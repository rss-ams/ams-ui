import {
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import {
  getProcessCategories,
  getCropCycleForProcess,
} from 'dataclients/ProcessesClient';
import React, { useEffect, useState } from 'react';
import TableComponent from 'components/common/TableComponent';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 300,
  },
  title: {
    margin: '10px 0 0 0',
  },
}));

/**
 * Define columns for Crop Cycle Table
 *
 */
const columnData = [
  {
    id: 'fieldName',
    type: 'text',
    label: 'Field',
    width: 30,
  },
  {
    id: 'cropName',
    type: 'text',
    label: 'Crop',
    width: 30,
  },
  {
    id: 'season',
    type: 'text',
    label: 'Season',
    width: 10,
  },
  {
    id: 'year',
    type: 'text',
    label: 'Year',
    width: 10,
  },
  {
    id: 'currentProcessesWithStatus',
    type: 'text',
    label: 'Current Process(es)',
    width: 10,
  },
];

const ProcessInfoPage = () => {
  const classes = useStyles();
  const [cropCycles, setCropCycles] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [processCategories, setProcessCategories] = useState([]);
  const [processCategoryCode, setProcessCategoryCode] = useState('');
  const [processNameCode, setProcessNameCode] = useState('');
  const [processNames, setProcessNames] = useState([]);
  const [rowData, setRowData] = useState([]);

  const handleAlertClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertStatus(false);
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertStatus(true);
  };

  useEffect(() => {
    getProcessCategories()
      .then(setProcessCategories)
      .catch((e) => {
        showAlert('Fetching process categories failed', 'error');
      });
  }, []);

  useEffect(() => {
    if (processCategories[processCategoryCode] !== undefined) {
      setProcessNames(processCategories[processCategoryCode].processNames);
    }
  }, [processCategories, processCategoryCode]);

  useEffect(() => {
    let data = cropCycles.map((obj) => {
      return {
        year: obj.year,
        season: obj.season,
        fieldName: obj.field.identifier,
        cropName: obj.crop.name,
        currentProcessesWithStatus: obj.currentProcesses
          .map(
            (process) =>
              process.processName.displayStr +
              ' : ' +
              process.processStatus.displayStr +
              ', ',
          )
          .toString()
          .replace(/(^\s*,)|(,\s*$)/g, ''),
      };
    });
    data.sort((a, b) => (a.year > b.year ? 1 : -1));
    setRowData(data);
  }, [cropCycles]);

  /**
   * Function to fetch CropCycles for a selected pocess code
   * updates CropCycles table if call is successful
   * shows alert in case call fails
   * @param {number} selectedFieldId The ID of the selected field
   */
  const fetchCropCyclesForProcess = (selectedProcessCode) => {
    getCropCycleForProcess(selectedProcessCode)
      .then(setCropCycles)
      .catch((e) => {
        showAlert('Fetching location list failed', 'error');
      });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'process-category') {
      setProcessCategoryCode(value);
      setProcessNameCode('');
      setCropCycles([]);
    } else if (name === 'process-name') {
      setProcessNameCode(value);
      fetchCropCyclesForProcess(value);
      // need to clear the following dropdowns and hence the process cards
    }
  };

  return (
    <FormGroup className={classes.formGroup}>
      <Typography align='center' variant='h6' className={classes.title}>
        Field Cycles for Process
      </Typography>

      {/* Process Category selection */}
      <FormControl className={classes.formControl}>
        <InputLabel id='process-category-label'>Process Category</InputLabel>
        <Select
          id='process-category'
          name='process-category'
          value={processCategoryCode}
          onChange={handleChange}
        >
          {processCategories.map((obj) => {
            return (
              <MenuItem key={obj.code} value={obj.code}>
                {obj.displayStr}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {/* Process Name selection */}
      <FormControl className={classes.formControl}>
        <InputLabel id='process-name-label'>Process Name</InputLabel>
        <Select
          id='process-name'
          name='process-name'
          value={processNameCode}
          onChange={handleChange}
        >
          {processNames.map((obj) => (
            <MenuItem key={obj.code} value={obj.code}>
              {obj.displayStr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* custom table to show crop cycles */}
      <TableComponent
        cols={columnData}
        rows={rowData}
        // loading={loading}
      />

      {/* Alerts on API call success/failure */}
      <Snackbar open={alertStatus} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </FormGroup>
  );
};

export default ProcessInfoPage;
