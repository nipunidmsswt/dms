import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import MaterialTable from 'material-table';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useEffect, useState, forwardRef } from 'react';
import Tax from './Tax';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTaxData, getLatestModifiedTaxDetails } from 'store/actions/masterActions/TaxActions/TaxAction';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';

const ViewTax = () => {
    const columns = [
        {
            title: 'Tax Code',
            field: 'taxCode',
            filterPlaceholder: 'Tax Code',
            align: 'left'
        },
        {
            title: 'Tax Description',
            field: 'taxDescription',
            filterPlaceholder: 'Tax Description',
            align: 'left'
        },
        {
            title: 'Percentage %',
            field: 'percentage',
            align: 'right',
            grouping: false,
            filterPlaceholder: 'Percentage'
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
    const [rowTaxCode, setTaxCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [tableData, setTableData] = useState([]);
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const dispatch = useDispatch();
    const error = useSelector((state) => state.taxReducer.errorMsg);
    const taxListData = useSelector((state) => state.taxReducer.taxes);
    const taxData = useSelector((state) => state.taxReducer.tax);
    const lastModifiedDate = useSelector((state) => state.taxReducer.lastModifiedDateTime);

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (taxData) {
            setHandleToast(true);

            dispatch(getAllTaxData());
            dispatch(getLatestModifiedTaxDetails());
        }
    }, [taxData]);

    useEffect(() => {
        dispatch(getAllTaxData());
        dispatch(getLatestModifiedTaxDetails());
    }, []);

    useEffect(() => {
        console.log(taxListData);
        if (taxListData?.length > 0) {
            setTableData(taxListData);
        }
    }, [taxListData]);

    useEffect(() => {
        setLastModifiedTimeDate(
            lastModifiedDate === ''
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
            setTaxCode(data.taxCode);
        } else if (type === 'INSERT') {
            setTaxCode('');
            setMode(type);
        } else {
            setMode(type);
            setTaxCode(data.taxCode);
        }
        setOpen(true);
    };

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };
    return (
        <div>
            <MainCard title="Tax Setup">
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

                                {open ? <Tax open={open} handleClose={handleClose} rowTaxCode={rowTaxCode} mode={mode} /> : ''}
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

export default ViewTax;
