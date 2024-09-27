import { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import FacilityCounter from './FacilityCount';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTaxData } from 'store/actions/masterActions/TaxActions/TaxAction';
import { getAllTaxGroupDetails } from 'store/actions/masterActions/TaxActions/TaxGroupAction';
import MainCard from 'ui-component/cards/MainCard';
import { FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import { getAllFacilityCounterData, getLatestModifiedDetailsFacilityCount } from 'store/actions/masterActions/FacilityCounterAction';

function ViewFacilityCounter() {
    const [open, setOpen] = useState(false);
    const [taxGroupCode, setTaxGroupCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const columns = [
        {
            title: 'Hotel Code',
            field: 'hotelCode',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Hotel Name',
            field: 'hotelName',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Facility Type',
            field: 'facilityType',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Count',
            field: 'count',
            filterPlaceholder: 'filter',
            align: 'center'
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
                            <FormControlLabel control={<Switch color="success" size="small" />} checked={true} />
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
    const error = useSelector((state) => state.taxReducer.errorMsg);
    const arrayList = [];
    const lastModifiedDate = useSelector((state) => state.facilityCountReducer.lastModifiedDateTime);

    const facilityCountList = useSelector((state) => state.facilityCountReducer.facilityCountList);
    useEffect(() => {
        if (facilityCountList?.payload?.length > 0) {
            facilityCountList?.payload[0].forEach((element) => {
                element?.facilityCountDetails.forEach((element2) => {
                    const initialValues = {
                        id: element?.id,
                        hotel: element?.hotel,
                        hotelCode: element?.hotel?.hotelCode,
                        hotelName: element?.hotel?.longName,
                        // facilityType: element.status,
                        status: element?.status,
                        facilityType: element2.facilityCodeName?.hotelFacilityType?.hotelFacilityType,
                        count: element2?.count,
                        facilityCountDetails: element2 // facilityCountDetails: [
                        //     {
                        //         facilityType: values.facilityCountDetails.facilityType,
                        //         facilityCodeName: values.facilityCountDetails.acilityCodeName,
                        //         count: values.facilityCountDetails.count,
                        //         status: values.facilityCountDetails.status
                        //     }
                        // ]
                    };
                    arrayList.push(initialValues);
                });
            });

            setTableData(arrayList);
        } else {
        }
    }, [facilityCountList]);

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

    useEffect(() => {
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        dispatch(getAllFacilityCounterData());
        dispatch(getLatestModifiedDetailsFacilityCount());
    }, []);

    const handleClickOpen = (type, data) => {
        console.log(type);
        console.log(data);
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setTaxGroupCode(data.taxGroupCode);
        } else if (type === 'INSERT') {
            setTaxGroupCode('');
            setMode(type);
        } else {
            setMode(type);
            setTaxGroupCode(data.taxGroupCode);
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
            <MainCard title="Facility Count">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <MaterialTable
                                    title={`Last Modified Date : ${lastModifiedTimeDate}`}
                                    columns={columns}
                                    data={tableData}
                                    actions={
                                        [
                                            // {
                                            //     icon: tableIcons.Add,
                                            //     tooltip: 'Add New',
                                            //     isFreeAction: true,
                                            //     onClick: () => handleClickOpen('INSERT', null)
                                            // },
                                            // (rowData) => ({
                                            //     icon: tableIcons.Edit,
                                            //     tooltip: 'Edit',
                                            //     onClick: () => handleClickOpen('VIEW_UPDATE', rowData)
                                            // }),
                                            // (rowData) => ({
                                            //     icon: tableIcons.VisibilityIcon,
                                            //     tooltip: 'Edit',
                                            //     onClick: () => handleClickOpen('VIEW', rowData)
                                            // })
                                        ]
                                    }
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
                                    <FacilityCounter open={open} handleClose={handleClose} taxGroupCode={taxGroupCode} mode={mode} />
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

export default ViewFacilityCounter;
