import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { fieldIds } from "../fieldIds"
import { fieldsData } from '../fieldsData';
import { cropSeasons } from "../CropSeason";
import { activityData } from "../ActivityData";
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));



function ActivityPage() {

    const classes = useStyles();
    const [locality, setLocality] = React.useState('');
    const [fieldId, setFieldId] = React.useState('');
    const [cropSeason, setCropSeason] = React.useState('');
    const [activity, setActivity] = React.useState('');
    const [status, setStatus] = React.useState('');

    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
    const [selectedEndDate, setselectedEndDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleCLick = () => {
        console.log("locality,fieldId,cropSeason,activity" + locality, fieldId, cropSeason, activity)
    }

    useEffect(() => {

    }, [])

    const handleStartDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleEndateChange = (date) => {
        setselectedEndDate(date);
    };

    const handleTextChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'status') {
            setStatus(value)
        }
    }
    const handleChange = ({ target }) => {
        console.log("locality,fieldId,cropSeason,activity" + locality, fieldId, cropSeason, activity)
        const { name, value } = target;
        if (name === 'locality') {
            setLocality(value)
        }
        else if (name === 'fieldId') {
            setFieldId(value);
        }
        else if (name === 'cropSeason') {
            setCropSeason(value);
        }
        else if (name === 'activityData') {
            setActivity(value)
        }

        console.log("after: locality,fieldId,cropSeason,activity" + locality, fieldId, cropSeason, activity)
    };

    return (

        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>

                    <List component="nav" aria-label="secondary mailbox folders">
                        <ListItem>
                            <span style={{ backgroundColor: 'gray', border: '1px solid gray', padding: '5px', margin: '5px', color: 'white', fontSize: '20px' }}>ADD FIELD ACTIVITY</span>
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

                        <ListItem key="3">
                            <FormControl className={classes.formControl}>
                                <InputLabel id="cs-label">Crop Season</InputLabel>
                                <Select
                                    id="cropSeason"
                                    name="cropSeason"
                                    value={cropSeason}
                                    onChange={handleChange}
                                >
                                    {
                                        cropSeasons.map((cropSeason) => {
                                            return (
                                                <MenuItem key={cropSeason} value={cropSeason}>{cropSeason}</MenuItem>
                                            );

                                        })
                                    }
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem key="4">
                            <FormControl className={classes.formControl}>
                                <InputLabel id="ac-label">Activity Data</InputLabel>
                                <Select
                                    id="activityData"
                                    name="activityData"
                                    value={activity}
                                    onChange={handleChange}
                                >
                                    {
                                        activityData.map((activity) => {
                                            return (
                                                <MenuItem key={activity} value={activity}>{activity}</MenuItem>
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
                                        label="Start Date"
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
                                        label="End Date"
                                        value={selectedEndDate}
                                        onChange={handleEndateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />

                                </Grid>
                            </MuiPickersUtilsProvider>
                        </ListItem>

                        <ListItem>
                            <TextField id="status" name="status" onChange={handleTextChange} label="Status" />
                        </ListItem>

                        <ListItem>
                            <TextField id="comment" name="comment" onChange={handleTextChange} label="Comment" />
                        </ListItem>

                        <ListItem key="5">
                            <Button variant="outlined" color="primary" onClick={handleCLick}>ADD/UPDATE</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

        </Grid>


    )
}

export default ActivityPage
