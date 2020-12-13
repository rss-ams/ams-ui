import {
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { getFieldsByLocation } from 'dataclients/FieldsClient';
import { getCropCyclesbyField } from 'dataclients/CropCyclesClient';
import { getLocations } from 'dataclients/LocationsClient';
import TableComponent from 'components/common/TableComponent';

/**
 * css styles for Field Info Page
 */
const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 250,
    maxWidth: 300,
  },
}));

/**
 * Define columns for Fields Info Table
 * * Need to add last two entries for edit and delete icons to be visible
 */
const columnData = [
  {
    id: 'id',
    label: 'Id',
    minWidth: 5,
  },
  {
    id: 'fieldName',
    label: 'Field Name',
    minWidth: 30,
  },
  {
    id: 'cropName',
    label: 'Crop',
    minWidth: 30,
  },
  {
    id: 'season',
    label: 'Season',
    minWidth: 10,
  },
  {
    id: 'edit',
    type: 'icon',
    minWidth: 5,
    align: 'left',
    label: '',
  },
  {
    id: 'delete',
    type: 'icon',
    minWidth: 5,
    align: 'left',
    label: '',
  },
];

/**
 * Component to show Field Information
 * @returns form allowing location selection
 * @returns Table to show field info
 */
function CropCycleInfoPage() {
  const classes = useStyles();
  const [locations, setLocations] = useState([]);
  const [locality, setLocality] = useState('');
  const [field, setField] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [fields, setFields] = useState([]);
  const [cropCycles, setCropCycles] = useState([]);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => {
        console.log('Fetching all locations failed', e);
        showAlert(`Fetching locations failed`, 'error');
      });
  }, []);

  useEffect(() => {
    if(Number.isInteger(locality)){
    getFieldsByLocation(locality)
      .then(setFields)
      .catch((e) => {
        console.log('Fetching fields failed', e);
        showAlert(`Fetching fields failed`, 'error');
      });
    }
  }, [locality]);

  /**
   * Function to fetch all crop cycle information using API
   * updates cropCycles if call is successful
   * shows alert in case call fails
   */
  const getCropCycles = () => {
    if(Number.isInteger(field)){
    getCropCyclesByField(field)
      .then(setCropCycles)
      .catch((e) => {
        console.log('Fetching crop cycles failed', e);
        showAlert(`Fetching crop cycles failed`, 'error');
      });
    }
  };

  /**
   * Function to create and return row data for binding to table
   *
   */
  const getRowData = () => {
    let data = cropCycles.map((obj) => {
      return {
        id: obj.id,
        year: obj.year,
        season: obj.season,
        fieldId: obj.field.id,
        fieldName: obj.field.identifier,
        cropId: obj.crop.id,
        cropName: obj.crop.name,
        ...obj.crop.cropGrowthProtocol,
        processHistory: obj.processHistory,
        currentProcesses: obj.currentProcesses,
      };
    });
    return data;
  };

  /**
   * Handler called on closing alert
   * @param {*} _event
   * @param {*} reason
   */
  const handleAlertClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertStatus(false);
  };

  /**
   * Handler called when user selects location from dropdown
   * sets the locality value to the selection
   * @param {*} object
   */
  const handleLocationChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'locality') {
      setLocality(value);
    }
  };

  /**
   * Handler called when user selects location from dropdown
   * sets the locality value to the selection
   * @param {*} object
   */
  const handleFieldChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'field') {
      setField(value);
    }
  };


  /**
   * 
   //TODO edit implementation for fields
   * @param {object} selectedRow 
   */
  const editField = (selectedRow) => {
    console.log(selectedRow);
  };

  /**
   *
   //TODO delete implementation for fields
   * @param {object} selectedRow 
   */
  const deleteField = (selectedRow) => {
    console.log(selectedRow);
  };

  /**
   * Shows alert on UI
   * sets values of severity - info/error
   * sets alert message
   * sets alert status true/false
   * @param {string} message
   * @param {string} severity
   */
  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertStatus(true);
  };

  return (
    <FormGroup className={classes.formGroup}>
      {/* page title */}
      <Typography align='center' variant='h6' className={classes.title}>
        Crop Cycle Info
      </Typography>
      {/* control for location selection */}
      <FormControl className={classes.formControl}>
        <InputLabel id='locality-label'>Locality</InputLabel>
        <Select
          id='locality'
          name='locality'
          value={locality}
          onChange={handleLocationChange}
        >
          {locations.map((location) => {
            return (
              <MenuItem key={location.code} value={location.code}>
                {location.displayStr}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {/* control for field selection */}
      <FormControl className={classes.formControl}>
        <InputLabel id='locality-label'>Field</InputLabel>
        <Select
          id='field'
          name='field'
          value={field}
          onChange={handleFieldChange}
        >
          {fields.map((field) => {
            return (
              <MenuItem key={field.identifier} value={field.identifier}>
                {field.identifier}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {/* fetch results button */}
      <Button
        variant='contained'
        color='primary'
        className={classes.formControl}
        onClick={getCropCycles()}
      >
        Fetch
      </Button>

      {/* custom table to show field info */}
      <TableComponent
        cols={columnData}
        rows={getRowData()}
        deleteHandler={deleteField}
        editHandler={editField}
      />
      {/* alert UI */}
      <Snackbar open={alertStatus} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
}

export default CropCycleInfoPage;
