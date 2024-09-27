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

function User({ open, handleClose, mode, userCode, component }) {
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
        docPath: ''
    };
    const [loadValues, setLoadValues] = useState('');
    const [previewImages, setPreviewImages] = useState([]);
    const formikRef = useRef();

    // yup.addMethod(yup.string, 'checkDuplicateLocationCode', function (message) {
    //     return this.test('checkDuplicateLocationCode', 'Duplicate Tax group', async function validateValue(value) {
    //         if (mode === 'INSERT') {
    //             try {
    //                 // dispatch(checkDuplicateTaxGroupCode(value));

    //                 if (duplicateLoction != null && duplicateLoction.errorMessages.length != 0) {
    //                     return false;
    //                 } else {
    //                     return true;
    //                 }
    //                 return false; // or true as you see fit
    //             } catch (error) {}
    //         }
    //         return true;
    //     });
    // });
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
    }, []);

    const showImages = (event) => {
        let images = [];
        console.log(event);
        for (let i = 0; i < event.target.files.length; i++) {
            images.push(URL.createObjectURL(event.target.files[i]));
        }
        setPreviewImages(images);
    };

    function deleteHandler(image) {
        setPreviewImages(previewImages.filter((e) => e !== image));
        URL.revokeObjectURL(image);
    }

    return (
        <div>
            <Dialog maxWidth="220px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" alignItems="center" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' && component === 'user_creation' ? 'Add User Creation' : ''}
                            {mode === 'VIEW_UPDATE' && component === 'user_creation' ? 'Update User Creation' : ''}
                            {mode === 'VIEW' && component === 'user_creation' ? 'View User Creation' : ''}
                            {component === 'user_profile' ? 'My Profile' : ''}
                        </Box>
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
                                                                <Grid display="flex" gap="10px" style={{ marginTop: '20px' }}>
                                                                    {/* <Grid item sm={4}>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="status"
                                                                                disabled={mode == 'VIEW'}
                                                                                onChange={handleChange}
                                                                                value={values.status}
                                                                                control={<Switch color="success" />}
                                                                                label="Status"
                                                                                checked={values.status}
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid> */}
                                                                    {/* <Grid item sm={4}>
                                                                        <Typography variant="" component="p">
                                                                            5 Licenses Used Out Of 10
                                                                        </Typography>
                                                                    </Grid> */}
                                                                    {/* <Grid item sm={4}>
                                                                        <Typography variant="" component="p">
                                                                            5 Licenses Used Out Of 10
                                                                        </Typography>
                                                                    </Grid> */}
                                                                </Grid>
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    {/* <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled
                                                                            label="System Generated User ID"
                                                                            name="generatedCode"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.generatedCode}
                                                                            // error={Boolean(touched.code && errors.code)}
                                                                            // helperText={touched.code && errors.code ? errors.code : ''}
                                                                        ></TextField>
                                                                    </Grid> */}
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.company}
                                                                            name="company"
                                                                            onChange={(_, value) => {
                                                                                console.log(value);
                                                                                setFieldValue(`company`, value);
                                                                                loadAvalibleLicenseCount(value, setFieldValue);
                                                                            }}
                                                                            options={companyListOptions}
                                                                            getOptionLabel={(option) => `${option.companyName}`}
                                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Company"
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    variant="outlined"
                                                                                    name="company"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(touched.company && errors.company)}
                                                                                    helperText={
                                                                                        touched.company && errors.company
                                                                                            ? errors.company
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 100, md: 100 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            select
                                                                            name="title"
                                                                            label="Title"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.title}
                                                                            error={Boolean(touched.title && errors.title)}
                                                                            helperText={touched.title && errors.title ? errors.title : ''}
                                                                            // MenuProps={{
                                                                            //   PaperProps: { sx: { maxHeight: 120 } },
                                                                            // }}
                                                                        >
                                                                            <MenuItem dense={true} value={'MR.'}>
                                                                                MR.
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'MRS.'}>
                                                                                MRS.
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'MISS.'}>
                                                                                MISS.
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'MS.'}>
                                                                                MS.
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'PROF.'}>
                                                                                PROF.
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'DR.'}>
                                                                                DR.
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'VEN.'}>
                                                                                VEN.
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 150 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Available LicenceCount"
                                                                            name="availableLicenceCount"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={true}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.availableLicenceCount}
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 150 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Alocated LicenceCount"
                                                                            name="allocatedLicenceCount"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={true}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.allocatedLicenceCount}
                                                                        ></TextField>
                                                                    </Grid>
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
                                                                </Grid>
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="NIC"
                                                                            name="nic"
                                                                            disabled={
                                                                                component === 'user_creation' && mode === 'INSERT'
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.nic}
                                                                            error={Boolean(touched.nic && errors.nic)}
                                                                            helperText={touched.nic && errors.nic ? errors.nic : ''}
                                                                        />
                                                                    </Grid>
                                                                    <Grid>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Email"
                                                                            type="email"
                                                                            name="email"
                                                                            disabled={
                                                                                component === 'user_creation' && mode === 'INSERT'
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.email}
                                                                            error={Boolean(touched.email && errors.email)}
                                                                            helperText={touched.email && errors.email ? errors.email : ''}
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
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.designation}
                                                                            name="designation"
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`designation`, value);
                                                                            }}
                                                                            disabled={component === 'user_profile' ? true : false}
                                                                            options={designationListOptions}
                                                                            getOptionLabel={(option) => `${option.description}`}
                                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Designation"
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    variant="outlined"
                                                                                    name="designation"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.designation && errors.designation
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.designation && errors.designation
                                                                                            ? errors.designation
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    <Grid>
                                                                        <Autocomplete
                                                                            value={values.department}
                                                                            name="department"
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`department`, value);
                                                                            }}
                                                                            disabled={component === 'user_profile' ? true : false}
                                                                            options={departmentListOptions}
                                                                            getOptionLabel={(option) => `${option.description}`}
                                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Department"
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    variant="outlined"
                                                                                    name="department"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(touched.department && errors.department)}
                                                                                    helperText={
                                                                                        touched.department && errors.department
                                                                                            ? errors.department
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    <Grid>
                                                                        <Autocomplete
                                                                            value={values.cluster}
                                                                            name="cluster"
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`cluster`, value);
                                                                            }}
                                                                            disabled={component === 'user_profile' ? true : false}
                                                                            options={clusterListOptions}
                                                                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                                                            // isOptionEqualToValue={(
                                                                            //     option,
                                                                            //     value
                                                                            // ) => option.taxId === value.taxId}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Cluster"
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    variant="outlined"
                                                                                    name="cluster"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(touched.cluster && errors.cluster)}
                                                                                    helperText={
                                                                                        touched.cluster && errors.cluster
                                                                                            ? errors.cluster
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid>
                                                                        <Autocomplete
                                                                            value={values.market}
                                                                            multiple
                                                                            fullWidth
                                                                            name="market"
                                                                            onChange={(_, value) => {
                                                                                // console.log(value);
                                                                                // setMarketInputValue(value.code);
                                                                                setFieldValue(`market`, value);
                                                                            }}
                                                                            disabled={component === 'user_profile' ? true : false}
                                                                            options={marketListOptions}
                                                                            getOptionLabel={(option) => `${option.code} - (${option.name})`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.marketId === value.marketId
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Market"
                                                                                    sx={{
                                                                                        width: { sm: 620, md: 620 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    // placeholder="--Select a Market Code --"
                                                                                    variant="outlined"
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    name="market"
                                                                                    onBlur={handleBlur}
                                                                                    // error={Boolean(touched.market && errors.market)}
                                                                                    // helperText={
                                                                                    //     touched.market && errors.market ? errors.market : ''
                                                                                    // }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid item xs={6} sm={4}>
                                                                        <Autocomplete
                                                                            value={values.roleId}
                                                                            name="roleId"
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`roleId`, value);
                                                                            }}
                                                                            // disabled={component === 'user_profile' ? true : false}
                                                                            options={userRoleListOptions}
                                                                            getOptionLabel={(option) => `${option.name}`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.roleId === value.roleId
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Role"
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    variant="outlined"
                                                                                    name="roleId"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(touched.roleId && errors.roleId)}
                                                                                    helperText={
                                                                                        touched.roleId && errors.roleId ? errors.roleId : ''
                                                                                    }
                                                                                />
                                                                            )}
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
                                                                            label="User Name"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="userName"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.userName}
                                                                            error={Boolean(touched.userName && errors.userName)}
                                                                            helperText={
                                                                                touched.userName && errors.userName ? errors.userName : ''
                                                                            }
                                                                            disabled={
                                                                                component === 'user_creation' && mode === 'INSERT'
                                                                                    ? false
                                                                                    : true
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        display={
                                                                            component === 'user_creation' && mode === 'INSERT'
                                                                                ? 'flex'
                                                                                : 'none'
                                                                        }
                                                                    >
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Password"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="password"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.password}
                                                                            error={Boolean(touched.password && errors.password)}
                                                                            helperText={
                                                                                touched.password && errors.password ? errors.password : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid item sm={4}>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="status"
                                                                                disabled={
                                                                                    mode == 'VIEW' || component === 'user_profile'
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                                onChange={handleChange}
                                                                                value={values.status}
                                                                                control={<Switch />}
                                                                                label="Status"
                                                                                checked={values.status}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                    <Grid item sm={4}>
                                                                        <input
                                                                            type="file"
                                                                            multiple
                                                                            accept="image/*"
                                                                            name="files"
                                                                            //  onChange={this.selectFiles}
                                                                            onChange={(event) => {
                                                                                // console.log("file", event.currentTarget.files);
                                                                                showImages(event);
                                                                                handleChange;
                                                                                setFieldValue('files', event.currentTarget.files);
                                                                            }}
                                                                            error={Boolean(errors.files)}
                                                                            helperText={errors.files ? errors.files : ''}
                                                                        />
                                                                        {errors.files}
                                                                        {previewImages && (
                                                                            <div>
                                                                                {previewImages.map((img, i) => {
                                                                                    return (
                                                                                        <div
                                                                                            style={{
                                                                                                display: 'inline-block',
                                                                                                position: 'relative'
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                width="100"
                                                                                                height="100"
                                                                                                style={{
                                                                                                    marginRight: '10px',
                                                                                                    marginTop: '10px'
                                                                                                }}
                                                                                                className="preview"
                                                                                                src={img}
                                                                                                alt={'image-' + i}
                                                                                                key={i + 'ke'}
                                                                                            />
                                                                                            <IconButton
                                                                                                aria-label="add an alarm"
                                                                                                onClick={() => deleteHandler(img)}
                                                                                            >
                                                                                                <HighlightOffIcon
                                                                                                    key={i}
                                                                                                    style={{
                                                                                                        position: 'absolute',
                                                                                                        top: -100,
                                                                                                        right: 0,
                                                                                                        width: '25px',
                                                                                                        height: '25px'
                                                                                                        // marginRight: "10px",
                                                                                                    }}
                                                                                                    // src="https://png.pngtree.com/png-vector/20190603/ourmid/pngtree-icon-close-button-png-image_1357822.jpg"
                                                                                                />
                                                                                            </IconButton>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                            </div>

                                                            <Box>
                                                                <Grid item>
                                                                    {mode === 'VIEW' ? (
                                                                        <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                    ) : null}
                                                                </Grid>
                                                            </Box>
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

export default User;
