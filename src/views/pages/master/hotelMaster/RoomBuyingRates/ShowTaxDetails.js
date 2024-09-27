import { useEffect, forwardRef, useState } from 'react';
import { Dialog, Box, DialogContent, TextField, DialogTitle, Button, Grid, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'assets/scss/style.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

function ShowTaxDetails({ open, handleClose, taxDetails, mode }) {
    useEffect(() => {
        if (taxDetails) {
            console.log(mode);
        }
    }, [taxDetails]);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#2196F3',
            background: '-ms-linear-gradient(top, #0790E8, #3180e6)',
            background: '-webkit-linear-gradient(top, #0790E8, #3180e6)',
            color: theme.palette.common.white
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 15,
            color: 'black'
        }
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        }
        // // hide last border
        // '&:last-child td, &:last-child th': {
        //     border: 3
        // }
    }));

    function createData(name, single, double, tripple, family, child) {
        return { name, single, double, tripple, family, child };
    }

    function createData2(name, guide, tourLead) {
        return { name, guide, tourLead };
    }
    const rows = [
        createData(
            'With Tax',
            +taxDetails.ratesDetails[0].singleRateAmountWithTax,
            +taxDetails.ratesDetails[0].tripleRateAmountWithTax,
            +taxDetails.ratesDetails[0].tripleRateAmountWithTax,
            +taxDetails.ratesDetails[0].familyRateAmountWithTax,
            +taxDetails.ratesDetails[0].childRateAmountWithTax
        ),
        createData(
            'Without Tax',

            +taxDetails.ratesDetails[0].singleRate,
            +taxDetails.ratesDetails[0].doubleRate,
            +taxDetails.ratesDetails[0].trippleRate,
            +taxDetails.ratesDetails[0].family,
            +taxDetails.ratesDetails[0].child
        )
    ];

    const rows2 = [
        createData2(
            'With Tax',
            taxDetails.tourGuideDetails[0].guideRateAmountWithTax,
            taxDetails.tourGuideDetails[0].tourLeadRateAmountWithTaxtourLeadValue
        ),
        createData2('Without Tax', taxDetails.tourGuideDetails[0].guideRate, taxDetails.tourGuideDetails[0].tourLeadRate)
    ];
    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
                maxWidth="lg"
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex">
                        <Box flexGrow={1}></Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box style={{ backgroundColor: '#B0B0B0', padding: '10px', borderRadius: '10px' }}>
                        <Typography style={{ fontSize: '15px', fontWeight: 'bold', color: 'black' }}>
                            Room Category: {taxDetails.ratesDetails[0]?.basis?.basisDesc}
                        </Typography>
                        <Typography style={{ fontSize: '15px', fontWeight: 'bold', paddingTop: '10px', color: 'black' }}>
                            Room Basis: {taxDetails.ratesDetails[0]?.roomCategory?.code}
                        </Typography>
                    </Box>
                    <br />
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            {mode == 'Rate' ? (
                                <div>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">Single</StyledTableCell>
                                            <StyledTableCell align="right">Double&nbsp;</StyledTableCell>
                                            <StyledTableCell align="right">Tripple&nbsp;</StyledTableCell>
                                            <StyledTableCell align="right">Family&nbsp;</StyledTableCell>
                                            <StyledTableCell align="right">Child&nbsp;</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <StyledTableRow key={row.name}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{row.single}</StyledTableCell>
                                                <StyledTableCell align="right">{row.double}</StyledTableCell>
                                                <StyledTableCell align="right">{row.tripple}</StyledTableCell>
                                                <StyledTableCell align="right">{row.family}</StyledTableCell>
                                                <StyledTableCell align="right">{row.child}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </div>
                            ) : (
                                ''
                            )}
                            {mode == 'Tour' ? (
                                <div>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">Guide</StyledTableCell>
                                            <StyledTableCell align="right">Tour Lead&nbsp;</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows2.map((row) => (
                                            <StyledTableRow key={row.name}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{row.guide}</StyledTableCell>
                                                <StyledTableCell align="right">{row.tourLead}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </div>
                            ) : (
                                ''
                            )}
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ShowTaxDetails;
