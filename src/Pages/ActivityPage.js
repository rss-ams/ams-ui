import React, { useState, useEffect } from 'react';
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
import { getAllFields } from "../components/utilities/fieldUtil"
import { statusData } from "../statusData";
import { subCategory } from "../subCategory"
import { activityDataObj } from "../activityDataObj"

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
    const [subCat, setSubCat] = useState('')
    const [subActivity, setSubActivity] = useState([])
    const [status, setStatus] = React.useState('');

    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
    const [selectedEndDate, setselectedEndDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const [displayCrops, setDisplayCrops] = useState([])
    const [displayCrop, setDisplayCrop] = useState('')
    const [displayCropId, setDisplayCropId] = useState(0)

    const [fields, setFields] = useState([]);

    const [locations, setLocations] = useState([])

    const [selectedSubActivity, setSelectedSubActivity] = useState('')

    const [comment, setComment] = useState('')

    //not required
    // getAllFields().then(function (d) {
    //     d.json().then(function (data) {
    //         setFields(data.content)
    //     })
    // })

    const handleCLick = () => {
        console.log("locality,fieldId,cropSeason,activity" + locality, fieldId, cropSeason, activity)
    }

    const getAllFieldLocations = () => {
        fetch('http://localhost:8080/api/fields/locations').then((locationsResponse) => {
            locationsResponse.json().then((locationsData) => {
                console.log(locationsData)
                setLocations(locationsData)
            })
        })
    }

    useEffect(() => {
        getAllFieldLocations();
    }, [])

    const handleStartDateChange = (date) => {
        setSelectedDate(date);
        console.log(locality, fieldId, displayCropId, activity , selectedSubActivity , status , comment, selectedDate , selectedEndDate)

    };
    const handleEndateChange = (date) => {
        setselectedEndDate(date);
        console.log(locality, fieldId, displayCropId, activity , selectedSubActivity , status , comment, selectedDate , selectedEndDate)

    };

    const handleTextChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'comment') {
            setComment(value)
        }
    }

    const [showActivity, setShowActivity] = useState(false)
    const [showInspection, setShowInspection] = useState(false)
    const showAddActivity = () => {
        setShowActivity(!showActivity)
        setShowInspection(false)
    }

    const showAddInspection = () => {
        setShowInspection(!showInspection)
        setShowActivity(false)
    }
    const getAllFieldIds = (fieldLocCode) => {
        fetch(`http://localhost:8080/api/fields?location=${fieldLocCode}`).then((fieldIdResp) => {
            fieldIdResp.json().then((fieldIdRespData) => {
                console.log(fieldIdRespData)

                setFields(fieldIdRespData)
            })
        })
    }
    const handleChange = ({ target }) => {

        const { name, value } = target;
        if (name === 'locality') {
            setLocality(value)

            getAllFieldIds(value)
            //fetch the field IDs

            console.log(value)
        }
        else if (name === 'fieldId') {
            console.log("selected field id is" + value)
            setFieldId(value);
            let crops=[]
            fields.map((field)=>{
                if (field.identifier === value) {
                    console.log("========***===========")
                    console.log(field);
                    field.fieldCropCycles.map((fieldCropCycle)=>{
                        let dispCrop = fieldCropCycle.crop.name+"-"+fieldCropCycle.season+"-"+fieldCropCycle.year;
                        console.log("dispCrop")
                        console.log(dispCrop);
                        let dispCropObj = {id:fieldCropCycle.id , crop:dispCrop}
                        crops.push(dispCropObj)
                    })
                    console.log("CROPS DROP DOWN")
                    console.log(crops);
                    setDisplayCrops(crops)
                }

            })
            


        }
        else if (name === 'crop') {
            // displayCrop
            setDisplayCrop(value);
            setDisplayCropId(value)
        }
        else if (name === 'activityData') {
            setActivity(value)

            setSubActivity(activityDataObj[value])
        }

        else if(name === 'sub-category'){
            console.log(value)
            setSelectedSubActivity(value)
        }
        else if(name === "statusData"){
            setStatus(value)
        }
        console.log(locality, fieldId, displayCropId, activity , selectedSubActivity , status , comment, selectedDate , selectedEndDate)
    };


    const handleAddActivity=()=>{
        console.log(locality, fieldId, displayCropId, activity , selectedSubActivity , status , comment, selectedDate , selectedEndDate)

    }
    return (

        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>

                    <List component="nav" aria-label="secondary mailbox folders">
                        <ListItem>
                            <span style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', margin: '5px', color: 'gray', fontSize: '20px' }}>ADD FIELD ACTIVITY | INSPECTION</span>
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
                                        locations.map((fieldLocation) => {
                                            return (
                                                <MenuItem key={fieldLocation.code} value={fieldLocation.code}>{fieldLocation.displayStr}</MenuItem>
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
                                        fields.map((field) => {
                                            return (
                                                <MenuItem key={field.identifier} value={field.identifier}>{field.identifier}</MenuItem>
                                            );

                                        })
                                    }
                                </Select>
                            </FormControl>
                        </ListItem>

                        {
                            showActivity ?
                                <div>
                                    <ListItem key="3">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="cs-label">Crop</InputLabel>
                                            <Select
                                                id="crop"
                                                name="crop"
                                                value={displayCrop}
                                                onChange={handleChange}
                                            >
                                                {
                                                    displayCrops.map((displayedCrop) => {
                                                        return (
                                                            <MenuItem key={displayedCrop.id} value={displayedCrop.id}>{displayedCrop.crop}</MenuItem>
                                                        );

                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </ListItem>
                                    <ListItem key="4">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="ac-label">Activity type</InputLabel>
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
                                    <ListItem key="5">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="ac-label">Sub activity</InputLabel>
                                            <Select
                                                id="sub-category"
                                                name="sub-category"
                                                value={selectedSubActivity}
                                                onChange={handleChange}
                                            >
                                                {
                                                    subActivity.map((subCat) => {
                                                        return (
                                                            <MenuItem key={subCat} value={subCat}>{subCat}</MenuItem>
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
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="ac-label">Status</InputLabel>
                                            <Select
                                                id="statusData"
                                                name="statusData"
                                                value={status}
                                                onChange={handleChange}
                                            >
                                                {
                                                    statusData.map((status) => {
                                                        return (
                                                            <MenuItem key={status} value={status}>{status}</MenuItem>
                                                        );

                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </ListItem>

                                    <ListItem>
                                        <TextField id="comment" name="comment" onChange={handleTextChange} label="Comment" />
                                    </ListItem>

                                    <ListItem key="6">
                                        <Button variant="outlined" color="primary" onClick={handleAddActivity}>ADD/UPDATE</Button>
                                    </ListItem>

                                    <ListItem key="7">
                                        <Button variant="outlined" color="primary" onClick={handleCLick}>SHOW MAP</Button>
                                    </ListItem>

                                </div> : null
                        }


                        {
                            showInspection ?
                                <div>

                                </div>
                                : null
                        }


                        <Button onClick={showAddActivity}>Toggle Add Activity</Button>

                        <Button onClick={showAddInspection}>Toggle Add Inspection</Button>



                    </List>
                </Grid>
            </Grid>

        </Grid>


    )
}

export default ActivityPage
