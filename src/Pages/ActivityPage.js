import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { activityData } from 'data/ActivityData';
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
import { getAllFields } from 'dataclients/FieldsClient';
import { statusData } from 'data/statusData';
import moment from 'moment';
import axios from 'axios';
import Success from '../components/common/Success';

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
  const [subActivityList, setSubActivityList] = useState([]);
  const [status, setStatus] = React.useState('');

  const [selectedEndDate, setselectedEndDate] = React.useState(
    new Date('2014-08-18T21:11:54'),
  );

  const [displayCrops, setDisplayCrops] = useState([]);
  const [displayCrop, setDisplayCrop] = useState('');
  const [displayCropId, setDisplayCropId] = useState(0);

  const [fields, setFields] = useState([]);

  const [locations, setLocations] = useState([]);

  const [selectedSubActivity, setSelectedSubActivity] = useState('');

  const [selectedSubActivityValue, setSelectedSubActivityValue] = useState('');

  const [comment, setComment] = useState('');

  const [selectedInspectionDate, setSelectedInspectionDate] = React.useState(
    new Date('2014-08-18T21:11:54'),
  );

  const [selectedGermination, setSelectedGermination] = useState('');
  const [selectedGrowth, setSelectedGrowth] = useState('');
  const [selectedFlowering, setSelectedFlowering] = useState('');
  const [selectedInfestation, setSelectedInfestation] = useState('');

  const [allMainActivityArr, setAllMainActivityArr] = useState([]);

  const [currentSeason, setCurrentSeason] = useState('');

  const [processName, setProcessName] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleCLick = () => {
    console.log(
      'locality,fieldId,cropSeason,activity' + locality,
      fieldId,
      cropSeason,
      activity,
    );
  };

  const getAllFieldLocations = () => {
    fetch('http://localhost:8080/api/fields/locations').then(
      (locationsResponse) => {
        locationsResponse.json().then((locationsData) => {
          console.log(locationsData);
          setLocations(locationsData);
        });
      },
    );
  };

  const getActivityDataFromServer = () => {
    let mainActivityArr = [];
    let mainActivity = '';
    fetch('http://localhost:8080/api/fieldCropCycles/processCategories').then(
      (activityResponse) => {
        activityResponse.json().then((activityResponseData) => {
          activityResponseData.map((eachActivityResponseData) => {
            console.log(eachActivityResponseData);
            mainActivity = eachActivityResponseData;
            mainActivityArr.push(mainActivity);
          });
        });
      },
    );
    console.log(mainActivityArr);
    setAllMainActivityArr(mainActivityArr);
  };
  useEffect(() => {
    getAllFieldLocations();
    getActivityDataFromServer();
  }, []);

  const handleStartDateChange = (date) => {
    setSelectedDate(date);
    console.log(
      locality,
      fieldId,
      displayCropId,
      activity,
      selectedSubActivity,
      status,
      comment,
      selectedDate,
      selectedEndDate,
    );
  };
  const handleEndateChange = (date) => {
    setselectedEndDate(date);
    console.log(
      locality,
      fieldId,
      displayCropId,
      activity,
      selectedSubActivity,
      status,
      comment,
      selectedDate,
      selectedEndDate,
    );
  };

  const handleTextChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'comment') {
      setComment(value);
    }
  };

  const [showActivity, setShowActivity] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const showAddActivity = () => {
    setShowActivity(!showActivity);
    setShowInspection(false);
  };

  const showAddInspection = () => {
    setShowInspection(!showInspection);
    setShowActivity(false);
  };
  const getAllFieldIds = (fieldLocCode) => {
    fetch(`http://localhost:8080/api/fields?location=${fieldLocCode}`).then(
      (fieldIdResp) => {
        fieldIdResp.json().then((fieldIdRespData) => {
          console.log(fieldIdRespData);

          setFields(fieldIdRespData);
        });
      },
    );
  };
  const handleChange = ({ target }) => {
    const { name, value } = target;

    if (name === 'locality') {
      setLocality(value);
      getAllFieldIds(value);
    } else if (name === 'germination') {
      setSelectedGermination(value);
    } else if (name === 'growth') {
      setSelectedGrowth(value);
    } else if (name === 'flowering') {
      setSelectedFlowering(value);
    } else if (name === 'infestation') {
      setSelectedInfestation(value);
    } else if (name === 'fieldId') {
      setFieldId(value);
      let crops = [];
      fields.map((field) => {
        if (field.identifier === value) {
          field.fieldCropCycles.map((fieldCropCycle) => {
            let dispCrop =
              fieldCropCycle.crop.name +
              '-' +
              fieldCropCycle.season +
              '-' +
              fieldCropCycle.year;
            let dispCropObj = {
              id: fieldCropCycle.id,
              crop: dispCrop,
              season: fieldCropCycle.season,
            };
            crops.push(dispCropObj);
          });
          setDisplayCrops(crops);
        }
      });
    } else if (name === 'crop') {
      console.log(value);
      setDisplayCrop(value);
      setDisplayCropId(value.id);
      setCurrentSeason(value.season);
    } else if (name === 'activityData') {
      console.log(value);
      setActivity(value);
      setSubActivityList(value.processNames);
    } else if (name === 'sub-activity') {
      console.log(value);
      console.log(value.displayStr);
      // setSelectedSubActivity(value.displayStr)
      setSelectedSubActivityValue(value.displayStr);
      setProcessName(value.code);
      // console.log("processName"+value.code)
    } else if (name === 'statusData') {
      setStatus(value);
    }
    console.log(
      locality,
      fieldId,
      displayCropId,
      activity,
      selectedSubActivity,
      status,
      comment,
      selectedDate,
      selectedEndDate,
    );
  };

  const handleAddActivity = () => {
    // console.log(locality, fieldId, displayCropId, activity, selectedSubActivity, status, comment, selectedDate, selectedEndDate)

    // {
    //     "processName": 4,d
    //     "processStatus": 1,
    //     "season": "RABI",d
    //     "fieldCropCycle": {"id": 1},d
    //     "startDueDate": 109809,
    //     "endDueDate": 7686987
    // }

    console.log(processName, currentSeason, displayCropId, selectedDate);

    const payload = {
      processName: processName,
      processStatus: 1,
      season: currentSeason,
      fieldCropCycle: { id: displayCropId },
      startDueDate: displaySelectedDate,
      endDueDate: selectedDate,
    };

    console.log(payload);

    axios({
      url: `http://localhost:8080/api/fieldCropCycles/${displayCropId}/processes`,
      method: 'POST',
      data: payload,

      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((r) => {
        console.log('Crop process cycle saved...' + JSON.stringify(r.data));
        alert('success');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      })
      .catch(() => {
        console.log('Internal server error');
      });
  };

  const handleInspectionDateChange = (d) => {
    console.log(d);
  };

  const handleAssigneeChange = () => {};

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [displaySelectedDate, setDisplaySelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDisplaySelectedDate(moment(date).format('MMDDYYYY'));
  };

  return (
    <div>
      {showSuccess ? <Success /> : null}

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
                  ADD FIELD ACTIVITY | INSPECTION
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
                    {locations.map((fieldLocation) => {
                      return (
                        <MenuItem
                          key={fieldLocation.displayStr}
                          value={fieldLocation.code}
                        >
                          {fieldLocation.displayStr}
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
                        <MenuItem
                          key={field.identifier}
                          value={field.identifier}
                        >
                          {field.identifier}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </ListItem>

              {showActivity ? (
                <div>
                  <ListItem key='3'>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='cs-label'>Crop</InputLabel>
                      <Select
                        id='crop'
                        name='crop'
                        value={displayCrop}
                        onChange={handleChange}
                      >
                        {displayCrops.map((displayedCrop) => {
                          return (
                            <MenuItem key={displayedCrop} value={displayedCrop}>
                              {displayedCrop.crop}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem key='4'>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='ac-label'>Activity type</InputLabel>
                      <Select
                        id='activityData'
                        name='activityData'
                        value={activity}
                        onChange={handleChange}
                      >
                        {allMainActivityArr.map((activity) => {
                          return (
                            <MenuItem
                              key={activity.displayStr}
                              value={activity}
                            >
                              {activity.displayStr}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem key='568'>
                    {selectedSubActivityValue}
                    <FormControl className={classes.formControl}>
                      <InputLabel id='ac-label'>Sub activity</InputLabel>
                      <Select
                        id='sub-category'
                        name='sub-activity'
                        value={selectedSubActivityValue}
                        onChange={handleChange}
                      >
                        {subActivityList.map((subActivity) => {
                          return (
                            <MenuItem
                              key={subActivity.displayStr}
                              value={subActivity}
                            >
                              {subActivity.displayStr}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </ListItem>
                  {/* <ListItem>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container>
                                                <KeyboardDatePicker

                                                    margin="normal"
                                                    id="date-picker-dialog"
                                                    label="Date picker dialog"
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
                                    </ListItem> */}

                  {/* <ListItem>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container>
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
                                    </ListItem> */}

                  <ListItem>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container>
                        <KeyboardDatePicker
                          margin='normal'
                          id='start-date'
                          label='Start date'
                          format='MMddyyyy'
                          value={selectedDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </ListItem>

                  <ListItem>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container>
                        <KeyboardDatePicker
                          margin='normal'
                          id='start-date'
                          label='End date'
                          format='MMddyyyy'
                          value={selectedDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </ListItem>

                  <ListItem>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='ac-label'>Status</InputLabel>
                      <Select
                        id='statusData'
                        name='statusData'
                        value={status}
                        onChange={handleChange}
                      >
                        {statusData.map((status) => {
                          return (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </ListItem>

                  {/* <ListItem key="66">
                                            <TextField id="comment" name="comment" onChange={handleTextChange} label="Comment" />
                                        </ListItem> */}

                  <ListItem key='6'>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={handleAddActivity}
                    >
                      ADD/UPDATE
                    </Button>
                  </ListItem>

                  <ListItem key='7'>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={handleCLick}
                    >
                      SHOW MAP
                    </Button>
                  </ListItem>
                </div>
              ) : null}

              {showInspection ? (
                <div>
                  <ListItem key='55'>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='ac-label'>Germination</InputLabel>
                      <Select
                        id='germination'
                        name='germination'
                        value={selectedGermination}
                        onChange={handleChange}
                      >
                        <MenuItem key={'yes'} value={'yes'}>
                          Yes
                        </MenuItem>
                        <MenuItem key={'no'} value={'no'}>
                          No
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>

                  <ListItem key='56'>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='ac-label'>Growth</InputLabel>
                      <Select
                        id='growth'
                        name='growth'
                        value={selectedGrowth}
                        onChange={handleChange}
                      >
                        <MenuItem key={'yes'} value={'yes'}>
                          Yes
                        </MenuItem>
                        <MenuItem key={'no'} value={'no'}>
                          No
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>

                  <ListItem key='57'>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='ac-label'>Flowering</InputLabel>
                      <Select
                        id='flowering'
                        name='flowering'
                        value={selectedFlowering}
                        onChange={handleChange}
                      >
                        <MenuItem key={'yes'} value={'yes'}>
                          Yes
                        </MenuItem>
                        <MenuItem key={'no'} value={'no'}>
                          No
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>

                  <ListItem key='58'>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='ac-label'>Infestation</InputLabel>
                      <Select
                        id='infestation'
                        name='infestation'
                        value={selectedInfestation}
                        onChange={handleChange}
                      >
                        <MenuItem key={'yes'} value={'yes'}>
                          Yes
                        </MenuItem>
                        <MenuItem key={'no'} value={'no'}>
                          No
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>

                  <ListItem>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container>
                        <KeyboardDatePicker
                          disableToolbar
                          variant='inline'
                          format='MM/dd/yyyy'
                          margin='normal'
                          id='inspection-date'
                          label='Date'
                          value={selectedInspectionDate}
                          formatDate={(date) =>
                            moment(new Date()).format('MMDDYYYY')
                          }
                          onChange={handleInspectionDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'Date',
                          }}
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                  </ListItem>

                  <ListItem>
                    <TextField
                      id='assignee'
                      name='assignee'
                      onChange={handleAssigneeChange}
                      label='Assignee'
                    />
                  </ListItem>

                  <ListItem key='100'>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={handleCLick}
                    >
                      Add Inspection
                    </Button>
                  </ListItem>
                </div>
              ) : null}

              <Button onClick={showAddActivity}>Toggle Add Activity</Button>

              <Button onClick={showAddInspection}>Toggle Add Inspection</Button>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ActivityPage;
