import { useEffect, forwardRef, useState } from 'react';

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
    Grid,
    Switch
} from '@mui/material';
import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@material-ui/core/Checkbox';
import { green } from '@material-ui/core/colors';
import { common } from '@material-ui/core/colors';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import 'assets/scss/style.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    getAllActiveTransportMainCategoryDataByType,
    getAllActiveVehicleCategoryDataByType,
    getAllActiveVehicleTypeDataByType
} from 'store/actions/masterActions/transportActions/MainTransportCategoriesActions';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import { getCalculatedDistanceAndDuration } from 'store/actions/masterActions/DistanceAction';
import '../../../assets/scss/style.scss';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    content: {
        justifyContent: 'center'
    },
    saveButton: {
        margin: '0px 10px',
        height: '40px',
        width: '70px',
        display: 'inline-flex',
        textTransform: 'capitalize',
        color: 'white',
        borderRadius: '10%',
        backgroundColor: '#1877f2',
        background: '-moz-linear-gradient(top, #3b5998, #1877f2)',
        background: '-ms-linear-gradient(top, #3b5998, #1877f2)',
        background: '-webkit-linear-gradient(top, #3b5998, #1877f2)'
    },
    clearButton: {
        margin: '0px 10px',
        height: '40px',
        width: '70px',
        display: 'inline-flex',
        textTransform: 'capitalize',
        color: '#1877f2',
        borderColor: '#1877f2',
        borderRadius: '10%',
        backgroundColor: 'white'
    }
}));
function ProgramTransport({ open, handleClose, mode, onSave, formIndex, editData }) {
    const initialValues = {
        paxBaggage: '',
        transportType: null,
        chargeMethod: '',
        vehicleType: null,
        vehicleCategory: null,
        location1: null,
        location2: null,
        location3: null,
        location4: null,
        location5: null,
        location6: null,
        location7: null,
        location8: null,
        location9: null,
        location10: null,
        distance: null,
        duration: null
    };
    const loadValues = {
        paxBaggage: editData.paxBaggage,
        transportType: editData.transportType,
        chargeMethod: editData.chargeMethod,
        vehicleType: editData.vehicleType,
        vehicleCategory: editData.vehicleCategory,
        location1: editData.location1,
        location2: editData.location2,
        location3: editData.location3,
        location4: editData.location4,
        location5: editData.location5,
        location6: editData.location6,
        location7: editData.location7,
        location8: editData.location8,
        location9: editData.location9,
        location10: editData.location10,
        distance: null,
        duration: null
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [activeTransportTypeList, setActiveTransportTypeList] = useState([]);
    const [activeVehicleTypeList, setActiveVehicleTypeList] = useState([]);
    const [activeVehicleCategoryList, setActiveVehicleCategoryList] = useState([]);
    const [activeLocationList, setActiveLocationList] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [transportType, setTransportType] = useState({});
    const [location1, setLocation1] = useState({});
    const [location2, setLocation2] = useState({});
    const [location3, setLocation3] = useState({});
    const [location4, setLocation4] = useState({});
    const [location5, setLocation5] = useState({});
    const [location6, setLocation6] = useState({});
    const [location7, setLocation7] = useState({});
    const [location8, setLocation8] = useState({});
    const [location9, setLocation9] = useState({});
    const [location10, setLocation10] = useState({});
    const [locationIds, setLocationIds] = useState([]);
    const [locationCodes, setLocationCodes] = useState([]);
    const [calculateStatus, setCalculateStatus] = useState(false);
    const [distance, setDistance] = useState();
    const [duration, setDuration] = useState();
    const dispatch = useDispatch();
    const classes = useStyles();

    //data from reducers
    const activeTransportTypeListData = useSelector((state) => state.mainTransportCategoryReducer.activeCategoryDetails);
    const activeVehicleTypeListData = useSelector((state) => state.mainTransportCategoryReducer.vehicleTypes);
    const activeVehicleCategoriesListData = useSelector((state) => state.mainTransportCategoryReducer.vehicleCategories);
    const activeLocationListData = useSelector((state) => state.locationReducer.activeLocations);
    const calculatedDistance = useSelector((state) => state.distanceReducer.calculatedDistance);
    const calculatedDuration = useSelector((state) => state.distanceReducer.calculatedDuration);

    //passing values to ProgramCreationDetails

    const validationSchema = yup.object().shape({
        paxBaggage: yup.string().nullable().required('Required field'),
        transportType: yup.object().nullable().required('Required field'),
        chargeMethod: yup.string().nullable().required('Required field'),
        vehicleType: yup.object().nullable().required('Required field'),
        vehicleCategory: yup.object().nullable().required('Required field'),
        location1: yup.object().nullable().required('Required field'),
        location2: yup.object().nullable().required('Required field'),
        location3: yup
            .object()
            .nullable()
            .when('location4', {
                is: (value) => !!value,
                then: yup.object().nullable().required('Required field')
            }),
        location4: yup
            .object()
            .nullable()
            .when('location5', {
                is: (value) => !!value,
                then: yup.object().nullable().required('Required field')
            }),
        location5: yup
            .object()
            .nullable()
            .when('location6', {
                is: (value) => !!value,
                then: yup.object().nullable().required('Required field')
            }),
        location6: yup
            .object()
            .nullable()
            .when('location7', {
                is: (value) => !!value,
                then: yup.object().nullable().required('Required field')
            }),
        location7: yup
            .object()
            .nullable()
            .when('location8', {
                is: (value) => !!value,
                then: yup.object().nullable().required('Required field')
            }),
        location8: yup
            .object()
            .nullable()
            .when('location9', {
                is: (value) => !!value,
                then: yup.object().nullable().required('Required field')
            }),
        location9: yup
            .object()
            .nullable()
            .when('location10', {
                is: (value) => !!value,
                then: yup.object().nullable().required('Required field')
            })
    });

    const handleSubmitForm = (data) => {
        onSave(data, formIndex);
        handleClose();
    };

    const handleCalculate = (values, setFieldError, setFieldTouched, errors, touched) => {
        const fields = [
            { fieldName: 'transportType', errorMessage: 'Required Field' },
            { fieldName: 'chargeMethod', errorMessage: 'Required Field' },
            { fieldName: 'location1', errorMessage: 'Required Field' },
            { fieldName: 'location2', errorMessage: 'Required Field' },
            { fieldName: 'location3', errorMessage: 'Required Field' },
            { fieldName: 'location4', errorMessage: 'Required Field' },
            { fieldName: 'location5', errorMessage: 'Required Field' },
            { fieldName: 'location6', errorMessage: 'Required Field' },
            { fieldName: 'location7', errorMessage: 'Required Field' },
            { fieldName: 'location8', errorMessage: 'Required Field' },
            { fieldName: 'location9', errorMessage: 'Required Field' },
            { fieldName: 'location10', errorMessage: 'Required Field' }
        ];

        const mandatoryFields = [
            { fieldName: 'transportType', errorMessage: 'Required Field' },
            { fieldName: 'chargeMethod', errorMessage: 'Required Field' },
            { fieldName: 'location1', errorMessage: 'Required Field' },
            { fieldName: 'location2', errorMessage: 'Required Field' }
        ];

        let hasError = false;

        fields.forEach((field) => {
            if (errors[field.fieldName]) {
                setFieldError(field.fieldName, field.errorMessage);
                hasError = true;
            }
        });

        mandatoryFields.forEach((mandatoryField) => {
            if (!values[mandatoryField.fieldName]) {
                setFieldError(mandatoryField.fieldName, mandatoryField.errorMessage);
                setFieldTouched(mandatoryField.fieldName, true);
                hasError = true;
            }
        });

        // if (!values.transportType || !values.transportType.categoryId) {
        //     setFieldError('transportType', 'Required Field');
        //     setFieldTouched('transportType', true);
        //     console.log(values.transportType);
        // }

        if (!hasError && touched.transportType && touched.chargeMethod && touched.location1 && touched.location2) {
            const filteredIds = locationIds.filter((id) => id !== '' && id !== undefined);
            const transportTypeId = transportType.categoryId;
            console.log(filteredIds);
            setCalculateStatus(true);
            dispatch(getCalculatedDistanceAndDuration(transportTypeId, filteredIds));
        }
    };

    const handleTranportType = (value) => {
        setTransportType(value);
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedItems((prevCheckedItems) => ({ ...prevCheckedItems, [name]: checked }));
    };

    const handleLocation1 = (value) => {
        setLocation1(value);
    };

    const handleLocation2 = (value) => {
        setLocation2(value);
    };

    const handleLocation3 = (value) => {
        setLocation3(value);
    };

    const handleLocation4 = (value) => {
        setLocation4(value);
    };

    const handleLocation5 = (value) => {
        setLocation5(value);
    };

    const handleLocation6 = (value) => {
        setLocation6(value);
    };

    const handleLocation7 = (value) => {
        setLocation7(value);
    };

    const handleLocation8 = (value) => {
        setLocation8(value);
    };

    const handleLocation9 = (value) => {
        setLocation9(value);
    };

    const handleLocation10 = (value) => {
        setLocation10(value);
    };

    useEffect(() => {
        const newIds = [location1, location2, location3, location4, location5, location6, location7, location8, location9, location10].map(
            (location) => (location === null || location === undefined ? '' : location.location_id)
        );
        const newCodes = [
            location1,
            location2,
            location3,
            location4,
            location5,
            location6,
            location7,
            location8,
            location9,
            location10
        ].map((location) => (location === null || location === undefined ? '' : location.code));
        setLocationIds(newIds);
        setLocationCodes(newCodes);
        setCalculateStatus(false);
    }, [location1, location2, location3, location4, location5, location6, location7, location8, location9, location10]);

    // useEffect(() => {
    //     const filteredIds = locationIds.filter((id) => id !== '' && id !== undefined);
    //     const transportTypeId = transportType.categoryId;
    //     console.log(filteredIds);
    //     dispatch(getCalculatedDistanceAndDuration(transportTypeId, filteredIds));
    // }, [locationIds, transportType]);

    // useEffect(() => {
    //     console.log(location1.shortDescription);
    //     console.log(location2.shortDescription);
    //     console.log(location3.shortDescription);
    //     console.log(location4.shortDescription);
    //     console.log(location5.shortDescription);
    //     console.log(location6.shortDescription);
    //     console.log(location7.shortDescription);
    //     console.log(location8.shortDescription);
    //     console.log(location9.shortDescription);
    //     console.log(location10.shortDescription);
    // }, [location1, location2, location3, location4, location5, location6, location7, location8, location9, location10]);

    useEffect(() => {
        if (activeTransportTypeListData.length != 0) {
            setActiveTransportTypeList(activeTransportTypeListData);
        }
    }, [activeTransportTypeListData]);

    useEffect(() => {
        if (activeVehicleTypeListData.length != 0) {
            setActiveVehicleTypeList(activeVehicleTypeListData);
        }
    }, [activeVehicleTypeListData]);

    useEffect(() => {
        if (activeVehicleCategoriesListData.length != 0) {
            setActiveVehicleCategoryList(activeVehicleCategoriesListData);
        }
    }, [activeVehicleCategoriesListData]);

    useEffect(() => {
        if (activeLocationListData.length != 0) {
            setActiveLocationList(activeLocationListData);
        }
    }, [activeLocationListData]);

    useEffect(() => {
        if (calculatedDistance != null) {
            setDistance(calculatedDistance);
        }
    }, [calculatedDistance]);

    useEffect(() => {
        if (calculatedDuration != null) {
            setDuration(calculatedDuration);
        }
    }, [calculatedDuration]);

    useEffect(() => {
        console.log(editData);
        dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
        dispatch(getAllActiveVehicleTypeDataByType('Vehicle Type'));
        dispatch(getAllActiveVehicleCategoryDataByType('Vehicle Category'));
        dispatch(getActiveLocations());
    }, []);

    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15, maxWidth: '120%', height: '80%' }
                }}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'UPDATE' ? 'Update' : ''} Transport
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={mode === 'UPDATE' ? loadValues : initialValues}
                            onSubmit={(values) => {
                                const filteredArrList = locationCodes.filter((item) => item !== '' && item !== undefined && item !== null);
                                const combinedLocations = filteredArrList.join('/ ');
                                values.locations = combinedLocations;
                                values.popUpType = 'Transport';
                                values.formIndex = formIndex;
                                handleSubmitForm(values);
                            }}
                            validationSchema={validationSchema}
                        >
                            {({
                                values,
                                handleChange,
                                setFieldValue,
                                setFieldError,
                                setFieldTouched,
                                errors,
                                handleBlur,
                                touched,
                                resetForm
                            }) => {
                                return (
                                    <Form>
                                        <div style={{ marginTop: '6px', margin: '10px' }}>
                                            <Grid gap="30px" display="flex">
                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.paxBaggage}
                                                        name="paxBaggage"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`paxBaggage`, value);
                                                            handlePaxBaggage(value);
                                                            console.log(value);
                                                        }}
                                                        fullWidth
                                                        options={['Pax', 'Baggage']}
                                                        disableClearable={true}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Pax/Baggage"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                fullWidth
                                                                sx={{
                                                                    width: { sm: 75, md: 180 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                variant="outlined"
                                                                name="paxBaggage"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.paxBaggage && errors.paxBaggage)}
                                                                helperText={
                                                                    touched.paxBaggage && errors.paxBaggage ? errors.paxBaggage : ''
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.transportType}
                                                        name="transportType"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`transportType`, value);
                                                            handleTranportType(value);
                                                            console.log(value);
                                                        }}
                                                        fullWidth
                                                        options={activeTransportTypeList}
                                                        getOptionLabel={(option) => `${option.description}`}
                                                        isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                                                        disableClearable={true}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Transport Type"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                fullWidth
                                                                sx={{
                                                                    width: { sm: 75, md: 180 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                // disabled={mode == 'VIEW'}
                                                                variant="outlined"
                                                                name="transportType"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.transportType && errors.transportType)}
                                                                helperText={
                                                                    touched.transportType && errors.transportType
                                                                        ? errors.transportType
                                                                        : ''
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.chargeMethod}
                                                        name="chargeMethod"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`chargeMethod`, value);
                                                            console.log(value);
                                                        }}
                                                        fullWidth
                                                        options={['Distance', 'Duration']}
                                                        disableClearable={true}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Charge Method"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                fullWidth
                                                                sx={{
                                                                    width: { sm: 75, md: 180 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                variant="outlined"
                                                                name="chargeMethod"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.chargeMethod && errors.chargeMethod)}
                                                                helperText={
                                                                    touched.chargeMethod && errors.chargeMethod ? errors.chargeMethod : ''
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.vehicleType}
                                                        name="vehicleType"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`vehicleType`, value);
                                                            handleVehicleType(value);
                                                        }}
                                                        fullWidth
                                                        options={activeVehicleTypeList}
                                                        getOptionLabel={(option) => `${option.description}`}
                                                        isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                                                        disableClearable={true}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Vehicle Type"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                fullWidth
                                                                sx={{
                                                                    width: { sm: 75, md: 180 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                // disabled={mode == 'VIEW'}
                                                                variant="outlined"
                                                                name="vehicleType"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.vehicleType && errors.vehicleType)}
                                                                helperText={
                                                                    touched.vehicleType && errors.vehicleType ? errors.vehicleType : ''
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.vehicleCategory}
                                                        name="vehicleCategory"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`vehicleCategory`, value);
                                                            handleVehicleCategory(value);
                                                        }}
                                                        fullWidth
                                                        options={activeVehicleCategoryList}
                                                        getOptionLabel={(option) => `${option.description}`}
                                                        isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                                                        disableClearable={true}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Vehicle Category"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                fullWidth
                                                                sx={{
                                                                    width: { sm: 75, md: 180 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                // disabled={mode == 'VIEW'}
                                                                variant="outlined"
                                                                name="vehicleCategory"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.vehicleCategory && errors.vehicleCategory)}
                                                                helperText={
                                                                    touched.vehicleCategory && errors.vehicleCategory
                                                                        ? errors.vehicleCategory
                                                                        : ''
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid gap="5px" display="flex" style={{ marginTop: '50px' }}>
                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.location1}
                                                        name="location1"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location1`, value);
                                                            handleLocation1(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        disableClearable={true}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 01"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location1 && errors.location1)}
                                                                helperText={touched.location1 && errors.location1 ? errors.location1 : ''}
                                                                variant="outlined"
                                                                name="location1"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox1 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox1"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location2}
                                                        name="location2"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location2`, value);
                                                            handleLocation2(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location1 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        disableClearable={true}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 02"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                // InputProps={{
                                                                //     readOnly: location2Check
                                                                // }}
                                                                error={Boolean(touched.location2 && errors.location2)}
                                                                helperText={touched.location2 && errors.location2 ? errors.location2 : ''}
                                                                variant="outlined"
                                                                name="location2"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox2 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox2"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location3}
                                                        name="location3"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location3`, value);
                                                            handleLocation3(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location2 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 03"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location3 && errors.location3)}
                                                                helperText={touched.location3 && errors.location3 ? errors.location3 : ''}
                                                                variant="outlined"
                                                                name="location3"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox3 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox3"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location4}
                                                        name="location4"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location4`, value);
                                                            handleLocation4(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location3 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code} - ${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 04"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location4 && errors.location4)}
                                                                helperText={touched.location4 && errors.location4 ? errors.location4 : ''}
                                                                variant="outlined"
                                                                name="location4"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox4 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox4"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location5}
                                                        name="location5"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location5`, value);
                                                            handleLocation5(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location4 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 05"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location5 && errors.location5)}
                                                                helperText={touched.location5 && errors.location5 ? errors.location5 : ''}
                                                                variant="outlined"
                                                                name="location5"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox5 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox5"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid gap="5px" display="flex" style={{ marginTop: '50px' }}>
                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.location6}
                                                        name="location6"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location6`, value);
                                                            handleLocation6(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location5 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 06"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location6 && errors.location6)}
                                                                helperText={touched.location6 && errors.location6 ? errors.location6 : ''}
                                                                variant="outlined"
                                                                name="location6"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox6 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox6"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location7}
                                                        name="location7"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location7`, value);
                                                            handleLocation7(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location6 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 07"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location7 && errors.location7)}
                                                                helperText={touched.location7 && errors.location7 ? errors.location7 : ''}
                                                                variant="outlined"
                                                                name="location7"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox7 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox7"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location8}
                                                        name="location8"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location8`, value);
                                                            handleLocation8(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location7 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 08"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location8 && errors.location8)}
                                                                helperText={touched.location8 && errors.location8 ? errors.location8 : ''}
                                                                variant="outlined"
                                                                name="location8"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox8 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox8"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location9}
                                                        name="location9"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location9`, value);
                                                            handleLocation9(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location8 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code} - ${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 09"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location9 && errors.location9)}
                                                                helperText={touched.location9 && errors.location9 ? errors.location9 : ''}
                                                                variant="outlined"
                                                                name="location9"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox9 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox9"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginLeft: '8px' }}>
                                                    <Autocomplete
                                                        value={values.location10}
                                                        name="location10"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`location10`, value);
                                                            handleLocation10(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={!values.location9 ? [] : activeLocationList}
                                                        getOptionLabel={(option) => `${option.code}-${option.shortDescription}`}
                                                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Location 10"
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    width: { sm: 75, md: 150 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.location10 && errors.location10)}
                                                                helperText={
                                                                    touched.location10 && errors.location10 ? errors.location10 : ''
                                                                }
                                                                variant="outlined"
                                                                name="location10"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Checkbox
                                                        checked={checkedItems.checkbox10 || false} // set to true for a checked checkbox
                                                        icon={<CheckBoxOutlineBlankIcon style={{ color: common.black }} />} // customize the icon with the desired color
                                                        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />} // customize the checked icon with the desired color
                                                        onChange={handleCheckboxChange}
                                                        name="checkbox10"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid display="flex" style={{ marginTop: '50px' }}>
                                                {/* <Grid item>
                                                    <Button
                                                        className={classes.saveButton}
                                                        style={{ width: '90px', left: '20px' }}
                                                        variant="contained"
                                                        type="button"
                                                        onClick={() =>
                                                            handleCalculate(values, setFieldError, setFieldTouched, errors, touched)
                                                        }
                                                    >
                                                        Calculate
                                                    </Button>
                                                </Grid> */}
                                                <Grid item>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            name="calculateStatus"
                                                            value={calculateStatus}
                                                            control={<Switch color="success" />}
                                                            label="Calculate"
                                                            labelPlacement="start"
                                                            checked={calculateStatus}
                                                            onChange={(event) => {
                                                                if (event.target.checked) {
                                                                    handleCalculate(
                                                                        values,
                                                                        setFieldError,
                                                                        setFieldTouched,
                                                                        errors,
                                                                        touched
                                                                    );
                                                                }
                                                                handleChange(event);
                                                            }}
                                                            // disabled={mode == 'VIEW'}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="Distance (km)"
                                                        sx={{
                                                            alignItems: 'center',
                                                            left: '100px',
                                                            width: { sm: 75, md: 150 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        InputProps={{
                                                            readOnly: true
                                                        }}
                                                        variant="outlined"
                                                        name="distance"
                                                        value={values.chargeMethod === 'Distance' ? distance : ''}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                <Grid>
                                                    <TextField
                                                        label="Duration (hr)"
                                                        sx={{
                                                            alignItems: 'center',
                                                            left: '160px',
                                                            width: { sm: 75, md: 150 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        InputProps={{
                                                            readOnly: true
                                                        }}
                                                        variant="outlined"
                                                        name="duration"
                                                        value={values.chargeMethod === 'Duration' ? duration : ''}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '60px' }}>
                                            <Button
                                                className={classes.clearButton}
                                                variant="outlined"
                                                type="button"
                                                style={{
                                                    // backgroundColor: '#B22222',
                                                    marginLeft: '10px'
                                                }}
                                                onClick={(e) => resetForm()}
                                            >
                                                CLEAR
                                            </Button>

                                            <Button className={classes.saveButton} variant="contained" type="submit">
                                                {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                            </Button>
                                        </Box>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProgramTransport;
