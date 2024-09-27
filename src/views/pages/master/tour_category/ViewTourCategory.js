import React from 'react';
import MaterialTable from 'material-table';

import { useEffect, useState, forwardRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import TourCategory from './TourCategory';
import { styled } from '@mui/material/styles';
import { Typography, TextField, Switch, FormGroup, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';
import './tourCategory.scss';
import { getAllTourCategoryData, getTourCategoryLatestModifiedDetails } from 'store/actions/masterActions/TourCategoryActions';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import tableIcons from 'utils/MaterialTableIcons';
import MainCard from 'ui-component/cards/MainCard';

function ViewTourCategory() {
    const [open, setOpen] = useState(false);
    const [rowTourCategoryCode, setTourCategoryCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const dispatch = useDispatch();
    const tourCategoryListData = useSelector((state) => state.tourCategoryReducer.tourCategories);
    const error = useSelector((state) => state.tourCategoryReducer.errorMsg);
    const lastModifiedDate = useSelector((state) => state.tourCategoryReducer.lastModifiedDateTime);
    // const updateErrorMsg = useSelector((state) => state.taxReducer.updateErrorMsg);

    const tourCategoryData = useSelector((state) => state.tourCategoryReducer.tourCategory);

    const columns = [
        {
            title: 'Category Code',
            field: 'tourCategoryCode',
            headerStyle: { textAlign: 'center' },
            cellStyle: {
                minWidth: 200,
                maxWidth: 200,
                align: 'left'
            },
            filterPlaceholder: 'filter'
        },
        {
            title: 'Category Description',
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
                    }}
                >
                    {rowData.status === true ? (
                        <FormGroup>
                            <FormControlLabel control={<Switch color="success" size="small" />} checked={true} />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel control={<Switch color="error" size="small" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
            // searchable: false,
            // export: false,
        }
    ];

    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (tourCategoryData) {
            setHandleToast(true);
            dispatch(getAllTourCategoryData());
            dispatch(getTourCategoryLatestModifiedDetails());
        }
    }, [tourCategoryData]);

    useEffect(() => {
        dispatch(getAllTourCategoryData());
        dispatch(getTourCategoryLatestModifiedDetails());
    }, []);

    useEffect(() => {
        if (tourCategoryListData?.payload?.length > 0) {
            setTableData(tourCategoryListData?.payload[0]);
        }
    }, [tourCategoryListData]);

    useEffect(() => {
        // setLastModifiedTimeDate(dateFormator(lastModifiedDate));
        setLastModifiedTimeDate(lastModifiedDate);
    }, [lastModifiedDate]);

    function dateFormator(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE' || type === 'VIEW') {
            // console.log(type)
            console.log('data:' + data);
            setMode(type);
            setTourCategoryCode(data.tourCategoryCode);
            // setTaxCode(data.tou);
        } else {
            setTourCategoryCode('');
            setMode(type);
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
            <MainCard title="Tour Category">
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
                                            color: '#FFF'
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

                                {open ? (
                                    <TourCategory
                                        open={open}
                                        handleClose={handleClose}
                                        mode={mode}
                                        rowTourCategoryCode={rowTourCategoryCode}
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

export default ViewTourCategory;
