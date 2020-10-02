import React from 'react'
import { fieldsData } from '../fieldsData';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import styled from "styled-components";

const StyledDiv = styled.div`

`;
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
}));


function MapsPage() {
    const classes = useStyles();

    const handleFieldClick = (e) => {
        alert(e)
    }

    return (
        <>
            {/* <iframe src="https://maps.google.com/maps?q=dayalbagh&output=embed"></iframe> */}
            <Grid container className={classes.root} spacing={2} >
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        {fieldsData.map((value) => (
                            <Grid key={value} item>
                                <Paper className={classes.paper} >
                                    <div style={{ display: 'flex', flexGrow: 1 }} >
                                        <button onClick={()=>handleFieldClick(value)} style={{ width: '200px', height: '200px' }}>{value}</button>
                                    </div>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default MapsPage
