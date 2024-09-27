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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Switch,
    Autocomplete,
    Button,
    MenuItem,
    Divider
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, FieldArray } from 'formik';
import Grid from '@mui/material/Grid';

import * as yup from 'yup';

import { getActiveLocations } from 'store/actions/masterActions/LocationAction';

import PreviewIcon from '@mui/icons-material/Preview';
import { getAllActiveManagingCompanyDetails } from 'store/actions/masterActions/ManagingComapanyAction';
import AlertItemExist from 'messages/AlertItemExist';
import ManagingCompany from '../../managing_company/ManagingCompany';
import {
    getAllActiveChildrenFacilitiesData,
    getAllActiveFacilitiesOfferedData,
    getAllActiveRecreationData,
    getAllActiveServiceOfferedData
} from 'store/actions/masterActions/HotelFacilityAction';
import { getAllActiveHotelCategoryData } from 'store/actions/masterActions/HotelCategoryAction';
import {
    checkDuplicateHotelMainCode,
    getHotelMainDataById,
    saveHotelMainData,
    updateHotelMainData
} from 'store/actions/masterActions/HotelMasterAction';

function HotelMaster({ open, handleClose, mode, hotelId }) {
    const initialValues = {
        id: '',
        hotelCode: '',
        propertyCode: '',
        starClass: '',
        managingCompany: null,
        longName: '',
        address: '',
        hotelCategory: null,
        location: null,
        phone1: '',
        phone2: '',
        fax1: '',
        fax2: '',
        email: '',
        cancellationPolicy: '',
        status: true,
        reCreation: [],
        facilitiesOffered: [],
        childrenFacilities: [],
        serviceOffered: []
    };
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const [existOpenModal, setExistOpenModal] = useState(false);
    const activity_supplimentToUpdate = useSelector((state) => state.activity_supplimentReducer.activity_supplimentToUpdate);
    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const activeManagingCompanies = useSelector((state) => state.ManagingCompanyReducer.activeManagingCompanies);
    const [loadValues, setLoadValues] = useState(initialValues);
    const [currencyListArray, setCurrecyListArray] = useState([]);
    const ref = useRef(null);
    const [appearing, setAppearing] = useState(false);
    const [activeLocationList, setActiveLocationList] = useState([]);
    const [activeManagingCompanyList, setActiveManagingCompanyList] = useState([]);
    const [mainRoomId, setMainRoomId] = useState('');

    const [activeReCreationList, setActiveRecreationList] = useState([]);
    const [activeFacilityOfferedListData, setActiveFacilityOfferedListData] = useState([]);
    const [activeChildrenFacilityListData, setActiveChildrenFacilityListData] = useState([]);
    const [activeServiceOfferedListData, setActiveServiceOfferedListData] = useState([]);

    const [activeHotelCategoriesData, setActiveHotelCategoriesData] = useState([]);
    const activeRoomRecreationListData = useSelector((state) => state.hotelFacilityReducer.activeRoomRecreationList);
    const activeFacilityOfferedList = useSelector((state) => state.hotelFacilityReducer.activeFacilityOfferedList);
    const activeChildrenFacilitiesList = useSelector((state) => state.hotelFacilityReducer.activeChildrenFacilitiesList);
    const activeServiceOfferedList = useSelector((state) => state.hotelFacilityReducer.activeServiceOfferedList);
    const activeHotelCategories = useSelector((state) => state.hotelCategoryReducer.activeHotelCategories);
    const hotelMainToUpdate = useSelector((state) => state.hotelMainReducer.hotelMainToUpdate);
    const duplicatehotelMain = useSelector((state) => state.hotelMainReducer.duplicatehotelMain);

    useEffect(() => {
        dispatch(getActiveLocations());
        dispatch(getAllActiveManagingCompanyDetails());
        dispatch(getAllActiveRecreationData());
        dispatch(getAllActiveFacilitiesOfferedData());
        dispatch(getAllActiveChildrenFacilitiesData());
        dispatch(getAllActiveServiceOfferedData());
        dispatch(getAllActiveHotelCategoryData());
    }, []);

    const handleExistModalClose = (status) => {
        if (status) {
            setExistOpenModal(false);
        }
    };
    useEffect(() => {
        setActiveLocationList(activeLocations);
    }, [activeLocations]);

    // useEffect(() => {
    //     dispatch(getHotelMainDataById(hotelId));
    // }, [mode]);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getHotelMainDataById(hotelId));
        }
    }, [mode]);

    useEffect(() => {
        setActiveHotelCategoriesData(activeHotelCategories);
    }, [activeHotelCategories]);

    useEffect(() => {
        if (activeRoomRecreationListData !== null || activeRoomRecreationListData !== []) {
            setActiveRecreationList(activeRoomRecreationListData);
        }
    }, [activeRoomRecreationListData]);

    useEffect(() => {
        if (activeServiceOfferedList != null) {
            setActiveServiceOfferedListData(activeServiceOfferedList);
        }
    }, [activeServiceOfferedList]);

    useEffect(() => {
        if (activeChildrenFacilitiesList != null) {
            setActiveChildrenFacilityListData(activeChildrenFacilitiesList);
        }
    }, [activeChildrenFacilitiesList]);

    useEffect(() => {
        if (activeFacilityOfferedList != null) {
            setActiveFacilityOfferedListData(activeFacilityOfferedList);
        }
    }, [activeFacilityOfferedList]);

    useEffect(() => {
        if (activeManagingCompanies?.payload?.length > 0) {
            setActiveManagingCompanyList(activeManagingCompanies?.payload[0]);
        }
    }, [activeManagingCompanies]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && hotelMainToUpdate != null) || (mode === 'VIEW' && hotelMainToUpdate != null)) {
            setMainRoomId(hotelMainToUpdate?.id);
            const initialValues = {
                hotelCode: hotelMainToUpdate?.hotelCode,
                propertyCode: hotelMainToUpdate?.propertyCode,
                starClass: hotelMainToUpdate?.starClass,
                managingCompany: hotelMainToUpdate?.managingCompany,
                longName: hotelMainToUpdate?.longName,
                address: hotelMainToUpdate?.address,
                hotelCategory: hotelMainToUpdate?.hotelCategory,
                location: hotelMainToUpdate?.location,
                phone1: hotelMainToUpdate?.phone1,
                phone2: hotelMainToUpdate?.phone2,
                fax1: hotelMainToUpdate?.fax1,
                fax2: hotelMainToUpdate?.fax2,
                email: hotelMainToUpdate?.email,
                cancellationPolicy: hotelMainToUpdate?.cancellationPolicy,
                status: hotelMainToUpdate?.status,
                reCreation: hotelMainToUpdate?.reCreation,
                facilitiesOffered: hotelMainToUpdate?.facilitiesOffered,
                childrenFacilities: hotelMainToUpdate?.childrenFacilities,
                serviceOffered: hotelMainToUpdate?.serviceOffered
            };
            setLoadValues(initialValues);
        }
    }, [hotelMainToUpdate]);

    yup.addMethod(yup.string, 'checkDuplicateHotelCode', function (message) {
        return this.test('checkDuplicateHotelCode', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateHotelMainCode(value));

                    if (duplicatehotelMain != null && duplicatehotelMain.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                    return false;
                } catch (error) {}
            }
            return true;
        });
    });

    const validationSchema = yup.object().shape({
        // code: yup.string().required('Required field').checkDuplicateActivitySupplementCode('Duplicate Code'),
        hotelCode: yup.string().required('Required field').checkDuplicateHotelCode('Duplicate Code'),
        starClass: yup.string().required('Required field'),
        location: yup.object().typeError('Required field'),
        email: yup.string().email(),
        phone1: yup.string().matches(phoneRegExp, 'Not valid').min(10, 'Must be exactly 10 digits').max(10, 'Must be 10 digits'),
        phone2: yup.string().matches(phoneRegExp, 'Not valid').min(10, 'Must be exactly 10 digits').max(10, 'Must be 10 digits'),
        // fax1: yup.number(),
        // fax2: yup.number()
        fax1: yup.string().matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/, 'Not valid'),
        fax2: yup.string().matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/, 'Not valid')
    });

    const dispatch = useDispatch();

    const handleSubmitForm = (data) => {
        if (mode === 'INSERT') {
            dispatch(saveHotelMainData(data));
        } else if (mode === 'VIEW_UPDATE') {
            const initialValues = {
                id: mainRoomId,
                hotelCode: data.hotelCode,
                propertyCode: data.propertyCode,
                starClass: data.starClass,
                managingCompany: data.managingCompany,
                longName: data.longName,
                address: data.address,
                hotelCategory: data.hotelCategory,
                location: data.location,
                phone1: data.phone1,
                phone2: data.phone2,
                fax1: data.fax1,
                fax2: data.fax2,
                email: data.email,
                cancellationPolicy: data.cancellationPolicy,
                reCreation: data.reCreation,
                status: data.status,
                facilitiesOffered: data.facilitiesOffered,
                childrenFacilities: data.childrenFacilities,
                serviceOffered: data.serviceOffered
            };
            dispatch(updateHotelMainData(initialValues));
        }
        handleClose();
    };

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    const [managingCompanyCode, setManagingCompanyCode] = useState('');
    const viewManagingCompanyDetails = (value) => {
        // alert(value.code);
        setManagingCompanyCode(value.code);
        setExistOpenModal(true);
        // alert('managing company');
    };

    return (
        <div>
            <Dialog
                // width="100px"
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}
                            Hotel
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
                            <div>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Formik
                                            innerRef={ref}
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
                                                        <Box sx={{ width: '100%' }}>
                                                            <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Hotel Code"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        id="hotelCode"
                                                                        name="hotelCode"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.hotelCode}
                                                                        error={Boolean(touched.hotelCode && errors.hotelCode)}
                                                                        helperText={
                                                                            touched.hotelCode && errors.hotelCode ? errors.hotelCode : ''
                                                                        }
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Grid container>
                                                                        <Grid item>
                                                                            <Autocomplete
                                                                                value={values.managingCompany}
                                                                                name="managingCompany"
                                                                                onChange={(_, value) => {
                                                                                    setFieldValue(`managingCompany`, value);
                                                                                }}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                // options={
                                                                                //     activeManagingCompanyList.length > 0
                                                                                //         ? activeManagingCompanyList
                                                                                //         : []
                                                                                // }
                                                                                options={activeManagingCompanyList}
                                                                                getOptionLabel={(option) => `${option.code}-${option.name}`}
                                                                                // isOptionEqualToValue={(option, value) =>
                                                                                //     option.id === value.id
                                                                                // }
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        label="Managing Company"
                                                                                        InputLabelProps={{
                                                                                            shrink: true
                                                                                        }}
                                                                                        sx={{
                                                                                            width: {
                                                                                                sm: 230
                                                                                            },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                        variant="outlined"
                                                                                        name="managingCompany"
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </Grid>

                                                                        <Grid item>
                                                                            {/* <PreviewIcon onClick={viewManagingCompanyDetails} /> */}
                                                                            <PreviewIcon
                                                                                onClick={() =>
                                                                                    viewManagingCompanyDetails(values.managingCompany)
                                                                                }
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={percentage}
                                                                        label="Property Code"
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        id="propertyCode"
                                                                        name="propertyCode"
                                                                        type="text"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.propertyCode}
                                                                        // error={Boolean(touched.propertyCode && errors.propertyCode)}
                                                                        // helperText={
                                                                        //     touched.propertyCode && errors.propertyCode ? errors.propertyCode : ''
                                                                        // }
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW'}
                                                                        id="standard-select-currency"
                                                                        select
                                                                        label="Star Class"
                                                                        name="starClass"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        // defaultValue={values.groupType}
                                                                        value={values.starClass}
                                                                        error={Boolean(touched.starClass && errors.starClass)}
                                                                        helperText={
                                                                            touched.starClass && errors.starClass ? errors.starClass : ''
                                                                        }
                                                                    >
                                                                        <MenuItem dense={true} value={'3'}>
                                                                            3 Star
                                                                        </MenuItem>
                                                                        <MenuItem dense={true} value={'4'}>
                                                                            4 Star
                                                                        </MenuItem>
                                                                        <MenuItem dense={true} value={'5'}>
                                                                            5 Star
                                                                        </MenuItem>
                                                                        <MenuItem dense={true} value={'6'}>
                                                                            6 Star
                                                                        </MenuItem>
                                                                        <MenuItem dense={true} value={'7'}>
                                                                            7 Star
                                                                        </MenuItem>
                                                                    </TextField>
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Long Name"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="longName"
                                                                        name="longName"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.longName}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Address"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="address"
                                                                        name="address"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.address}
                                                                        // error={Boolean(touched.address && errors.address)}
                                                                        // helperText={touched.address && errors.address ? errors.address : ''}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Autocomplete
                                                                        value={values.location}
                                                                        name="location"
                                                                        onChange={(_, value) => {
                                                                            setFieldValue(`location`, value);
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        options={activeLocationList}
                                                                        getOptionLabel={(option) => `${option.code}`}
                                                                        // isOptionEqualToValue={(option, value) =>
                                                                        //     option.location_id === value.location_id
                                                                        // }
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Location "
                                                                                InputLabelProps={{
                                                                                    shrink: true
                                                                                }}
                                                                                sx={{
                                                                                    width: {
                                                                                        sm: 250
                                                                                    },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                variant="outlined"
                                                                                name="location"
                                                                                onBlur={handleBlur}
                                                                                error={Boolean(touched.location && errors.location)}
                                                                                helperText={
                                                                                    touched.location && errors.location
                                                                                        ? errors.location
                                                                                        : ''
                                                                                }
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <Autocomplete
                                                                        value={values.hotelCategory}
                                                                        name="hotelCategory"
                                                                        onChange={(_, value) => {
                                                                            setFieldValue(`hotelCategory`, value);
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        options={activeHotelCategoriesData}
                                                                        getOptionLabel={(option) => `${option.code}-${option.name}`}
                                                                        // isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Hotel Category "
                                                                                InputLabelProps={{
                                                                                    shrink: true
                                                                                }}
                                                                                sx={{
                                                                                    width: {
                                                                                        sm: 250
                                                                                    },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                variant="outlined"
                                                                                name="hotelCategory"
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Hotel Phone 1"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="phone1"
                                                                        name="phone1"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.phone1}
                                                                        error={Boolean(touched.phone1 && errors.phone1)}
                                                                        helperText={touched.phone1 && errors.phone1 ? errors.phone1 : ''}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Hotel Phone 2"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="phone2"
                                                                        name="phone2"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.phone2}
                                                                        error={Boolean(touched.phone2 && errors.phone2)}
                                                                        helperText={touched.phone2 && errors.phone2 ? errors.phone2 : ''}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Hotel Fax 1"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="fax1"
                                                                        name="fax1"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.fax1}
                                                                        error={Boolean(touched.fax1 && errors.fax1)}
                                                                        helperText={touched.fax1 && errors.fax1 ? errors.fax1 : ''}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Hotel Fax 2"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="fax2"
                                                                        name="fax2"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.fax2}
                                                                        error={Boolean(touched.fax2 && errors.fax2)}
                                                                        helperText={touched.fax2 && errors.fax2 ? errors.fax2 : ''}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        label="Email"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="email"
                                                                        name="email"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.email}
                                                                        error={Boolean(touched.email && errors.email)}
                                                                        helperText={touched.email && errors.email ? errors.email : ''}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Website"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="website"
                                                                        name="website"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.website}
                                                                        // error={Boolean(touched.website && errors.website)}
                                                                        // helperText={touched.website && errors.website ? errors.website : ''}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12}>
                                                                    <TextField
                                                                        disabled={mode == 'VIEW'}
                                                                        // label={taxCode}
                                                                        label="Cancellation Policy"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        sx={{
                                                                            width: { xs: 150, sm: 520 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        // className="txt"
                                                                        id="cancellationPolicy"
                                                                        name="cancellationPolicy"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.cancellationPolicy}
                                                                    />
                                                                </Grid>

                                                                {/* <Divider variant="middle" /> */}

                                                                <Grid item xs={12}>
                                                                    <Autocomplete
                                                                        value={values.reCreation}
                                                                        name="reCreation"
                                                                        onChange={(_, value) => {
                                                                            setFieldValue(`reCreation`, value);
                                                                        }}
                                                                        multiple
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        options={activeReCreationList}
                                                                        getOptionLabel={(option) => `${option.code}-${option.name}`}
                                                                        // isOptionEqualToValue={(option, value) =>
                                                                        //     option.hotelFacilityId === value.hotelFacilityId
                                                                        // }
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Recreation"
                                                                                InputLabelProps={{
                                                                                    shrink: true
                                                                                }}
                                                                                sx={{
                                                                                    width: {
                                                                                        sm: 520
                                                                                    },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                variant="outlined"
                                                                                name="reCreation"
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12}>
                                                                    <Autocomplete
                                                                        value={values.facilitiesOffered}
                                                                        name="facilitiesOffered"
                                                                        onChange={(_, value) => {
                                                                            setFieldValue(`facilitiesOffered`, value);
                                                                        }}
                                                                        multiple
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        options={activeFacilityOfferedListData}
                                                                        getOptionLabel={(option) => `${option.code}-${option.name}`}
                                                                        // isOptionEqualToValue={(option, value) =>
                                                                        //     option.hotelFacilityId === value.hotelFacilityId
                                                                        // }
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Facilities Offered"
                                                                                InputLabelProps={{
                                                                                    shrink: true
                                                                                }}
                                                                                sx={{
                                                                                    width: {
                                                                                        sm: 520
                                                                                    },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                variant="outlined"
                                                                                name="facilitiesOffered"
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Autocomplete
                                                                        value={values.childrenFacilities}
                                                                        name="childrenFacilities"
                                                                        onChange={(_, value) => {
                                                                            setFieldValue(`childrenFacilities`, value);
                                                                        }}
                                                                        multiple
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        options={activeChildrenFacilityListData}
                                                                        getOptionLabel={(option) => `${option.code}-${option.name}`}
                                                                        // isOptionEqualToValue={(option, value) =>
                                                                        //     option.hotelFacilityId === value.hotelFacilityId
                                                                        // }
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Children's Facilities"
                                                                                InputLabelProps={{
                                                                                    shrink: true
                                                                                }}
                                                                                sx={{
                                                                                    width: {
                                                                                        sm: 520
                                                                                    },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                variant="outlined"
                                                                                name="childrenFacilities"
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Autocomplete
                                                                        value={values.serviceOffered}
                                                                        name="serviceOffered"
                                                                        onChange={(_, value) => {
                                                                            setFieldValue(`serviceOffered`, value);
                                                                        }}
                                                                        multiple
                                                                        fullWidth
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        options={activeServiceOfferedListData}
                                                                        getOptionLabel={(option) => `${option.code}-${option.name}`}
                                                                        // isOptionEqualToValue={(option, value) =>
                                                                        //     option.hotelFacilityId === value.hotelFacilityId
                                                                        // }
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Service Offered"
                                                                                InputLabelProps={{
                                                                                    shrink: true
                                                                                }}
                                                                                sx={{
                                                                                    width: {
                                                                                        sm: 520
                                                                                    },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                variant="outlined"
                                                                                name="serviceOffered"
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <FormGroup>
                                                                        <FormControlLabel
                                                                            name="status"
                                                                            control={<Switch color="success" />}
                                                                            label="Status"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            checked={values.status}
                                                                            value={values.status}
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>

                                                        <br />
                                                        {/* <Box>
                                                            <Grid item>
                                                                {mode === 'VIEW' ? (
                                                                    <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                ) : null}
                                                            </Grid>
                                                        </Box> */}
                                                        <Grid item>
                                                            {existOpenModal ? (
                                                                <ManagingCompany
                                                                    title="dev"
                                                                    open={existOpenModal}
                                                                    handleClose={handleExistModalClose}
                                                                    code={managingCompanyCode}
                                                                    mode="VIEW"
                                                                />
                                                            ) : null}
                                                        </Grid>
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
                                                                    Cancel
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

export default HotelMaster;
