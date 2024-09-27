import React from 'react';
import MaterialTable from 'material-table';
import { useEffect, useState } from 'react';
import tableIcons from 'utils/MaterialTableIcons';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { styled } from '@mui/material/styles';
import { Typography, TextField, Switch, FormGroup, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import HotelCategory from './HotelCategory';
import { getAllHotelCategoryData, getLatestModifiedDetails } from 'store/actions/masterActions/HotelCategoryAction';

function ViewHotelCategory() {
    const [open, setOpen] = useState(false);
    const [rowhotelCategoryCode, setCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const error = useSelector((state) => state.hotelCategoryReducer.errorMsg);
    const hotelCategoryListData = useSelector((state) => state.hotelCategoryReducer.hotelCategories);
    const [tableData, setTableData] = useState([]);
    const lastModifiedDate = useSelector((state) => state.hotelCategoryReducer.lastModifiedDateTime);

    const hotelCategoryData = useSelector((state) => state.hotelCategoryReducer.hotelCategory);
    const dispatch = useDispatch();

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE' || type === 'VIEW') {
            setMode(type);
            console.log('get by code' + data.code);
            setCode(data.code);
        } else {
            setCode('');
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
        dispatch(getAllHotelCategoryData());
        dispatch(getLatestModifiedDetails());
    }, []);

    useEffect(() => {
        if (hotelCategoryListData?.payload?.length > 0) {
            setTableData(hotelCategoryListData?.payload[0]);
        }
    }, [hotelCategoryListData]);

    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        console.log(hotelCategoryData);
        if (hotelCategoryData != null) {
            setHandleToast(true);
            dispatch(getAllHotelCategoryData());
            dispatch(getLatestModifiedDetails());
        }
    }, [hotelCategoryData]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleToast = () => {
        setHandleToast(false);
    };

    const columns = [
        {
            title: 'Hotel Category Code',
            field: 'code',
            headerStyle: { textAlign: 'center' },
            cellStyle: {
                minWidth: 200,
                maxWidth: 200,
                align: 'left'
            },
            filterPlaceholder: 'filter'
        },
        {
            title: 'Name',
            field: 'name',
            filterPlaceholder: 'filter',
            headerStyle: { textAlign: 'center' },
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
    return (
        <div>
            <MainCard title="Hotel Category">
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
                                        exportFileName: 'Service Offered Table Data',
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
                                            padding: 0
                                        }
                                    }}
                                />

                                {open ? (
                                    <HotelCategory
                                        open={open}
                                        handleClose={handleClose}
                                        mode={mode}
                                        hotelCategoryCode={rowhotelCategoryCode}
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

export default ViewHotelCategory;
