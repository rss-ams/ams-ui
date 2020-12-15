import {
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { getAllCropGrowthProtocols } from 'dataclients/CropGrowthProtocolsClient';
import { createCrop, updateCrop } from 'dataclients/CropsClient';
import React, { useEffect, useState } from 'react';
import { CropSeasons } from 'utils/CropConstants';

const useStyles = makeStyles((theme) => ({
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
}));

const AddCrop = ({ operation, title, selectedRow, closeHandler, submitButtonText }) => {
  const classes = useStyles();
  const [cropName, setCropName] = useState(selectedRow.name);
  const [cropSeason, setCropSeason] = useState(selectedRow.season);
  const [cropGrowthProtocol, setCropGrowthProtocol] = useState(selectedRow.cgpid);
  const [cropGrowthProtocols, setCropGrowthProtocols] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  useEffect(() => {
    getAllCropGrowthProtocols()
      .then(setCropGrowthProtocols)
      .catch((e) => {
        console.log('Fetching crop growth protocols failed', e);
        showAlert('Fetching crop growth protocols failed', 'error');
      });
  }, []);

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

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'season') {
      setCropSeason(value);
    } else if (name === 'cropGrowthProtocol') {
      setCropGrowthProtocol(value);
    } else if (name === 'cropName') {
      setCropName(value);
    }
  };

  const handleSubmit = () => {
    const payload = {
      id: selectedRow.id,
      name: cropName,
      season: cropSeason,
      cropGrowthProtocol: { id: cropGrowthProtocol },
    };
    if(operation === 'UPDATE') {
      updateCrop(payload)
        .then((_response) => {
          closeHandler();
          showAlert('Crop successfully updated', 'info');
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showAlert('Crop creation failed: ' + e.message, 'error');
        });
    }
    else {
      createCrop(payload)
        .then((_response) => {
          showAlert('Crop successfully created', 'info');
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showAlert('Crop creation failed: ' + e.message, 'error');
        });
    }
  };

  return (
    <FormGroup className={classes.formGroup}>
      <Typography align='center' variant='h6' className={classes.title}>
        {title}
      </Typography>

      <TextField
        className={classes.formControl}
        id='cropName'
        name='cropName'
        onChange={handleChange}
        label='Crop Name'
        value={cropName}
      />

      <FormControl className={classes.formControl}>
        <InputLabel id='season-label'>Season</InputLabel>
        <Select
          id='season'
          name='season'
          value={cropSeason}
          onChange={handleChange}
        >
          {CropSeasons.map((cropSeason) => {
            return (
              <MenuItem
                key={cropSeason}
                value={cropSeason}
                className={classes.menuItem}
              >
                {cropSeason}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id='cropGrowthProtocol-label'>
          Crop Growth Protocol
        </InputLabel>
        <Select
          id='cropGrowthProtocol'
          name='cropGrowthProtocol'
          value={cropGrowthProtocol}
          onChange={handleChange}
        >
          {cropGrowthProtocols.map((item) => {
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                className={classes.menuItem}
              >
                {item.name + ' - ' + item.description}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Button
        variant='contained'
        color='primary'
        className={classes.submitButton}
        onClick={handleSubmit}
      >
        {submitButtonText}
      </Button>

      <Snackbar open={alertStatus} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
};

export default AddCrop;