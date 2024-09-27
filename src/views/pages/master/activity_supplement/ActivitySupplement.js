import { useEffect, forwardRef, useState, Fragment, useRef } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
    MenuItem
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, FieldArray } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';
import { gridSpacing } from 'store/constant';
import { getAllTaxData, getTaxDataById, getTaxDataByUniqueId } from 'store/actions/masterActions/TaxActions/TaxAction';
import {
    checkDuplicateExpenseRateCode,
    getAllCurrencyListData,
    getExpenseTypesById,
    saveExpenseTypesData,
    updateExpenseTypesData
} from 'store/actions/masterActions/ExpenseTypeAction';

import { getGuideClassDetailsByCode, saveGuideClassData, updateGuideClassData } from 'store/actions/masterActions/GuideClassAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import {
    checkDuplicateActivity_SupplimentsCode,
    getActivity_SupplimentDetailsByCode,
    saveActivity_SupplimentData,
    updateActivity_SupplimentData
} from 'store/actions/masterActions/Activity_SupplimentAction';
import { getActivity_SupplimentDetailsByCodeSaga } from 'store/saga/mastersaga/Activity_SupplimentSage';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ActivitySupplement({ open, handleClose, mode, activitySupplimentId }) {
    const initialValues = {
        id: '',
        type: '',
        typeOfActivity: '',
        code: '',
        locationCode: null,
        activityDescription: '',
        advanceType: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        website: '',
        fax: '',
        maxPax: '',
        status: true,
        advanceType: true,
        files: '',
        youtubeLinks: [
            {
                id: '',
                url: '',
                status: true,
                enableYoutubeRow: false
            }
        ],

        activityWithTaxes: [
            {
                fromDate: '',
                toDate: '',
                currencyList: null,
                tax: null,
                perPaxBuyRate: '',
                rateWithoutTax: '',
                rateWithTax: '',
                status: true,
                enableRow: false
            }
        ]
    };
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const [existOpenModal, setExistOpenModal] = useState(false);
    const activity_supplimentToUpdate = useSelector((state) => state.activity_supplimentReducer.activity_supplimentToUpdate);
    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const [loadValues, setLoadValues] = useState(initialValues);
    const [currencyListArray, setCurrecyListArray] = useState([]);
    const ref = useRef(null);
    const [appearing, setAppearing] = useState(false);
    const [activeLocationList, setActiveLocationList] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // const handleChangeStatus = (event) => {
    //     console.log(event.target.checked);
    //     // this.setState({ checked: event.target.checked });
    // };
    const handleExistModalClose = (status) => {
        if (status) {
            setExistOpenModal(false);
        }
    };
    useEffect(() => {
        setActiveLocationList(activeLocations);
    }, [activeLocations]);

    useEffect(() => {
        if (activity_supplimentToUpdate != null) {
            const dataArray = [];
            const dataArrayYoutube = [];
            if (
                (mode === 'VIEW_UPDATE' && activity_supplimentToUpdate != null) ||
                (mode === 'VIEW' && activity_supplimentToUpdate != null)
            ) {
                console.log(activity_supplimentToUpdate);

                activity_supplimentToUpdate.activityWithTaxes.map((item) => {
                    const activityWithTaxes = {
                        enableRow: true,
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        currencyList: item.currencyList,
                        tax: item.tax,
                        perDayRate: item.perPaxBuyRate == null ? 0.0 : item.perPaxBuyRate,
                        status: item.status
                    };

                    dataArray.push(activityWithTaxes);
                });

                activity_supplimentToUpdate.youtubeLinks.map((itemYoutube) => {
                    const youtubeLinks = {
                        url: itemYoutube.url,
                        status: itemYoutube.status
                    };
                    dataArrayYoutube.push(youtubeLinks);
                });

                const saveValues = {
                    id: activity_supplimentToUpdate.id,
                    type: activity_supplimentToUpdate.type,
                    typeOfActivity: activity_supplimentToUpdate.typeOfActivity,
                    code: activity_supplimentToUpdate.code,
                    locationCode: activity_supplimentToUpdate.locationCode,
                    activityDescription: activity_supplimentToUpdate.activityDescription,
                    advanceType: activity_supplimentToUpdate.advanceType,
                    contactPerson: activity_supplimentToUpdate.contactPerson,
                    phone: activity_supplimentToUpdate.phone,
                    email: activity_supplimentToUpdate.email,
                    address: activity_supplimentToUpdate.address,
                    website: activity_supplimentToUpdate.website,
                    fax: activity_supplimentToUpdate.fax,
                    maxPax: activity_supplimentToUpdate.maxPax,
                    status: activity_supplimentToUpdate.status,
                    advanceType: activity_supplimentToUpdate.advanceType,
                    docPath: activity_supplimentToUpdate.docPath,
                    youtubeLinks: dataArrayYoutube,
                    activityWithTaxes: dataArray
                };

                let images = [];
                let files = [];
                const contentType = 'image/png';
                console.log(saveValues);
                for (let i in saveValues.docPath) {
                    let byteCharacters = '';
                    byteCharacters = atob(saveValues.docPath[i]);
                    let byteNumbers = '';
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    let byteArray = '';
                    byteArray = new Uint8Array(byteNumbers);
                    let blob1 = '';
                    blob1 = new Blob([byteArray], { type: contentType });
                    images.push(URL.createObjectURL(blob1));
                    let fileData = new File([blob1], 'name');
                    files.push(fileData);
                }
                saveValues.files = files;
                console.log(images);
                setPreviewImages(images);

                setLoadValues(saveValues);
                setCategoryType(activity_supplimentToUpdate.type);
                // activity_supplimentToUpdate.type == 'Supplement' ? setCategoryType('Supplement') : setCategoryType('Activity');
                activity_supplimentToUpdate.type == 'Supplement' ? setTypeOfActivity(false) : setTypeOfActivity(true);
                // activity_supplimentToUpdate.typeOfActivity == 'Supplement' ? setCategoryType('Supplement') : setCategoryType('Activity');
                if (activity_supplimentToUpdate.typeOfActivity == 'Group') {
                    setLabelName('Per Group Rate');
                } else if (activity_supplimentToUpdate.typeOfActivity == 'Slab') {
                    setLabelName('Max Pax Rate');
                    // setTypeOfActivity(false);
                } else {
                    setLabelName('Per Pax Rate');
                }
            }
        }
    }, [activity_supplimentToUpdate]);

    yup.addMethod(yup.string, 'checkDuplicateActivitySupplementCode', function (message) {
        return this.test('checkDuplicateActivitySupplementCode', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateActivity_SupplimentsCode(value, categoryType));

                    if (duplicateCode != null && duplicateCode.errorMessages.length != 0) {
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
        code: yup.string().required('Required field').checkDuplicateActivitySupplementCode('Duplicate Code'),
        activityDescription: yup.string().required('Required field'),
        maxPax: yup.number().required('Required field'),
        email: yup.string().email().required('Required field'),
        phone: yup.string().matches(phoneRegExp, 'Not valid').min(10, 'Must be exactly 10 digits').max(10, 'Must be 10 digits'),

        activityWithTaxes: yup.array().of(
            yup.object().shape({
                tax: yup.object().typeError('Required field'),
                fromDate: yup.date().required('Required field'),
                toDate: yup.date().min(yup.ref('fromDate'), "End date can't be before start date"),
                currencyList: yup.object().typeError('Required field'),
                perDayRate: yup.number().required('Required field').positive('entry should be greater than 0'),
                status: yup.boolean()
            })
        )
        // .uniqueStatus('Already Existing Active Record.')
    });

    // const  checkStatus()=>{

    // }
    let checkStatus = function (value) {
        initialValues.guideClassDetails?.map((s) => console.log(s.status));
        // console.log('value:' + value);
    };

    const dispatch = useDispatch();
    const [taxIdValues, setTaxIdValues] = useState(null);
    const [taxValues, setTaxValues] = useState(null);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getActivity_SupplimentDetailsByCode(activitySupplimentId));
        }
    }, [mode]);

    const showImages = (event) => {
        let images = [];
        console.log(event);
        for (let i = 0; i < event.target.files.length; i++) {
            // console.log(event.target.files[i])
            images.push(URL.createObjectURL(event.target.files[i]));
        }

        setPreviewImages(images);
    };

    function deleteHandler(image) {
        setPreviewImages(previewImages.filter((e) => e !== image));
        URL.revokeObjectURL(image);
    }

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            const dataArray = [];
            const dataArrayYoutube = [];
            if (data.activityWithTaxes.length > 0 || data.youtubeLinks.length > 0) {
                data.activityWithTaxes.map((item) => {
                    const activityWithTaxes = {
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        currencyList: item.currencyList.currencyListId,
                        tax: item.tax.taxId,
                        perPaxBuyRate: item.perDayRate == null ? 0.0 : item.perDayRate,
                        rateWithoutTax: item.perDayRate,
                        rateWithTax: item.perDayRate,
                        status: item.status
                    };
                    dataArray.push(activityWithTaxes);
                });

                data.youtubeLinks.map((itemYoutube) => {
                    const youtubeLinks = {
                        url: itemYoutube.url,
                        status: itemYoutube.status
                    };
                    dataArrayYoutube.push(youtubeLinks);
                });

                const saveValues = {
                    type: data.type,
                    typeOfActivity: data.typeOfActivity,
                    code: data.code,
                    locationCode: data.locationCode.location_id,
                    activityDescription: data.activityDescription,
                    advanceType: data.advanceType,
                    contactPerson: data.contactPerson,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    website: data.website,
                    fax: data.fax,
                    maxPax: data.maxPax,
                    status: data.status,
                    advanceType: data.advanceType,
                    files: data.files,
                    youtubeLinks: dataArrayYoutube,
                    activityWithTaxes: dataArray
                };
                dispatch(saveActivity_SupplimentData(saveValues));
            }
        } else if (mode === 'VIEW_UPDATE') {
            const dataArray = [];
            const dataArrayYoutube = [];

            console.log('activity_supplimentToUpdate.id:' + activity_supplimentToUpdate.id);
            data.activityWithTaxes.map((item) => {
                const activityWithTaxes = {
                    id: item.id,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    currencyList: item.currencyList.currencyListId,
                    tax: item.tax.taxId,
                    perPaxBuyRate: item.perDayRate == null ? 0.0 : item.perDayRate,
                    rateWithoutTax: item.perDayRate,
                    rateWithTax: item.perDayRate,
                    status: item.status
                };
                dataArray.push(activityWithTaxes);
            });

            data.youtubeLinks.map((itemYoutube) => {
                const youtubeLinks = {
                    url: itemYoutube.url,
                    status: itemYoutube.status
                };
                dataArrayYoutube.push(youtubeLinks);
            });

            const saveValues = {
                id: data.id,
                type: data.type,
                typeOfActivity: data.typeOfActivity,
                code: data.code,
                locationCode: data.locationCode.location_id,
                activityDescription: data.activityDescription,
                advanceType: data.advanceType,
                contactPerson: data.contactPerson,
                phone: data.phone,
                email: data.email,
                address: data.address,
                website: data.website,
                fax: data.fax,
                maxPax: data.maxPax,
                status: data.status,
                advanceType: data.advanceType,
                files: data.files,
                youtubeLinks: dataArrayYoutube,
                activityWithTaxes: dataArray
            };
            dispatch(updateActivity_SupplimentData(saveValues));
        }
        handleClose();
    };

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    const taxListData = useSelector((state) => state.taxReducer.taxes);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const duplicateCode = useSelector((state) => state.activity_supplimentReducer.duplicateCode);
    const [taxListOptions, setTaxListOptions] = useState([]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);
    const [categoryType, setCategoryType] = useState('Activity');
    const [typeOfActivity, setTypeOfActivity] = useState(true);
    const [labelName, setLabelName] = useState('Per Pax Rate');

    useEffect(() => {
        dispatch(getAllTaxData());
        dispatch(getAllCurrencyListData());
        dispatch(getActiveLocations());
    }, []);

    useEffect(() => {
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);

    useEffect(() => {
        if (taxListData != null) {
            setTaxListOptions(taxListData);
        }
    }, [taxListData]);

    const selectedType = (event) => {
        const selectedType = event.currentTarget.dataset.value;

        setCategoryType(selectedType);
        if (selectedType == 'Activity') {
            setTypeOfActivity(true);
        } else if (selectedType == 'Miscellaneous') {
            setTypeOfActivity(true);
        } else {
            setLabelName('Per Pax Rate');
            setTypeOfActivity(false);
        }
        // setActivityType(t)
    };

    const selectedActivityType = (event) => {
        const selectedType = event.currentTarget.dataset.value;
        if (selectedType == 'Group') {
            setLabelName('Per Group Rate');
        } else if (selectedType == 'Slab') {
            setLabelName('Max Pax Rate');
            // setTypeOfActivity(false);
        } else {
            setLabelName('Per Pax Rate');
        }
    };

    return (
        <div>
            <Dialog
                maxWidth="100px"
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
                            Activity / Supplement
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
                                                        <div style={{ marginTop: '6px', margin: '10px' }}>
                                                            <Grid container spacing={gridSpacing}>
                                                                <Grid item>
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        id="standard-select-currency"
                                                                        select
                                                                        label="Activity / Supplement / Miscellaneous"
                                                                        name="type"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        // defaultValue={values.groupType}
                                                                        value={values.type}

                                                                        // error={Boolean(touched.groupType && errors.groupType)}
                                                                        // helperText={
                                                                        //     touched.groupType && errors.groupType
                                                                        //         ? errors.groupType
                                                                        //         : ''
                                                                        // }
                                                                    >
                                                                        <MenuItem dense={true} value={'Activity'} onClick={selectedType}>
                                                                            Activity
                                                                        </MenuItem>
                                                                        <MenuItem dense={true} value={'Supplement'} onClick={selectedType}>
                                                                            Supplement
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            dense={true}
                                                                            value={'Miscellaneous'}
                                                                            onClick={selectedType}
                                                                        >
                                                                            Miscellaneous
                                                                        </MenuItem>
                                                                    </TextField>
                                                                </Grid>
                                                                {typeOfActivity ? (
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            id="standard-select-currency"
                                                                            select
                                                                            label={'Type of ' + categoryType}
                                                                            name="typeOfActivity"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.typeOfActivity}
                                                                            // onClick={handleClick}

                                                                            // error={Boolean(touched.groupType && errors.groupType)}
                                                                            // helperText={
                                                                            //     touched.groupType && errors.groupType
                                                                            //         ? errors.groupType
                                                                            //         : ''
                                                                            // }
                                                                        >
                                                                            <MenuItem
                                                                                dense={true}
                                                                                value={'Individual'}
                                                                                onClick={selectedActivityType}
                                                                            >
                                                                                Individual
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                dense={true}
                                                                                value={'Group'}
                                                                                onClick={selectedActivityType}
                                                                            >
                                                                                Group
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                dense={true}
                                                                                value={'Slab'}
                                                                                onClick={selectedActivityType}
                                                                            >
                                                                                Slab
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </Grid>
                                                                ) : (
                                                                    ''
                                                                )}

                                                                <Grid item>
                                                                    <TextField
                                                                        label={categoryType + '  Code'}
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="code"
                                                                        value={values.code}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        error={Boolean(touched.code && errors.code)}
                                                                        helperText={touched.code && errors.code ? errors.code : ''}
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        name="activityDescription"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        label={categoryType + '  Description'}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.activityDescription}
                                                                        error={Boolean(
                                                                            touched.activityDescription && errors.activityDescription
                                                                        )}
                                                                        helperText={
                                                                            touched.activityDescription && errors.activityDescription
                                                                                ? errors.activityDescription
                                                                                : ''
                                                                        }
                                                                    ></TextField>
                                                                </Grid>
                                                                {typeOfActivity ? (
                                                                    <Grid item>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="advanceType"
                                                                                onChange={handleChange}
                                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                value={values.advanceType}
                                                                                control={<Switch color="success" />}
                                                                                label="Advance Type"
                                                                                checked={values.advanceType}
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </Grid>
                                                            <br />

                                                            <Grid container spacing={gridSpacing}>
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
                                                                    <TextField
                                                                        label="Contact Person"
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        // disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        name="contactPerson"
                                                                        value={values.contactPerson}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Phone"
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        // disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        name="phone"
                                                                        value={values.phone}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Email"
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="email"
                                                                        value={values.email}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        error={Boolean(touched.email && errors.email)}
                                                                        helperText={touched.email && errors.email ? errors.email : ''}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <br />
                                                            <Grid container spacing={gridSpacing}>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Address"
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="address"
                                                                        value={values.address}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Website"
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="website"
                                                                        value={values.website}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Fax"
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="fax"
                                                                        value={values.fax}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Max Pax"
                                                                        sx={{
                                                                            width: { sm: 200, md: 200 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        type="number"
                                                                        variant="outlined"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="maxPax"
                                                                        value={values.maxPax}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        error={Boolean(touched.maxPax && errors.maxPax)}
                                                                        helperText={touched.maxPax && errors.maxPax ? errors.maxPax : ''}
                                                                    />
                                                                </Grid>

                                                                <Grid item>
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
                                                                </Grid>
                                                            </Grid>

                                                            <br />
                                                            <Grid item xs={8} display={categoryType === 'Miscellaneous' ? 'none' : 'block'}>
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
                                                                />
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
                                                                                            }}
                                                                                        />
                                                                                    </IconButton>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </Grid>
                                                        </div>

                                                        {/* youtubeLinks */}
                                                        {categoryType !== 'Miscellaneous' ? (
                                                            <FieldArray name="youtubeLinks">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    onClick={() => {
                                                                                        push({
                                                                                            url: '',
                                                                                            status: false
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <AddBoxIcon />
                                                                                </IconButton>
                                                                            </Box>
                                                                        ) : (
                                                                            ''
                                                                        )}

                                                                        <TableContainer>
                                                                            <Table stickyHeader size="small">
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell>Sequence</TableCell>
                                                                                        <TableCell>Youtube Link</TableCell>

                                                                                        <TableCell>Status</TableCell>
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.youtubeLinks.map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                <TableCell>{idx + 1}</TableCell>

                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 500 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        // label="Additional Price"
                                                                                                        type="text"
                                                                                                        variant="outlined"
                                                                                                        // disabled={
                                                                                                        //     mode == 'VIEW_UPDATE' ||
                                                                                                        //     mode == 'VIEW'
                                                                                                        // }

                                                                                                        name={`youtubeLinks.${idx}.url`}
                                                                                                        value={
                                                                                                            values.youtubeLinks[idx] &&
                                                                                                            values.youtubeLinks[idx].url
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        // onChange={(e) =>
                                                                                                        //     setRateWithTax(e.target.value)
                                                                                                        // }
                                                                                                        onBlur={handleBlur}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        <FormControlLabel
                                                                                                            name={`youtubeLinks.${idx}.status`}
                                                                                                            // onChange={handleChangeStatus}
                                                                                                            value={
                                                                                                                values.youtubeLinks[idx] &&
                                                                                                                values.youtubeLinks[idx]
                                                                                                                    .status
                                                                                                            }
                                                                                                            control={
                                                                                                                <Switch color="success" />
                                                                                                            }
                                                                                                            onChange={(_, value) => {
                                                                                                                checkStatus();
                                                                                                                // console.log(value.currencyListId);
                                                                                                                // setAppearing(value);
                                                                                                                setFieldValue(
                                                                                                                    `youtubeLinks.${idx}.status`,
                                                                                                                    value
                                                                                                                );
                                                                                                            }}
                                                                                                            // label="Status"
                                                                                                            checked={
                                                                                                                values.youtubeLinks[idx] &&
                                                                                                                values.youtubeLinks[idx]
                                                                                                                    .status
                                                                                                            }
                                                                                                            disabled={mode == 'VIEW'}
                                                                                                        />
                                                                                                    </FormGroup>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <IconButton
                                                                                                        aria-label="delete"
                                                                                                        onClick={() => {
                                                                                                            remove(idx);
                                                                                                        }}
                                                                                                    >
                                                                                                        <HighlightOffIcon />
                                                                                                    </IconButton>
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    </Paper>
                                                                )}
                                                            </FieldArray>
                                                        ) : (
                                                            ''
                                                        )}
                                                        <FieldArray name="activityWithTaxes">
                                                            {({ insert, remove, push }) => (
                                                                <Paper>
                                                                    {mode != 'VIEW' ? (
                                                                        <Box display="flex" flexDirection="row-reverse">
                                                                            <IconButton
                                                                                aria-label="delete"
                                                                                onClick={() => {
                                                                                    // setFieldValue(
                                                                                    //   `taxGroupDetails.${ref.current.values.taxGroupDetails.length}.taxOrder`,
                                                                                    //   ref.current.values.taxGroupDetails.length+1
                                                                                    // );
                                                                                    push({
                                                                                        id: '',
                                                                                        fromDate: '',
                                                                                        toDate: '',
                                                                                        currencyList: '',
                                                                                        tax: null,
                                                                                        perDayRate: '',
                                                                                        rateWithoutTax: '',
                                                                                        rateWithTax: '',
                                                                                        status: true,
                                                                                        enableRow:
                                                                                            mode === 'VIEW_UPDATE' || mode === 'INSERT'
                                                                                                ? false
                                                                                                : true
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <AddBoxIcon />
                                                                            </IconButton>
                                                                        </Box>
                                                                    ) : (
                                                                        ''
                                                                    )}

                                                                    <TableContainer>
                                                                        <Table stickyHeader size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>From Date</TableCell>
                                                                                    <TableCell>To Date</TableCell>
                                                                                    <TableCell>Currency</TableCell>
                                                                                    <TableCell>Tax Code</TableCell>
                                                                                    <TableCell>Tax %</TableCell>
                                                                                    <TableCell>{labelName}</TableCell>
                                                                                    <TableCell>Rate Without Tax</TableCell>
                                                                                    <TableCell>Rate With Tax</TableCell>
                                                                                    <TableCell>Status</TableCell>
                                                                                    <TableCell>Actions</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {values.activityWithTaxes.map((record, idx) => {
                                                                                    return (
                                                                                        <TableRow key={idx} hover>
                                                                                            {/* <TableCell>
                                                    {idx + 1}
                                                  </TableCell> */}
                                                                                            <TableCell>
                                                                                                <LocalizationProvider
                                                                                                    dateAdapter={AdapterDayjs}
                                                                                                    // adapterLocale={locale}
                                                                                                >
                                                                                                    <DatePicker
                                                                                                        onChange={(value) => {
                                                                                                            setFieldValue(
                                                                                                                `activityWithTaxes.${idx}.fromDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            values.activityWithTaxes[idx]
                                                                                                                .enableRow || mode == 'VIEW'
                                                                                                        }
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values.activityWithTaxes[idx] &&
                                                                                                            values.activityWithTaxes[idx]
                                                                                                                .fromDate
                                                                                                        }
                                                                                                        renderInput={(params) => (
                                                                                                            <TextField
                                                                                                                {...params}
                                                                                                                sx={{
                                                                                                                    width: {
                                                                                                                        sm: 150
                                                                                                                    },
                                                                                                                    '& .MuiInputBase-root':
                                                                                                                        {
                                                                                                                            height: 40
                                                                                                                        }
                                                                                                                }}
                                                                                                                disabled={
                                                                                                                    values
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].enableRow ||
                                                                                                                    mode == 'VIEW'
                                                                                                                }
                                                                                                                variant="outlined"
                                                                                                                name={`activityWithTaxes.${idx}.fromDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                                error={Boolean(
                                                                                                                    touched.activityWithTaxes &&
                                                                                                                        touched
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ].fromDate &&
                                                                                                                        errors.activityWithTaxes &&
                                                                                                                        errors
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ].fromDate
                                                                                                                )}
                                                                                                                helperText={
                                                                                                                    touched.activityWithTaxes &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].fromDate &&
                                                                                                                    errors.activityWithTaxes &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].fromDate
                                                                                                                        ? errors
                                                                                                                              .activityWithTaxes[
                                                                                                                              idx
                                                                                                                          ].fromDate
                                                                                                                        : ''
                                                                                                                }
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </LocalizationProvider>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <LocalizationProvider
                                                                                                    dateAdapter={AdapterDayjs}
                                                                                                >
                                                                                                    <DatePicker
                                                                                                        onChange={(value) => {
                                                                                                            console.log(value);
                                                                                                            setFieldValue(
                                                                                                                `activityWithTaxes.${idx}.toDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            values.activityWithTaxes[idx]
                                                                                                                .enableRow || mode == 'VIEW'
                                                                                                        }
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values.activityWithTaxes[idx] &&
                                                                                                            values.activityWithTaxes[idx]
                                                                                                                .toDate
                                                                                                        }
                                                                                                        renderInput={(params) => (
                                                                                                            <TextField
                                                                                                                {...params}
                                                                                                                sx={{
                                                                                                                    width: {
                                                                                                                        sm: 150
                                                                                                                    },
                                                                                                                    '& .MuiInputBase-root':
                                                                                                                        {
                                                                                                                            height: 40
                                                                                                                        }
                                                                                                                }}
                                                                                                                disabled={
                                                                                                                    values
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].enableRow ||
                                                                                                                    mode == 'VIEW'
                                                                                                                }
                                                                                                                variant="outlined"
                                                                                                                name={`activityWithTaxes.${idx}.toDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                                helperText={
                                                                                                                    touched.activityWithTaxes &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].toDate &&
                                                                                                                    errors.activityWithTaxes &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].toDate
                                                                                                                        ? errors
                                                                                                                              .activityWithTaxes[
                                                                                                                              idx
                                                                                                                          ].toDate
                                                                                                                        : ''
                                                                                                                }
                                                                                                                error={Boolean(
                                                                                                                    touched.activityWithTaxes &&
                                                                                                                        touched
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ].toDate &&
                                                                                                                        errors.activityWithTaxes &&
                                                                                                                        errors
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .activityWithTaxes[
                                                                                                                            idx
                                                                                                                        ].toDate
                                                                                                                )}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </LocalizationProvider>
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <Autocomplete
                                                                                                    value={
                                                                                                        values.activityWithTaxes[idx]
                                                                                                            ? values.activityWithTaxes[idx]
                                                                                                                  .currencyList
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`activityWithTaxes.${idx}.currencyList`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value.currencyListId);
                                                                                                        setFieldValue(
                                                                                                            `activityWithTaxes.${idx}.currencyList`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    disabled={
                                                                                                        values.activityWithTaxes[idx]
                                                                                                            .enableRow || mode == 'VIEW'
                                                                                                    }
                                                                                                    options={currencyListOptions}
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.currencyCode} - ${option.currencyDescription}`
                                                                                                    }
                                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                                        option.currencyListId ===
                                                                                                        value.currencyListId
                                                                                                    }
                                                                                                    renderInput={(params) => (
                                                                                                        <TextField
                                                                                                            {...params}
                                                                                                            // label="tax"
                                                                                                            sx={{
                                                                                                                width: { sm: 200 },
                                                                                                                '& .MuiInputBase-root': {
                                                                                                                    height: 40
                                                                                                                }
                                                                                                            }}
                                                                                                            placeholder="--Select a Currency Code --"
                                                                                                            variant="outlined"
                                                                                                            name={`activityWithTaxes.${idx}.currencyList`}
                                                                                                            onBlur={handleBlur}
                                                                                                            helperText={
                                                                                                                touched.activityWithTaxes &&
                                                                                                                touched.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ].currencyList &&
                                                                                                                errors.activityWithTaxes &&
                                                                                                                errors.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ].currencyList
                                                                                                                    ? errors
                                                                                                                          .activityWithTaxes[
                                                                                                                          idx
                                                                                                                      ].currencyList
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.activityWithTaxes &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].currencyList &&
                                                                                                                    errors.activityWithTaxes &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].currencyList
                                                                                                            )}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Autocomplete
                                                                                                    value={
                                                                                                        values.activityWithTaxes[idx]
                                                                                                            ? values.activityWithTaxes[idx]
                                                                                                                  .tax
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`activityWithTaxes.${idx}.tax`}
                                                                                                    onChange={(_, value) => {
                                                                                                        setFieldValue(
                                                                                                            `activityWithTaxes.${idx}.tax`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    options={taxListOptions}
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.taxCode} - (${option.taxDescription})`
                                                                                                    }
                                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                                        option.taxId === value.taxId
                                                                                                    }
                                                                                                    renderInput={(params) => (
                                                                                                        <TextField
                                                                                                            {...params}
                                                                                                            // label="tax"
                                                                                                            sx={{
                                                                                                                width: { sm: 200 },
                                                                                                                '& .MuiInputBase-root': {
                                                                                                                    height: 40
                                                                                                                }
                                                                                                            }}
                                                                                                            placeholder="--Select a Tax Code --"
                                                                                                            variant="outlined"
                                                                                                            name={`activityWithTaxes.${idx}.tax`}
                                                                                                            disabled={
                                                                                                                values.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ].enableRow ||
                                                                                                                mode == 'VIEW'
                                                                                                            }
                                                                                                            onBlur={handleBlur}
                                                                                                            helperText={
                                                                                                                touched.activityWithTaxes &&
                                                                                                                touched.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ].tax &&
                                                                                                                errors.activityWithTaxes &&
                                                                                                                errors.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ].tax
                                                                                                                    ? errors
                                                                                                                          .activityWithTaxes[
                                                                                                                          idx
                                                                                                                      ].tax
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.activityWithTaxes &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].tax &&
                                                                                                                    errors.activityWithTaxes &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].tax
                                                                                                            )}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.activityWithTaxes[idx] &&
                                                                                                values.activityWithTaxes[idx].tax
                                                                                                    ? values.activityWithTaxes[idx].tax
                                                                                                          .percentage
                                                                                                    : 0}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { sm: 100 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    min="0.00"
                                                                                                    step="0.001"
                                                                                                    max="1.00"
                                                                                                    presicion={2}
                                                                                                    // label="Additional Price"
                                                                                                    type="number"
                                                                                                    variant="outlined"
                                                                                                    disabled={
                                                                                                        values.activityWithTaxes[idx]
                                                                                                            .enableRow || mode == 'VIEW'
                                                                                                    }
                                                                                                    placeholder="0"
                                                                                                    name={`activityWithTaxes.${idx}.perDayRate`}
                                                                                                    value={
                                                                                                        values.activityWithTaxes[idx] &&
                                                                                                        values.activityWithTaxes[idx]
                                                                                                            .perDayRate
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    // onChange={(e) =>
                                                                                                    //     setRateWithTax(e.target.value)
                                                                                                    // }
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.activityWithTaxes &&
                                                                                                            touched.activityWithTaxes[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.activityWithTaxes[idx]
                                                                                                                .perDayRate &&
                                                                                                            errors.activityWithTaxes &&
                                                                                                            errors.activityWithTaxes[idx] &&
                                                                                                            errors.activityWithTaxes[idx]
                                                                                                                .perDayRate
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.activityWithTaxes &&
                                                                                                        touched.activityWithTaxes[idx] &&
                                                                                                        touched.activityWithTaxes[idx]
                                                                                                            .perDayRate &&
                                                                                                        errors.activityWithTaxes &&
                                                                                                        errors.activityWithTaxes[idx] &&
                                                                                                        errors.activityWithTaxes[idx]
                                                                                                            .perDayRate
                                                                                                            ? errors.activityWithTaxes[idx]
                                                                                                                  .perDayRate
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.activityWithTaxes[idx] &&
                                                                                                values.activityWithTaxes[idx].perDayRate
                                                                                                    ? values.activityWithTaxes[idx]
                                                                                                          .perDayRate
                                                                                                    : 0}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.activityWithTaxes[idx] &&
                                                                                                values.activityWithTaxes[idx].perDayRate
                                                                                                    ? values.activityWithTaxes[idx]
                                                                                                          .perDayRate *
                                                                                                          (values.activityWithTaxes[idx].tax
                                                                                                              .percentage /
                                                                                                              100) +
                                                                                                      values.activityWithTaxes[idx]
                                                                                                          .perDayRate
                                                                                                    : 0}
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <FormGroup>
                                                                                                    <FormControlLabel
                                                                                                        name={`activityWithTaxes.${idx}.status`}
                                                                                                        // onChange={handleChangeStatus}
                                                                                                        value={
                                                                                                            values.activityWithTaxes[idx] &&
                                                                                                            values.activityWithTaxes[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        control={<Switch color="success" />}
                                                                                                        error={Boolean(
                                                                                                            touched.activityWithTaxes &&
                                                                                                                touched.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ].status &&
                                                                                                                errors.activityWithTaxes &&
                                                                                                                errors.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.activityWithTaxes[
                                                                                                                    idx
                                                                                                                ].status
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.activityWithTaxes &&
                                                                                                            touched.activityWithTaxes[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.activityWithTaxes[idx]
                                                                                                                .status &&
                                                                                                            errors.activityWithTaxes &&
                                                                                                            errors.activityWithTaxes[idx] &&
                                                                                                            errors.activityWithTaxes[idx]
                                                                                                                .status
                                                                                                                ? errors.activityWithTaxes[
                                                                                                                      idx
                                                                                                                  ].status
                                                                                                                : ''
                                                                                                        }
                                                                                                        onChange={(_, value) => {
                                                                                                            checkStatus();
                                                                                                            // console.log(value.currencyListId);
                                                                                                            // setAppearing(value);
                                                                                                            setFieldValue(
                                                                                                                `activityWithTaxes.${idx}.status`,
                                                                                                                value
                                                                                                            );
                                                                                                            console.log(
                                                                                                                values.activityWithTaxes
                                                                                                            );

                                                                                                            // s.code ===
                                                                                                            //     values.code &&
                                                                                                            // s.category ==
                                                                                                            //     values.codeType
                                                                                                            //     ? setExistOpenModal(
                                                                                                            //           true
                                                                                                            //       )
                                                                                                            //     : initialValuesNew.codeAndNameDetails.push(
                                                                                                            //           s
                                                                                                            //       )
                                                                                                        }}
                                                                                                        // label="Status"
                                                                                                        checked={
                                                                                                            values.activityWithTaxes[idx] &&
                                                                                                            values.activityWithTaxes[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                    {errors.activityWithTaxes &&
                                                                                                        errors.activityWithTaxes[idx] &&
                                                                                                        errors.activityWithTaxes[idx]
                                                                                                            .status && (
                                                                                                            <p>
                                                                                                                {
                                                                                                                    errors
                                                                                                                        .activityWithTaxes[
                                                                                                                        idx
                                                                                                                    ].status
                                                                                                                }
                                                                                                            </p>
                                                                                                        )}
                                                                                                </FormGroup>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {(values.activityWithTaxes[idx] &&
                                                                                                    values.activityWithTaxes[idx].id) ===
                                                                                                '' ? (
                                                                                                    <IconButton
                                                                                                        aria-label="delete"
                                                                                                        onClick={() => {
                                                                                                            remove(idx);
                                                                                                        }}
                                                                                                    >
                                                                                                        <HighlightOffIcon />
                                                                                                    </IconButton>
                                                                                                ) : null}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    );
                                                                                })}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableContainer>
                                                                </Paper>
                                                            )}
                                                        </FieldArray>

                                                        <br />
                                                        <Box>
                                                            <Grid item>
                                                                {mode === 'VIEW' ? (
                                                                    <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                ) : null}
                                                            </Grid>
                                                        </Box>
                                                        <Grid item>
                                                            {existOpenModal ? (
                                                                <AlertItemExist
                                                                    title="dev"
                                                                    open={existOpenModal}
                                                                    handleClose={handleExistModalClose}
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

export default ActivitySupplement;
