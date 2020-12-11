import { FormGroup, Snackbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { getAllCrops } from 'dataclients/CropsClient';
import TableComponent from 'components/common/TableComponent';

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
    id: 'id',
    label: 'Id',
    width: 5,
  },
  {
    id: 'name',
    label: 'Crop Name',
    width: 50,
  },
  {
    id: 'season',
    label: 'Season',
    width: 30,
  },
  {
    id: 'cgp',
    label: 'Crop Growth Protocol',
    width: 20,
  },
  {
    id: 'edit',
    type: 'icon',
    width: 5,
    align: 'left',
    label: '',
  },
  {
    id: 'delete',
    type: 'icon',
    width: 5,
    align: 'left',
    label: '',
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
   * 
   //TODO edit implementation for crops
   * @param {object} selectedRow 
   */
  const editCrop = (selectedRow) => {
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
        Crop Info
      </Typography>

      {/* custom table to show crop info */}
      <TableComponent
        cols={columnData}
        rows={getRowData()}
        deleteHandler={deleteCrop}
        editHandler={editCrop}
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

export default CropInfoPage;