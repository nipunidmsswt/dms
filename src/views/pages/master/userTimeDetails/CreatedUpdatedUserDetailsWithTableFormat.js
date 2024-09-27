import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MuiTableHead from '@material-ui/core/TableHead';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';

export default function CreatedUpdatedUserDetailsWithTableFormat({ formValues }) {
    const TableHead = withStyles((theme) => ({
        root: {
            backgroundColor: 'hsl(83, 43%, 51%)',
            maxHeight: 34.59,
            minHeight: 34.59
        }
    }))(MuiTableHead);

    const [createdDate, setCreatedDate] = useState('');
    const [updatedDate, setUpdatedDate] = useState('');

    useEffect(() => {
        console.log(formValues);
        setCreatedDate(
            formValues.createdDate === null
                ? ''
                : new Date(formValues.createdDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                  })
        );
        setUpdatedDate(
            formValues.updatedDate === null
                ? ''
                : new Date(formValues.updatedDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                  })
        );
    }, [formValues]);

    //   function dateFormators(date) {
    //     var d = new Date(date)

    //     return d.toLocaleString("en-GB");
    // }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="History table">
                {/* <caption>History Details</caption> */}
                <TableHead
                    stickyHeader
                    style={{
                        backgroundColor: '#1877f2',
                        background: '-moz-linear-gradient(top, #3b5998, #1877f2)',
                        background: '-ms-linear-gradient(top, #3b5998, #1877f2)',
                        background: '-webkit-linear-gradient(top, #3b5998, #1877f2)',
                        color: '#fff'
                    }}
                >
                    <TableRow>
                        <TableCell align="center">Created By</TableCell>
                        <TableCell align="center">Created Date</TableCell>
                        <TableCell align="center">Updated By</TableCell>
                        <TableCell align="center">Updated Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* {formValues.createdBy == "" ? (""
          ) : formValues.createdBy} */}

                    <TableRow>
                        <TableCell align="center">{formValues.createdBy} </TableCell>
                        <TableCell align="center">{createdDate}</TableCell>
                        <TableCell align="center"> {formValues.updatedBy}</TableCell>
                        <TableCell align="center">{updatedDate}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
