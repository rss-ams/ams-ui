import {
  FormGroup,
  Grid,
  Snackbar,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getLocations } from 'dataclients/LocationsClient';
import { postBatchProcess } from 'dataclients/ProcessesClient';
import {
  getAdhocProcesses,
  postBatchInspection,
} from 'dataclients/InspectionClient';
import React, { useEffect, useState } from 'react';
import InspectionOptions from 'components/InspectionOptions';
import InspectionAdHocActivity from 'components/InspectionAdHocActivity';
import CropCycleComponent from 'components/CropCycleComponent';
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
  const [inspectionList, setInspectionList] = useState([]);
  const [selectedInspectionDate, setSelectedInspectionDate] = useState(
    new Date(),
  );
  const [showFollowUpProcesses, setShowFollowUpProcesses] = useState(false);
  const [followUpProcesses, setFollowUpProcesses] = useState([
    { code: '', displayStr: '' },
  ]);
  const [adHocProcessList, setAdHocProcessList] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  const resetForm = () => {
    setCropCycleId('');
    setSelectedInspectionDate(new Date());
    setAdHocProcessList([]);
    setFollowUpProcesses([{ code: '', displayStr: '' }]);
  };

  const handleAlertClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertStatus(false);
    if (alertSeverity === 'info') {
      resetForm();
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertStatus(true);
  };

  /** sets Ad Hoc process list to
   *  - empty for if crop cycle not selected or inspection params not changed
   *  - array fetched from server based on seleted crop cycle and inspection values   *
   *  */

  const fetchAdHocActivityList = () => {
    let qParam = '';
    inspectionList.forEach((inspectionValue) => {
      if (inspectionValue.val === 0) {
        qParam = qParam + inspectionValue.code + '=false&';
      }
      if (inspectionValue.val === 1) {
        qParam = qParam + inspectionValue.code + '=true&';
      }
    });
    if (cropCycleId === '' || qParam === '') setAdHocProcessList([]);
    else {
      getAdhocProcesses(cropCycleId, qParam)
        .then(setAdHocProcessList)
        .catch((e) => {
          console.log('Fetching ad hoc activities failed', e);
        });
    }
  };

  const enableAddAdHocActivities = () => {
    setShowFollowUpProcesses(adHocProcessList.length > 0);
  };

  //return no of submitted inspection parameters
  const countInspectionParamSubmitted = () => {
    let cnt = inspectionList.filter(
      (inspectionValue) => inspectionValue.val !== -1,
    ).length;
    return cnt;
  };

  //checks if duplicate Ad hoc actvities are getting submitted
  const isDuplicateAdHocEntry = () => {
    let followUpProcessesArray = followUpProcesses.map(
      (element) => element.code,
    );

    return (
      new Set(followUpProcessesArray).size !== followUpProcessesArray.length
    );
  };

  const handleAssigneeChange = () => {}; // TO DO

  // post all submitted inspection observations through the batch post api
  const postInspections = () => {
    let payload = [];
    inspectionList.forEach((inspectionValue) => {
      if (inspectionValue.val !== -1) {
        payload.push({
          inspectionType: inspectionValue.code,
          resultPositive: Boolean(inspectionValue.val),
          dueDate: selectedInspectionDate,
          completionDate: selectedInspectionDate,
          fieldCropCycle: { id: cropCycleId },
        });
      }
    });
    postBatchInspection(payload, cropCycleId)
      .then((response) => {
        if (showFollowUpProcesses === false) {
          showAlert('Inspection Info successfullly posted', 'info');
        }
      })
      .catch((e) => {
        console.log('Internal server error', e);
        showAlert('Inspection posting failed ' + e.message, 'error');
      });
  };

  // post Ad hoc activities to be scheduled in case of not favourable inspection results
  const postAdHocProcesses = () => {
    let payload = [];
    followUpProcesses.forEach((adHocProcess) => {
      if (adHocProcess.code !== '') {
        payload.push({
          processName: adHocProcess.code,
          fieldCropCycle: { id: cropCycleId },
          startDueDate: selectedInspectionDate,
        });
      }
    });

    postBatchProcess(payload, cropCycleId)
      .then((response) => {
        showAlert('Inspection Info successfullly posted', 'info');
      })
      .catch((e) => {
        showAlert('Posting adhoc activities failed ' + e.message, 'error');
      });
  };

  /**
   * Validates inspection data non empty data and duplicate ad hoc activities
   * are not submitted
   * @returns {error,message}  Dicttionary containing error and message
   */
  const validateInspectionData = () => {
    let error = false;
    let message = '';
    let cntInspParam = countInspectionParamSubmitted();
    if (cntInspParam === 0) {
      error = true;
      message = 'At least one inspection parameter need to be submitted';
    } else {
      if (showFollowUpProcesses === true) {
        if (
          followUpProcesses.length === 1 &&
          followUpProcesses[0].code === ''
        ) {
          error = true;
          message = 'Please select at least one follow up activity';
        } else if (isDuplicateAdHocEntry() === true) {
          error = true;
          message = 'Same activity cannot be added be twice';
        }
      }
    }
    return { error: error, message: message };
  };
  const handleSubmit = (e) => {
    let formValidationResult = validateInspectionData();

    if (!formValidationResult.error) {
      postInspections();
      if (showFollowUpProcesses === true) {
        postAdHocProcesses();
      }
    } else {
      showAlert(formValidationResult.message, 'error');
    }
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
          this crop cycle?'
        </Typography>
      );

    return (
      <div>
        <InspectionOptions
          inspectionList={inspectionList}
          setInspectionList={setInspectionList}
          classStyleObj={classes}
          failureHandler={processUpdateFailureHandler}
        />

        {showFollowUpProcesses && (
          <InspectionAdHocActivity
            adHocProcessList={adHocProcessList}
            followUpProcesses={followUpProcesses}
            setFollowUpProcesses={setFollowUpProcesses}
            classStyleObj={classes}
          />
        )}
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container>
              <DatePicker
                disableToolbar
                autoOk
                format='dd/MM/yyyy'
                margin='normal'
                id='inspection-date'
                label='Date'
                value={selectedInspectionDate}
                onChange={setSelectedInspectionDate}
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
        </Grid>
        <br />

        <Grid container item xs={12} align='center' justify='center'>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
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

  useEffect(fetchAdHocActivityList, [inspectionList, cropCycleId]);
  useEffect(enableAddAdHocActivities, [adHocProcessList]);

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
        <CropCycleComponent
          classStyleObj={classes}
          locations={locations}
          cropCycleId={cropCycleId}
          setCropCycleIdHandler={setCropCycleId}
          cropCycles={cropCycles}
          setCropCyclesHandler={setCropCycles}
          failureHandler={processUpdateFailureHandler}
        />
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
