import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(250),
            height: theme.spacing(100),
        },
    },
}));


function ApplnPaper(props) {
    const classes = useStyles();
    const {children, ...rest } = props;
    return (
        <div className={classes.root}>
            <Paper elevation={3} {...rest} >{children}</Paper>
        </div>
    )
}

export default ApplnPaper
