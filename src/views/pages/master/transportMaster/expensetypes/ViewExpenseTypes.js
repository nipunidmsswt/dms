import { useEffect, useState } from 'react';
import MaterialTable from 'material-table';

import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import tableIcons from 'utils/MaterialTableIcons';
import { useSelector, useDispatch } from 'react-redux';
import { getAllExChangeRateData, getLatestModifiedDetails } from 'store/actions/masterActions/exchangeRateActions/ExchangeRateActions';
import MainCard from 'ui-component/cards/MainCard';
import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import { gridSpacing } from 'store/constant';
import ExpenseTypes from './ExpenseTypes';
import { getAllExpenseTypesData, getLatestModifiedDetailsExpenseRates } from 'store/actions/masterActions/ExpenseTypeAction';
import AlertModelClose from 'messages/AlertModelClose';

function ViewExpenseTypes() {
    const [open, setOpen] = useState(false);
    const [openConfirmationModel, setOpenConfirmationModel] = useState(false);
    const [Code, setCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const columns = [
        {
            title: 'Expense Code',
            field: 'expenseCode',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Description',
            field: 'description',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Status',
            field: 'status',
            filterPlaceholder: 'True || False',
            align: 'center',
            emptyValue: () => <em>null</em>,
            render: (rowData) => (
                <div
                    style={{
                        alignItems: 'center',
                        align: 'center',
                        display: 'flex',
                        justifyContent: 'center'
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

    const dispatch = useDispatch();
    const error = useSelector((state) => state.exchangeRateTypesReducer.errorMsg);
    const lastModifiedDate = useSelector((state) => state.expenseTypesReducer.lastModifiedDateTime);
    const expenseType = useSelector((state) => state.expenseTypesReducer.expenseType);
    const expenseTypesList = useSelector((state) => state.expenseTypesReducer.expenseTypes);

    useEffect(() => {
        if (expenseTypesList?.length > 0) {
            setTableData(expenseTypesList);
        }
    }, [expenseTypesList]);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (expenseType) {
            setHandleToast(true);
            dispatch(getAllExpenseTypesData());
            dispatch(getLatestModifiedDetailsExpenseRates());
        }
    }, [expenseType]);

    useEffect(() => {
        dispatch(getLatestModifiedDetailsExpenseRates());
        dispatch(getAllExpenseTypesData());
    }, []);

    useEffect(() => {
        setLastModifiedTimeDate(
            lastModifiedDate === null || lastModifiedDate === ''
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
            console.log('expenseCode:' + data.expenseCode);
            setMode(type);
            setCode(data.expenseCode);
        } else if (type === 'INSERT') {
            setCode('');
            setMode(type);
        } else {
            setMode(type);
            setCode(data.expenseCode);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpenConfirmationModel(true);
    };

    const handleCloseSubmit = () => {
        setOpen(false);
    };

    const handleCloseModel = (status) => {
        //close
        if (status == true) {
            setOpen(false);
            setOpenConfirmationModel(false);
        } else {
            setOpenConfirmationModel(false);
        }
    };

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };
    return (
        <div>
            <MainCard title="Expense Types">
                {/* <div style={{ textAlign: 'right' }}> Last Modified Date : {lastModifiedTimeDate}</div> */}
                <br />
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
                                            icon: tableIcons.Add,
                                            tooltip: 'Add New',
                                            isFreeAction: true,
                                            onClick: () => handleClickOpen('INSERT', null)
                                        },
                                        (rowData) => ({
                                            icon: tableIcons.Edit,
                                            tooltip: 'Edit',
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
                                        pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
                                        pageSize: 10,
                                        paginationType: 'stepped',
                                        showFirstLastPageButtons: false,
                                        exportButton: true,
                                        exportAllData: true,
                                        exportFileName: 'TableData',
                                        actionsColumnIndex: -1,
                                        columnsButton: true,

                                        headerStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            maxHeight: 20,
                                            padding: 2,
                                            fontSize: '14px',
                                            background: '-moz-linear-gradient(top, #0790E8, #3180e6)',
                                            background: '-ms-linear-gradient(top, #0790E8, #3180e6)',
                                            background: '-webkit-linear-gradient(top, #0790E8, #3180e6)',
                                            textAlign: 'center',
                                            color: '#FFF'
                                        },
                                        rowStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            fontSize: '13px',
                                            padding: 0
                                        }
                                    }}
                                />
                                {openConfirmationModel ? (
                                    <AlertModelClose title="dev" open={openConfirmationModel} handleCloseModel={handleCloseModel} />
                                ) : (
                                    ''
                                )}
                                {open ? (
                                    <ExpenseTypes
                                        open={open}
                                        handleClose={handleClose}
                                        handleCloseSubmit={handleCloseSubmit}
                                        code={Code}
                                        mode={mode}
                                    />
                                ) : (
                                    ''
                                )}
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
}

export default ViewExpenseTypes;
