import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "date-fns";
import React, { useEffect, useState } from "react";
import { seasonsData } from "../seasonData";
import { Autocomplete, Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const AddCropCycle = () => {
  const classes = useStyles();

  const [crop, setCrop] = useState("");
  const [cropSeason, setCropSeason] = useState("");
  const [year, handleYearChange] = useState(new Date());
  const [fields, setFields] = useState([]);

  const [allCrops, setAllCrops] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');

  const getAllCrops = () => {
    fetch("http://localhost:8080/api/crops").then((cropsResponse) => {
      cropsResponse
        .json()
        .then((crops) => {
          console.log(crops);
          setAllCrops(crops);
        })
        .catch(() => {
          console.log(
            "%c Internal server error",
            "color:red;background-color:blue;"
          );
        });
    });
  };

  const getAllFields = () => {
    fetch("http://localhost:8080/api/fields").then((fieldsResponse) => {
      fieldsResponse
        .json()
        .then((fields) => {
          console.log(fields);
          setAllFields(fields.content);
        })
        .catch(() => {
          console.log(
            "%c Internal server error",
            "color:red;background-color:blue;"
          );
        });
    });
  };

  useEffect(() => {
    getAllCrops();
    getAllFields();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "season") {
      setCropSeason(value);
    } else if (name === "crop") {
      setCrop(value);
    } else {
      console.log("handleChange on invalid target!");
    }
  };

  const handleFieldChange = (event, values) => {
    setFields(values);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertStatus(false);
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertStatus(true);
  }

  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  const handleSubmit = () => {
    let fieldIds = [];
    fields.map((field) => fieldIds.push({ id: field.id }));

    // {
    //     "fields": [{"id": 10}, {...}],
    //     "year": 2000,
    //     "season": "RABI",
    //     "crop": {"id": 10}
    // }

    const payload = {
      fields: fieldIds,
      season: cropSeason,
      year: year.getFullYear(),
      crop: { id: crop },
    };

    fetch("http://localhost:8080/api/fieldCropCycles/batch", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(handleErrors)
      .then((response) => {
        if (response.ok) { }
        console.log("fieldCropCycles saved..." + response);
        showAlert("Crop cycles successfully created", "info");
      })
      .catch((e) => {
        console.log("Internal server error");
        showAlert("Crop cycles creation failed: " + e.message, "error");
      });
  };

  return (
    <div>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem key="0">
                <span
                  style={{
                    backgroundColor: "white",
                    padding: "5px",
                    margin: "5px",
                    color: "gray",
                    fontSize: "20px",
                  }}
                >
                  ADD CROP CYCLE
                </span>
              </ListItem>

              <ListItem key="1">
                <FormControl className={classes.formControl}>
                  <InputLabel id="crop-label">Crop</InputLabel>
                  <Select
                    id="crop"
                    name="crop"
                    value={crop}
                    onChange={handleChange}
                  >
                    {allCrops.map((crop) => {
                      return (
                        <MenuItem key={crop.id} value={crop.id}>
                          {crop.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </ListItem>

              <ListItem key="2">
                <FormControl className={classes.formControl}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={allFields}
                    getOptionLabel={(option) => option.identifier}
                    defaultValue={[]}
                    onChange={handleFieldChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Fields"
                        placeholder="Select fields for the crop"
                      />
                    )}
                  />
                </FormControl>
              </ListItem>

              <ListItem key="3">
                <FormControl className={classes.formControl}>
                  <InputLabel id="season-label">Season</InputLabel>
                  <Select
                    id="season"
                    name="season"
                    value={cropSeason}
                    onChange={handleChange}
                  >
                    {seasonsData.map((seasonData) => {
                      return (
                        <MenuItem key={seasonData} value={seasonData}>
                          {seasonData}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </ListItem>

              <ListItem key="4">
                <FormControl className={classes.formControl}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      disableToolbar
                      variant="inline"
                      format="yyyy"
                      margin="normal"
                      id="year"
                      label="Year"
                      name="year"
                      value={year}
                      onChange={handleYearChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      views={["year"]}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </ListItem>

              <ListItem key="5">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </ListItem>
              <Snackbar open={alertStatus} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity}>
                  {alertMessage}
                </Alert>
              </Snackbar>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default AddCropCycle;
