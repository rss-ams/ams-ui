import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import axios from 'axios';
import { statusData } from 'data/statusData';
import { getLocations } from 'dataclients/LocationsClient';
import { getProcessCategories } from 'dataclients/ProcessesClient';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddActivityPage = () => {
  const classes = useStyles();
  const [locality, setLocality] = useState('');
  const [fieldIdentifier, setFieldIdentifier] = useState('');
  const [cropSeason, setCropSeason] = useState('');
  const [process, setProcess] = useState('');
  const [subActivityList, setSubActivityList] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedEndDate, setselectedEndDate] = useState(
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
  const [selectedInspectionDate, setSelectedInspectionDate] = useState(
    new Date('2014-08-18T21:11:54'),
  );
  const [selectedGermination, setSelectedGermination] = useState('');
  const [selectedGrowth, setSelectedGrowth] = useState('');
  const [selectedFlowering, setSelectedFlowering] = useState('');
  const [selectedInfestation, setSelectedInfestation] = useState('');
  const [processCategories, setProcessCategories] = useState([]);
  const [currentSeason, setCurrentSeason] = useState('');
  const [processName, setProcessName] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  const handleClick = () => {
    console.log(
      'locality,fieldId,cropSeason,activity' + locality,
      fieldIdentifier,
      cropSeason,
      process,
    );
  };

  const handleAlertClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertStatus(false);
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertStatus(true);
  };

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => {
        console.log('Fetching location list failed', e);
        showAlert('Fetching location list failed', 'error');
      });

    getProcessCategories()
      .then(setProcessCategories)
      .catch((e) => {
        console.log('Fetching process category list failed', e);
        showAlert('Fetching process category list failed', 'error');
      });
  }, []);

  const handleStartDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleEndateChange = (date) => {
    setselectedEndDate(date);
  };

  const handleTextChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'comment') {
      setComment(value);
    }
  };

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
      setFieldIdentifier(value);
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
      setDisplayCrop(value);
      setDisplayCropId(value.id);
      setCurrentSeason(value.season);
    } else if (name === 'activityData') {
      setProcess(value);
      setSubActivityList(value.processNames);
    } else if (name === 'sub-activity') {
      setSelectedSubActivityValue(value.displayStr);
      setProcessName(value.code);
    } else if (name === 'statusData') {
      setStatus(value);
    }
  };

  const handleAddActivity = () => {
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
      })
      .catch(() => {
        console.log('Internal server error');
      });
  };

  const handleInspectionDateChange = (d) => {
    console.log(d);
  };

  const handleAssigneeChange = () => {};

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displaySelectedDate, setDisplaySelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDisplaySelectedDate(moment(date).format('MMDDYYYY'));
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
                  value={fieldIdentifier}
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
                      value={process}
                      onChange={handleChange}
                    >
                      {processCategories.map((activity) => {
                        return (
                          <MenuItem key={activity.displayStr} value={activity}>
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
                    onClick={handleClick}
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
                    onClick={handleClick}
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
  );
};

export default AddActivityPage;
