import {
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import ProcessCards from 'components/common/ProcessCards';
import { getCropCyclesByField } from 'dataclients/CropCyclesClient';
import { getFieldsByLocation } from 'dataclients/FieldsClient';
import { getLocations } from 'dataclients/LocationsClient';
import { getProcessStatuses } from 'dataclients/ProcessesClient';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 300,
  },
  submitButton: {
    margin: theme.spacing(3),
    width: 'fit-content',
    minWidth: '150px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  menuItem: {
    maxWidth: 300,
    whiteSpace: 'normal',
  },
  helpText: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
  },
  title: {
    margin: '10px 0 0 0',
  },
}));

const ProcessPage = () => {
  const classes = useStyles();
  const [locationCode, setLocationCode] = useState('');
  const [locations, setLocations] = useState([]);
  const [fieldId, setFieldId] = useState('');
  const [fields, setFields] = useState([]);
  const [cropCycleId, setCropCycleId] = useState('');
  const [cropCycles, setCropCycles] = useState([]);
  const [processStatuses, setProcessStatuses] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  const handleAlertClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertStatus(false);
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertStatus(true);
  };

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => {
        console.log('Fetching location list failed', e);
        showAlert('Fetching location list failed', 'error');
      });

    getProcessStatuses()
      .then(setProcessStatuses)
      .catch((e) => {
        console.log('Fetching process statuses failed', e);
        showAlert('Fetching process statuses failed', 'error');
      });
  }, []);

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
        showAlert(`Fetching fields for ${displayStr} failed`, 'error');
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
      .then(setCropCycles)
      .catch((e) => {
        console.log(
          `Fetching crop cycles for ${selectedFieldId} - ${fieldName} failed`,
          e,
        );
        showAlert(`Fetching crop cycles for ${fieldName} failed`, 'error');
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
      setCropCycleId('');
    } else if (name === 'field') {
      setFieldId(value);
      fetchCropCyclesForField(value);
      // need to clear the following dropdowns and hence the process cards
      setCropCycleId('');
    } else if (name === 'crop-cycle') {
      setCropCycleId(value);
    }
  };

  /**
   * Sucess handler passed as the callback function to processs card
   * @param {string} message success message
   */
  const processUpdateSuccessHandler = (message) => {
    showAlert(message, 'info');
    fetchCropCyclesForField(fieldId);
  };

  /**
   * Failure handler passed as the callback function to processs card
   * @param {string} message failure message
   */
  const processUpdateFailureHandler = (message) => {
    showAlert(message, 'error');
  };

  /**
   * Returns process cards corresponding to each non-completed processes
   * for the selected crop-cycle
   */
  const getSelectedCropCycle = () =>
    cropCycles.filter((cropCycle) => cropCycle.id === cropCycleId)[0];

  return (
    <FormGroup className={classes.formGroup}>
      <Grid
        container
        className={classes.container}
        spacing={2}
        justify='center'
        direction='column'
        alignItems='center'
      >
        <Grid item xs={12}>
          <Typography align='center' variant='h6' className={classes.title}>
            Process status
          </Typography>
        </Grid>

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

        {/* Process cards for each non-completed processes */}
        <Grid item xs={12}>
          <ProcessCards
            selectedCropCycle={getSelectedCropCycle()}
            processStatuses={processStatuses}
            updateSuccessHandler={processUpdateSuccessHandler}
            updateFailureHandler={processUpdateFailureHandler}
          ></ProcessCards>
        </Grid>
      </Grid>

      {/* Alerts on API call success/failure */}
      <Snackbar open={alertStatus} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
};

export default ProcessPage;
