import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { fieldsData } from '../fieldsData';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

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

    const handleTextChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'fieldId') {
            setFieldId(value)
        }
        else if (name === 'area') {
            setArea(value)
        }
        
    }


    const handleCLick = () => {

        axios({
            url: `http://localhost:8080/api/fields`,
            method: 'POST',
            data: {
                name:fieldId,
                identifier:fieldId,
                location:locality
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => {
            console.log("Field saved..."+JSON.stringify(r.data))
        })
            .catch(() => {
                console.log('Internal server error');
            });
    }


    const handleChange = ({ target }) => {

        const { name, value } = target;
        if (name === 'locality') {
            setLocality(value)
        }

    };

    return (

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
                                        fieldsData.map((fieldData) => {
                                            return (
                                                <MenuItem key={fieldData} value={fieldData}>{fieldData}</MenuItem>
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
                            <TextField id="Area" name="area" onChange={handleTextChange} label="Area" />
                        </ListItem>

                        <ListItem key="5">
                            <Button variant="outlined" color="primary" onClick={handleCLick}>ADD FIELD</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

        </Grid>


    )
}

export default AddFarm
