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
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from  '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function FarmTimeline() {

    const classes = useStyles();
    const [locality, setLocality] = React.useState('');
    const [fieldId, setFieldId] = React.useState('');


    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
    const [selectedEndDate, setselectedEndDate] = React.useState(new Date('2014-08-18T21:11:54'));


    const handleStartDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleEndateChange = (date) => {
        setselectedEndDate(date);
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
                            <span style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', margin: '5px', color: 'gray', fontSize: '20px' }}> FARM TIMELINE</span>
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


                        <ListItem>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="start-date"
                                        label="From"
                                        value={selectedDate}
                                        onChange={handleStartDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />

                                </Grid>
                            </MuiPickersUtilsProvider>
                        </ListItem>


                        <ListItem>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="en-date"
                                        label="To"
                                        value={selectedEndDate}
                                        onChange={handleEndateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />

                                </Grid>
                            </MuiPickersUtilsProvider>
                        </ListItem>


                        <ListItem key="5">
                            <Button variant="outlined" color="primary" onClick={handleCLick}>SHOW</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>


        </Grid>


    )
}

export default FarmTimeline
