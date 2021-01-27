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
import { getAllCropGrowthProtocols } from 'dataclients/CropGrowthProtocolsClient';
import { createCrop, updateCrop } from 'dataclients/CropsClient';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CropSeasons } from 'utils/CropConstants';

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

const CropForm = ({
  operation,
  title,
  selectedRow,
  closeHandler,
  submitButtonText,
  showToastMessage,
}) => {
  const [cropGrowthProtocols, setCropGrowthProtocols] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const classes = useStyles();
  const defaultValues = {
    cropName: selectedRow.cropName,
    season: selectedRow.season,
    cgpid: selectedRow.cgpid,
  };
  const { handleSubmit, reset, control, errors: fieldsErrors } = useForm({
    defaultValues,
  });

  useEffect(() => {
    getAllCropGrowthProtocols()
      .then(setCropGrowthProtocols)
      .catch((e) => {
        console.log('Fetching crop growth protocols failed', e);
        showAlert('Fetching crop growth protocols failed', 'error');
      });
  }, []);

  /**
   * handler for alert close
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
   * displays the alert message on UI
   * @param {String} message
   * @param {String} severity can be info, error etc
   */
  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertStatus(true);
  };

  /**
   * sets the anchor for display of hint popover
   */
  const [anchorEl, setAnchorEl] = React.useState(null);

  /**
   * Handler for open of hint popover
   * @param {*} event
   */
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * handler for close of hint popover
   */
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  /**
   * sets the hint popover state to open/closed
   */
  const open = Boolean(anchorEl);

  /**
   * handler for form reset
   */
  const resetHandler = () => {
    reset(defaultValues);
  };

  /**
   * handler for form submit/create
   * @param {Object} formData
   */
  const submitHandler = (formData) => {
    let payload = {};
    payload.name = formData.cropName;
    payload.season = formData.season;
    payload.cropGrowthProtocol = { id: formData.cgpid };
    if (operation === 'UPDATE') {
      payload.id = selectedRow.id;
      updateCrop(payload)
        .then((_response) => {
          showToastMessage('Crop successfully updated', 'info');
          closeHandler();
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showToastMessage('Crop update failed: ' + e.message, 'error');
        });
    } else {
      createCrop(payload)
        .then((_response) => {
          reset(defaultValues);
          showToastMessage('Crop successfully created', 'info');
        })
        .catch((e) => {
          console.log('Internal server error', e);
          showToastMessage('Crop creation failed: ' + e.message, 'error');
        });
    }
  };

  return (
    <form onSubmit={handleSubmit((formData) => submitHandler(formData))}>
      <FormGroup className={classes.formGroup}>
        <Typography align='center' variant='h6' className={classes.title}>
          {title}
        </Typography>
        {/* crop name input */}
        <FormControl className={classes.formControl}>
          <Controller
            name='cropName'
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
                id='cropName'
                name='cropName'
                label='Crop Name'
                error={fieldsErrors.cropName}
                helperText={
                  fieldsErrors.cropName ? fieldsErrors.cropName.message : null
                }
              />
            }
            control={control}
            rules={{
              required: 'Please enter a crop name',
              pattern: {
                value: /^[a-zA-Z]+[a-zA-Z0-9_\s]*$/,
                message: 'Enter a valid name',
              },
            }}
          />
          {/* popover to show hint for field input */}
          <Popover
            id='cropname-help'
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
              A name must start with a letter followed by letters, digits,
              whitespaces or _.
            </Typography>
          </Popover>
        </FormControl>
        {/* season selection */}
        <FormControl className={classes.formControl}>
          <Controller
            name='season'
            control={control}
            rules={{
              required: 'Please select a season',
            }}
            as={
              <TextField
                select
                id='season'
                label='Season'
                error={fieldsErrors.season}
                helperText={
                  fieldsErrors.season ? fieldsErrors.season.message : null
                }
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
              </TextField>
            }
          ></Controller>
        </FormControl>
        {/* crop growth protocol selection */}
        <FormControl className={classes.formControl}>
          <Controller
            name='cgpid'
            control={control}
            rules={{
              required: 'Please select crop growth protocol',
            }}
            as={
              <TextField
                select
                id='cgpid'
                label='Crop Growth Protocol'
                error={fieldsErrors.cgpid}
                helperText={
                  fieldsErrors.cgpid ? fieldsErrors.cgpid.message : null
                }
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
              </TextField>
            }
          ></Controller>
        </FormControl>

        {/* reset/save/create button */}
        <FormButtons {...{ resetHandler, submitButtonText }} />
        {/* success and error alerts */}
        <Snackbar
          open={alertStatus}
          autoHideDuration={3000}
          Close={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </FormGroup>
    </form>
  );
};

export default CropForm;
