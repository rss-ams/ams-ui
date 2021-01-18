import {
  FormControl,
  FormGroup,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { Alert } from '@material-ui/lab';
import FormButtons from 'components/common/FormButtons';
import { createField, updateField } from 'dataclients/FieldsClient';
import { getLocations } from 'dataclients/LocationsClient';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 300,
  },
  menuItem: {
    maxWidth: 300,
    whiteSpace: 'normal',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const FieldForm = ({
  operation,
  title,
  selectedRow,
  closeHandler,
  submitButtonText,
  showToastMessage,
}) => {
  const classes = useStyles();
  const defaultValues = {
    locationCode: selectedRow.locationCode,
    area: selectedRow.area,
    fieldName: selectedRow.fieldName,
  };
  const { handleSubmit, reset, control, errors: fieldsErrors } = useForm({
    defaultValues,
  });

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

  const resetHandler = () => {
    reset(defaultValues);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const submitHandler = (formData) => {
    let payload = {};
    payload.identifier = formData.fieldName;
    payload.location = formData.locationCode;
    payload.area = Number(formData.area);

    if (operation === 'UPDATE') {
      payload.id = selectedRow.id;
      updateField(payload)
        .then((response) => {
          showToastMessage('Field successfully updated', 'info');
          reset(defaultValues);
          closeHandler();
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showToastMessage('Field updation failed: ' + e.message, 'error');
        });
    } else {
      createField(payload)
        .then((response) => {
          showToastMessage('Field successfully created', 'info');
          reset(defaultValues);
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showToastMessage('Field creation failed: ' + e.message, 'error');
        });
    }
  };

  return (
    <form onSubmit={handleSubmit((formData) => submitHandler(formData))}>
      <FormGroup className={classes.formGroup}>
        <Typography align='center' variant='h6' className={classes.title}>
          {title}
        </Typography>
        {/* location selection */}
        <FormControl className={classes.formControl}>
          <Controller
            name='locationCode'
            control={control}
            rules={{
              required: 'Please select a locality',
            }}
            as={
              <TextField
                select
                id='locationCode'
                label='Locality'
                error={fieldsErrors.locationCode}
                helperText={
                  fieldsErrors.locationCode
                    ? fieldsErrors.locationCode.message
                    : null
                }
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
              </TextField>
            }
          ></Controller>
        </FormControl>
        {/* field input */}
        <FormControl className={classes.formControl}>
          <Controller
            name='fieldName'
            as={
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                      >
                        <InfoOutlined />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className={classes.formControl}
                id='fieldName'
                name='fieldName'
                label='Field Name'
                error={fieldsErrors.fieldName}
                helperText={
                  fieldsErrors.fieldName ? fieldsErrors.fieldName.message : null
                }
              />
            }
            control={control}
            rules={{
              required: 'Please enter a field name',
              pattern: {
                value: /^[a-zA-Z]+[a-zA-Z0-9_]*$/,
                message: 'Enter a valid name',
              },
            }}
          />
          <Popover
            id='fieldname-help'
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography variant='body2'>
              A name must start with a letter followed by letters, digits or _.
            </Typography>
          </Popover>
        </FormControl>
        {/* area input */}
        <FormControl className={classes.formControl}>
          <Controller
            name='area'
            as={
              <TextField
                className={classes.formControl}
                id='area'
                name='area'
                label='Area (in acres)'
                error={fieldsErrors.area}
                helperText={
                  fieldsErrors.area ? fieldsErrors.area.message : null
                }
              />
            }
            control={control}
            rules={{
              required: 'Please enter area',
              validate: (val) =>
                Number(val) > 0 ? null : 'Enter a valid number',
            }}
          />
        </FormControl>
        {/* reset/save/create button */}
        <FormButtons {...{ resetHandler, submitButtonText }} />

        {/* success and error alerts */}
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
    </form>
  );
};

export default FieldForm;
