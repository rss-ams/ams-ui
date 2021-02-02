import { Chip, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '160px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  oppositeContent: {
    alignSelf: 'center',
    padding: theme.spacing(1),
  },
  timelineContent: {
    alignSelf: 'center',
    padding: theme.spacing(1),
  },
  timelineItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  timelineRoot: {
    padding: theme.spacing(0),
  },
}));

/**
 * Renders a timeline component that includes all the processes and
 * inspections associated with a crop cycle.
 *
 * @param {Array} processes All the crop cycles processes
 * @param {Array} inspections All the inspections recorded on the crop cycle
 */
const AmsTimeline = ({ processes, inspections }) => {
  const classes = useStyles();

  const mergeProcessesAndInspections = () => {
    let processDetailsList = processes.map((process) => {
      return {
        name: process.processName.displayStr,
        status: process.processStatus.displayStr,
        date: process.startDate,
        isAdhoc: process.processName.adhoc,
        isProcess: true,
      };
    });

    let inspectionDetailsList = inspections.map((inspection) => {
      return {
        name: inspection.inspectionType.displayStr,
        date: inspection.completionDate,
        resultPositive: inspection.resultPositive,
        isProcess: false,
      };
    });

    return [...processDetailsList, ...inspectionDetailsList];
  };

  /**
   * Sorts the crop cycle processes and inspections for display in timeline.
   *
   * @param {Array} processesAndInspections A list containing both processes
   *        and inspections, merged together. Every item has a property `date`
   *        which is start date for process and inspection completion date in
   *        case of inspections. Sorting is done based on the date in
   *        chronological order.
   * @return sorted list
   */
  const sortProcessesAndInspections = (processesAndInspections) =>
    processesAndInspections.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate > bDate ? 1 : bDate > aDate ? -1 : 0;
    });

  /**
   * Merges the processes list and the inspection list and then sorts them
   * for displaying in the timeline.
   */
  const prepareDataForTimeline = () =>
    sortProcessesAndInspections(mergeProcessesAndInspections());

  /**
   * Returns a card corresponding to a process or inspection, used as the
   * building block for rendering timeline.
   * @param {Object} processOrInspection
   */
  const getCard = (processOrInspection) => {
    let dateOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };

    return (
      <Paper elevation={3} className={classes.paper}>
        <Typography variant='subtitle1'>{processOrInspection.name}</Typography>
        {processOrInspection.isProcess && (
          <Typography variant='subtitle2'>
            {'Status: ' + processOrInspection.status}
          </Typography>
        )}
        {!processOrInspection.isProcess && (
          <Typography variant='subtitle2'>
            {processOrInspection.resultPositive
              ? 'Result: Positive'
              : 'Result: Negative'}
          </Typography>
        )}
        <Typography variant='body2'>
          {new Date(processOrInspection.date).toLocaleDateString(
            'en-IN',
            dateOptions,
          )}
        </Typography>
      </Paper>
    );
  };

  return (
    <Timeline className={classes.timelineRoot}>
      {prepareDataForTimeline().map((processOrInspection) => {
        return (
          <TimelineItem className={classes.timelineItem}>
            {processOrInspection.isAdhoc && (
              <TimelineOppositeContent className={classes.oppositeContent}>
                <Chip variant='outlined' size='small' label='Ad hoc' />
              </TimelineOppositeContent>
            )}
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color='primary' variant='outlined'>
                {processOrInspection.isProcess ? (
                  <SettingsIcon />
                ) : (
                  <SearchIcon />
                )}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className={classes.timelineContent}>
              {getCard(processOrInspection)}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default AmsTimeline;
