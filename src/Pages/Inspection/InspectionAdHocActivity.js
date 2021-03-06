import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import React from 'react';

/**
 * Component to render Ad Hoc activities selection input in case of negative inspection result.
 * @param {Array} adHocProcessList List of available Ad hoc Processes for given set of inspection paramter values
 * @param {Array} followUpProcesses List of Ad hoc processes to be scheduled
 * @param {*} setFollowUpProcesses Handler for setting followUpProcesses value
 * @param {object}  classStyleObj CSS style object created using makestyles
 */
const InspectionAdHocActivity = ({
  adHocProcessList,
  followUpProcesses,
  setFollowUpProcesses,
  classStyleObj,
}) => {
  // handle Selection of Adhoc activities
  const classes = classStyleObj;
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    const list = [...followUpProcesses];
    list[index].code = value;
    list[index].displayStr = adHocProcessList.filter(
      (activity) => activity.code === value,
    );
    setFollowUpProcesses(list);
  };
  // handle click event of the Remove button for removing Adhoc activity select box
  const handleRemoveClick = (index) => {
    const list = [...followUpProcesses];
    list.splice(index, 1);
    setFollowUpProcesses(list);
  };

  // handle click event of the Add button for adding another Addhoc activity
  const handleAddClick = () => {
    setFollowUpProcesses([...followUpProcesses, { code: '', displayStr: '' }]);
  };

  return (
    <div>
      {followUpProcesses.map((fActivityElem, indx) => {
        return (
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id='fId-label'>Select Activity</InputLabel>
              <Select
                id='adHocActivity'
                name='adHocActivity'
                value={fActivityElem.id}
                onChange={(e) => handleInputChange(e, indx)}
              >
                {adHocProcessList.map((activity) => {
                  return (
                    <MenuItem key={activity.code} value={activity.code}>
                      {activity.displayStr}
                    </MenuItem>
                  );
                })}
              </Select>
              {followUpProcesses.length !== 1 && (
                <button
                  className='mr10'
                  onClick={() => handleRemoveClick(indx)}
                >
                  Remove this Activity
                </button>
              )}
              {followUpProcesses.length - 1 === indx &&
                indx < adHocProcessList.length - 1 && (
                  <button onClick={handleAddClick}>Add Another Activity</button>
                )}
            </FormControl>
          </Grid>
        );
      })}
    </div>
  );
};

export default InspectionAdHocActivity;
