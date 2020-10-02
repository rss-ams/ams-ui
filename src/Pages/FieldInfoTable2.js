import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
    table: {

    }
});

function createData(r, l, f, a) {
    return { r, l, f, a };
}

const rows = [
    createData(
        "1",
        "Oct-1-2020",
        "Sowing",
        24,

    ),
];

export default function FieldInfoTable2() {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Activity</TableCell>
                        <TableCell align="right">Assignee&nbsp;</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.r}>
                            <TableCell component="th" scope="row">
                                {row.r}
                            </TableCell>
                            <TableCell align="right">{row.l}</TableCell>
                            <TableCell align="right">{row.f}</TableCell>
                            <TableCell align="right">{row.a}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
