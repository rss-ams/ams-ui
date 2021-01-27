import {
    FormGroup,
    Grid,
    Snackbar,
    Typography,Button,TextField
  } from '@material-ui/core';
  import { makeStyles } from '@material-ui/core/styles';
  import { Alert } from '@material-ui/lab';
  import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
  import DateFnsUtils from '@date-io/date-fns';
  import { getLocations } from 'dataclients/LocationsClient';
  import { postActivity } from '../dataclients/ProcessesClient'
  import { getAdhocActivities, postInspection } from '../dataclients/InspectionClient';
  import React, { useEffect, useState } from 'react';
  import InspectionOptions from '../components/InspectionOptions';
  import InspectionAdHocActivity from '../components/InspectionAdHocActivity';
  import CropCycleComponent from '../components/CropCycleComponent';
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
    const [locations, setLocations] = useState([]);
    const [cropCycleId, setCropCycleId] = useState('');
    const [cropCycles, setCropCycles] = useState([]);
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
      setCropCycleId('');
      setSelectedInspectionDate(new Date());
      setShowFollowUpActivity(false);
      setFollowUpActivties([{ code: "", displayStr: "" }]);
      setAdHocActivityList([]);
    }
  
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
  

    
      function enableAddAdHocActivities() {
        //console.log("inside enable adhoc add");
        if (adHocActivityList.length > 0)
          setShowFollowUpActivity(true)
        else
          setShowFollowUpActivity(false);
        //console.log(showFollowUpActivity);
        //console.log(adHocActivityList);
      }
    
    const handleInspectionDateChange = (d) => {
        setSelectedInspectionDate(d);
        //console.log(d);
      };
    
      //return no of submitted inspection parameters
      const countInspData = () => {
        let cnt = 0;
        let indx = 0;
        while (indx < inspectionVal.length) {
          if (inspectionVal[indx].val !== -1) {
            cnt = cnt +1;
          }
          indx++;
        }
        return cnt;
      }
    
      //checks if duplicate Ad hoc actvities are not submitted
      const isDuplicateAdHocEntry = () => {
        //console.log("Inside isduplicateAdHocEntry");
        let i = 0;
        let len = followUpActivities.length;
        let dup = 0;
        while ((i < (len - 1)) && (dup === 0)) {
          let j = i + 1;
          while ((j < len) && (dup === 0)) {
            if (followUpActivities[i].code === followUpActivities[j].code) {
              dup = 1;
              //console.log("Found duplicate");
            }
            //console.log(i + "th adHocActivity:" + followUpActivities[i].code);
            //console.log(j + "th adHocActivity:" + followUpActivities[j].code);
            j++;
          }
          i++;
        }
        return dup;
      }
    
    
    
      const handleAssigneeChange = () => { };
    
    
      function processAllInspectionPosting(cntInspParam) {
        let error = "";
        let info = "Inspection Info successfullly posted";
        
        let inspPostedCnt = 0;
        inspectionVal.forEach((iParam) => {
         if(iParam.val !== -1)
         {
          const payload = {
            "inspectionType": iParam.code,
            "resultPositive":Boolean( iParam.val),
            "dueDate": selectedInspectionDate,
            "completionDate": selectedInspectionDate,
            "fieldCropCycle": { "id": cropCycleId }
          };
          //console.log(payload);
          postInspection(payload, cropCycleId)
            .then((response) => {
              //console.log("Inspection posted for " + iParam.name + " : " + response);
              inspPostedCnt = inspPostedCnt + 1;
    
              if (inspPostedCnt === cntInspParam) {
                if (showFollowUpActivity === false) {
                  showAlert(info, 'info');
                  //console.log("Inspection count" + inspPostedCnt);
                }
    
              }
    
    
            })
            .catch((e) => {
    
              console.log("Internal server error", e);
              error = "Inspection posting failed " + e.message;
              showAlert(error, 'error');
    
            });
         }
         
          
        });
      }
    
      function postAdHocActivity() {
        //console.log("Posting AdHoc Activiies:")
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
          //console.log(payload);
          postActivity(payload, cropCycleId)
            .then((response) => {
              //console.log("AdHoc activty posted for " + adHoctivity.displayStr + " : " + response);
              postAdhocCnt = postAdhocCnt + 1;
              if (postAdhocCnt === followUpActivities.length) {
                showAlert(info, 'info');
                //console.log("Inspection count" + postAdhocCnt);
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
        let cntInspParam = countInspData();
        if (cntInspParam === 0) {
          showAlert("At least one inspection parameter need to be submitted", 'error');
        } else {
          if(showFollowUpActivity === true)
          {
           
            if((followUpActivities.length === 1) && (followUpActivities[0].code === ""))
            {
              showAlert("Please select at least one follow up activity",'error');
              console.log("error");
            }else if(isDuplicateAdHocEntry() === 1) 
            {
              showAlert(" Same activity cannot be added be twice", 'error');
            }else {
              processAllInspectionPosting(cntInspParam);
              //console.log("ShowfollowupActivity:" + showFollowUpActivity);
              if (showFollowUpActivity === true) {
                //console.log("Inside postAdhoc");
                postAdHocActivity();
              }
            }
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
     * Returns Inspection Form containg the different inspection parameters and add hoc activities
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

      
      return (
        
         <div>
            <InspectionOptions inspectionVal ={inspectionVal}
                               setInspectionVal={setInspectionVal}
                                classStyleObj={classes}
                                failureHandler={processUpdateFailureHandler}/>

               
               {showFollowUpActivity ?
                  <InspectionAdHocActivity adHocActivityList={adHocActivityList}
                                          followUpActivities={followUpActivities}
                                          setFollowUpActivties={setFollowUpActivties}
                                          classStyleObj={classes}
                                          />
                 : null
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
  
    useEffect(() => {
      getLocations()
        .then(setLocations)
        .catch((e) => {
          console.log('Fetching location list failed', e);
          showAlert('Fetching location list failed', 'error');
        });
    }, []);

    useEffect(() => {
      getAdhocActivities(cropCycleId, inspectionVal)
        .then(setAdHocActivityList)
        .catch((e) => {
          console.log("Fetching ad hoc activities failed", e);
        })
    }, [inspectionVal, cropCycleId])
    useEffect(enableAddAdHocActivities, [adHocActivityList]);


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
          <CropCycleComponent classStyleObj={classes}
                              locations={locations}
                              cropCycleId={cropCycleId}
                              setCropCycleIdHandler={setCropCycleId}
                              cropCycles={cropCycles}
                              setCropCyclesHandler={setCropCycles}
                              failureHandler={processUpdateFailureHandler}/>
          {/* InspectionForm containing inspection paramters and ad hoc activities if required */}
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
  