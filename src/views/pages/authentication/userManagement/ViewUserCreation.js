import { useEffect, useState, forwardRef } from 'react';
import MaterialTable from 'material-table';

import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import { getAllUserDetails, getLatestModifiedUserDetails } from 'store/actions/authenticationActions/UserAction';
import User from './UserCreation';

function ViewUserCreation() {
    const [open, setOpen] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);

    const columns = [
        {
            title: 'User Name',
            field: 'userName',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'First Name',
            field: 'firstName',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Last Name',
            field: 'lastName',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'NIC',
            field: 'nic',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },
        {
            title: 'Email',
            field: 'email',
            align: 'left',
            grouping: false,
            filterPlaceholder: 'filter'
        },

        {
            title: 'Active',
            field: 'status',
            filterPlaceholder: 'True || False',
            align: 'center',
            emptyValue: () => <em>null</em>,
            render: (rowData) => (
                <div
                    style={{
                        color: rowData.status === true ? '#008000aa' : '#f90000aa',
                        fontWeight: 'bold',
                        // background: rowData.status === true ? "#008000aa" : "#f90000aa",
                        borderRadius: '4px',
                        paddingLeft: 5,
                        paddingRight: 5
                    }}
                >
                    {rowData.status === true ? 'Active' : 'Inactive'}
                </div>
            )
        }
    ];

    const dispatch = useDispatch();
    const error = useSelector((state) => state.userReducer.errorMsg);
    const users = useSelector((state) => state.userReducer.users);
    const user = useSelector((state) => state.userReducer.user);
    const lastModifiedDate = useSelector((state) => state.userReducer.lastModifiedDateTime);
    const myProfileUpdate = useSelector((state) => state.userReducer.myProfileUpdate);

    useEffect(() => {
        setLastModifiedTimeDate(lastModifiedDate);
    }, [lastModifiedDate]);

    useEffect(() => {
        console.log('users payload');
        console.log(users);
        if (users?.length > 0) {
            console.log('users payload');
            console.log(users);
            setTableData(users);
        }
    }, [users]);

    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (myProfileUpdate) {
            console.log('myProfileUpdate');
            // dispatch(getProfileData(userCode));
            setMode('VIEW_UPDATE');
            setHandleToast(myProfileUpdate);
            // dispatch(getAllUserDetails());
            // dispatch(getLatestModifiedUserDetails());
        }
    }, [myProfileUpdate]);

    useEffect(() => {
        if (user) {
            setHandleToast(true);
            dispatch(getAllUserDetails());
            dispatch(getLatestModifiedUserDetails());
        }
    }, [user]);

    useEffect(() => {
        dispatch(getAllUserDetails());
        dispatch(getLatestModifiedUserDetails());
    }, []);

    const handleClickOpen = (type, data) => {
        console.log(type);
        console.log(data);
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setUserCode(data.userId);
        } else if (type === 'INSERT') {
            setUserCode('');
            setMode(type);
        } else {
            setMode(type);
            setUserCode(data.userId);
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
            <MainCard title="User">
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
                                            // textAlign: 'center',
                                            color: '#FFF',
                                            textAlign: 'center'
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
                                    <User open={open} handleClose={handleClose} userCode={userCode} mode={mode} component="user_creation" />
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

export default ViewUserCreation;
