import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProcessCard from 'components/common/ProcessCard';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  helpText: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
  },
}));

/**
 * Component to render the list a processes as cards, each of which render
 * a process detail along with options to update the details.
 *
 * @param {object} selectedCropCycle The crop cycle object whose processes are to be rendered
 * @param {Array} processStatuses List of supported process status objects
 * @param {*} updateSuccessHandler Callback method to be called on successful update of any process
 * @param {*} updateFailureHandler Callback method to be called on failed update of any process
 */
const ProcessCards = ({
  selectedCropCycle,
  processStatuses,
  updateSuccessHandler,
  updateFailureHandler,
}) => {
  const classes = useStyles();

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
    selectedCropCycle.currentProcesses &&
    selectedCropCycle.currentProcesses.map((currentProcess) => {
      return (
        <ProcessCard
          key={currentProcess.id}
          process={currentProcess}
          processStatuses={processStatuses}
          cropCycleId={selectedCropCycle.id}
          updateSuccessHandler={updateSuccessHandler}
          updateFailureHandler={updateFailureHandler}
        />
      );
    })
  );
};

export default ProcessCards;
