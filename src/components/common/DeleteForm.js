import { Button, FormGroup, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  submitButton: {
    margin: theme.spacing(2),
    width: 'fit-content',
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
  const [title] = useState('Are you sure you want to delete?');

  return (
    <FormGroup>
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
    </FormGroup>
  );
};

export default DeleteForm;
