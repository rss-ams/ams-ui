import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

export default function DeleteDialog({
  context,
  deleteHandler,
  closeHandler,
  openState,
}) {
  return (
    <div>
      <Dialog
        open={openState}
        onClose={closeHandler}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Delete</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id='delete-dialog-description'>
            {`Are you sure you want to delete ${context} ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color='primary'>
            Cancel
          </Button>
          <Button onClick={deleteHandler} color='primary' autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
