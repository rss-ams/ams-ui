import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Success from "../components/common/Success"

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function AddFarm() {

    const classes = useStyles();
    const [locality, setLocality] = React.useState('');
    const [fieldId, setFieldId] = React.useState('');
    const [area, setArea] = React.useState('');
    const [fieldName, setFieldName] = useState('');
    const [allfields, setAllfields] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const [locations, setLocations] = useState([])

    const getAllFields = () => {
        axios({
            url: `http://localhost:8080/api/fields`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        }).then((r) => {
            console.log("%c Fields =>..." + JSON.stringify(r.data.content) , "color:yellow;background-color:blue;")
            setAllfields(r.data.content);
        })
            .catch(() => {
                console.log('%c Internal server error',"color:red;background-color:blue;");
            });
    }

    const getAllFieldLocations = () => {
        fetch('http://localhost:8080/api/fields/locations').then((locationsResponse) => {
            locationsResponse.json().then((locationsData) => {
                console.log(locationsData)
                setLocations(locationsData)
            })
        })
    }

    useEffect(() => {
        getAllFieldLocations();
        getAllFields();
    }, [])

    const handleTextChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'fieldId') {
            setFieldId(value)
        }
        else if (name === 'area') {
            setArea(value)
        }

    }

    const postField = (payload) => {
        axios({
            url: `http://localhost:8080/api/fields`,
            method: 'POST',
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => {
            console.log("%c Field saved ..." + JSON.stringify(r.data) , 'color:green;background-color:gray;')
            setShowSuccess(true)
            setTimeout(() => {
                document.getElementById('fieldId').value = '';
                document.getElementById('area').value = ''
                document.getElementById('locality').innerHTML = ''
                setShowSuccess(false)
            }, 3000)

            getAllFields();
        })
            .catch(() => {
                console.log('%c Internal server error', "color:red ; background-color:gray;");
            });
    }

    const handleCLick = () => {
        const payload = {
            name: fieldId,
            identifier: fieldId,
            location: locality,
            area: Number(area)
        };
        postField(payload);
    }

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'locality') {
            setLocality(value)
        }
    };

    return (
        <div>
            {
                showSuccess ?
                    <Success /> : null
            }
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        <List component="nav" aria-label="secondary mailbox folders">
                            <ListItem>
                                <span style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', margin: '5px', color: 'gray', fontSize: '20px' }}>ADD FIELD</span>
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
                                        {
                                            locations.map((location) => {
                                                return (
                                                    <MenuItem key={location.code} value={location.code}>{location.displayStr}</MenuItem>
                                                );

                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </ListItem>

                            <ListItem>
                                <TextField id="fieldId" name="fieldId" onChange={handleTextChange} label="Field ID" />
                            </ListItem>
                            <ListItem>
                                <TextField id="area" name="area" onChange={handleTextChange} label="Area" />
                            </ListItem>

                            <ListItem key="5">
                                <Button variant="outlined" color="primary" onClick={handleCLick}>Submit</Button>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Grid>

            <div style={{ marginLeft: '115px' }}>
                {

                    allfields.map((field) => {
                        return (
                            <div style={{ backgroundColor: 'gray', color: 'white', textAlign: 'left', padding: '5px', width: '100px' }} key={field.id}>
                                <span>{field.identifier} - {field.area}</span>
                                <br />
                            </div>
                        )
                    })
                }
            </div>

        </div>




    )
}

export default AddFarm
