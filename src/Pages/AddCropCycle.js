import DateFnsUtils from '@date-io/date-fns';
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
import { Alert, Autocomplete } from '@material-ui/lab';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createCropCycles } from 'dataclients/CropCyclesClient';
import { getAllCrops } from 'dataclients/CropsClient';
import { getAllFields } from 'dataclients/FieldsClient';
import 'date-fns';
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

const AddCropCycle = () => {
  const classes = useStyles();

  const [crop, setCrop] = useState('');
  const [cropSeason, setCropSeason] = useState('');
  const [year, handleYearChange] = useState(new Date());
  const [fields, setFields] = useState([]);

  const [allCrops, setAllCrops] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  useEffect(() => {
    getAllCrops()
      .then((crops) => setAllCrops(crops))
      .catch((e) => {
        console.log('Fetching crop list failed' + e);
        showAlert('Fetching crop list failed', 'error');
      });

    getAllFields()
      .then((fields) => setAllFields(fields.content))
      .catch((e) => {
        console.log('Fetching field list failed', e);
        showAlert('Fetching field list failed', 'error');
      });
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'season') {
      setCropSeason(value);
    } else if (name === 'crop') {
      setCrop(value);
    } else {
      console.log('handleChange on invalid target!');
    }
  };

  const handleFieldsChange = (_event, values) => {
    setFields(values);
  };

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
    let fieldIds = [];
    fields.map((field) => fieldIds.push({ id: field.id }));

    const payload = {
      fields: fieldIds,
      season: cropSeason,
      year: year.getFullYear(),
      crop: { id: crop },
    };

    createCropCycles(payload)
      .then((response) => {
        console.log('fieldCropCycles saved...' + response);
        showAlert('Crop cycles successfully created', 'info');
      })
      .catch((e) => {
        console.log('Internal server error', e);
        showAlert('Crop cycles creation failed: ' + e.message, 'error');
      });
  };

  return (
    <FormGroup>
      <Typography align='center' variant='h6' className={classes.title}>
        Add Crop Cycles
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel shrink id='crop-label'>
          Crop
        </InputLabel>
        <Select id='crop' name='crop' value={crop} onChange={handleChange}>
          {allCrops.map((crop) => {
            return (
              <MenuItem key={crop.id} value={crop.id}>
                {crop.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <Autocomplete
          multiple
          id='tags-standard'
          options={allFields}
          getOptionLabel={(option) => option.identifier}
          defaultValue={[]}
          onChange={handleFieldsChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='standard'
              label='Fields'
              placeholder='Select fields for the crop'
            />
          )}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id='season-label'>Season</InputLabel>
        <Select
          id='season'
          name='season'
          value={cropSeason}
          onChange={handleChange}
        >
          {CropSeasons.map((seasonData) => {
            return (
              <MenuItem key={seasonData} value={seasonData}>
                {seasonData}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            variant='inline'
            format='yyyy'
            margin='normal'
            id='year'
            label='Year'
            name='year'
            value={year}
            onChange={handleYearChange}
            views={['year']}
          />
        </MuiPickersUtilsProvider>
      </FormControl>

      <Button
        variant='contained'
        color='primary'
        className={classes.submitButton}
        onClick={handleSubmit}
      >
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

export default AddCropCycle;
