import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Button from  '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 1000,
        },
    },
}));

function FieldsPage() {
    const classes = useStyles();
    const [fieldName, setFieldName] = useState('');
    const [fieldIdentifier, setFieldIdentifier] = useState('');
    const [fieldLocation, setFieldLocation] = useState('');

    const submitField = (event) => {
        console.log("submitField");
        console.log("fieldName" + fieldName + "->" + fieldIdentifier + "->" + fieldLocation);

        event.preventDefault();

        const payload = {
            fieldName: fieldName,
            fieldIdentifier: fieldIdentifier,
            fieldLocation: fieldLocation
        };

        //TODO
        // axios({
        //     url: `http://localhost:8080/api/fields`,
        //     method: 'POST',
        //     data: payload,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(() => {
        //     console.log("Data posted to the server")
        // })
        //     .catch(() => {
        //         console.log('Internal server error');
        //     });
    }

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'fieldName') {
            setFieldName(value)
        }
        else if (name === 'fieldIdentifier') {
            setFieldIdentifier(value);
        }
        else if (name === 'fieldLocation') {
            setFieldLocation(value);
        }
    };


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>
                    <List component="nav">
                        <ListItem>
                            <span style={{ backgroundColor: 'gray', border: '1px solid gray', padding: '5px', margin: '5px', color: 'white', fontSize: '20px' }}>ADD FIELD</span>
                        </ListItem>
                        <ListItem>
                            <TextField id="standard-basic" name="fieldName" onChange={handleChange} label="Field name" />
                        </ListItem>
                        <ListItem>
                            <TextField id="standard-basic" name="fieldIdentifier" onChange={handleChange} label="Field identifier" />
                        </ListItem>
                        <ListItem>
                            <TextField id="standard-basic" name="fieldLocation" onChange={handleChange} label="Field location" />
                        </ListItem>
                        <ListItem>
                            <Button variant="outlined" color="primary">Submit</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default FieldsPage
