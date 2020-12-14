import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import HistoryIcon from '@material-ui/icons/History';
import AssessmentIcon from '@material-ui/icons/Assessment';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    borderRadius: '10px',
  },
})((props) => (
  <Menu
    elevation={10}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}))(MenuItem);

export default function ContextMenu({
  menuActions,
  row,
  contextMenuActionHandler,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls='customized-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        ...
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuActions.map((action) => {
          return (
            <StyledMenuItem
              style={{ paddingTop: 0, paddingBottom: 0 }}
              onClick={() => contextMenuActionHandler(action.id, row)}
            >
              <ListItemIcon>
                {action.id === 'currentProcesses' && (
                  <AssessmentIcon fontSize='small' />
                )}
                {action.id === 'processHistory' && (
                  <HistoryIcon fontSize='small' />
                )}
                {action.id === 'delete' && <DeleteIcon fontSize='small' />}
                {action.id === 'edit' && (
                  <IconButton style={{ padding: 0 }}>
                    <SvgIcon fontSize='small'>
                      <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'></path>
                    </SvgIcon>
                  </IconButton>
                )}
              </ListItemIcon>
              <ListItemText primary={action.label} />
            </StyledMenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
}