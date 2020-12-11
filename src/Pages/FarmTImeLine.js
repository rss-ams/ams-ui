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
import React, { useState, useEffect } from "react";
import { getAllFields } from "../dataclients/FieldsClient";
import { getLocations } from "../dataclients/LocationsClient";

import { sortBy } from "../components/particles/util/sort-util";
import Card from "../components/molecules/Card/Card"
import TimeLine from "../components/molecules/Timeline/Timeline"

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
  var months = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
  const classes = useStyles();
  const [locality, setLocality] = React.useState("");
  const [fieldId, setFieldId] = React.useState("");

  const [fields, setFields] = useState([]);
  const [locationsDataFromServer, setLocationsDataFromServer] = useState([]);

  const [processHistory, setProcessHistory] = useState([]);

  useEffect(() => {
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

      console.log(locationsDataFromServer)
  }, []);



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

  const [showTimeLine, setShowTimeLine] = useState(false);

  const handleCLick = () => {
    console.log(locality);

    fetch(`http://localhost:8080/api/fieldCropCycles/${locality.value}`).then(
      (resp) => {
        resp.json().then((data) => {
          console.log(data.processHistory);
          setProcessHistory([...data.processHistory])
        });
      },
    );

    setShowTimeLine(true);

  };

  const handleChange = ({ target }) => {
    console.log("locality,fieldId,cropSeason,activity" + locality, fieldId);
    const { name, value } = target;
    if (name === "locality") {
      setLocality(target);
    } else if (name === "fieldId") {
      setFieldId(target);
    }

    console.log(
      "after: locality,fieldId,cropSeason,activity" + locality,
      fieldId
    );
  };

  let timeLine = processHistory.sortBy(function (o) { return [ o.startDueDate ] }).map(function (obj, index) {

    return (<TimeLine key={index} process={<Card
      processName={obj.processName.displayStr}
      processStatus={obj.processStatus.displayStr}
      startDueDate={obj.startDueDate.substring(0, 4)+" - "+months[parseInt(obj.startDueDate.substring(obj.startDueDate.indexOf("-")+1 ,obj.startDueDate.indexOf("-")+3 ), 10)]+" - "+obj.startDueDate.substring(obj.startDueDate.lastIndexOf("-")+1 ,obj.startDueDate.lastIndexOf("-")+3 )}
      endDueDate={obj.endDueDate.substring(0, 4)+" - "+ months[parseInt(obj.endDueDate.substring(obj.endDueDate.indexOf("-")+1 ,obj.endDueDate.indexOf("-")+3 ),10)]+" - "+obj.endDueDate.substring(obj.endDueDate.lastIndexOf("-")+1 ,obj.endDueDate.lastIndexOf("-")+3 )}
    
    />}>
    </TimeLine>
    );
  });

  return (
    <div>
      {!showTimeLine ?
        <Grid container className={classes.root} spacing={2} >
          <Grid item xs={12}>
            <Grid container justify="center">

            </Grid>
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
              FIELD TIMELINE
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
        </Grid > : null

      }

      {
        timeLine
      }
    </div>
  );
}

export default FarmTimeline;
