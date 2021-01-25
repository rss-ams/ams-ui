import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  submitButton: {
    width: 'fit-content',
    minWidth: '150px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  resetButton: {
    width: 'fit-content',
    minWidth: '150px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  root: {
    textAlign: 'center',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
}));
const FormButtons = ({ reset, defaultValues, submitButtonText }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Button
        variant='contained'
        size='medium'
        className={classes.submitButton}
        onClick={() => {
          reset(defaultValues);
        }}
      >
        Reset
      </Button>
      <Button
        variant='contained'
        color='primary'
        size='medium'
        type='submit'
        className={classes.submitButton}
      >
        {submitButtonText}
      </Button>
    </div>
  );
};

export default FormButtons;
