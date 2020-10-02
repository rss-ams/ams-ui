import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    
    title: {
      flexGrow: 1,
    },
  }));


function ApplnBar() {
    const classes = useStyles();
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                   
                    <Typography variant="h6" className={classes.title}>
                        AMS
                     </Typography>
                  
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default ApplnBar
