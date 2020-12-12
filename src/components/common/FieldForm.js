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
import { createField, updateField } from 'dataclients/FieldsClient';
import { getLocations } from 'dataclients/LocationsClient';
import React, { useEffect, useState } from 'react';

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
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const FieldForm = ({ operation, title, selectedRow, closeHandler, submitButtonText }) => {
  const classes = useStyles();
  const [locality, setLocality] = useState(selectedRow.locationCode);
  const [fieldIdentifier, setFieldIdentifier] = useState(selectedRow.name);
  const [area, setArea] = useState(selectedRow.area);
  const [locations, setLocations] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => {
        console.log('Fetching location list failed', e);
        showAlert('Fetching location list failed', 'error');
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

  const handleSubmit = () => {
    let payload = {};
    payload.identifier = fieldIdentifier;
    payload.location = locality;
    payload.area = Number(area);
    payload.id = selectedRow.id;
    
    if (operation === 'UPDATE') {
      updateField(payload)
        .then((response) => {
          closeHandler();          
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showAlert('Field updation failed: ' + e.message, 'error');
        });
    } else {
      createField(payload)
        .then((response) => {
          showAlert('Field successfully created', 'info');
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showAlert('Field creation failed: ' + e.message, 'error');
        });
    }
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'locality') {
      setLocality(value);
    } else if (name === 'fieldId') {
      setFieldIdentifier(value);
    } else if (name === 'area') {
      setArea(value);
    }
  };

  return (
    <FormGroup className={classes.formGroup}>
      <Typography align='center' variant='h6' className={classes.title}>
        {title}
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel id='locality-label'>Locality</InputLabel>
        <Select
          id='locality'
          name='locality'
          value={locality}
          onChange={handleChange}
        >
          {locations.map((location) => {
            return (
              <MenuItem
                key={location.code}
                value={location.code}
                className={classes.menuItem}
              >
                {location.displayStr}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <TextField
        className={classes.formControl}
        id='fieldId'
        name='fieldId'
        onChange={handleChange}
        label='Field Name'
        value={fieldIdentifier}
      />

      <TextField
        className={classes.formControl}
        id='area'
        name='area'
        onChange={handleChange}
        label='Area'
        value={area}
      />

      <Button
        variant='contained'
        color='primary'
        size='medium'
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

export default FieldForm;
