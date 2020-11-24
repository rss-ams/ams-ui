import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState } from "react";
import { getAllFields } from "../dataclients/FieldsClient";
import { getLocations } from "../dataclients/LocationsClient";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function FarmTimeline() {
  const classes = useStyles();
  const [locality, setLocality] = React.useState("");
  const [fieldId, setFieldId] = React.useState("");

  const [fields, setFields] = useState([]);
  const [locationsDataFromServer, setLocationsDataFromServer] = useState([]);

  getAllFields()
    .then((fields) => setFields(fields.content))
    .catch((e) => {
      console.log("Fetching all fields failed: " + e.message);
    });

  getLocations()
    .then(setLocationsDataFromServer)
    .catch((e) => {
      console.log("Fetching all locations failed: " + e.message);
    });

  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [selectedEndDate, setselectedEndDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleStartDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleEndateChange = (date) => {
    setselectedEndDate(date);
  };

  const handleCLick = () => {
    console.log("locality,fieldId,cropSeason,activity" + locality, fieldId);
  };

  const handleChange = ({ target }) => {
    console.log("locality,fieldId,cropSeason,activity" + locality, fieldId);
    const { name, value } = target;
    if (name === "locality") {
      setLocality(value);
    } else if (name === "fieldId") {
      setFieldId(value);
    }

    console.log(
      "after: locality,fieldId,cropSeason,activity" + locality,
      fieldId
    );
  };

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          <List component="nav" aria-label="secondary mailbox folders">
            <ListItem>
              <span
                style={{
                  backgroundColor: "white",
                  border: "1px solid gray",
                  padding: "5px",
                  margin: "5px",
                  color: "gray",
                  fontSize: "20px",
                }}
              >
                {" "}
                FEILD TIMELINE
              </span>
            </ListItem>
            <ListItem key="1">
              <FormControl className={classes.formControl}>
                <InputLabel id="locality-label">Locality</InputLabel>
                <Select
                  id="locality"
                  name="locality"
                  value={locality}
                  onChange={handleChange}
                >
                  {locationsDataFromServer.map((locationDataFromServer) => {
                    return (
                      <MenuItem
                        key={locationDataFromServer.code}
                        value={locationDataFromServer.code}
                      >
                        {locationDataFromServer.displayStr}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem key="2">
              <FormControl className={classes.formControl}>
                <InputLabel id="fId-label">Field ID</InputLabel>
                <Select
                  id="fieldId"
                  name="fieldId"
                  value={fieldId}
                  onChange={handleChange}
                >
                  {fields.map((field) => {
                    return (
                      <MenuItem key={field.identifier} value={field.identifier}>
                        {field.identifier}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="start-date"
                    label="From"
                    value={selectedDate}
                    onChange={handleStartDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </ListItem>

            <ListItem>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="en-date"
                    label="To"
                    value={selectedEndDate}
                    onChange={handleEndateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </ListItem>

            <ListItem key="5">
              <Button variant="outlined" color="primary" onClick={handleCLick}>
                SHOW
              </Button>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default FarmTimeline;
