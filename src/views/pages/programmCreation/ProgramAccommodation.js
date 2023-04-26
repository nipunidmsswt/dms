import { useEffect, forwardRef, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    Slide,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    Typography,
    MenuItem,
    Autocomplete,
    Switch
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import {
    getAllRolesData,
    getUserDataById,
    saveUserData,
    updateUserData,
    getProfileData,
    updateMyProfile
} from 'store/actions/authenticationActions/UserAction';
import CreatedUpdatedUserDetailsWithTableFormat from 'views/pages/master/userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import { getAllActiveMarketData } from 'store/actions/masterActions/operatorActions/MarketAction';
import { getAllClusterData } from 'store/actions/masterActions/CodeAndNameAction';
import { getAllCompanyProfileData, getAvailableLicenseCount } from 'store/actions/masterActions/CompanyProfileAction';
import { getAllDepartmentData, getAllDesignationData } from 'store/actions/masterActions/DepartmentDesignationAction';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import { makeStyles } from '@material-ui/core/styles';
import CompareRates from './CompareRates';

function ProgramAccommodation({ open, handleClose, mode, userCode, component }) {
    const initialValues = {
        disablePassowrdField: true,
        company: null,
        title: '',
        firstName: '',
        middleName: '',
        status: true,
        lastName: '',
        nic: '',
        email: '',
        mobile: '',
        designation: null,
        department: null,
        cluster: null,
        market: [],
        roleId: null,
        userName: '',
        password: '',
        availableLicenceCount: '',
        allocatedLicenceCount: '',
        files: '',
        docPath: '',

        location: null,
        allLocation: false,
        currency: null,
        minRate: '',
        maxRate: '',
        allRates: true,
        hotel: null,
        hotelDefaultCurrency: null,
        rate: '',
        rateConverson: true,
        ratePeriod: null,
        roomCategory: null,
        basis: null,
        arrivalMeal: null
    };

    const [loadValues, setLoadValues] = useState('');
    const [previewImages, setPreviewImages] = useState([]);
    //new
    const [activeLocationList, setActiveLocationList] = useState([]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);
    const [openCompareRate, setOpenCompareRate] = useState(false);

    const formikRef = useRef();

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = yup.object().shape({
        disablePassowrdField: yup.boolean(),
        company: yup.object().typeError('Required field'),
        // title: yup.string().required('Required field'),
        firstName: yup.string().required('Required field'),
        lastName: yup.string().required('Required field'),
        nic: yup.string().required('Required field'),
        email: yup.string().email().required('Required field'),
        mobile: yup
            .string()
            .required('Required field')
            .matches(phoneRegExp, 'Not valid')
            .min(10, 'Must be exactly 10 digits')
            .max(10, 'Must be 10 digits'),
        designation: yup.object().typeError('Required field'),
        department: yup.object().typeError('Required field'),
        cluster: yup.object().typeError('Required field'),
        userName: yup.string().required('Requied field'),
        roleId: yup.object().typeError('Required field')
        // market: yup.object().typeError('Required field')

        // password: yup.string().when('disablePassowrdField', {
        //     is: true && mode === 'INSERT' && component === 'user_creation',
        //     then: yup.string().required('Field is required')
        // })
    });

    //get data from reducers
    const duplicateUser = useSelector((state) => state.userReducer.duplicateUser);
    const userToUpdate = useSelector((state) => state.userReducer.userToUpdate);
    const profileToUpdate = useSelector((state) => state.userReducer.profileToUpdate);
    const [marketListOptions, setMarketListOptions] = useState([]);
    const clusterListData = useSelector((state) => state.codeAndNameReducer.cluterTypesDetails);
    const companyProfile = useSelector((state) => state.companyProfileReducer.companyProfileList);
    const availableLicenseCount = useSelector((state) => state.companyProfileReducer.availableLicenseCount);
    const marketListData = useSelector((state) => state.marketReducer.marketActiveList);
    const [clusterListOptions, setClusterListOptions] = useState([]);
    const [departmentListOptions, setDepartmentListOptions] = useState([]);
    const [designationListOptions, setDesignationListOptions] = useState([]);
    const [userListOptions, setuserListOptions] = useState([]);
    const [titleListOptions, setTitleListOptions] = useState([]);
    const [companyListOptions, setCompanyListOptions] = useState([]);
    const [userRoleListOptions, setuserRoleListOptions] = useState([]);
    const [inputMarketValue, setMarketInputValue] = useState(initialValues.market);
    const departmentActiveList = useSelector((state) => state.departmentDesignationReducer.departmentActiveList);
    const designationActiveList = useSelector((state) => state.departmentDesignationReducer.designationActiveList);
    const roleIdList = useSelector((state) => state.userReducer.userRole);
    const myProfileUpdate = useSelector((state) => state.userReducer.myProfileUpdate);

    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);

    const dispatch = useDispatch();
    const titleItems = [
        {
            title: 'Mr.'
        },
        {
            title: 'Mrs.'
        },
        {
            title: 'Miss.'
        },
        {
            title: 'Ms.'
        },
        {
            title: 'Prof.'
        },
        {
            title: 'Dr.'
        },
        {
            title: 'Ven.'
        }
    ];
    useEffect(() => {
        if (clusterListData != null) {
            setClusterListOptions(clusterListData);
        }
    }, [clusterListData]);

    useEffect(() => {
        if (departmentActiveList != null) {
            setDepartmentListOptions(departmentActiveList);
        }
    }, [departmentActiveList]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && userToUpdate != null) || (mode === 'VIEW' && userToUpdate != null)) {
            userToUpdate.disablePassowrdField = false;
            userToUpdate.availableLicenceCount = userToUpdate.company.availableLicenceCount;
            userToUpdate.allocatedLicenceCount = userToUpdate.company.allocatedLicenceCount;
            console.log(userToUpdate);
            userToUpdate.roleId = userToUpdate.role;

            let images = [];
            const contentType = 'image/png';
            console.log(userToUpdate.docPath);
            if (userToUpdate.docPath !== '' && userToUpdate.docPath !== null) {
                console.log('dftyuiopghfxcvjklkb hhhhhhhhhhhhhhhhh');
                const byteCharacters = atob(userToUpdate.docPath);

                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob1 = new Blob([byteArray], { type: contentType });
                images.push(URL.createObjectURL(blob1));
                let fileData = new File([blob1], 'name');
                userToUpdate.files = [fileData];
            }
            console.log([images]);
            setLoadValues(userToUpdate);
            setPreviewImages(images);
        }
    }, [userToUpdate]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && profileToUpdate != null) || (mode === 'VIEW' && profileToUpdate != null)) {
            profileToUpdate.disablePassowrdField = false;
            profileToUpdate.availableLicenceCount = profileToUpdate.company.availableLicenceCount;
            profileToUpdate.allocatedLicenceCount = profileToUpdate.company.allocatedLicenceCount;
            // setFieldValue('disablePassowrdField', false);
            let images = [];
            const contentType = 'image/png';
            if (profileToUpdate.docPath !== '') {
                const byteCharacters = atob(profileToUpdate.docPath);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob1 = new Blob([byteArray], { type: contentType });
                images.push(URL.createObjectURL(blob1));
                let fileData = new File([blob1], 'name');
                profileToUpdate.files = [fileData];
            }
            profileToUpdate.files = [];
            setLoadValues(profileToUpdate);
            // formikRef.current.setFieldValue('disablePassowrdField', false);
        }
    }, [profileToUpdate]);

    useEffect(() => {
        console.log(roleIdList);
        if (roleIdList != null) {
            console.log(roleIdList);
            setuserRoleListOptions(roleIdList);
        }
    }, [roleIdList]);

    useEffect(() => {
        if (designationActiveList != null) {
            setDesignationListOptions(designationActiveList);
        }
    }, [designationActiveList]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && component === 'user_creation') || (mode === 'VIEW' && component === 'user_creation')) {
            dispatch(getUserDataById(userCode));

            // setTitleListOptions(ti)
        } else if ((mode === 'VIEW_UPDATE' && component === 'user_profile') || (mode === 'VIEW' && component === 'user_profile')) {
            dispatch(getProfileData(userCode));
        }
    }, [mode]);

    useEffect(() => {
        setMarketListOptions(marketListData);
    }, [marketListData]);

    useEffect(() => {
        if (companyProfile?.payload?.length > 0) {
            setCompanyListOptions(companyProfile?.payload[0]);

            dispatch(getAvailableLicenseCount(companyProfile?.payload[0][0].id));
        }
    }, [companyProfile]);

    const handleSubmitForm = (data) => {
        console.log(data);
        if (component === 'user_creation') {
            if (mode === 'INSERT') {
                console.log(data);
                dispatch(saveUserData(data));
            } else if (mode === 'VIEW_UPDATE') {
                dispatch(updateUserData(data));
            }
        } else if (component === 'user_profile') {
            console.log('user_profile');
            dispatch(updateMyProfile(data));
        }

        handleClose();
    };

    const loadAvalibleLicenseCount = (data, setFieldValue) => {
        setFieldValue('availableLicenceCount', data.availableLicenceCount);
        setFieldValue('allocatedLicenceCount', data.allocatedLicenceCount);
    };

    useEffect(() => {
        dispatch(getAllActiveMarketData());
        dispatch(getAllClusterData());
        dispatch(getAllCompanyProfileData());
        setTitleListOptions(titleItems);
        dispatch(getAllDepartmentData());
        dispatch(getAllDesignationData());
        dispatch(getAllRolesData());

        dispatch(getActiveLocations());
    }, []);

    useEffect(() => {
        if (activeLocations.length > 0) {
            setActiveLocationList(activeLocations);
        }
    }, [activeLocations]);

    useEffect(() => {
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);

    return (
        <div>
            <Dialog maxWidth="500px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" alignItems="center" className="dialog-title">
                        <Box flexGrow={1}>{mode === 'INSERT' ? 'Add Accommodation' : 'Update Accommodation'}</Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <>
                    <DialogContent>
                        <div>
                            <div className="row">
                                <Grid container direction="row">
                                    <Grid item lg={12} md={12} xs={12}>
                                        <>
                                            <Formik
                                                innerRef={formikRef}
                                                enableReinitialize={true}
                                                initialValues={loadValues || initialValues}
                                                onSubmit={(values) => {
                                                    handleSubmitForm(values);
                                                }}
                                                validationSchema={validationSchema}
                                            >
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.locationCode}
                                                                            name="locationCode"
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`locationCode`, value);
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            options={activeLocationList}
                                                                            getOptionLabel={(option) => `${option.code}`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.location_id === value.location_id
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Location Code"
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    sx={{
                                                                                        width: {
                                                                                            sm: 200
                                                                                        },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                    variant="outlined"
                                                                                    name="locationCode"
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="allLocation"
                                                                                disabled={mode == 'VIEW'}
                                                                                onChange={handleChange}
                                                                                value={values.allLocation}
                                                                                control={<Switch color="success" />}
                                                                                label="All Locations"
                                                                                checked={values.allLocation}
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                    <fieldset style={{ border: '4px solid' }}>
                                                                        <legend>Filtaration for Half Double Sell</legend>
                                                                        <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                            <Grid item>
                                                                                <Autocomplete
                                                                                    value={values.currency}
                                                                                    name="currency"
                                                                                    onChange={(_, value) => {
                                                                                        console.log(value);
                                                                                        setFieldValue(`currency`, value);
                                                                                        // if (value != null) {
                                                                                        //     loadExchangeRates(value);
                                                                                        // }
                                                                                    }}
                                                                                    options={currencyListOptions}
                                                                                    getOptionLabel={(option) => `${option.currencyCode}`}
                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                        option.currencyListId === value.currencyListId
                                                                                    }
                                                                                    fullWidth
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            // label="tax"
                                                                                            sx={{
                                                                                                width: { sm: 200, md: 250 },
                                                                                                '& .MuiInputBase-root': {
                                                                                                    height: 40
                                                                                                }
                                                                                            }}
                                                                                            disabled={mode == 'VIEW_UPDATE'}
                                                                                            InputLabelProps={{
                                                                                                shrink: true
                                                                                            }}
                                                                                            fullWidth
                                                                                            variant="outlined"
                                                                                            name="currency"
                                                                                            label="Currency"
                                                                                            onBlur={handleBlur}
                                                                                            error={Boolean(
                                                                                                touched.currency && errors.currency
                                                                                            )}
                                                                                            helperText={
                                                                                                touched.currency && errors.currency
                                                                                                    ? errors.currency
                                                                                                    : ''
                                                                                            }
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                {' '}
                                                                                <TextField
                                                                                    sx={{
                                                                                        width: { sm: 150, md: 150 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    id="standard-select-currency"
                                                                                    label="Min"
                                                                                    name="minRate"
                                                                                    onChange={handleChange}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    onBlur={handleBlur}
                                                                                    value={values.minRate}
                                                                                    error={Boolean(touched.minRate && errors.minRate)}
                                                                                    helperText={
                                                                                        touched.minRate && errors.minRate
                                                                                            ? errors.minRate
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    /// disabled={disableDistrict}
                                                                                    sx={{
                                                                                        width: { sm: 150, md: 150 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    label="Max"
                                                                                    name="maxRate"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    value={values.maxRate}
                                                                                    error={Boolean(touched.maxRate && errors.maxRate)}
                                                                                    helperText={
                                                                                        touched.maxRate && errors.maxRate
                                                                                            ? errors.maxRate
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <FormGroup>
                                                                                    <FormControlLabel
                                                                                        name="allRates"
                                                                                        disabled={mode == 'VIEW'}
                                                                                        onChange={handleChange}
                                                                                        value={values.allRates}
                                                                                        control={<Switch color="success" />}
                                                                                        label="All Rates"
                                                                                        checked={values.allRates}
                                                                                        // disabled={mode == 'VIEW'}
                                                                                    />
                                                                                </FormGroup>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </fieldset>
                                                                </Grid>

                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="First Name"
                                                                            name="firstName"
                                                                            onChange={handleChange}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={
                                                                                component === 'user_creation' && mode === 'INSERT'
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                            onBlur={handleBlur}
                                                                            value={values.firstName}
                                                                            error={Boolean(touched.firstName && errors.firstName)}
                                                                            helperText={
                                                                                touched.firstName && errors.firstName
                                                                                    ? errors.firstName
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="standard-select-currency"
                                                                            label="Middle Name"
                                                                            name="middleName"
                                                                            onChange={handleChange}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={
                                                                                component === 'user_creation' && mode === 'INSERT'
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                            onBlur={handleBlur}
                                                                            value={values.middleName}
                                                                            error={Boolean(touched.middleName && errors.middleName)}
                                                                            helperText={
                                                                                touched.middleName && errors.middleName
                                                                                    ? errors.middleName
                                                                                    : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            /// disabled={disableDistrict}
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Last Name"
                                                                            name="lastName"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={
                                                                                component === 'user_creation' && mode === 'INSERT'
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                            value={values.lastName}
                                                                            error={Boolean(touched.lastName && errors.lastName)}
                                                                            helperText={
                                                                                touched.lastName && errors.lastName ? errors.lastName : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="status"
                                                                                disabled={mode == 'VIEW'}
                                                                                onChange={handleChange}
                                                                                value={values.status}
                                                                                control={<Switch color="success" />}
                                                                                label="Apply Rate Conversion 4"
                                                                                checked={values.status}
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            /// disabled={disableDistrict}
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Last Name"
                                                                            name="lastName"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={
                                                                                component === 'user_creation' && mode === 'INSERT'
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                            value={values.lastName}
                                                                            error={Boolean(touched.lastName && errors.lastName)}
                                                                            helperText={
                                                                                touched.lastName && errors.lastName ? errors.lastName : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Button
                                                                            variant="contained"
                                                                            style={{ backgroundColor: '#556B2F' }}
                                                                            sx={{ borderRadius: 60 }}
                                                                            onClick={setOpenCompareRate(true)}
                                                                        >
                                                                            Compare Rates
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Mobile No"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="mobile"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.mobile}
                                                                            error={Boolean(touched.mobile && errors.mobile)}
                                                                            helperText={
                                                                                touched.mobile && errors.mobile ? errors.mobile : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Mobile No"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="mobile"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.mobile}
                                                                            error={Boolean(touched.mobile && errors.mobile)}
                                                                            helperText={
                                                                                touched.mobile && errors.mobile ? errors.mobile : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Mobile No"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="mobile"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.mobile}
                                                                            error={Boolean(touched.mobile && errors.mobile)}
                                                                            helperText={
                                                                                touched.mobile && errors.mobile ? errors.mobile : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Mobile No"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="mobile"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.mobile}
                                                                            error={Boolean(touched.mobile && errors.mobile)}
                                                                            helperText={
                                                                                touched.mobile && errors.mobile ? errors.mobile : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid style={{ marginTop: '20px' }}>
                                                                    <fieldset style={{ border: '4px solid' }}>
                                                                        <legend>Buy Rates</legend>
                                                                        <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    id="outlined-required"
                                                                                    label="First Name"
                                                                                    name="firstName"
                                                                                    onChange={handleChange}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    onBlur={handleBlur}
                                                                                    value={values.firstName}
                                                                                    error={Boolean(touched.firstName && errors.firstName)}
                                                                                    helperText={
                                                                                        touched.firstName && errors.firstName
                                                                                            ? errors.firstName
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                {' '}
                                                                                <TextField
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    id="standard-select-currency"
                                                                                    label="Middle Name"
                                                                                    name="middleName"
                                                                                    onChange={handleChange}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    onBlur={handleBlur}
                                                                                    value={values.middleName}
                                                                                    error={Boolean(touched.middleName && errors.middleName)}
                                                                                    helperText={
                                                                                        touched.middleName && errors.middleName
                                                                                            ? errors.middleName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    /// disabled={disableDistrict}
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    label="Last Name"
                                                                                    name="lastName"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    value={values.lastName}
                                                                                    error={Boolean(touched.lastName && errors.lastName)}
                                                                                    helperText={
                                                                                        touched.lastName && errors.lastName
                                                                                            ? errors.lastName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                {' '}
                                                                                <TextField
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    id="standard-select-currency"
                                                                                    label="Middle Name"
                                                                                    name="middleName"
                                                                                    onChange={handleChange}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    onBlur={handleBlur}
                                                                                    value={values.middleName}
                                                                                    error={Boolean(touched.middleName && errors.middleName)}
                                                                                    helperText={
                                                                                        touched.middleName && errors.middleName
                                                                                            ? errors.middleName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    /// disabled={disableDistrict}
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    label="Last Name"
                                                                                    name="lastName"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    value={values.lastName}
                                                                                    error={Boolean(touched.lastName && errors.lastName)}
                                                                                    helperText={
                                                                                        touched.lastName && errors.lastName
                                                                                            ? errors.lastName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </fieldset>
                                                                </Grid>
                                                                <Grid style={{ marginTop: '20px' }}>
                                                                    <fieldset style={{ border: '4px solid' }}>
                                                                        <legend>Buy Rates</legend>
                                                                        <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    id="outlined-required"
                                                                                    label="First Name"
                                                                                    name="firstName"
                                                                                    onChange={handleChange}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    onBlur={handleBlur}
                                                                                    value={values.firstName}
                                                                                    error={Boolean(touched.firstName && errors.firstName)}
                                                                                    helperText={
                                                                                        touched.firstName && errors.firstName
                                                                                            ? errors.firstName
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                {' '}
                                                                                <TextField
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    id="standard-select-currency"
                                                                                    label="Middle Name"
                                                                                    name="middleName"
                                                                                    onChange={handleChange}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    onBlur={handleBlur}
                                                                                    value={values.middleName}
                                                                                    error={Boolean(touched.middleName && errors.middleName)}
                                                                                    helperText={
                                                                                        touched.middleName && errors.middleName
                                                                                            ? errors.middleName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    /// disabled={disableDistrict}
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    label="Last Name"
                                                                                    name="lastName"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    value={values.lastName}
                                                                                    error={Boolean(touched.lastName && errors.lastName)}
                                                                                    helperText={
                                                                                        touched.lastName && errors.lastName
                                                                                            ? errors.lastName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                {' '}
                                                                                <TextField
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    id="standard-select-currency"
                                                                                    label="Middle Name"
                                                                                    name="middleName"
                                                                                    onChange={handleChange}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    onBlur={handleBlur}
                                                                                    value={values.middleName}
                                                                                    error={Boolean(touched.middleName && errors.middleName)}
                                                                                    helperText={
                                                                                        touched.middleName && errors.middleName
                                                                                            ? errors.middleName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                    /// disabled={disableDistrict}
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    label="Last Name"
                                                                                    name="lastName"
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    disabled={
                                                                                        component === 'user_creation' && mode === 'INSERT'
                                                                                            ? false
                                                                                            : true
                                                                                    }
                                                                                    value={values.lastName}
                                                                                    error={Boolean(touched.lastName && errors.lastName)}
                                                                                    helperText={
                                                                                        touched.lastName && errors.lastName
                                                                                            ? errors.lastName
                                                                                            : ''
                                                                                    }
                                                                                ></TextField>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </fieldset>
                                                                </Grid>
                                                            </div>

                                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                                {mode != 'VIEW' ? (
                                                                    <Button
                                                                        variant="outlined"
                                                                        type="button"
                                                                        style={{
                                                                            marginLeft: '10px'
                                                                        }}
                                                                        // onClick={handleCancel}
                                                                    >
                                                                        CLEAR
                                                                    </Button>
                                                                ) : (
                                                                    ''
                                                                )}

                                                                {mode != 'VIEW' ? (
                                                                    <Button variant="contained" type="submit" className="btnSave">
                                                                        {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                                                    </Button>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </Box>
                                                            {openCompareRate ? (
                                                                <CompareRates
                                                                    open={openCompareRate}
                                                                    handleClose={handleClose}
                                                                    taxGroupCode={null}
                                                                    mode={mode}
                                                                />
                                                            ) : (
                                                                ''
                                                            )}
                                                        </Form>
                                                    );
                                                }}
                                            </Formik>
                                        </>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </DialogContent>
                </>
            </Dialog>
        </div>
    );
}

export default ProgramAccommodation;
