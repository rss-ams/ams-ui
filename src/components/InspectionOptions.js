import {
  FormControl,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';
import { getInspectionParams } from 'dataclients/InspectionClient';
import React, { useEffect, useState } from 'react';

/**
 * Component to render Radio boxes of available inspection parameters fetched from server.
 * @param {Array} inspectionVal List of Inspection objects to be submitted
 * @param {*} setInspectionVal Handler to update the Inspection objects
 * @param {object} classStyleObj CSS style object created using makestyles
 * @param {*} failureHandler Callback method to be called on any operation failure
 */

const InspectionOptions = ({
  inspectionVal,
  setInspectionVal,
  classStyleObj,
  failureHandler,
}) => {
  //object and callaback for fetching list of avaialble Inspection parameters
  const [inspectionParams, setInspectionParams] = useState([]);

  /*
    function to initialize Inspection values with -1 
    */
  const initializeInspectionVal = () => {
    var inspVals = [];
    inspectionParams.forEach((param) => {
      inspVals.push({ code: param.code, name: param.displayStr, val: -1 });
    });
    setInspectionVal(inspVals);
  };

  const handleInspectionChange = ({ target }) => {
    const { name, value } = target;
    let inspVals = inspectionVal;
    inspVals.find((inspV) => inspV.name === name).val = parseInt(value);
    setInspectionVal([...inspVals]);
  };

  //fecthing inspection parameters available from the server
  useEffect(() => {
    getInspectionParams()
      .then(setInspectionParams)
      .catch((e) => {
        console.log('Fetching Inspection Param list failed', e);
        failureHandler('Fetching Inspection Param list failed', 'error');
      });
  }, []);

  useEffect(initializeInspectionVal, [inspectionParams]);

  return (
    <div>
      {inspectionParams.map((insParam, index) => {
        return (
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='center'
            key={insParam.displayStr}
          >
            <FormControl className={classStyleObj.formControl} row='true'>
              <FormLabel
                id={insParam.displayStr}
                className={classStyleObj.radioLabel}
              >
                {insParam.displayStr}
              </FormLabel>
              <RadioGroup
                id={insParam.displayStr}
                name={insParam.displayStr}
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
