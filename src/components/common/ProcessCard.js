import DateFnsUtils from '@date-io/date-fns';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
import { updateProcess } from 'dataclients/ProcessesClient';
import React, { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 300,
  },
  accordianItems: {
    width: 130,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  accordian: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  status: {
    width: 200,
  },
}));

/**
 * Component to render details of a process, along with update support.
 * @param {object} process The process object which is to be rendered
 * @param {Array} processStatuses List of supported process status objects
 * @param {number} cropCycleId The ID of the crop cycle to which this process belongs
 * @param {*} updateSuccessHandler Callback method to be called on successful update of the process
 * @param {*} updateFailureHandler Callback method to be called on failed update of the process
 */
const ProcessCard = ({
  process,
  processStatuses,
  cropCycleId,
  updateSuccessHandler,
  updateFailureHandler,
}) => {
  const classes = useStyles();
  const [statusCode, setStatusCode] = useState(process.processStatus.code);
  const [startDueDate, setStartDueDate] = useState(process.startDueDate);
  const [startDate, setStartDate] = useState(process.startDate);
  const [endDueDate, setEndDueDate] = useState(process.endDueDate);
  const [endDate, setEndDate] = useState(process.endDate);
  const [showProcessNameLabel, setShowProcessNameLabel] = useState(true);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'status') {
      setStatusCode(value);
    }
  };

  // we need to update the state whenever the cropCycleId changes
  useEffect(() => {
    setStatusCode(process.processStatus.code);
    setStartDueDate(process.startDueDate);
    setEndDueDate(process.endDueDate);
    setStartDate(process.startDate);
    setEndDate(process.endDate);
    handleAccordionExpand(null, false);
  }, [cropCycleId]);

  const getStatusName = () =>
    processStatuses.filter((obj) => obj.code === statusCode)[0].displayStr;

  const handleAccordionExpand = (e, expanded) => {
    setShowProcessNameLabel(!expanded);
  };

  /**
   * Handles the Save button click. Makes an API request to update the process.
   */
  const handleSave = () => {
    const payload = {
      id: process.id,
      processName: process.processName.code,
      processStatus: statusCode,
      startDueDate: startDueDate,
      endDueDate: endDueDate,
      startDate: startDate,
      endDate: endDate,
      fieldCropCycle: {
        id: cropCycleId,
      },
    };
    updateProcess(cropCycleId, payload)
      .then((r) => {
        updateSuccessHandler('Process successfully updated');
      })
      .catch((e) => {
        console.log('Updating process failed', e);
        updateFailureHandler(`Process update failed`);
      });
  };

  return (
    <div className={classes.root}>
      <Accordion
        className={classes.accordian}
        square={true}
        onChange={handleAccordionExpand}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='process-name'
          id='process-name'
        >
          <Grid
            container
            justify='space-between'
            alignItems='center'
            spacing={1}
          >
            <Grid item>
              {/* process name */}
              <Typography className={classes.heading}>
                {process.processName.displayStr}
              </Typography>

              {/* process status label */}
              {showProcessNameLabel && (
                <Typography className={classes.secondaryHeading}>
                  {getStatusName()}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {/* additional label shown if the process is of ad hoc type */}
              {process.isAdhoc && (
                <Chip variant='outlined' size='small' label='Ad hoc' />
              )}
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid
              container
              className={classes.container}
              direction='row'
              justify='center'
              alignItems='center'
            >
              {/* process status dropdown */}
              <Grid item xs={12}>
                <FormControl
                  className={clsx(classes.accordianItems, classes.status)}
                  variant='standard'
                >
                  <InputLabel
                    id='status-label'
                    className={classes.accordianItems}
                  >
                    Status
                  </InputLabel>
                  <Select
                    id='status'
                    name='status'
                    value={statusCode}
                    onChange={handleChange}
                  >
                    {processStatuses.map((obj) => (
                      <MenuItem key={obj.displayStr} value={obj.code}>
                        {obj.displayStr}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Start due date picker */}
              <Grid item xs={6} sm={3} className={classes.accordianItems}>
                <DatePicker
                  disableToolbar
                  autoOk
                  format='dd/MM/yyyy'
                  margin='normal'
                  id='start-due-date'
                  label='Start due date'
                  value={startDueDate}
                  onChange={setStartDueDate}
                />
              </Grid>

              {/* End due date picker */}
              <Grid item xs={6} sm={3} className={classes.accordianItems}>
                <DatePicker
                  disableToolbar
                  autoOk
                  format='dd/MM/yyyy'
                  margin='normal'
                  id='end-due-date'
                  label='End due date'
                  value={endDueDate}
                  onChange={setEndDueDate}
                />
              </Grid>

              {/* Start date picker */}
              <Grid item xs={6} sm={3} className={classes.accordianItems}>
                <DatePicker
                  disableToolbar
                  autoOk
                  format='dd/MM/yyyy'
                  margin='normal'
                  id='start-date'
                  label='Start date'
                  value={startDate}
                  onChange={setStartDate}
                />
              </Grid>

              {/* End date picker */}
              <Grid item xs={6} sm={3} className={classes.accordianItems}>
                <DatePicker
                  disableToolbar
                  autoOk
                  format='dd/MM/yyyy'
                  margin='normal'
                  id='end-date'
                  label='End date'
                  value={endDate}
                  onChange={setEndDate}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          {/* Save button to save process details */}
          <Button
            size='small'
            color='primary'
            variant='contained'
            onClick={handleSave}
          >
            Save
          </Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
};

export default ProcessCard;
