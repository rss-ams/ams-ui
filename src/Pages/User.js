import {
  Button,
  FormGroup,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { createUser } from 'dataclients/UserClient';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(3),
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

const User = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

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
    if (name === 'email') {
      setEmail(value);
    }
  };

  const handleSubmit = () => {
    const payload = {
      email: email,
    };

    createUser(payload)
      .then((_response) => {
        showAlert('User successfully saved to application', 'info');
      })
      .catch((e) => {
        console.log('Internal server error', e);
        showAlert('User addition failed: ' + e.message, 'error');
      });
  };

  return (
    <FormGroup className={classes.formControl}>
      <Typography align='center' variant='h6' className={classes.title}>
        User
      </Typography>

      <TextField
        className={classes.formControl}
        id='email'
        name='email'
        onChange={handleChange}
        label='Email'
      />

      <Button
        variant='contained'
        color='primary'
        className={classes.submitButton}
        onClick={handleSubmit}
      >
        Add User
      </Button>

      <Snackbar open={alertStatus} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
};

export default User;
