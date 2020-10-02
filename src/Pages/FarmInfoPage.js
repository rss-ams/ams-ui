import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { fieldIds } from "../fieldIds"
import { fieldsData } from '../fieldsData';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FarmInfoTable from "./FarmInfoTable"
import FieldInfoTable2 from "./FieldInfoTable2"
import FieldInfoTable3 from "./FieldInfoTable3"
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';

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
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
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

    const classes = useStyles();
    const [locality, setLocality] = React.useState('');
    const [fieldId, setFieldId] = React.useState('');


    const [value, setValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleCLick = () => {
        console.log("locality,fieldId,cropSeason,activity" + locality, fieldId)

    }


    const handleChange = ({ target }) => {
        console.log("locality,fieldId,cropSeason,activity" + locality, fieldId)
        const { name, value } = target;
        if (name === 'locality') {
            setLocality(value)
        }
        else if (name === 'fieldId') {
            setFieldId(value);
        }

        console.log("after: locality,fieldId,cropSeason,activity" + locality, fieldId)
    };

    return (

        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>

                    <List component="nav" aria-label="secondary mailbox folders">
                        <ListItem>
                            <span style={{ backgroundColor: 'gray', border: '1px solid gray', padding: '5px', margin: '5px', color: 'white', fontSize: '20px' }}> FIELD INFO</span>
                        </ListItem>
                        <ListItem key="1">
                            <FormControl className={classes.formControl}>
                                <InputLabel id="locality-label">Locality</InputLabel>
                                <Select
                                    id="locality"
                                    name="locality"
                                    value={locality}
                                    onChange={handleChange}
                                >
                                    {
                                        fieldsData.map((fieldData) => {
                                            return (
                                                <MenuItem key={fieldData} value={fieldData}>{fieldData}</MenuItem>
                                            );

                                        })
                                    }
                                </Select>
                            </FormControl>
                        </ListItem>

                        <ListItem key="2">
                            <FormControl className={classes.formControl}>
                                <InputLabel id="fId-label">Field ID</InputLabel>
                                <Select
                                    id="fieldId"
                                    name="fieldId"
                                    value={fieldId}
                                    onChange={handleChange}
                                >
                                    {
                                        fieldIds.map((fieldId) => {
                                            return (
                                                <MenuItem key={fieldId} value={fieldId}>{fieldId}</MenuItem>
                                            );

                                        })
                                    }
                                </Select>
                            </FormControl>
                        </ListItem>



                        <ListItem key="5">

                            <Button variant="outlined" color="primary" onClick={handleCLick}>FETCH</Button>
                            <Button variant="outlined" color="primary" onClick={handleCLick}>ADD ACTIVITY</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>
                    <AppBar position="static">
                        <Tabs value={value} onChange={handleTabChange} aria-label="simple tabs example">
                            <Tab label="Info" {...a11yProps(0)} />
                            <Tab label="Upcoming" {...a11yProps(1)} />
                            <Tab label="Recent Past" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <FarmInfoTable />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                       <FieldInfoTable2 />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <FieldInfoTable3 />
                    </TabPanel>
                </Grid>
            </Grid>

        </Grid>


    )
}

export default FarmInfoPage
