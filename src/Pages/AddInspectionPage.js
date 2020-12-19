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
  Snackbar,
  TextField,Radio, RadioGroup,FormControlLabel,FormLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { getLocations } from '../dataclients/LocationsClient';
import {getFieldsByLocation} from '../dataclients/FieldsClient';
import {getInspectionParams,postInspection} from '../dataclients/InspectionClient';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Autocomplete } from '@material-ui/lab';
import {fetchCropCycles} from '../utils/ActInspUtils';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 300,
  },
  submitButton: {
    margin: theme.spacing(3),
    width: 'fit-content',
    minWidth: '150px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  menuItem: {
    maxWidth: 300,
    whiteSpace: 'normal',
  },
  radioLabel:{
    marginRight:theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddInspectionPage = () => {
  const classes = useStyles();
  const [locality, setLocality] = useState('');
  const [fieldIdentifier, setFieldIdentifier] = useState('');
  const [fields, setFields] = useState([]);
  const [locations, setLocations] = useState([]);

  const [inspectionParams, setInspectionParams] = useState([]);
  const [inspectionVal,setInspectionVal] = useState([]);
  const [cropCycleList, setCropCycleList] = useState([]);
  const [cropCycleId, setCropCycleId] = useState('');
 
 
 
  const [selectedInspectionDate, setSelectedInspectionDate] = useState(
    new Date(),
  );
  
 
 
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');


  const [showFollowUpActivity,setShowFollowUpActivity] = useState(false);
  const [followUpActivities,setFollowUpActivties] = useState([{name:''}]);
  const activityList = [{id:1,value:"Watering"},{id:2,value:"Sowing"},{id:3,value:"Spraying"}];
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...followUpActivities];
    list[index].name = value;
    setFollowUpActivties(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...followUpActivities];
    list.splice(index, 1);
    setFollowUpActivties(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setFollowUpActivties([...followUpActivities, { name:"" }]);
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
    getInspectionParams()
      .then(setInspectionParams)
      .catch((e) => {
        console.log('Fetching Inspection Param list failed', e);
        showAlert('Fetching Inspection Param list failed', 'error');
      })

   
  }, []);



 
  const initializeInspectionVal = () =>{
    var inspVals = [];
    inspectionParams.forEach((param) => {
      inspVals.push({code:param.code,name:param.displayStr,val:-1})
    });
    setInspectionVal(inspVals);
  };

  useEffect(initializeInspectionVal,[inspectionParams]);

  const fetchFieldsForLocation= (val) =>{
    getFieldsByLocation(val)
    .then(setFields)
    .catch((e) => {
      console.log("Fetching fields for location:"+val+" failed",e);
      showAlert("Fetching fields for location:"+val+" failed","error");
    })
  };
 
  const handleChange = ({ target }) => {
    const { name, value } = target;

    if (name === 'locality') {
      setLocality(value);
      fetchFieldsForLocation(value);
    }  else if (name === 'fieldId') {
      setFieldIdentifier(value);
      let s = fetchCropCycles(fields,fieldIdentifier);
      console.log(s);
      setCropCycleList(s);
    } else if (name === 'cropCycle') {
      setCropCycleId(value);
    }
  };

 

  const handleInspectionDateChange = (d) => {
    setSelectedInspectionDate(d);
    console.log(d);
  };
  const handleInspectionChange = ({target}) => {
    const {name,value} = target;
    //target.value = parseInt(value);
    //console.log(name+":"+value);
    //console.log(inspectionVal);
    let inspVals = inspectionVal;
    inspVals.find(inspV => inspV.name===name).val = parseInt(value);
    setInspectionVal(inspVals);
    //console.log(inspectionVal);

  }
  const verifyInspData = () => {
    let indx = 0;
    while(indx < inspectionVal.length )
    {
      if(inspectionVal[indx].val === -1)
      {
         return 0;
      }
      indx++;
    }
    return 1;
  }
    


  const handleAssigneeChange = () => {};

  
  function processAllInspectionPosting()
  {
    let error = "";
    let info =  "Inspection Info successfullly posted";
    let fieldCropCycleId = 1;
    let inspPostedCnt = 0;
    inspectionVal.forEach((iParam) => {
      if(inspPostedCnt === 2)
      {
        fieldCropCycleId=2;
        console.log(fieldCropCycleId);
      } 
      const payload = {
        "inspectionName": iParam.code,
        "inspectionStatus": iParam.val,
        "dueDate": selectedInspectionDate,
        "completionDate": selectedInspectionDate,
        "fieldCropCycle": {"id":cropCycleId}
        };
      console.log(payload);
      postInspection(payload,cropCycleId)
        .then((response) => {
          console.log("Inspection posted for " + iParam.name + " : " + response);
          inspPostedCnt = inspPostedCnt + 1;
          if(inspPostedCnt === inspectionVal.length)
          {
            showAlert(info,'info');
            console.log("Inspection count"+inspPostedCnt);
          }
         

        })
        .catch((e) =>{
            
            console.log("Internal server error",e);
            error = "Inspection posting failed " + e.message;
            showAlert(error,'error');
            
          });
        });
  } 
  const handleSubmit = () => {
    
    if(verifyInspData() === 0)
    {
      showAlert("All inspection parametes need to be filled",'error');
    }else{
      processAllInspectionPosting();
    }
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
                ADD FIELD INSPECTION
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
            <ListItem key='3'>
              <FormControl className={classes.formControl}>
                <InputLabel id='cs-label'>Crop Cycle</InputLabel>
                <Select
                  id='cropCycle'
                  name='cropCycle'
                  value={cropCycleId}
                  onChange={handleChange}
                >
                  {cropCycleList.map((cropCycle) => {
                    return (
                      <MenuItem key={cropCycle.displayStr} value={cropCycle.id}>
                        {cropCycle.displayStr}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              </ListItem>
              <div>
                {inspectionParams.map((iParam,index) => {
                  return (
                    <ListItem key={iParam.code}>
                      <FormControl className={classes.formControl} >
                        <FormLabel id='ac-label' className={classes.radioLabel}>{iParam.displayStr}</FormLabel>
                        <RadioGroup
                          id={iParam.displayStr}
                          name={iParam.displayStr}                           
                          onChange={handleInspectionChange}
                         row >
                            <FormControlLabel value={'1'} control={<Radio />} label="Yes" />
                            <FormControlLabel value={'0'} control={<Radio />} label="No" />
                            
                          </RadioGroup>
                      </FormControl>
                    </ListItem>
                  )
                })}
               
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
                {showFollowUpActivity? 
                  followUpActivities.map((x,i) =>{
                    return(
                      <ListItem key='2'>
                        <FormControl className={classes.formControl}>
                          <InputLabel id='fId-label'>Add Activity</InputLabel>
                          <Select
                            id='fieldId'
                            name='fieldId'
                            value={x.name}
                            onChange={e => handleInputChange(e, i)}
                            
                          >
                            {activityList.map((activity) => {
                              return (
                                <MenuItem key={activity.id} value={activity.value}>
                                  {activity.value}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {followUpActivities.length !== 1 && <button
                              className="mr10"
                              onClick={() => handleRemoveClick(i)}>Remove</button>}
                            {followUpActivities.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
                        </FormControl>
                      </ListItem>
                    )
                  }):null  
                }
                <ListItem key='100'>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={handleSubmit}
                  >
                    Add Inspection
                  </Button>
                </ListItem>
                <Snackbar open={alertStatus} onClose={handleAlertClose}>
                  <Alert onClose={handleAlertClose} severity={alertSeverity}>
                    {alertMessage}
                  </Alert>
                </Snackbar>
                
              </div>
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddInspectionPage;
