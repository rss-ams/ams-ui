import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import DynamicTabs from 'components/DynamicTabs';
import ProcessPage from 'Pages/ProcessPage';
import AddCrop from 'Pages/AddCrop';
import AddCropCycle from 'Pages/AddCropCycle';
import AddField from 'Pages/AddField';
import AddVehicle from 'Pages/AddVehicle';
import FieldInfoPage from 'Pages/FieldInfoPage';
import CropInfoPage from 'Pages/CropInfoPage';
import CropCycleInfoPage from 'Pages/CropCycleInfoPage';
import FarmTimeline from 'Pages/FarmTImeLine';
import React, { useState } from 'react';
import AddInspectionPage from 'Pages/AddInspectionPage';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
}));

const ApplnBar = () => {
  const classes = useStyles();

  const [drawerState, setDrawerState] = useState(false);
  const [page, setPage] = useState('FIELD');

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerState(open);
  };

  const handlePageSelection = (selection) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setPage(selection);
  };
  const getMenuItems = () => (
    <div
      className={classes.list}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[
          'FIELD',
          '',
          'CROP',
          '',
          'CROP CYCLE',
          '',
          'ACTIVITY',
          '',
          'INSPECTION',
          '',
          'VEHICLE',
        ].map((text, _index) => {
          if (text === '') return <Divider key={_index} />;
          return (
            <ListItem button key={text} onClick={handlePageSelection(text)}>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const comp = (page) => {
    if (page === 'FIELD') {
      return (
        <DynamicTabs
          component1={<AddField />}
          component2={<FieldInfoPage />}
          component3={<FarmTimeline />}
        />
      );
    } else if (page === 'CROP') {
      return (
        <DynamicTabs
          component1={<AddCrop />}
          component2={<CropInfoPage />}
          component3={'c3'}
        />
      );
    } else if (page === 'CROP CYCLE') {
      return (
        <DynamicTabs
          component1={<AddCropCycle />}
          component3={<FarmTimeline />}
          component2={<CropCycleInfoPage />}
        />
      );
    } else if (page === 'ACTIVITY') {
      return <DynamicTabs component1={<ProcessPage />} component2={'c2'} />;
    } else if (page === 'INSPECTION') {
      return <DynamicTabs component1={<AddInspectionPage />} />;
    } else if (page === 'VEHICLE') {
      return <AddVehicle />;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default'>
        <Toolbar>
          <React.Fragment key='left'>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='menu'
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor={'left'}
              open={drawerState}
              onClose={toggleDrawer(false)}
            >
              {getMenuItems()}
            </Drawer>
          </React.Fragment>
          <Typography variant='h6' className={classes.title}>
            Agri-Man
          </Typography>
          <Button color='inherit'>Login</Button>
        </Toolbar>
      </AppBar>
      {comp(page)}
    </div>
  );
};

export default ApplnBar;
