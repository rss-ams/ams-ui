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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  submitButton: {
    margin: theme.spacing(2),
    width: 'fit-content',
  },
  menuItem: {
    whiteSpace: 'normal',
  },
  root: {
    textAlign: 'center',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const DeleteForm = ({ deleteHandler, closeHandler }) => {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [title] = useState('Are you sure you want to delete?');

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

  return (
    <FormGroup className={classes.formGroup}>
      <Typography align='center' variant='h7' className={classes.title}>
        {title}
      </Typography>
      <div className={classes.root}>
        <Button
          variant='contained'
          color='primary'
          className={classes.submitButton}
          onClick={deleteHandler}
        >
          Yes
        </Button>
        <Button
          variant='contained'
          color='primary'
          className={classes.submitButton}
          onClick={closeHandler}
        >
          No
        </Button>
      </div>

      <Snackbar open={alertStatus} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
};

export default DeleteForm;
