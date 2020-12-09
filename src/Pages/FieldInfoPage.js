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
import { getAllFields, getFieldsByLocation } from 'dataclients/FieldsClient';
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
    id: 'name',
    label: 'Field Name',
    minWidth: 30,
  },
  {
    id: 'location',
    label: 'Locality',
    minWidth: 30,
  },
  {
    id: 'area',
    label: 'Area',
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
function FieldInfoPage() {
  const classes = useStyles();
  const [locations, setLocations] = useState([]);
  const [locality, setLocality] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [fieldsData, setFields] = useState([]);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => {
        console.log('Fetching all locations failed', e);
        showAlert(`Fetching locations failed`, 'error');
      });
  }, []);

  /**
   * Function to fetch all field information using API
   * updates fieldsData if call is successful
   * shows alert in case call fails
   */
  const getFieldData = () => {
    getAllFields()
      .then((fields) => {
        setFields(fields.content);
      })
      .catch((e) => {
        console.log('Fetching all fields failed', e);
        showAlert(`Fetching fields failed`, 'error');
      });
  };

  useEffect(() => {
    getFieldData();
  }, []);

  /**
   * Function to create and return row data for binding to table
   *
   */
  const getRowData = () => {
    let data = fieldsData.map((obj) => {
      return {
        id: obj.id,
        name: obj.identifier,
        location: obj.location.displayStr,
        area: obj.area,
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
   * Function to fetch fields for a selected ocation using API
   * updates fieldsData if call is successful
   * shows alert in case call fails
   */
  const fetchFieldsForLocation = () => {
    getFieldsByLocation(locality)
      .then(setFields)
      .catch((e) => {
        console.log(`Fetching fields for ${locality} failed`, e);
        showAlert(`Fetching fields for ${locality} failed`, 'error');
      });
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
        Field Info
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
      {/* fetch results button */}
      <Button
        variant='contained'
        color='primary'
        className={classes.formControl}
        onClick={fetchFieldsForLocation}
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

export default FieldInfoPage;
