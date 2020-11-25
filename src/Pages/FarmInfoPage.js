import {
  AppBar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  makeStyles,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { getAllFields } from 'dataclients/FieldsClient';
import { getLocations } from 'dataclients/LocationsClient';
import FarmInfoTable from './FarmInfoTable';
import FieldInfoTable2 from './FieldInfoTable2';
import FieldInfoTable3 from './FieldInfoTable3';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <h1>{children}</h1>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function FarmInfoPage() {
  const [fields, setFields] = useState([]);
  const [locationsDataFromServer, setLocationsDataFromServer] = useState([]);

  useEffect(() => {
    getAllFields()
      .then((fields) => setFields(fields.content))
      .catch((e) => {
        console.log('Fetching all fields failed: ' + e.message);
      });

    getLocations()
      .then(setLocationsDataFromServer)
      .catch((e) => {
        console.log('Fetching all locations failed: ' + e.message);
      });
  }, []);

  const classes = useStyles();
  const [locality, setLocality] = useState('');
  const [fieldId, setFieldId] = useState('');

  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCLick = () => {
    console.log('locality,fieldId,cropSeason,activity' + locality, fieldId);
  };

  const handleChange = ({ target }) => {
    console.log('locality,fieldId,cropSeason,activity' + locality, fieldId);
    const { name, value } = target;
    if (name === 'locality') {
      setLocality(value);
    } else if (name === 'fieldId') {
      setFieldId(value);
    }

    console.log(
      'after: locality,fieldId,cropSeason,activity' + locality,
      fieldId,
    );
  };

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify='center' spacing={2}>
          <List component='nav' aria-label='secondary mailbox folders'>
            <ListItem>
              <span
                style={{
                  backgroundColor: 'white',
                  border: '1px solid gray',
                  padding: '5px',
                  margin: '5px',
                  color: 'gray',
                  fontSize: '20px',
                }}
              >
                {' '}
                FIELD INFO
              </span>
            </ListItem>
            <ListItem key='1'>
              <FormControl className={classes.formControl}>
                <InputLabel id='locality-label'>Locality</InputLabel>
                <Select
                  id='locality'
                  name='locality'
                  value={locality}
                  onChange={handleChange}
                >
                  {locationsDataFromServer.map((locationDataFromServer) => {
                    return (
                      <MenuItem
                        key={locationDataFromServer.code}
                        value={locationDataFromServer.code}
                      >
                        {locationDataFromServer.displayStr}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem key='2'>
              <FormControl className={classes.formControl}>
                <InputLabel id='fId-label'>Field ID</InputLabel>
                <Select
                  id='fieldId'
                  name='fieldId'
                  value={fieldId}
                  onChange={handleChange}
                >
                  {fields.map((field) => {
                    return (
                      <MenuItem key={field.identifier} value={field.identifier}>
                        {field.identifier}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem key='5'>
              <Button variant='outlined' color='primary' onClick={handleCLick}>
                FETCH
              </Button>
              <Button variant='outlined' color='primary' onClick={handleCLick}>
                SUBMIT{' '}
              </Button>
            </ListItem>
          </List>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container justify='center' spacing={2}>
          <AppBar position='static' color='default'>
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label='simple tabs example'
            >
              <Tab label='Info' {...a11yProps(0)} />
              <Tab label='Upcoming' {...a11yProps(1)} />
              <Tab label='Recent Past' {...a11yProps(2)} />
            </Tabs>
          </AppBar>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default FarmInfoPage;
