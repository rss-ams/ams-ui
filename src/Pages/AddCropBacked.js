import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {seasonsData} from "../seasonData";
import {cropGrowthProtocolData} from "../cgpData";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function AddCrop() {

    const classes = useStyles();


    const [cropName, setCropName] = React.useState('');
    const [cropSeason, setCropSeason] = React.useState('');
    const [cropGrowthProtocol, setCropGrowthProtocol] = useState({});

    const handleTextChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'cropName') {
            setCropName(value)
        }
        
        
    }

    const handleChange = ({ target }) => {

        const { name, value } = target;
        if (name === 'season') {
            setCropSeason(value)
        }
        else if (name === 'cgp') {
            setCropGrowthProtocol(value)
        }
        
    };

    // {
    //     "name": "cropGrowthProtocol1",
    //     "description": "desc1",
    //     "fertilization": {
    //             "sprays": [
    //                 {
    //                     "a": "b",
    //                     "c": 2
    //                 },
    //                 {
    //                     "a": "b"
    //                 }
    //             ]
    //         }
    // }


    // {
    //     "name": "ABC 12324234",
    //     "season": "RABI",
    //     "cropGrowthProtocol": {
    //         "id": 1
    //     }
    // }

    const handleCLick = () => {

        const payload= {
            name:cropName,
            season:cropSeason,
            cropGrowthProtocol:{id:cropGrowthProtocol}
        };
        axios({
            url: `http://localhost:8080/api/crops`,
            method: 'POST',
            data:payload,

            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => {
            console.log("Crop saved..."+JSON.stringify(r.data))
        })
            .catch(() => {
                console.log('Internal server error');
            });
    }


    return (

        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>

                    <List component="nav" aria-label="secondary mailbox folders">
                        <ListItem>
                            <span style={{ backgroundColor: 'white', border: '1px solid gray', padding: '5px', margin: '5px', color: 'gray', fontSize: '20px' }}>ADD CROP</span>
                        </ListItem>
                       
                        <ListItem>
                            <TextField id="cropName" name="cropName" onChange={handleTextChange} label="Name" />
                        </ListItem>

                        <ListItem key="1">
                            <FormControl className={classes.formControl}>
                                <InputLabel id="season-label">Season</InputLabel>
                                <Select
                                    id="season"
                                    name="season"
                                    value={cropSeason}
                                    onChange={handleChange}
                                >
                                    {
                                        seasonsData.map((seasonData) => {
                                            return (
                                                <MenuItem key={seasonData} value={seasonData}>{seasonData}</MenuItem>
                                            );

                                        })
                                    }
                                </Select>
                            </FormControl>
                        </ListItem>

                        <ListItem key="2">
                            <FormControl className={classes.formControl}>
                                <InputLabel id="cgp-label">Crop Growth Protocol</InputLabel>
                                <Select
                                    id="cgp"
                                    name="cgp"
                                    value={cropGrowthProtocol}
                                    onChange={handleChange}
                                >
                                    {
                                        cropGrowthProtocolData.map((cgpData) => {
                                            return (
                                                <MenuItem key={cgpData.id} value={cgpData.id}>{cgpData.id}</MenuItem>
                                            );

                                        })
                                    }
                                </Select>
                            </FormControl>
                        </ListItem>


                        <ListItem key="5">
                            <Button variant="outlined" color="primary" onClick={handleCLick}>ADD CROP</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

        </Grid>


    )
}

export default AddCrop
