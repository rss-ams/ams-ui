import {
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
import DeleteDialog from 'components/common/DeleteDialog';
import FieldForm from 'components/common/FieldForm';
import SimpleModal from 'components/common/SimpleModal';
import TableComponent from 'components/common/TableComponent';
import {
  deleteField,
  getAllFields,
  getFieldsByLocation,
} from 'dataclients/FieldsClient';
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
  title: {
    margin: '10px 0 0 0',
  },
}));

/**
 * Define columns for Fields Info Table
 * * Need to add last two entries for edit and delete icons to be visible
 */
const columnData = [
  {
    id: 'id',
    type: 'text',
    label: 'Id',
    width: 5,
  },
  {
    id: 'fieldName',
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
        index: '0',
        label: 'Edit',
      },
      {
        id: 'delete',
        index: '1',
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [fieldTableRows, setFieldTableRows] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    getAllFields()
      .then((fields) => {
        setLoading(false);
        setFieldsData(fields.content);
      })
      .catch((e) => {
        setLoading(false);
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
    let data = fieldsData.map((obj, index) => {
      return {
        key: index,
        id: obj.id,
        fieldName: obj.identifier,
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
    setLoading(true);
    getFieldsByLocation(locationCode)
      .then((fields) => {
        setFieldsData(fields);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(`Fetching fields for ${locationCode} failed`, e);
        showAlert(`Fetching fields for ${locationCode} failed`, 'error');
      });
  };

  /**
   * 
   //Opens the edit modal and passed the relevant row information
   * @param {object} selectedRow 
   */
  const editClickHandler = (selectedRow) => {
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
        editClickHandler(selectedRow);
        break;
      case 'delete':
        deleteClickHandler(selectedRow);
        break;
      default:
        console.log(selectedRow);
    }
  };

  /**
   *delete handler for fields
   * @param {object} selectedRow
   */
  const deleteClickHandler = (selectedRow) => {
    setSelectedRow(selectedRow);
    setIsDeleteModalOpen(true);
  };

  /**
   * call to delete API after user confirmation
   * @param {object} selectedRow
   */
  const deleteConfirmationHandler = () => {
    console.log(selectedRow);
    deleteField(selectedRow.id)
      .then((_response) => {
        handleClose();
        showAlert('Field successfully deleted', 'info');
      })
      .catch((e) => {
        console.log('Internal server error', e);
        showAlert('Field deletion failed: ' + e.message, 'error');
      });
    handleClose();
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

  /**
   * closes the edit modal
   * refreshes the table with updated data
   */
  const handleClose = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
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
        loading={loading}
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
            showToastMessage={showAlert}
          />
        }
      ></SimpleModal>
      {/* modal to delete selected field data */}
      <DeleteDialog
        context={selectedRow.fieldName}
        deleteHandler={deleteConfirmationHandler}
        closeHandler={handleClose}
        openState={isDeleteModalOpen}
      ></DeleteDialog>
      {/* alert UI */}
      <Snackbar
        open={alertStatus}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
}

export default FieldInfoPage;
