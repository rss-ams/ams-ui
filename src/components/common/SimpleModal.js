import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal({
  isOpen,
  closeHandler,
  modalBody
}) {
  const classes = useStyles();

  const body = (
    <div className={classes.paper}>
      {modalBody}
    </div>
  );

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={closeHandler}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        style={{display:'flex',alignItems:'center',justifyContent:'center'}}
      >
        {body}
      </Modal>
    </div>
  );
}
