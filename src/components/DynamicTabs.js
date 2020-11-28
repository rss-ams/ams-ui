import { AppBar, Box, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    maxWidth: 728,
    margin: 'auto',
  },
}));

const DynamicTabs = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default' >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='simple tabs example'
          variant='fullWidth'
          centered
        >
          {props.component1 && <Tab label='Add' {...a11yProps(0)} />}
          {props.component2 && <Tab label='Info' {...a11yProps(1)} />}
          {props.component3 && <Tab label='Timeline' {...a11yProps(2)} />}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {props.component1}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.component2}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {props.component3}
      </TabPanel>
    </div>
  );
};

export default DynamicTabs;
