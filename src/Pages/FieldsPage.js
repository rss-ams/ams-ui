import React from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ApplnPaper from './components/ApplnPaper'

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
    return (
        <div>
            <ApplnPaper>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="standard-basic" label="Field name" />
                    <TextField id="standard-basic" label="Field identifier" />
                    <TextField id="standard-basic" label="Field location" />
                    <TextField id="standard-basic" label="Field area" />
                </form>
                <button>Submit</button>
            </ApplnPaper>

        </div>
    )
}

export default FieldsPage
