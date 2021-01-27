import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';


const InspectionAdHocActivity = ({
  adHocActivityList,
  followUpActivities,
  setFollowUpActivties,
  classStyleObj
}) => {

  //const [followUpActivities, setFollowUpActivties] = useState([{ code: "", displayStr: "" }]);
  //const [adHocActivityList, setAdHocActivityList] = useState([]);

  // handle Selection of Adhoc activities
  const classes = classStyleObj;
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...followUpActivities];
    list[index].code = value;
    list[index].displayStr = adHocActivityList.filter((activity) => activity.code === value);
    setFollowUpActivties(list);
  };
  // handle click event of the Remove button for removing Adhoc activity select box
  const handleRemoveClick = index => {
    const list = [...followUpActivities];
    list.splice(index, 1);
    setFollowUpActivties(list);
  };

  // handle click event of the Add button for adding another Addhoc activity
  const handleAddClick = () => {
    setFollowUpActivties([...followUpActivities, { code: "", displayStr: "" }]);
  };




  return (
    <div>
      {followUpActivities.map((x, i) => {
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
      })
      }
    </div>
  )
};

export default InspectionAdHocActivity;

