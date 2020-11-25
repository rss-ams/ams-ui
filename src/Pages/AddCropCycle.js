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
import 'date-fns';
import React, { useEffect, useState } from 'react';
import { createCropCycles } from 'dataclients/CropCyclesClient';
import { getAllCrops } from 'dataclients/CropsClient';
import { getAllFields } from 'dataclients/FieldsClient';
import { CropSeasons } from 'utils/CropConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
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

    // {
    //     "fields": [{"id": 10}, {...}],
    //     "year": 2000,
    //     "season": "RABI",
    //     "crop": {"id": 10}
    // }

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

      <Button variant='contained' color='primary' fullWidth={false} onClick={handleSubmit}>
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
