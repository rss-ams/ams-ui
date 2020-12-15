import { FormGroup, Snackbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import CropForm from 'components/common/CropForm';
import SimpleModal from 'components/common/SimpleModal';
import TableComponent from 'components/common/TableComponent';
import { getAllCrops } from 'dataclients/CropsClient';
import React, { useEffect, useState } from 'react';

/**
 * css styles for Crop Info Page
 */
const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 250,
  },
}));

/**
 * Define columns for crops Info Table
 * * Need to add last two entries for edit and delete icons to be visible
 */
const columnData = [
  {
    id: 'name',
    type: 'text',
    label: 'Name',
    width: 50,
  },
  {
    id: 'season',
    type: 'text',
    label: 'Season',
    width: 30,
  },
  {
    id: 'cgp',
    type: 'text',
    label: 'Crop Growth Protocol',
    width: 20,
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
 * Component to show Crop Information
 *
 * @returns Table to show crop info
 */
function CropInfoPage() {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [crops, setCrops] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');

  /**
   * Function to fetch all crop information using API
   * updates cropsData if call is successful
   * shows alert in case call fails
   */
  const getCropData = () => {
    getAllCrops()
      .then(setCrops)
      .catch((e) => {
        console.log('Fetching all crops failed', e);
        showAlert(`Fetching crops failed`, 'error');
      });
  };

  useEffect(() => {
    getCropData();
  }, []);

  /**
   * Function to create and return row data for binding to table
   *
   */
  const getRowData = () => {
    let data = crops.map((obj) => {
      return {
        id: obj.id,
        name: obj.name,
        season: obj.season,
        cgp: `${obj.cropGrowthProtocol.name} - ${obj.cropGrowthProtocol.description}`,
        cgpid: obj.cropGrowthProtocol.id,
      };
    });
    data.sort((a, b) => (a.id > b.id ? 1 : -1));
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
   * 
   //TODO edit implementation for crops
   * @param {object} selectedRow 
   */
  const editCrop = (selectedRow) => {
    setIsEditModalOpen(true);
    setSelectedRow(selectedRow);
    console.log(selectedRow);
  };

  /**
   *
   //TODO delete implementation for crops
   * @param {object} selectedRow 
   */
  const deleteCrop = (selectedRow) => {
    console.log(selectedRow);
  };

  /**
   * context menu actions handler for crops
   * @param {*} id
   * @param {*} selectedRow
   */
  const handleCropOptions = (id, selectedRow) => {
    switch (id) {
      case 'edit':
        editCrop(selectedRow);
        break;
      case 'delete':
        deleteCrop(selectedRow);
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
   * closes the edit modal
   * refreshes the table with updated data
   */
  const handleClose = () => {
    setIsEditModalOpen(false);
    getCropData();
  };

  return (
    <FormGroup className={classes.formGroup}>
      {/* page title */}
      <Typography align='center' variant='h6' className={classes.title}>
        Crop Info
      </Typography>

      {/* custom table to show crop info */}
      <TableComponent
        cols={columnData}
        rows={getRowData()}
        contextMenuActionHandler={handleCropOptions}
      />
      {/* modal to show selected field data and edit */}
      <SimpleModal
        isOpen={isEditModalOpen}
        closeHandler={handleClose}
        modalBody={
          <CropForm
            operation='UPDATE'
            title='Edit Crop'
            selectedRow={selectedRow}
            setOpen={setIsEditModalOpen}
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

export default CropInfoPage;
