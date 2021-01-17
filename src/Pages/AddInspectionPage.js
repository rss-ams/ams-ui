import {
    FormControl,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Typography,Button,TextField, Radio, RadioGroup, FormControlLabel, FormLabel
  } from '@material-ui/core';
  import { makeStyles } from '@material-ui/core/styles';
  import { Alert } from '@material-ui/lab';
  import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
  import DateFnsUtils from '@date-io/date-fns';
  import { getCropCyclesByField } from 'dataclients/CropCyclesClient';
  import { getFieldsByLocation } from 'dataclients/FieldsClient';
  import { getLocations } from 'dataclients/LocationsClient';
  import { postActivity } from '../dataclients/ProcessesClient'
  import { getInspectionParams, getAdhocActivities, postInspection } from '../dataclients/InspectionClient';
  import React, { useEffect, useState } from 'react';
  
  const useStyles = makeStyles((theme) => ({
    gridItem: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
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
    helpText: {
      fontSize: theme.typography.pxToRem(14),
      color: theme.palette.text.secondary,
    },
  }));
  
  const AddInspectionPage = () => {
    const classes = useStyles();
    const [locationCode, setLocationCode] = useState('');
    const [locations, setLocations] = useState([]);
    const [fieldId, setFieldId] = useState('');
    const [fields, setFields] = useState([]);
    const [cropCycleId, setCropCycleId] = useState('');
    const [cropCycles, setCropCycles] = useState([]);
    const [inspectionParams, setInspectionParams] = useState([]);
    const [inspectionVal, setInspectionVal] = useState([]);
    const [selectedInspectionDate, setSelectedInspectionDate] = useState(
        new Date(),
      );
    const [showFollowUpActivity, setShowFollowUpActivity] = useState(false);
    const [followUpActivities, setFollowUpActivties] = useState([{ code: "", displayStr: "" }]);
    const [adHocActivityList, setAdHocActivityList] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('');
    
    const resetForm = () => {
      setLocationCode('');
      setFieldId('');
      setFields([]);
      initializeInspectionVal();
      setCropCycles([]);
      setCropCycleId('');
      setSelectedInspectionDate(new Date());
      setShowFollowUpActivity(false);
      setFollowUpActivties([{ code: "", displayStr: "" }]);
      setAdHocActivityList([]);
    }
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...followUpActivities];
        list[index].code = value;
        list[index].displayStr = adHocActivityList.filter((activity) => activity.code === value);
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
        setFollowUpActivties([...followUpActivities, { code: "", displayStr: "" }]);
    };

  
    const handleAlertClose = (_event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setAlertStatus(false);
      if (alertSeverity === "info") {
        resetForm();
      }
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
        });
    }, []);
    


    /**
     * Function to fetch fields for a selected location using API
     * updates fieldsData if call is successful
     * shows alert in case call fails
     * @param {number} selectedLocationCode The code for the selected location
     */
    const fetchFieldsForLocation = (selectedLocationCode) => {
      const displayStr = locations.filter(
        (obj) => obj.code === selectedLocationCode,
      )[0].displayStr;
      getFieldsByLocation(selectedLocationCode)
        .then(setFields)
        .catch((e) => {
          console.log(
            `Fetching fields for ${selectedLocationCode} - ${displayStr} failed`,
            e,
          );
          showAlert(`Fetching fields for ${displayStr} failed`, 'error');
        });
    };
  
    /**
     * Function to fetch CropCycles for a selected field
     * updates CropCycles if call is successful
     * shows alert in case call fails
     * @param {number} selectedFieldId The ID of the selected field
     */
    const fetchCropCyclesForField = (selectedFieldId) => {
      const fieldName = fields.filter((obj) => obj.id === selectedFieldId)[0]
        .identifier;
      getCropCyclesByField(selectedFieldId)
        .then((data) => data.content)
        .then(formatCropCyclesForDisplay)
        .then(setCropCycles)
        .catch((e) => {
          console.log(
            `Fetching crop cycles for ${selectedFieldId} - ${fieldName} failed`,
            e,
          );
          showAlert(`Fetching crop cycles for ${fieldName} failed`, 'error');
        });
    };
  
    /**
     * Formats the crop cycle objects for display. It addes name as a new
     * attribute in the object which is formed by using the crop name,
     * season and year separated by hyphens for better readability
     * @param {object} cropCycleObjects Objects containing crop cycle details
     */
    const formatCropCyclesForDisplay = (cropCycleObjects) =>
      cropCycleObjects.map((cropCycleObject) => ({
        ...cropCycleObject,
        name: `${cropCycleObject.crop.name} - ${cropCycleObject.season} - ${cropCycleObject.year}`,
      }));


    
      const initializeInspectionVal = () => {
        var inspVals = [];
        inspectionParams.forEach((param) => {
          inspVals.push({ code: param.code, name: param.displayStr, val: -1 })
        });
        setInspectionVal(inspVals);
      };
    
      useEffect(initializeInspectionVal, [inspectionParams]);
      useEffect(() => {
        getAdhocActivities(cropCycleId, inspectionVal)
          .then(setAdHocActivityList)
          .catch((e) => {
            console.log("Fetching ad hoc activities failed", e);
          })
      }, [inspectionVal, cropCycleId])
    
      function enableAddAdHocActivities() {
        console.log("inside enable adhoc add");
        if (adHocActivityList.length > 0)
          setShowFollowUpActivity(true)
        else
          setShowFollowUpActivity(false);
        console.log(showFollowUpActivity);
        console.log(adHocActivityList);
      }
      useEffect(enableAddAdHocActivities, [adHocActivityList]);

    const handleChange = ({ target }) => {
      const { name, value } = target;
      if (name === 'location') {
        setLocationCode(value);
        fetchFieldsForLocation(value);
        // need to clear the following dropdowns and hence the process cards
        setFieldId('');
        setCropCycleId('');
      } else if (name === 'field') {
        setFieldId(value);
        fetchCropCyclesForField(value);
        // need to clear the following dropdowns and hence the process cards
        setCropCycleId('');
      } else if (name === 'crop-cycle') {
        setCropCycleId(value);
      }
    };
    
    const handleInspectionDateChange = (d) => {
        setSelectedInspectionDate(d);
        console.log(d);
      };
      const handleInspectionChange = ({ target }) => {
        const { name, value } = target;
        //target.value = parseInt(value);
        //console.log(name+":"+value);
        //console.log(inspectionVal);
        let inspVals = inspectionVal;
        inspVals.find(inspV => inspV.name === name).val = parseInt(value);
        setInspectionVal([...inspVals]);
        //console.log(inspectionVal);
    
      }
      const verifyInspData = () => {
        let indx = 0;
        while (indx < inspectionVal.length) {
          if (inspectionVal[indx].val === -1) {
            return 0;
          }
          indx++;
        }
        return 1;
      }
    
      const isDuplicateAdHocEntry = () => {
        console.log("Inside isduplicateAdHocEntry");
        let i = 0;
        let len = followUpActivities.length;
        let dup = 0;
        while ((i < (len - 1)) && (dup === 0)) {
          let j = i + 1;
          while ((j < len) && (dup === 0)) {
            if (followUpActivities[i].code === followUpActivities[j].code) {
              dup = 1;
              console.log("Found duplicate");
            }
            console.log(i + "th adHocActivity:" + followUpActivities[i].code);
            console.log(j + "th adHocActivity:" + followUpActivities[j].code);
            j++;
          }
          i++;
        }
        return dup;
      }
    
    
    
      const handleAssigneeChange = () => { };
    
    
      function processAllInspectionPosting() {
        let error = "";
        let info = "Inspection Info successfullly posted";
        
        let inspPostedCnt = 0;
        inspectionVal.forEach((iParam) => {
         
          const payload = {
            "inspectionType": iParam.code,
            "resultPositive":Boolean( iParam.val),
            "dueDate": selectedInspectionDate,
            "completionDate": selectedInspectionDate,
            "fieldCropCycle": { "id": cropCycleId }
          };
          console.log(payload);
          postInspection(payload, cropCycleId)
            .then((response) => {
              console.log("Inspection posted for " + iParam.name + " : " + response);
              inspPostedCnt = inspPostedCnt + 1;
    
              if (inspPostedCnt === inspectionVal.length) {
                if (showFollowUpActivity === false) {
                  showAlert(info, 'info');
                  console.log("Inspection count" + inspPostedCnt);
                }
    
              }
    
    
            })
            .catch((e) => {
    
              console.log("Internal server error", e);
              error = "Inspection posting failed " + e.message;
              showAlert(error, 'error');
    
            });
        });
      }
    
      function postAdHocActivity() {
        console.log("Posting AdHoc Activiies:")
        let postAdhocCnt = 0;
        let info = "Inspection Info successfullly posted";
        let error = "";
        followUpActivities.forEach((adHoctivity) => {
        
          const payload = {
            "processName": adHoctivity.code,
            // "season": fields.filter((field) => field.identifier === fieldIdentifier)[0].fieldCropCycles.filter((cropCycle) => cropCycle.id === cropCycleId)[0].season,
            "fieldCropCycle": { "id": cropCycleId },
            "startDueDate": selectedInspectionDate,
            "endDueDate": selectedInspectionDate
          };
          console.log(payload);
          postActivity(payload, cropCycleId)
            .then((response) => {
              console.log("AdHoc activty posted for " + adHoctivity.displayStr + " : " + response);
              postAdhocCnt = postAdhocCnt + 1;
              if (postAdhocCnt === followUpActivities.length) {
                showAlert(info, 'info');
                console.log("Inspection count" + postAdhocCnt);
              }
    
    
            })
            .catch((e) => {
    
              console.log("Internal server error", e);
              error = "Posting adhoc activities failed " + e.message;
              showAlert(error, 'error');
    
            });
        });
    
    
      }
      const handleSubmit = (e) => {
    
        if (verifyInspData() === 0) {
          showAlert("All inspection parametes need to be filled", 'error');
        } else if (isDuplicateAdHocEntry() === 1) {
          showAlert(" Same activity cannot be added be twice", 'error');
        } else {
          processAllInspectionPosting();
          console.log("ShowfollowupActivity:" + showFollowUpActivity);
          if (showFollowUpActivity === true) {
            console.log("Inside postAdhoc");
            postAdHocActivity();
          }
    
        }
      };


    /**
     * Sucess handler passed as the callback function to processs card
     * @param {string} message success message
     */
    const processUpdateSuccessHandler = (message) => {
      showAlert(message, 'info');
    };
  
    /**
     * Failure handler passed as the callback function to processs card
     * @param {string} message failure message
     */
    const processUpdateFailureHandler = (message) => {
      showAlert(message, 'error');
    };
  
    /**
     * Returns process cards corresponding to each non-completed processes
     * for the selected crop-cycle
     */
    const getInspectionForm = () => {
      let selectedCropCycle = cropCycles.filter(
        (cropCycle) => cropCycle.id === cropCycleId,
      )[0];
  
      // if a crop cycle is not selected
      if (!selectedCropCycle)
        return (
          <Typography className={classes.helpText}>
            Please select a crop cycle
          </Typography>
        );
  
      // if the crop cycle doesn't have ant non-completed processes
      if (
        !selectedCropCycle.currentProcesses ||
        selectedCropCycle.currentProcesses.length === 0
      )
        return (
          <Typography className={classes.helpText}>
            'No ongoing processes for the crop cycle. All processes completed for
            this crop cycle?'{' '}
          </Typography>
        );
  
      // Happy case - return process cards corresponding to each non-completed process
      return (
        
         <div>
            {inspectionParams.map((iParam, index) => {
                return (

                  <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                    <FormControl className={classes.formControl} row>
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
                  </Grid>

                )
              })}
               {showFollowUpActivity ?
                  followUpActivities.map((x, i) => {
                    return (
                      <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id='fId-label'>Select Activity</InputLabel>
                          <Select
                            id='adHocActivity'
                            name='adHocActivity'
                            value={x.id}
                            onChange={e => handleInputChange(e, i)}

                          >
                            {adHocActivityList.map((activity) => {
                              return (
                                <MenuItem key={activity.code} value={activity.code}>
                                  {activity.displayStr}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {followUpActivities.length !== 1 && <button
                            className="mr10"
                            onClick={() => handleRemoveClick(i)}>Remove this Activity</button>}
                          {followUpActivities.length - 1 === i && (i < adHocActivityList.length - 1) && <button onClick={handleAddClick}>Add Another Activity</button>}
                        </FormControl>
                      </Grid>
                    )
                  }) : null
                }
              <Grid item xs={12}>
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
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id='assignee'
                    name='assignee'
                    onChange={handleAssigneeChange}
                    label='Assignee'
                  />
                </Grid><br/>
             
                <Grid container item xs={12} align="center" justify="center">
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    
                  >
                    SUBMIT
                  </Button>
                  </Grid>
        </div>
          );
        
    };
  
    return (
      <FormGroup className={classes.formGroup}>
        <Grid
          container
          className={classes.container}
          spacing={2}
          justify='center'
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12}>
            <Typography align='center' variant='h6' className={classes.title}>
              Update Inspection
            </Typography>
          </Grid>
  
          {/* Location selection */}
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id='location-label'>Location</InputLabel>
              <Select
                id='location'
                name='location'
                value={locationCode}
                onChange={handleChange}
              >
                {locations.map((obj) => {
                  return (
                    <MenuItem key={obj.displayStr} value={obj.code}>
                      {obj.displayStr}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
  
          {/* Field selection */}
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id='field-label'>Field</InputLabel>
              <Select
                id='field'
                name='field'
                value={fieldId}
                onChange={handleChange}
              >
                {fields.map((obj) => (
                  <MenuItem key={obj.identifier} value={obj.id}>
                    {obj.identifier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
  
          {/* Crop-cycle selection */}
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id='crop-cycle-label'>Crop cycle</InputLabel>
              <Select
                id='crop-cycle'
                name='crop-cycle'
                value={cropCycleId}
                onChange={handleChange}
              >
                {cropCycles.map((obj) => {
                  return (
                    <MenuItem key={obj.name} value={obj.id}>
                      {obj.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
  
          {/* Process cards for each non-completed processes */}
          <Grid item xs={12}>
            {getInspectionForm()}
          </Grid>
        </Grid>
  
        {/* Alerts on API call success/failure */}
        <Snackbar open={alertStatus} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </FormGroup>
    );
  };
export default AddInspectionPage;
  