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
import { createField } from 'dataclients/FieldsClient';
import { getLocations } from 'dataclients/LocationsClient';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddField = () => {
  const classes = useStyles();
  const [locality, setLocality] = useState('');
  const [fieldIdentifier, setFieldIdentifier] = useState('');
  const [area, setArea] = useState('');
  const [locations, setLocations] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => {
        console.log('Fetching all locations failed', e);
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

  const handleTextChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'fieldId') {
      setFieldIdentifier(value);
    } else if (name === 'area') {
      setArea(value);
    }
  };

  const handleCLick = () => {
    const payload = {
      name: fieldIdentifier,
      identifier: fieldIdentifier,
      location: locality,
      area: Number(area),
    };

    createField(payload)
      .then((response) => {
        console.log('fieldCropCycles saved...' + response);
        showAlert('Field successfully created', 'info');
      })
      .catch((e) => {
        console.log('Internal server error', e);
        showAlert('Field creation failed: ' + e.message, 'error');
      });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'locality') {
      setLocality(value);
    }
  };

  return (
    <FormGroup>
      <Typography align='center' variant='h6' className={classes.title}>
        Add Field
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
              <MenuItem key={location.code} value={location.code}>
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
        onChange={handleTextChange}
        label='Field Name'
      />

      <TextField
        className={classes.formControl}
        id='area'
        name='area'
        onChange={handleTextChange}
        label='Area'
      />

      <Button variant='contained' color='primary' onClick={handleCLick}>
        Submit
      </Button>

      <Snackbar open={alertStatus} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
};

export default AddField;
