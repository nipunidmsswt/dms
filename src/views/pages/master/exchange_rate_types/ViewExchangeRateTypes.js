import { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import ExchangeRateTypes from './ExchangeRateTypes';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import tableIcons from 'utils/MaterialTableIcons';
import { useSelector, useDispatch } from 'react-redux';
import { getAllExChangeRateData, getLatestModifiedDetails } from 'store/actions/masterActions/exchangeRateActions/ExchangeRateActions';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { gridSpacing } from 'store/constant';

function ViewExchangeRateTypes() {
    const [open, setOpen] = useState(false);
    const [Code, setCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const columns = [
        {
            title: 'Exchange Type',
            field: 'exchangeType',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Base Currency Code',
            field: 'baseCurrencyCode.currencyCode',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Currency ISO Code',
            field: 'currencyISOCode.currencyCode',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Status',
            field: 'status',
            align: 'center',
            lookup: {
                true: 'Active',
                false: 'Inactive'
            },
            render: (rowData) => (
                <div
                    style={{
                        alignItems: 'center',
                        align: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
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

    const exchangeRateTypeList = useSelector((state) => state.exchangeRateTypesReducer.exchangeRateTypeList);
    const exchangeRateType = useSelector((state) => state.exchangeRateTypesReducer.exchangeRateType);
    const lastModifiedDate = useSelector((state) => state.exchangeRateTypesReducer.lastModifiedDateTime);
    console.log(exchangeRateType);

    useEffect(() => {
        if (exchangeRateTypeList?.payload?.length > 0) {
            setTableData(exchangeRateTypeList?.payload[0]);
        }
    }, [exchangeRateTypeList]);

    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        console.log(exchangeRateType);
        if (exchangeRateType) {
            console.log('sucessToast');
            setHandleToast(true);
            dispatch(getAllExChangeRateData());
        }
    }, [exchangeRateType]);

    useEffect(() => {
        dispatch(getLatestModifiedDetails());
        dispatch(getAllExChangeRateData());
    }, []);

    useEffect(() => {
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
        console.log(type);
        console.log(data);
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setCode(data.currencyId);
        } else if (type === 'INSERT') {
            setCode('');
            setMode(type);
        } else {
            setMode(type);
            setCode(data.currencyId);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };
    return (
        <div>
            <MainCard title="Exchange Rate Types">
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

                                {open ? <ExchangeRateTypes open={open} handleClose={handleClose} code={Code} mode={mode} /> : ''}
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

export default ViewExchangeRateTypes;
