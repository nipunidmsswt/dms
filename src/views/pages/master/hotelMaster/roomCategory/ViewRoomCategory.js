import React from 'react';
import MaterialTable from 'material-table';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, TextField, Switch, FormGroup, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import HotelChildrenFacilities from './RoomCategory';
import { getAllRoomCategoryData, getRoomCategoryLatestModifiedDetails } from 'store/actions/masterActions/RoomCategoryAction';
import MainCard from 'ui-component/cards/MainCard';

function ViewRoomCategory() {
    const [open, setOpen] = useState(false);
    const [rowHotelChildrenFacilityCode, setHotelChildrenFacilityCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const error = useSelector((state) => state.productDataReducer.errorMsg);
    const hotelChildrenFacilityListData = useSelector((state) => state.roomCategoryReducer.hotelChildrenFacilityList);
    const [tableData, setTableData] = useState([]);
    const lastModifiedDate = useSelector((state) => state.roomCategoryReducer.lastModifiedDateTime);

    const hotelChildrenFacilityData = useSelector((state) => state.roomCategoryReducer.hotelChildrenFacility);
    const dispatch = useDispatch();

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE' || type === 'VIEW') {
            setMode(type);
            setHotelChildrenFacilityCode(data.code);
        } else {
            setHotelChildrenFacilityCode('');
            setMode(type);
        }

        setOpen(true);
    };

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
        dispatch(getAllRoomCategoryData());
        dispatch(getRoomCategoryLatestModifiedDetails());
    }, []);

    useEffect(() => {
        if (hotelChildrenFacilityListData?.payload?.length > 0) {
            setTableData(hotelChildrenFacilityListData?.payload[0]);
        }
    }, [hotelChildrenFacilityListData]);

    useEffect(() => {
        console.log(error);
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (hotelChildrenFacilityData) {
            setHandleToast(true);
            dispatch(getAllRoomCategoryData());
            dispatch(getRoomCategoryLatestModifiedDetails());
        }
    }, [hotelChildrenFacilityData]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleToast = () => {
        setHandleToast(false);
    };

    const columns = [
        {
            title: ' Code',
            field: 'code',
            align: 'center',
            cellStyle: {
                minWidth: 200,
                maxWidth: 200,
                align: 'center'
            },
            headerStyle: { textAlign: 'center' },
            filterPlaceholder: 'filter'
        },
        {
            title: 'Description',
            field: 'roomDescription',
            filterPlaceholder: 'filter',
            cellStyle: {
                minWidth: 200,
                maxWidth: 200,
                align: 'center'
            },
            headerStyle: { textAlign: 'center' },
            align: 'center'
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
    return (
        <div>
            <MainCard title="Room Category">
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
                                            filtering: true,
                                            tooltip: 'Edit',
                                            // iconProps: { color: "primary" },
                                            onClick: () => handleClickOpen('VIEW_UPDATE', rowData)
                                        }),
                                        (rowData) => ({
                                            icon: tableIcons.VisibilityIcon,
                                            tooltip: 'View',
                                            // iconProps: { color: "action" },
                                            onClick: () => handleClickOpen('VIEW', rowData)
                                        })
                                    ]}
                                    options={{
                                        // title:<ModifiedElement/>,
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
                                        // paginationPosition: "both",
                                        exportButton: true,
                                        exportAllData: true,
                                        exportFileName: 'Children Facilities Table Data',
                                        actionsColumnIndex: -1,

                                        // grouping: true,
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
                                            // textAlign: 'center',
                                            color: '#FFF'
                                        },
                                        rowStyle: {
                                            whiteSpace: 'nowrap',
                                            height: 20,
                                            fontSize: '13px',
                                            padding: 0,
                                            align: 'center'
                                        }
                                    }}
                                />

                                {open ? (
                                    <HotelChildrenFacilities
                                        open={open}
                                        handleClose={handleClose}
                                        mode={mode}
                                        rowHotelChildrenFacilityCode={rowHotelChildrenFacilityCode}
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

export default ViewRoomCategory;
