import {
  FormControl,
  Grid,
  InputLabel, Select, MenuItem
} from '@material-ui/core';
import { getCropCyclesByField } from 'dataclients/CropCyclesClient';
import { getFieldsByLocation } from 'dataclients/FieldsClient';
import React, { useEffect, useState } from 'react';

const CropCycleComponent = ({
  classStyleObj,
  locations,
  cropCycleId,
  setCropCycleIdHandler,
  cropCycles,
  setCropCyclesHandler,
  failureHandler

}) => {

  const classes = classStyleObj;
  const [locationCode, setLocationCode] = useState('');
  const [fieldId, setFieldId] = useState('');
  const [fields, setFields] = useState([]);
  //const [cropCycles, setCropCycles] = useState([]);

  /**
   * Function to fetch fields for a selected location using API
   * updates fieldsData if call is successful
   * shows alert in case call fails
   * @param {number} selectedLocationCode The code for the selected location
   */
  const fetchFieldsForLocation = (selectedLocationCode) => {
    const displayStr = locations.filter(
      (obj) => obj.code === selectedLocationCode,
    )[0].displayStr;
    getFieldsByLocation(selectedLocationCode)
      .then(setFields)
      .catch((e) => {
        console.log(
          `Fetching fields for ${selectedLocationCode} - ${displayStr} failed`,
          e,
        );
        failureHandler(`Fetching fields for ${displayStr} failed`);
      });
  };

  /**
   * Function to fetch CropCycles for a selected field
   * updates CropCycles if call is successful
   * shows alert in case call fails
   * @param {number} selectedFieldId The ID of the selected field
   */
  const fetchCropCyclesForField = (selectedFieldId) => {
    const fieldName = fields.filter((obj) => obj.id === selectedFieldId)[0]
      .identifier;
    getCropCyclesByField(selectedFieldId)
      .then((data) => data.content)
      .then(formatCropCyclesForDisplay)
      .then(setCropCyclesHandler)
      .catch((e) => {
        console.log(
          `Fetching crop cycles for ${selectedFieldId} - ${fieldName} failed`,
          e,
        );
        failureHandler(`Fetching crop cycles for ${fieldName} failed`);
      });
  };

  /**
   * Formats the crop cycle objects for display. It addes name as a new
   * attribute in the object which is formed by using the crop name,
   * season and year separated by hyphens for better readability
   * @param {object} cropCycleObjects Objects containing crop cycle details
   */
  const formatCropCyclesForDisplay = (cropCycleObjects) =>
    cropCycleObjects.map((cropCycleObject) => ({
      ...cropCycleObject,
      name: `${cropCycleObject.crop.name} - ${cropCycleObject.season} - ${cropCycleObject.year}`,
    }));

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'location') {
      setLocationCode(value);
      fetchFieldsForLocation(value);
      // need to clear the following dropdowns and hence the process cards
      setFieldId('');
      setCropCycleIdHandler('');
    } else if (name === 'field') {
      setFieldId(value);
      fetchCropCyclesForField(value);
      // need to clear the following dropdowns and hence the process cards
      setCropCycleIdHandler('');
    } else if (name === 'crop-cycle') {
      setCropCycleIdHandler(value);
    }
  };

  return (
    <React.Fragment>
      {/* Location selection */}
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel id='location-label'>Location</InputLabel>
          <Select
            id='location'
            name='location'
            value={locationCode}
            onChange={handleChange}
          >
            {locations.map((obj) => {
              return (
                <MenuItem key={obj.displayStr} value={obj.code}>
                  {obj.displayStr}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

      {/* Field selection */}
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel id='field-label'>Field</InputLabel>
          <Select
            id='field'
            name='field'
            value={fieldId}
            onChange={handleChange}
          >
            {fields.map((obj) => (
              <MenuItem key={obj.identifier} value={obj.id}>
                {obj.identifier}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Crop-cycle selection */}
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel id='crop-cycle-label'>Crop cycle</InputLabel>
          <Select
            id='crop-cycle'
            name='crop-cycle'
            value={cropCycleId}
            onChange={handleChange}
          >
            {cropCycles.map((obj) => {
              return (
                <MenuItem key={obj.name} value={obj.id}>
                  {obj.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

    </React.Fragment>

  )
}
export default CropCycleComponent;