import { useEffect, useState, forwardRef } from 'react';
import MaterialTable from 'material-table';
import SendIcon from '@mui/icons-material/Send';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useSelector, useDispatch } from 'react-redux';
import { getAllLocationDetails, getLatestModifiedLocationDetails } from 'store/actions/masterActions/LocationAction';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { Button, FormControlLabel, FormGroup, Switch } from '@mui/material';

import {
    getActivity_SupplementLatestModifiedDetails,
    getAllActivity_SupplimentData
} from 'store/actions/masterActions/Activity_SupplimentAction';
import HotelMaster from './HotelMaster';
import { getAllHotelMainData, getHotelLatestModifiedDetails } from 'store/actions/masterActions/HotelMasterAction';
import RoomBuyingRates from '../RoomBuyingRates/RoomBuyingRates';
import FacilityCounter from '../facility_count/FacilityCount';

function ViewHotelMaster() {
    const [open, setOpen] = useState(false);
    const [activitySupplimentId, setActivitySupplimentId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [openBuyingRateView, setOpenBuyingRateView] = useState(false);
    const [hotelCode, setHotelCode] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [facilityCountView, setFacilityCountView] = useState(false);
    const [hotel, setHotel] = useState(null);
    const navigate = useNavigate();
    const columns = [
        {
            title: 'Hotel Code',
            field: 'hotelCode',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Property Code',
            field: 'propertyCode',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Hotel Name',
            field: 'longName',
            filterPlaceholder: 'filter',
            align: 'left'
        },

        {
            title: 'Star Class',
            field: 'starClass',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Email',
            field: 'email',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        // {
        //     title: 'Max Pax',
        //     field: 'maxPax',
        //     filterPlaceholder: 'filter',
        //     align: 'left'
        // },

        {
            title: 'Status',
            field: 'status',
            filterPlaceholder: 'True || False',
            align: 'left',
            emptyValue: () => <em>null</em>,
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
                            <FormControlLabel control={<Switch size="small" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
        },
        {
            title: 'Room Buying Rate',
            field: 'status',
            filterPlaceholder: 'True || False',
            align: 'center',
            emptyValue: () => <em>null</em>,
            render: (rowData) => (
                <div>
                    <div
                        style={{
                            alignItems: 'center',
                            align: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {/* {rowData.status === true ? ( */}
                        <FormGroup>
                            <Button variant="outlined" endIcon={<SendIcon />} onClick={() => loadBuyingRatesView(rowData)}>
                                Buying Rates
                            </Button>
                            {/* <FormControlLabel control={<Switch size="small" />} checked={true} /> */}
                        </FormGroup>
                    </div>
                </div>
            )
        },

        {
            title: 'Room Count',
            field: 'status',
            filterPlaceholder: 'True || False',
            align: 'center',
            emptyValue: () => <em>null</em>,
            render: (rowData) => (
                <div>
                    <div
                        style={{
                            alignItems: 'center',
                            align: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {/* {rowData.status === true ? ( */}
                        <FormGroup>
                            <Button variant="outlined" endIcon={<SendIcon />}>
                                Room Count
                            </Button>
                            {/* <FormControlLabel control={<Switch size="small" />} checked={true} /> */}
                        </FormGroup>
                    </div>
                </div>
            )
        },

        {
            title: 'Hotel Facility Count',
            field: 'hotelCode',
            filterPlaceholder: 'True || False',
            align: 'center',
            emptyValue: () => <em>null</em>,
            render: (rowData) => (
                <div>
                    <div
                        style={{
                            alignItems: 'center',
                            align: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {/* {rowData.status === true ? ( */}
                        <FormGroup>
                            <Button variant="outlined" endIcon={<SendIcon />} onClick={() => loadFacilityCount(rowData)}>
                                Hotel Facility Count
                            </Button>
                            {/* <FormControlLabel control={<Switch size="small" />} checked={true} /> */}
                        </FormGroup>
                    </div>
                </div>
            )
        }
    ];

    const loadFacilityCount = (rowData) => {
        setHotelCode(rowData.hotelCode);
        setHotelName(rowData.longName);
        setFacilityCountView(true);
        setHotel(rowData);

        // navigate('/master/facilitycount', { replace: true });
        // setHandleToast(false);
    };

    const loadBuyingRatesView = (rowdata) => {
        console.log('loadBuyingRatesView');
        // setActivitySupplimentId('');
        // setMode('INSERT');
        // setOpenBuyingRateView(true);
        navigate('/master/roombuyingrateview', {
            state: {
                rowdata
            }
        });
        // setHandleToast(false);
    };
    const dispatch = useDispatch();
    const error = useSelector((state) => state.activity_supplimentReducer.errorMsg);
    const hotelMainData = useSelector((state) => state.hotelMainReducer.hotelMain);
    const facilityCountData = useSelector((state) => state.facilityCountReducer.facilityCount);
    const hotelMainList = useSelector((state) => state.hotelMainReducer.hotelMainList);
    const lastModifiedDate = useSelector((state) => state.hotelMainReducer.lastModifiedDateTime);

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

    useEffect(() => {
        if (hotelMainList?.payload?.length > 0) {
            setTableData(hotelMainList.payload[0]);
        }
    }, [hotelMainList]);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (hotelMainData) {
            setHandleToast(true);

            dispatch(getAllHotelMainData());
            dispatch(getHotelLatestModifiedDetails());
        }
    }, [hotelMainData]);

    useEffect(() => {
        if (facilityCountData) {
            setHandleToast(true);

            // dispatch(getAllHotelMainData());
            // dispatch(getHotelLatestModifiedDetails());
        }
    }, [facilityCountData]);
    useEffect(() => {
        dispatch(getAllHotelMainData());
        dispatch(getHotelLatestModifiedDetails());
    }, []);

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE' || type == 'VIEW') {
            setMode(type);
            setActivitySupplimentId(data.id);
        } else if (type === 'INSERT') {
            setActivitySupplimentId('');
            setMode(type);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseHotelFacility = () => {
        setFacilityCountView(false);
    };

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };
    return (
        <div>
            <MainCard title="Hotel Master">
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
                                            tooltip: 'Edit',
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
                                            // alignItems: 'center'
                                        },
                                        rowStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            fontSize: '13px',
                                            padding: 0
                                        }
                                    }}
                                />

                                {open ? (
                                    <HotelMaster open={open} handleClose={handleClose} hotelId={activitySupplimentId} mode={mode} />
                                ) : (
                                    ''
                                )}
                                {openBuyingRateView ? (
                                    <RoomBuyingRates
                                        open={openBuyingRateView}
                                        handleClose={handleClose}
                                        code={activitySupplimentId}
                                        mode={mode}
                                    />
                                ) : (
                                    ''
                                )}

                                {facilityCountView ? (
                                    <FacilityCounter
                                        open={facilityCountView}
                                        handleClose={handleCloseHotelFacility}
                                        hotelCode={hotelCode}
                                        hotelName={hotelName}
                                        mode={mode}
                                        hotel={hotel}
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

export default ViewHotelMaster;
