import {
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import FieldForm from 'components/common/FieldForm';
import SimpleModal from 'components/common/SimpleModal';
import TableComponent from 'components/common/TableComponent';
import { getAllFields, getFieldsByLocation } from 'dataclients/FieldsClient';
import { getLocations } from 'dataclients/LocationsClient';
import React, { useEffect, useState } from 'react';

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
    id: 'name',
    type: 'text',
    label: 'Name',
    width: 30,
  },
  {
    id: 'location',
    type: 'text',
    label: 'Locality',
    width: 50,
  },
  {
    id: 'area',
    type: 'text',
    label: 'Area (in acres)',
    width: 10,
    align: 'center',
  },
  {
    id: 'actions',
    type: 'menu',
    label: 'Actions',
    width: 30,
    align: 'center',
    actions: [
      {
        id: 'edit',
        label: 'Edit',
      },
      {
        id: 'delete',
        label: 'Delete',
      },
    ],
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
  const [locationCode, setLocationCode] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [fieldsData, setFieldsData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [fieldTableRows, setFieldTableRows] = useState([]);

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
        setFieldsData(fields.content);
      })
      .catch((e) => {
        console.log('Fetching all fields failed', e);
        showAlert(`Fetching fields failed`, 'error');
      });
  };

  useEffect(() => {
    if (locationCode === '') getFieldData();
    else fetchFieldsForLocation();
  }, [locationCode]);

  useEffect(() => {
    updateRowData();
  }, [fieldsData]);

  /**
   * Function to create and return row data for binding to table
   *
   */
  const updateRowData = () => {
    let data = fieldsData.map((obj) => {
      return {
        id: obj.id,
        name: obj.identifier,
        location: obj.location.displayStr,
        locationCode: obj.location.code,
        area: obj.area,
      };
    });
    data.sort((a, b) => (a.id > b.id ? 1 : -1));
    setFieldTableRows(data);
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
      setLocationCode(value);
    }
  };

  /**
   * Function to fetch fields for a selected location using API
   * updates fieldsData if call is successful
   * shows alert in case call fails
   */
  const fetchFieldsForLocation = () => {
    getFieldsByLocation(locationCode)
      .then(setFieldsData)
      .catch((e) => {
        console.log(`Fetching fields for ${locationCode} failed`, e);
        showAlert(`Fetching fields for ${locationCode} failed`, 'error');
      });
  };

  /**
   * 
   //Opens the edit modal and passed the relevant row information
   * @param {object} selectedRow 
   */
  const editField = (selectedRow) => {
    setIsEditModalOpen(true);
    setSelectedRow(selectedRow);
  };

  /**
   * context menu actions handler for fields
   * @param {*} id
   * @param {*} selectedRow
   */
  const handleFieldOptions = (id, selectedRow) => {
    switch (id) {
      case 'edit':
        editField(selectedRow);
        console.log(id, selectedRow);
        break;
      case 'delete':
        deleteField(selectedRow);
        console.log(id, selectedRow);
        break;
      default:
        console.log(selectedRow);
    }
  };

  /**
   *
   //TODO delete implementation for fields
   * @param {object} selectedRow 
   */
  const deleteField = (selectedRow) => {};

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

  /**
   * closes the edit modal
   * refreshes the table with updated data
   */
  const handleClose = () => {
    setIsEditModalOpen(false);
    if (locationCode === '') getFieldData();
    else fetchFieldsForLocation();
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
          value={locationCode}
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
      {/* custom table to show field info */}
      <TableComponent
        cols={columnData}
        rows={fieldTableRows}
        contextMenuActionHandler={handleFieldOptions}
      />
      {/* modal to show selected field data and edit */}
      <SimpleModal
        isOpen={isEditModalOpen}
        closeHandler={handleClose}
        modalBody={
          <FieldForm
            operation='UPDATE'
            title='Edit Field'
            selectedRow={selectedRow}
            isOpen={isEditModalOpen}
            closeHandler={handleClose}
            submitButtonText='Save'
          />
        }
      ></SimpleModal>
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
