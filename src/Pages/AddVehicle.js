import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
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


function AddVehicle() {

    const classes = useStyles();
    const [vehicleName, setVehicleName] = React.useState('');
    const [vehicleNum, setVehicleNum] = React.useState('');
    const [vehicleCap, setVehicleCap] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleTextChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'vehicleName') {
            setVehicleName(value)
        }
        else if (name === 'vehicleNumber') {
            setVehicleNum(value)
        }
        else if (name === 'vehicleCapacity') {
            setVehicleCap(value)
        }

    }

    const handleCLick = () => {

        axios({
            url: `http://localhost:8080/api/vehicles`,
            method: 'POST',
            data: {
                name: vehicleName,
                number: vehicleNum,
                capacity: vehicleCap
            },

            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => {
            console.log("Vehicle saved..." + JSON.stringify(r.data))

            setShowSuccess(true)
            setTimeout(() => {
                document.getElementById('vehicleName').value = '';
                document.getElementById('vehicleNumber').value = ''
                document.getElementById('vehicleCapacity').innerHTML = ''
                setShowSuccess(false)
            }, 3000)


        })
            .catch(() => {
                console.log('Internal server error');
            });
    }


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
                                <span style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', margin: '5px', color: 'gray', fontSize: '20px' }}>ADD VEHICLE</span>
                            </ListItem>

                            <ListItem>
                                <TextField id="vehicleName" name="vehicleName" onChange={handleTextChange} label="Name" />
                            </ListItem>

                            <ListItem>
                                <TextField id="vehicleNumber" name="vehicleNumber" onChange={handleTextChange} label="Number" />
                            </ListItem>
                            <ListItem>
                                <TextField id="vehicleCapacity" name="vehicleCapacity" onChange={handleTextChange} label="Capacity" />
                            </ListItem>

                            <ListItem key="5">
                                <Button variant="outlined" color="primary" onClick={handleCLick}>SUBMIT</Button>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>

            </Grid>

        </div>
    )
}

export default AddVehicle
