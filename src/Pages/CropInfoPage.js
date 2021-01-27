import { FormGroup, Snackbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import CropForm from 'components/common/CropForm';
import DeleteDialog from 'components/common/DeleteDialog';
import SimpleModal from 'components/common/SimpleModal';
import TableComponent from 'components/common/TableComponent';
import { deleteCrop, getAllCrops } from 'dataclients/CropsClient';
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
  title: {
    margin: '10px 0 0 0',
  },
}));

/**
 * Define columns for crops Info Table
 * * Need to add last two entries for edit and delete icons to be visible
 */
const columnData = [
  {
    id: 'cropName',
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
 * Component to show Crop Information
 *
 * @returns Table to show crop info
 */
function CropInfoPage() {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [crops, setCrops] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');

  /**
   * Function to fetch all crop information using API
   * updates cropsData if call is successful
   * shows alert in case call fails
   */
  const getCropData = () => {
    setLoading(true);
    getAllCrops()
      .then((crops) => {
        setCrops(crops);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
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
    let data = crops.map((obj, index) => {
      return {
        key: index,
        id: obj.id,
        cropName: obj.name,
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
   * edit implementation for crops
   * @param {object} selectedRow
   */
  const editClickHandler = (selectedRow) => {
    setIsEditModalOpen(true);
    setSelectedRow(selectedRow);
    console.log(selectedRow);
  };

  /**
   * delete implementation for crops
   * @param {object} selectedRow
   */
  const deleteClickHandler = (selectedRow) => {
    setSelectedRow(selectedRow);
    setIsDeleteModalOpen(true);
  };

  /**
   * delete crops after user confirmation
   * @param {object} selectedRow
   */
  const deleteConfirmationHandler = () => {
    console.log(selectedRow);
    deleteCrop(selectedRow.id)
      .then((_response) => {
        handleClose();
        showAlert('Crop successfully deleted', 'info');
      })
      .catch((e) => {
        console.log('Internal server error', e);
        showAlert('Crop deletion failed: ' + e.message, 'error');
      });
    handleClose();
  };

  /**
   * context menu actions handler for crops
   * @param {*} id
   * @param {*} selectedRow
   */
  const handleCropOptions = (id, selectedRow) => {
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
        loading={loading}
        contextMenuActionHandler={handleCropOptions}
      />
      {/* modal to show selected crop data and edit */}
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
            showToastMessage={showAlert}
          />
        }
      ></SimpleModal>
      {/* modal to delete selected crop data */}
      <DeleteDialog
        context={selectedRow.cropName}
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

export default CropInfoPage;
