import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { CropSeasons } from "../utils/CropConstants";
import { cropGrowthProtocolData } from "../data/cgpData";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Success from "../components/common/Success"

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function AddCrop() {

    const classes = useStyles();


    const [cropName, setCropName] = React.useState('');
    const [cropSeason, setCropSeason] = React.useState('');
    const [cropGrowthProtocol, setCropGrowthProtocol] = useState('');
    const [cropGrowthProtocolObj, setCropGrowthProtocolObj] = useState({});

    const [showSuccess, setShowSuccess] = useState(false);

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
            console.log(value)
            setCropGrowthProtocol(value)
            const d1 = cropGrowthProtocolData.filter((d) => {
                return d.id === value
            })
            setCropGrowthProtocolObj(d1)
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

        const payload = {
            name: cropName,
            season: cropSeason,
            cropGrowthProtocol: { id: cropGrowthProtocol }
        };
        axios({
            url: `http://localhost:8080/api/crops`,
            method: 'POST',
            data: payload,

            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => {
            console.log("Crop saved..." + JSON.stringify(r.data))
            

            setShowSuccess(true)
            setTimeout(() => {
                document.getElementById('cropName').value = '';
                document.getElementById('season').value = ''
                document.getElementById('cgp').innerHTML = ''
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
                                            CropSeasons.map((cropSeason) => {
                                                return (
                                                    <MenuItem key={cropSeason} value={cropSeason}>{cropSeason}</MenuItem>
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
                                <Button variant="outlined" color="primary" onClick={handleCLick}>SUBMIT</Button>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>

            </Grid>

        </div>
    )
}

export default AddCrop
