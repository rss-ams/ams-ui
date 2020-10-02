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
    minWidth: 650
  }
});

function createData(r, l, f, a, cs, x, y, z) {
  return { r, l, f, a, cs, x, y, z };
}

const rows = [
  createData(
    "1",
    "Locality1",
    "FarmID1",
    24,
    "Rabi",
    "Jowar",
    "process1",
    "done"
  ),
];

export default function BasicTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Locality</TableCell>
            <TableCell align="right">Farm ID</TableCell>
            <TableCell align="right">Area&nbsp;(acres)</TableCell>
            <TableCell align="right">Crop Season&nbsp;(g)</TableCell>
            <TableCell align="right">Crop&nbsp;(g)</TableCell>
            <TableCell align="right">Current Process&nbsp;(g)</TableCell>
            <TableCell align="right">Inspection&nbsp;(g)</TableCell>
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
              <TableCell align="right">{row.cs}</TableCell>
              <TableCell align="right">{row.x}</TableCell>
              <TableCell align="right">{row.y}</TableCell>
              <TableCell align="right">{row.z}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
