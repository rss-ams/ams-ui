import {
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import CropCycleForm from 'components/common/CropCycleForm';
import DeleteDialog from 'components/common/DeleteDialog';
import SimpleModal from 'components/common/SimpleModal';
import TableComponent from 'components/common/TableComponent';
import {
  deleteCropCycle,
  getCropCyclesByField,
} from 'dataclients/CropCyclesClient';
import { getFieldsByLocation } from 'dataclients/FieldsClient';
import { getLocations } from 'dataclients/LocationsClient';
import React, { useEffect, useState } from 'react';

/**
 * css styles for Crop Cycle Info Page
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
 * Define columns for Crop Cycle Info Table
 *
 */
const columnData = [
  {
    id: 'fieldName',
    type: 'text',
    label: 'Field',
    width: 30,
  },
  {
    id: 'cropName',
    type: 'text',
    label: 'Crop',
    width: 30,
  },
  {
    id: 'season',
    type: 'text',
    label: 'Season',
    width: 10,
  },
  {
    id: 'year',
    type: 'text',
    label: 'Year',
    width: 10,
  },
  {
    id: 'actions',
    type: 'menu',
    label: 'Actions',
    width: 30,
    align: 'center',
    actions: [
      {
        id: 'processHistory',
        index: '0',
        label: 'Process History',
      },
      {
        id: 'currentProcesses',
        index: '1',
        label: 'Current Processes',
      },
      {
        id: 'edit',
        index: '2',
        label: 'Edit',
      },
      {
        id: 'delete',
        index: '3',
        label: 'Delete',
      },
    ],
  },
];

/**
 * Component to show Crop Cycle Information
 * @returns form allowing location selection
 * @returns form allowing field selection
 * @returns Table to show crop cycle info
 */
function CropCycleInfoPage() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationCode, setLocationCode] = useState('');
  const [field, setField] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [showLocalityError, setLocalityError] = useState(false);
  const [showFieldError, setFieldError] = useState(false);
  const [fields, setFields] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => {
        console.log('Fetching all locations failed', e);
        showAlert(`Fetching locations failed`, 'error');
      });
  }, []);

  useEffect(() => {
    if (Number.isInteger(locationCode)) {
      setLocalityError(false);
      getFieldsByLocation(locationCode)
        .then(setFields)
        .catch((e) => {
          console.log('Fetching fields failed', e);
          showAlert(`Fetching fields failed`, 'error');
        });
    } else {
      setLocalityError(true);
    }
  }, [locationCode]);

  /**
   * Function to fetch all crop cycle information using API
   * updates rowData if call is successful
   * shows alert in case call fails
   */
  const getCropCycles = () => {
    if (Number.isInteger(field)) {
      setFieldError(false);
      setLoading(true);
      getCropCyclesByField(field)
        .then((resp) => {
          setLoading(false);
          getRowData(resp.content);
        })
        .catch((e) => {
          setLoading(false);
          console.log('Fetching crop cycles failed', e);
          showAlert(`Fetching crop cycles failed`, 'error');
        });
    } else {
      setFieldError(true);
    }
  };

  /**
   * Function to create and return row data for binding to table
   *
   */
  const getRowData = (cropCycles) => {
    let data = cropCycles.map((obj) => {
      return {
        id: obj.id,
        year: obj.year,
        season: obj.season,
        fieldId: obj.field.id,
        fieldName: obj.field.identifier,
        cropId: obj.crop.id,
        cropName: obj.crop.name,
        ...obj.crop.cropGrowthProtocol.fertilization,
        processHistory: obj.processHistory,
        currentProcesses: obj.currentProcesses,
      };
    });
    data.sort((a, b) => (a.year > b.year ? 1 : -1));
    setRowData(data);
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
   * sets the locationCode value to the selection
   * @param {*} object
   */
  const handleLocationChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'locationCode') {
      setLocationCode(value);
      setField('');
    }
  };

  /**
   * Handler called when user selects field from dropdown
   * sets the field value to the selection
   * @param {*} object
   */
  const handleFieldChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'field') {
      setField(value);
    }
  };

  /**
   //TODO action implementation for crop cycles
   * @param {*} id 
   * @param {*} selectedRow 
   */
  const handleCropCycleOptions = (id, selectedRow) => {
    switch (id) {
      case 'edit':
        editClickHandler(selectedRow);
        break;
      case 'delete':
        deleteClickHandler(selectedRow);
        break;
      case 'currentProcesses':
        console.log(id, selectedRow);
        break;
      case 'processHistory':
        console.log(id, selectedRow);
        break;
      default:
        console.log(selectedRow);
    }
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
   * 
   //Opens the edit modal and passes the relevant row information
   * @param {object} selectedRow 
   */
  const editClickHandler = (selectedRow) => {
    setIsEditModalOpen(true);
    setSelectedRow(selectedRow);
  };

  /**
   * delete handler for crop cycle
   * @param {object} selectedRow
   */
  const deleteClickHandler = (selectedRow) => {
    setSelectedRow(selectedRow);
    setIsDeleteModalOpen(true);
  };

  /**
   * delete crop cycle after user confirmation
   * @param {object} selectedRow
   */
  const deleteConfirmationHandler = () => {
    console.log(selectedRow);
    deleteCropCycle(selectedRow.id)
      .then((_response) => {
        handleClose();
        showAlert('Crop cycle successfully deleted', 'info');
      })
      .catch((e) => {
        console.log('Internal server error', e);
        showAlert('Crop cycle deletion failed: ' + e.message, 'error');
      });
    handleClose();
  };

  /**
   * closes the edit modal
   * refreshes the table with updated data
   */
  const handleClose = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    getCropCycles();
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
          id='locationCode'
          name='locationCode'
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
        {showLocalityError && (
          <FormHelperText>Select a locality</FormHelperText>
        )}
      </FormControl>
      {/* control for field selection */}
      <FormControl className={classes.formControl}>
        <InputLabel id='field-label'>Field</InputLabel>
        <Select
          id='field'
          name='field'
          value={field}
          onChange={handleFieldChange}
        >
          {fields.map((fieldObj) => {
            return (
              <MenuItem key={fieldObj.id} value={fieldObj.id}>
                {fieldObj.identifier}
              </MenuItem>
            );
          })}
        </Select>
        {showFieldError && <FormHelperText>Select a field</FormHelperText>}
      </FormControl>
      {/* fetch results button */}
      <Button
        variant='contained'
        color='primary'
        className={classes.formControl}
        onClick={getCropCycles}
      >
        Fetch
      </Button>

      {/* custom table to show field info */}
      <TableComponent
        cols={columnData}
        rows={rowData}
        loading={loading}
        contextMenuActionHandler={handleCropCycleOptions}
      />
      {/* modal to show selected field data and edit */}
      <SimpleModal
        isOpen={isEditModalOpen}
        closeHandler={handleClose}
        modalBody={
          <CropCycleForm
            operation='UPDATE'
            title='Edit Crop Cycle'
            selectedRow={selectedRow}
            submitButtonText='Save'
            closeHandler={handleClose}
          />
        }
      ></SimpleModal>
      {/* modal to delete selected crop cycle data */}
      <DeleteDialog
        context={'the crop cycle'}
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

export default CropCycleInfoPage;
