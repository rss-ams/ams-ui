import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    width: 200,
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  accordianSummary: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  accordianDetails: {
    padding: theme.spacing(0),
  },
  accordianItem: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
}));

const ApplnBar = () => {
  const classes = useStyles();

  const [drawerState, setDrawerState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerState(open);
  };

  const getMenu = () => (
    <div role='presentation'>
      {/* Fields */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='fields-content'
          id='fields-header'
          classes={{
            content: classes.accordianSummary,
            expanded: classes.accordianSummaryExpanded,
          }}
        >
          <Typography>FIELDS</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <List className={classes.list}>
            <ListItem
              button
              key='fields-add-'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/fields/add'>
                <ListItemText primary='ADD' />
              </Link>
            </ListItem>
            <ListItem
              button
              key='fields-info'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/fields/info'>
                <ListItemText primary='VIEW' />
              </Link>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Crops */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='crops-content'
          id='crops-header'
          className={classes.accordianSummary}
        >
          <Typography>CROPS</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <List className={classes.list}>
            <ListItem
              button
              key='crops-add-'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/crops/add'>
                <ListItemText primary='ADD' />
              </Link>
            </ListItem>
            <ListItem
              button
              key='crops-info'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/crops/info'>
                <ListItemText primary='VIEW' />
              </Link>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Crop-cycles */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='crop-cycles-content'
          id='crop-cycles-header'
          className={classes.accordianSummary}
        >
          <Typography>CROP CYCLES</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <List className={classes.list}>
            <ListItem
              button
              key='crop-cycles-add-'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/crop-cycles/add'>
                <ListItemText primary='ADD' />
              </Link>
            </ListItem>
            <ListItem
              button
              key='crop-cycles-info'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/crop-cycles/info'>
                <ListItemText primary='VIEW' />
              </Link>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Processes */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='processes-content'
          id='processes-header'
          className={classes.accordianSummary}
        >
          <Typography>PROCESSES</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <List className={classes.list}>
            <ListItem
              button
              key='processes'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/processes/update'>
                <ListItemText primary='UPDATE' />
              </Link>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );

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
              {getMenu()}
            </Drawer>
          </React.Fragment>
          <Typography variant='h6' className={classes.title}>
            Agri-Man
          </Typography>
          <Button color='inherit'>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ApplnBar;
