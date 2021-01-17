import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Box,
  Popover,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Home from 'Pages/Home';
import User from 'Pages/User';
import { GoogleLogout } from 'react-google-login';
import GoogleLogin from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';

const useStyles = makeStyles((theme) => ({
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
  header: {
    padding: theme.spacing(2, 2, 2),
  },
  middle: {
    padding: theme.spacing(0, 2, 0),
  },
}));

const ApplnBar = () => {
  const classes = useStyles();

  const [drawerState, setDrawerState] = useState(false);
  const [page, setPage] = useState('HOME');
  const [imageUrl, setImgUrl] = useState('');
  const [loginVisible, setLoginVisible] = useState(true);
  const [avatarVisible, setAvatarVisible] = useState('hidden');
  const [logoutVisible, setLogoutVisible] = useState('hidden');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userName, setUserName] = React.useState('');
  const [email, setEmail] = React.useState('');

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

      {/* USER */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='user-content'
          id='user-header'
          className={classes.accordianSummary}
        >
          <Typography>USER</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <List className={classes.list}>
            <ListItem
              button
              key='user'
              className={classes.accordianItem}
              onClick={toggleDrawer(false)}
            >
              <Link to='/user/add'>
                <ListItemText primary='ADD' />
              </Link>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );

  const onLoginSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    setImgUrl(res.profileObj.imageUrl);
    setAvatarVisible('visible');
    setLoginVisible(false);
    setLogoutVisible('visible');
    refreshTokenSetup(res);
    setUserName(res.profileObj.name);
    setEmail(res.profileObj.email);
    localStorage.setItem('authToken', res.tokenId);
    refreshTokenSetup(res);
  };

  const onLoginFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(`Failed to login`);
  };

  const onLogoutSuccess = (res) => {
    localStorage.setItem('authToken', null);
    setAnchorEl(null);
    console.log('Logged out Success');
    alert('Logged out Successfully');
    setAvatarVisible('hidden');
    setLoginVisible(true);
    setLogoutVisible('hidden');
    //route to home page
  };

  const onLogoutFailure = (res) => {
    console.log('Log out Failed');
    alert('Log out Failed');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
              {getMenu()}
            </Drawer>
          </React.Fragment>
          <Typography variant='h6' className={classes.title}>
            Agri-Man
          </Typography>
          {loginVisible ? (
            <Box>
              <GoogleLogin
                clientId='765498256947-104ng32fscf55ntmdc0p2hn0v6g6k0nu.apps.googleusercontent.com'
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                isSignedIn={true}
                render={(renderProps) => (
                  <Button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    color='primary'
                    variant='contained'
                  >
                    Login
                  </Button>
                )}
                buttonText='Login'
                cookiePolicy={'single_host_origin'}
                className={classes.object}
              />
            </Box>
          ) : (
            <Box visibility={avatarVisible}>
              <Avatar alt='Remy Sharp' onClick={handleClick} src={imageUrl} />
            </Box>
          )}
          <Popover
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <div>
              <Box>
                <Typography
                  variant='h7'
                  className={classes.header}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {userName}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant='subtitle2'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  className={classes.middle}
                >
                  {email}
                </Typography>
              </Box>
              <Box
                className={classes.header}
                visibility={logoutVisible}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GoogleLogout
                  clientId='765498256947-104ng32fscf55ntmdc0p2hn0v6g6k0nu.apps.googleusercontent.com'
                  onLogoutSuccess={onLogoutSuccess}
                  onLogoutFailure={onLogoutFailure}
                  render={(renderProps) => (
                    <Button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      color='primary'
                      variant='contained'
                    >
                      Logout
                    </Button>
                  )}
                  cookiePolicy={'single_host_origin'}
                  className={classes.object}
                />
              </Box>
            </div>
          </Popover>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ApplnBar;
