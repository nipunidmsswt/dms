import { useEffect, useState, forwardRef } from 'react';
import MaterialTable from 'material-table';

import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useSelector, useDispatch } from 'react-redux';
import { getAllLocationDetails, getLatestModifiedLocationDetails } from 'store/actions/masterActions/LocationAction';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';

function ViewBaggeTransportRateDetails({ paxVehicleRate }) {
    const [open, setOpen] = useState(false);
    const [locationCode, setLocationCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);

    const columns = [
        // {
        //     title: 'From Date',
        //     field: 'fromDate',
        //     filterPlaceholder: 'filter',
        //     align: 'left'
        // },
        // {
        //     title: 'To Date',
        //     field: 'toDate',
        //     filterPlaceholder: 'filter',
        //     align: 'left'
        // },
        {
            title: 'Currency',
            field: 'currency.currencyCode',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Max KM',
            field: 'maxKm',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },

        {
            title: 'TaxCode',
            field: 'taxCode.code',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Vehicle Rate',
            field: 'vehicleRate',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Vehicle Rate with Tax',
            field: 'vehicleRateWithTax',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Driver Rate',
            field: 'driverRate',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Driver Rate with Tax',
            field: 'driverRateWithTax',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Assistant Rate',
            field: 'assistantRate',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Assistant Rate with Tax',
            field: 'assistantWithTax',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Status',
            field: 'status',
            filterPlaceholder: 'True || False',
            align: 'center',
            emptyValue: () => <em></em>,
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
    const error = useSelector((state) => state.locationReducer.errorMsg);
    const locations = useSelector((state) => state.locationReducer.locations);
    const location = useSelector((state) => state.locationReducer.location);
    const lastModifiedDate = useSelector((state) => state.locationReducer.lastModifiedDateTime);

    useEffect(() => {
        setLastModifiedTimeDate(lastModifiedDate);
    }, [lastModifiedDate]);

    // useEffect(() => {
    //     if (locations?.payload?.length > 0) {
    //         setTableData(locations?.payload[0]);
    //     }
    // }, [locations]);

    useEffect(() => {
        if (paxVehicleRate.length > 0) {
            console.log(paxVehicleRate);
            setTableData(paxVehicleRate);
        }
    }, [paxVehicleRate]);

    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (location) {
            console.log('sucessToast');
            setHandleToast(true);
            dispatch(getAllLocationDetails());
        }
    }, [location]);

    useEffect(() => {
        dispatch(getAllLocationDetails());
        dispatch(getLatestModifiedLocationDetails());
    }, []);

    const handleClickOpen = (type, data) => {
        console.log(type);
        console.log(data);
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setLocationCode(data.code);
        } else if (type === 'INSERT') {
            setLocationCode('');
            setMode(type);
        } else {
            setMode(type);
            setLocationCode(data.code);
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
        <MaterialTable
            title={''}
            columns={columns}
            data={tableData}
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
                pageSize: 5,
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
    );
}

export default ViewBaggeTransportRateDetails;
