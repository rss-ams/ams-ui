import { AppBar, Box, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
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
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component='a'
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
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
  const [value, setValue] = useState(props.selectedIndex);

  let history = createBrowserHistory();

  useEffect(() => {
    setValue(props.selectedIndex);
  }, [props]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    createBrowserHistory.push(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='simple tabs example'
          variant='fullWidth'
          centered
        >
          {props.tabs.map((tab) => {
            return (
              <LinkTab
                label={tab.name}
                key={tab.name}
                href={tab.location}
                {...a11yProps(tab.index)}
              />
            );
          })}
        </Tabs>
      </AppBar>
      {props.tabs.map((tab) => {
        return (
          <TabPanel value={value} index={tab.index} key={tab.index}>
            {tab.component}
          </TabPanel>
        );
      })}
    </div>
  );
};

export default DynamicTabs;
