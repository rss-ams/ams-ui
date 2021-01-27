import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  submitButton: {
    width: 'fit-content',
    minWidth: '120px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  resetButton: {
    width: 'fit-content',
    minWidth: '120px',
    marginLeft: 'auto',
    marginRight: '8px',
  },
  root: {
    textAlign: 'center',
    marginTop: '16px',
  },
}));
const FormButtons = ({ resetHandler, submitButtonText }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Button
        variant='contained'
        size='medium'
        className={classes.resetButton}
        onClick={() => {
          resetHandler();
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
