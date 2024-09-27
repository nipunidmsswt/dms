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
import { getAllGuideClassData } from 'store/actions/masterActions/GuideClassAction';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import ActivitySupplement from './ActivitySupplement';
import {
    getActivity_SupplementLatestModifiedDetails,
    getAllActivity_SupplimentData
} from 'store/actions/masterActions/Activity_SupplimentAction';
import { useLocation } from 'react-router-dom';

function ViewActivitySupplement() {
    const [open, setOpen] = useState(false);
    const [activitySupplimentId, setActivitySupplimentId] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);

    const columns = [
        {
            title: 'Type',
            field: 'type',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Type Of Activity',
            field: 'typeOfActivity',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Code',
            field: 'code',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        // {
        //     title: 'Location Code',
        //     field: 'locationCode',
        //     filterPlaceholder: 'filter',
        //     align: 'center'
        // },
        {
            title: 'Max Pax',
            field: 'maxPax',
            filterPlaceholder: 'filter',
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
                            <FormControlLabel control={<Switch size="small" color="error" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
        }
    ];

    const dispatch = useDispatch();
    const error = useSelector((state) => state.activity_supplimentReducer.errorMsg);
    const activity_suppliment = useSelector((state) => state.activity_supplimentReducer.activity_suppliment);
    const activity_supplimentList = useSelector((state) => state.activity_supplimentReducer.activity_supplimentList);
    const lastModifiedDate = useSelector((state) => state.activity_supplimentReducer.lastModifiedDateTime);

    let location = useLocation();

    useEffect(() => {
        if (location?.state?.miscellaneous === 'miscellaneous') {
            setMode('INSERT');
            setOpen(true);
        }
    }, [location]);

    useEffect(() => {
        setLastModifiedTimeDate(lastModifiedDate);
    }, [lastModifiedDate]);

    useEffect(() => {
        if (activity_supplimentList?.length > 0) {
            setTableData(activity_supplimentList);
        }
    }, [activity_supplimentList]);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (activity_suppliment) {
            setHandleToast(true);
            dispatch(getAllActivity_SupplimentData());
            dispatch(getActivity_SupplementLatestModifiedDetails());
        }
    }, [activity_suppliment]);

    useEffect(() => {
        dispatch(getAllActivity_SupplimentData());
        dispatch(getActivity_SupplementLatestModifiedDetails());
    }, []);

    const handleClickOpen = (type, data) => {
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setActivitySupplimentId(data.id);
        } else if (type === 'INSERT') {
            setActivitySupplimentId('');
            setMode(type);
        } else {
            setMode(type);
            setActivitySupplimentId(data.guideCode);
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
            <MainCard title="Activity / Supplement">
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
                                    <ActivitySupplement
                                        open={open}
                                        handleClose={handleClose}
                                        activitySupplimentId={activitySupplimentId}
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

export default ViewActivitySupplement;
