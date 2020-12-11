import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        minWidth: 40,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 20,
    },
    pos: {
        marginBottom: 6,
    },
});

export default function OutlinedCard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const {processName , processStatus , startDueDate, endDueDate} = props;
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {processName}
                </Typography>
                <Typography variant="h5" component="h2">
                    {processStatus}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    Start: {startDueDate}
                </Typography>
                <Typography variant="body2" component="p">
                    End:{endDueDate}
                    <br />
                </Typography>
            </CardContent>

        </Card>
    );
}