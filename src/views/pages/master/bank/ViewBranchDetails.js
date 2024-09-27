import { FormControlLabel, FormGroup, Grid, Switch, Paper, Button } from '@mui/material';
import MaterialTable, { MTableToolbar } from 'material-table';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useEffect, useState } from 'react';
import Branch from './Branch';
import Bank from './Bank';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTaxData, getLatestModifiedTaxDetails } from 'store/actions/masterActions/TaxActions/TaxAction';
import { getAllBranchData, getLatestModifiedBranchDetails } from 'store/actions/masterActions/BankAction';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';

const ViewBranchDetails = () => {
    const columns = [
        {
            title: 'Bank Name',
            field: 'bankCode.bankName',
            filterPlaceholder: 'Bank Name',
            align: 'left'
        },
        {
            title: 'Branch Code',
            field: 'branchCode',
            filterPlaceholder: 'Branch Code',
            align: 'left'
        },
        {
            title: 'Branch Name',
            field: 'branchName',
            filterPlaceholder: 'Tax Description',
            align: 'left'
        },
        {
            title: 'Branch Description',
            field: 'branchDesc',
            filterPlaceholder: 'Branch Description',
            align: 'left'
        },
        {
            title: 'Branch Prefix',
            field: 'branchPrefix',
            filterPlaceholder: 'Branch Prefix',
            align: 'left'
        },
        {
            title: 'Status',
            field: 'status',
            // filterPlaceholder: "True || False",
            align: 'center',
            lookup: {
                true: 'Active',
                false: 'Inactive'
            },

            // emptyValue: () => <em>null</em>,
            render: (rowData) => (
                <div
                    style={{
                        alignItems: 'center',
                        align: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                        // background: rowData.status === true ? "#008000aa" : "#f90000aa",
                        // borderRadius: "4px",
                        // paddingLeft: 5,
                        // paddingRight: 5,
                    }}
                >
                    {rowData.status === true ? (
                        <FormGroup>
                            <FormControlLabel control={<Switch size="small" color="success" />} checked={true} />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel control={<Switch color="error" size="small" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
        }
    ];
    const [open, setOpen] = useState(false);
    const [id, setId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [tableData, setTableData] = useState([]);
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [openBankDialog, setOpenBankDialog] = useState(false);
    const dispatch = useDispatch();
    const error = useSelector((state) => state.branchReducer.errorMsg);

    const bankData = useSelector((state) => state.bankReducer.bank);
    const branchData = useSelector((state) => state.branchReducer.branch);
    const branchList = useSelector((state) => state.branchReducer.branches);
    const lastModifiedDate = useSelector((state) => state.branchReducer.lastModifiedDateTime);

    useEffect(() => {
        console.log(branchList);
        if (branchList?.payload?.length > 0) {
            setTableData(branchList?.payload[0]);
        }
    }, [branchList]);

    const handleClose = () => {
        setOpen(false);
    };
    const handleBankClose = () => {
        setOpenBankDialog(false);
    };
    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (bankData) {
            setMode('INSERT');
            setHandleToast(true);
        }
    }, [bankData]);

    useEffect(() => {
        console.log(branchData);
        if (branchData) {
            setHandleToast(true);
            dispatch(getAllBranchData());
            dispatch(getLatestModifiedBranchDetails());
        }
    }, [branchData]);

    useEffect(() => {
        dispatch(getAllBranchData());
        dispatch(getLatestModifiedBranchDetails());
    }, []);

    useEffect(() => {
        console.log(lastModifiedDate);
        setLastModifiedTimeDate(
            lastModifiedDate === null
                ? ''
                : new Date(lastModifiedDate).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                  })
        );
    }, [lastModifiedDate]);

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setId(data.branchId);
            setOpen(true);
        } else if (type === 'INSERT') {
            setId('');
            setMode(type);
            setOpen(true);
        } else if (type === 'BANK') {
            setMode(type);
            setOpenBankDialog(true);
        } else {
            setMode(type);
            setId(data.branchId);
            setOpen(true);
        }
    };

    const handleToast = () => {
        setHandleToast(false);
    };

    return (
        <div>
            <MainCard title="Bank & Branch Setup">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <MaterialTable
                                    title={`Last Modified Date : ${lastModifiedTimeDate}`}
                                    columns={columns}
                                    data={tableData}
                                    actions={[
                                        {
                                            icon: tableIcons.AccountBalanceIcon,
                                            tooltip: 'Add New Bank',
                                            isFreeAction: true,
                                            onClick: () => handleClickOpen('BANK', null)
                                        },
                                        {
                                            icon: tableIcons.Add,
                                            tooltip: 'Add New Branch',
                                            isFreeAction: true,
                                            onClick: () => handleClickOpen('INSERT', null)
                                        },
                                        (rowData) => ({
                                            // <-- ***NOW A FUNCTION***
                                            icon: tableIcons.Edit,
                                            tooltip: 'Edit ',
                                            onClick: () => handleClickOpen('VIEW_UPDATE', rowData)
                                        }),
                                        (rowData) => ({
                                            icon: tableIcons.VisibilityIcon,
                                            tooltip: 'View',
                                            onClick: () => handleClickOpen('VIEW', rowData)
                                        })
                                    ]}
                                    options={{
                                        padding: 'dense',
                                        showTitle: true,
                                        sorting: true,
                                        search: true,
                                        searchFieldAlignment: 'right',
                                        searchAutoFocus: true,
                                        searchFieldVariant: 'standard',
                                        filtering: true,
                                        paging: true,
                                        pageSizeOptions: [5, 10, 20, 50, 100],
                                        pageSize: 10,
                                        paginationType: 'stepped',
                                        showFirstLastPageButtons: false,
                                        exportButton: true,
                                        exportAllData: true,
                                        exportFileName: 'Tax Data',
                                        actionsColumnIndex: -1,
                                        columnsButton: true,
                                        color: 'primary',

                                        headerStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 30,
                                            maxHeight: 30,
                                            padding: 2,
                                            fontSize: '14px',
                                            backgroundColor: '#2196F3',
                                            background: '-ms-linear-gradient(top, #0790E8, #3180e6)',
                                            background: '-webkit-linear-gradient(top, #0790E8, #3180e6)',
                                            textAlign: 'center',
                                            color: '#FFF',
                                            textAlign: 'center'
                                        },
                                        rowStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            align: 'left',
                                            // maxHeight: 20,
                                            fontSize: '13px',
                                            padding: 0
                                        }
                                    }}
                                />
                                {/* <MaterialTable
                                    components={{
                                        Toolbar: (props) => (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Button style={{ height: 'fit-content' }} color="primary" variant="contained">
                                                    Quotations
                                                </Button>
                                                <div style={{ width: '13rem' }}>
                                                    <MTableToolbar {...props} />
                                                </div>
                                            </div>
                                        ),
                                        Container: (props) => <Paper {...props} elevation={8} />
                                    }}
                                    title={lastModifiedTimeDate}
                                    columns={columns}
                                    data={tableData}
                                    options={{
                                        padding: 'dense',
                                        showTitle: false,
                                        sorting: true,
                                        search: true,
                                        searchFieldAlignment: 'right',
                                        searchAutoFocus: true,
                                        searchFieldVariant: 'standard',
                                        filtering: true,
                                        paging: true,
                                        pageSizeOptions: [5, 10, 20, 50, 100],
                                        pageSize: 5,
                                        paginationType: 'stepped',
                                        showFirstLastPageButtons: false,
                                        exportButton: true,
                                        exportAllData: true,
                                        exportFileName: 'Tax Data',
                                        actionsColumnIndex: -1,
                                        columnsButton: true,
                                        color: 'primary',

                                        headerStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 30,
                                            maxHeight: 30,
                                            padding: 2,
                                            fontSize: '14px',
                                            backgroundColor: '#2196F3',
                                            background: '-ms-linear-gradient(top, #0790E8, #3180e6)',
                                            background: '-webkit-linear-gradient(top, #0790E8, #3180e6)',
                                            textAlign: 'center',
                                            color: '#FFF',
                                            textAlign: 'center'
                                        },
                                        rowStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            align: 'left',
                                            // maxHeight: 20,
                                            fontSize: '13px',
                                            padding: 0
                                        }
                                    }}
                                /> */}
                                {openBankDialog ? <Bank open={openBankDialog} handleClose={handleBankClose} id={id} mode={mode} /> : ''}
                                {open ? <Branch open={open} handleClose={handleClose} id={id} mode={mode} /> : ''}
                                {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                                {openErrorToast ? (
                                    <ErrorMsg openToast={openErrorToast} handleToast={setOpenErrorToast} mode={mode} />
                                ) : null}
                            </Grid>
                        </Grid>
                        {/* </SubCard> */}
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
};

export default ViewBranchDetails;
