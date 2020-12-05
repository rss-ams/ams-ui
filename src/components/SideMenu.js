import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddField from "../Pages/AddField";
import AddVehicle from "../Pages/AddVehicle";
import AddActivityPage from "../Pages/AddActivityPage";
import AddCropCycle from "../Pages/AddCropCycle";
import DynamicTabs from "../components/DynamicTabs";
import FieldInfoPage from '../Pages/FieldInfoPage';
import FarmTimeline from '../Pages/FarmTImeLine';
import AddCrop from '../Pages/AddCrop';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 250,
    },
    tabs: {
        width: '25%',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function SideMenu() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Agri Tabs"
                className={classes.tabs}
            >
                <Tab label="FIELD" {...a11yProps(0)} />
                <Tab label="CROP" {...a11yProps(1)} />
                <Tab label="CROP CYCLE" {...a11yProps(2)} />
                <Tab label="ACTIVITY" {...a11yProps(3)} />
                <Tab label="VEHICLE" {...a11yProps(4)} />

            </Tabs>
            <TabPanel value={value} index={0}>
                <DynamicTabs component1={<AddField />} component2={<FieldInfoPage />} component3={<FarmTimeline />} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DynamicTabs component1={<AddCrop />} component2={"c2"} component3={"c3"} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <DynamicTabs component1={<AddCropCycle />} component2={"c2"} component3={"c3"} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <AddActivityPage />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <AddVehicle />
            </TabPanel>
        </div>
    );
}
