import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import ContextMenu from 'components/common/ContextMenu';
import React from 'react';
/**
 * css styles for table
 */
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px 0 20px 0',
    width: '100%',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    maxHeight: 400,
  },
  noDataContainer: {
    textAlign: 'center',
    padding: '50px',
  },
  noDataSpan: {
    fontWeight: 'normal',
    verticalAlign: 'middle',
    fontSize: '14px',
  },
  iconBut: {
    padding: 0,
    borderRadius: 0,
  },
}));

/**
 * Common Table component for displaying details
 * with a fixed header
 * configuration such as columns, rows, edithandler , deletehandler can be passed
 * deletehandler will be called when user clicks on delete button for a single row
 * edithandler will be called when user clicks on edit  button for a single row
 * A single column can have properties like id, label, align, minWidth, type
 * @param {*}
 */
export default function TableComponent({
  cols,
  rows,
  deleteHandler,
  editHandler,
  contextMenuActionHandler,
  loading,
}) {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='Data' size='small'>
          <TableHead>
            <TableRow>
              {cols.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    width: column.width,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.key}>
                  {cols.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ width: column.width }}
                      >
                        {/* when column is simple text */}
                        {column.type === 'text'
                          ? column.format && typeof value === 'number'
                            ? column.format(value)
                            : value
                          : null}
                        {/* when column is actions menu */}
                        {column.type === 'menu' && (
                          <ContextMenu
                            menuActions={column.actions}
                            row={row}
                            contextMenuActionHandler={contextMenuActionHandler}
                          />
                        )}
                        {/* when column is edit or delete icon */}
                        {column.type === 'icon' ? (
                          <Tooltip title={column.id}>
                            {column.id === 'delete' ? (
                              <IconButton
                                className={classes.iconBut}
                                aria-label={column.id}
                                onClick={() => deleteHandler(row)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                className={classes.iconBut}
                                aria-label={column.id}
                                onClick={() => editHandler(row)}
                              >
                                <SvgIcon>
                                  <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'></path>
                                </SvgIcon>
                              </IconButton>
                            )}
                          </Tooltip>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {!rows.length && !loading ? (
        <div className={classes.noDataContainer}>
          <span className={classes.noDataSpan}>No Data</span>
        </div>
      ) : null}
      <Backdrop className={classes.backdrop} open={loading} close={!loading}>
        <CircularProgress color='Primary' />
      </Backdrop>
    </Paper>
  );
}
