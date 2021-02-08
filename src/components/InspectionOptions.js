import {
  FormControl,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';
import { getInspectionParams } from 'dataclients/InspectionClient';
import React, { useEffect } from 'react';

/**
 * Component to render Radio boxes of available inspection parameters fetched from server.
 * @param {Array} inspectionList List of Inspection objects to be submitted
 * @param {*} setInspectionList Handler to update the Inspection objects
 * @param {object} classStyleObj CSS style object created using makestyles
 * @param {*} failureHandler Callback method to be called on any operation failure
 */

const InspectionOptions = ({
  inspectionList,
  setInspectionList,
  classStyleObj,
  failureHandler,
}) => {
  /*
    function to initialize Inspection values with -1 
    */
  const initializeInspectionList = (serverInspectionParams) => {
    var inspVals = [];
    serverInspectionParams.forEach((param) => {
      inspVals.push({
        code: param.code,
        displayStr: param.displayStr,
        val: -1,
      });
    });
    setInspectionList(inspVals);
  };

  const handleInspectionChange = ({ target }) => {
    const { name, value } = target;
    let inspVals = inspectionList;
    inspVals.find((inspV) => inspV.displayStr === name).val = parseInt(value);
    setInspectionList([...inspVals]);
  };

  //fecthing inspection parameters available from the server
  useEffect(() => {
    getInspectionParams()
      .then(initializeInspectionList)
      .catch((e) => {
        console.log('Fetching Inspection Param list failed', e);
        failureHandler('Fetching Inspection Param list failed', 'error');
      });
  }, []);

  return (
    <div>
      {inspectionList.map((inspectionValue) => {
        return (
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='center'
            key={inspectionValue.displayStr}
          >
            <FormControl className={classStyleObj.formControl} row='true'>
              <FormLabel
                id={inspectionValue.displayStr}
                className={classStyleObj.radioLabel}
              >
                {inspectionValue.displayStr}
              </FormLabel>
              <RadioGroup
                id={inspectionValue.displayStr}
                name={inspectionValue.displayStr}
                onChange={handleInspectionChange}
                row
              >
                <FormControlLabel value={'1'} control={<Radio />} label='Yes' />
                <FormControlLabel value={'0'} control={<Radio />} label='No' />
                <FormControlLabel value={'-1'} control={<Radio />} label='NA' />
              </RadioGroup>
            </FormControl>
          </Grid>
        );
      })}
    </div>
  );
};

export default InspectionOptions;
