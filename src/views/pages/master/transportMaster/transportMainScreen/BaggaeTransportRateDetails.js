import { useEffect, forwardRef, useState, Fragment } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    Slide,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    FormGroup,
    FormControlLabel,
    Switch,
    TablePagination,
    TableFooter,
    Autocomplete,
    MenuItem,
    Typography
} from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, FieldArray, Field } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import AlertItemDelete from 'messages/AlertItemDelete';
import AlertItemExist from 'messages/AlertItemExist';
import {
    getTransportMainCategoryDataByType,
    saveMainTransportDetailsData
} from 'store/actions/masterActions/transportActions/MainTransportCategoriesActions';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import { getAllActiveExpenseTypesData } from 'store/actions/masterActions/ExpenseTypeAction';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getAllCurrencyListData } from 'store/actions/masterActions/ExpenseTypeAction';
import { getAllActiveVehicleTypeDataByType } from 'store/actions/masterActions/transportActions/MainTransportCategoriesActions';
import { getAllTaxData } from 'store/actions/masterActions/TaxActions/TaxAction';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function BaggaeTransportRateDetails({ open, handleClose, mode, childToParent, paxVehicleRate, paxVehicleRateHeader }) {
    const headerInitialValues = {
        fromDate: '',
        toDate: '',
        currency: null,
        maxKm: '',
        taxCode: null,
        vehicleRate: '',
        vehicleRateWithTax: 0.0,
        driverRate: '',
        driverRateWithTax: 0.0,
        assistantRate: '',
        assistantWithTax: 0.0,
        status: true
    };
    const pages = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [openModal, setOpenModal] = useState(false);
    const [existOpenModal, setExistOpenModal] = useState(false);
    const [loadValues, setLoadValues] = useState({
        baggageTransportRateDetails: [
            {
                fromDate: '',
                toDate: '',
                currency: null,
                maxKm: '',
                taxCode: null,
                vehicleRate: '',
                vehicleRateWithTax: 0.0,
                driverRate: '',
                driverRateWithTax: 0.0,
                assistantRate: '',
                assistantWithTax: 0.0,
                status: true
            }
        ]
    });
    const [activeLocationList, setActiveLocationList] = useState([]);
    const [activeExpenseTypeList, setExpenseTypes] = useState([]);
    const [vehicleTypeList, setvehicleTypes] = useState([]);
    const [activeTaxGroupandTaxesList, setActiveTaxGroupandTaxesListData] = useState([]);
    const [taxListOptions, setTaxListOptions] = useState([]);
    const [headerValues, setHeaderValues] = useState({
        vehcleCategory: '',
        noOfDrivers: '',
        noOfAssistants: '',
        baggageTransportDesc: ''
    });
    //get data from reducers
    const detailsType = useSelector((state) => state.mainTransportCategoryReducer.detailsType);
    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const activeExpenseTypes = useSelector((state) => state.expenseTypesReducer.activeExpenseTypes);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const vehicleTypes = useSelector((state) => state.mainTransportCategoryReducer.vehicleTypes);
    const activeTaxGroupandTaxesListData = useSelector((state) => state.taxGroupReducer.activeTaxGroupandTaxes);

    const dispatch = useDispatch();

    useEffect(() => {
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);

    useEffect(() => {
        if (paxVehicleRateHeader != null) {
            console.log(paxVehicleRateHeader);
            setHeaderValues({
                vehcleCategory: paxVehicleRateHeader.vehicleCategory?.typeCode,
                noOfDrivers: paxVehicleRateHeader.noOfDrivers,
                noOfAssistants: paxVehicleRateHeader.noOfAssistants,
                baggageTransportDesc: paxVehicleRateHeader.baggageTransportDesc
            });
        }
    }, [paxVehicleRateHeader]);
    useEffect(() => {
        if (activeTaxGroupandTaxesListData.length != 0) {
            setActiveTaxGroupandTaxesListData(activeTaxGroupandTaxesListData);
        }
    }, [activeTaxGroupandTaxesListData]);

    const validationSchema = yup.object().shape({
        mainCategoryDetails: yup.array().of(
            yup.object().shape({
                // location: yup.object().nullable().required('Required field'),
                // locationDes: yup.string().required('Required field'),
                // expenseTypes: yup.object().nullable().required('Required field'),
                // expenseDes: yup.string().required('Required field')
            })
        )
        // .uniqueCodeAndNameCode("Must be unique"),
        // .uniqueCode('Code Already Exist')
    });
    const validationSchema1 = yup.object().shape({
        fromDate: yup.date().required('Required field'),
        currency: yup.object().nullable().required('Required field'),

        taxCode: yup.object().nullable().required('Required field'),
        vehicleRate: yup.number().required('Required field'),
        toDate: yup.date().min(yup.ref('fromDate'), "End date can't be before start date"),
        vehicleRateWithTax: yup.number(),
        driverRate: yup.number(),
        driverRateWithTax: yup.number(),
        assistantRate: yup.number(),
        assistantWithTax: yup.number()

        // currency: yup.object().nullable().required('Required field'),
        // expenseDes: yup.string().required('Required field')
    });

    useEffect(() => {
        console.log(paxVehicleRate);
        let values;
        if (paxVehicleRate.length === 0) {
            values = {
                baggageTransportRateDetails: [
                    {
                        fromDate: '',
                        toDate: '',
                        currency: null,

                        maxKm: '',
                        taxCode: null,
                        vehicleRate: '',
                        vehicleRateWithTax: 0.0,
                        driverRate: '',
                        driverRateWithTax: 0.0,
                        assistantRate: '',
                        assistantWithTax: 0.0,
                        status: true
                    }
                ]
            };
        } else {
            values = {
                baggageTransportRateDetails: paxVehicleRate
            };
        }

        setLoadValues(values);
    }, [paxVehicleRate]);

    useEffect(() => {
        dispatch(getAllCurrencyListData());
        dispatch(getAllActiveVehicleTypeDataByType('Vehicle Type'));
        dispatch(getAllTaxData());
    }, []);
    const handleModalClose = (status) => {
        setOpenModal(false);
        if (status) {
            dispatch(getTransportMainCategoryDataByType(categoryType));
        }
    };
    const handleExistModalClose = (status) => {
        if (status) {
            setExistOpenModal(false);
        }
    };

    useEffect(() => {
        if (vehicleTypes.length != 0) {
            setvehicleTypes(vehicleTypes);
        }
    }, [vehicleTypes]);

    useEffect(() => {
        setActiveLocationList(activeLocations);
    }, [activeLocations]);

    const handleSubmit = async (values) => {
        console.log(values);
        const initialValuesNew = {
            baggageTransportRateDetails: [
                {
                    fromDate: values.fromDate,
                    toDate: values.toDate,
                    currency: values.currency,
                    maxKm: values.maxKm,
                    taxCode: values.taxCode,
                    vehicleRate: values.vehicleRate,
                    vehicleRateWithTax: values.vehicleRateWithTax,
                    driverRate: values.driverRate,
                    driverRateWithTax: values.driverRateWithTax,
                    assistantRate: values.assistantRate,
                    assistantWithTax: values.assistantWithTax,
                    status: values.status
                }
            ]
        };
        if (loadValues.baggageTransportRateDetails.length != 0) {
            loadValues.baggageTransportRateDetails?.map((s) => {
                if (s.currency != null) {
                    initialValuesNew.baggageTransportRateDetails.push(s);
                }
            });

            setLoadValues(initialValuesNew);
        } else {
            setLoadValues(initialValuesNew);
        }
    };

    const calculateVehicleTax = (value, tax, setFieldValue) => {
        console.log(value);
        console.log(tax);
        if (tax != null) {
            if (tax.type === 'Group') {
                let amountWithTax = value;
                for (let i in tax.taxOrder) {
                    amountWithTax = (+amountWithTax * tax.taxOrder[i]) / 100 + +amountWithTax;
                }

                setFieldValue(`vehicleRateWithTax`, +amountWithTax.toFixed(4));
            } else if (tax.type === 'IND') {
                let amountWithTax = 0;
                amountWithTax = (+value * tax.tax) / 100 + +value;

                setFieldValue(`vehicleRateWithTax`, +amountWithTax.toFixed(4));
            }
        }
    };

    const calculateDriverRateTax = (value, tax, setFieldValue) => {
        if (tax != null) {
            if (tax.type === 'Group') {
                let amountWithTax = value;
                for (let i in tax.taxOrder) {
                    amountWithTax = (+amountWithTax * tax.taxOrder[i]) / 100 + +amountWithTax;
                }

                setFieldValue(`driverRateWithTax`, +amountWithTax.toFixed(4));
            } else if (tax.type === 'IND') {
                let amountWithTax = 0;
                amountWithTax = (+value * tax.tax) / 100 + +value;

                setFieldValue(`driverRateWithTax`, +amountWithTax.toFixed(4));
            }
        }
    };

    const calculateAssistantRateTax = (value, tax, setFieldValue) => {
        if (tax != null) {
            if (tax.type === 'Group') {
                let amountWithTax = value;
                for (let i in tax.taxOrder) {
                    amountWithTax = (+amountWithTax * tax.taxOrder[i]) / 100 + +amountWithTax;
                }

                setFieldValue(`assistantWithTax`, +amountWithTax.toFixed(4));
            } else if (tax.type === 'IND') {
                let amountWithTax = 0;
                amountWithTax = (+value * tax.tax) / 100 + +value;

                setFieldValue(`assistantWithTax`, +amountWithTax.toFixed(4));
            }
        }
    };

    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
                maxWidth="220px"
                open={open}
                TransitionComponent={Transition}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update ' : ''} {mode === 'VIEW' ? 'View ' : ''}
                            Baggage Transport Rate Details
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
                                            <Grid
                                                container
                                                spacing={2}
                                                style={{
                                                    border: '3px solid #6082B6',
                                                    marginTop: '2px',
                                                    marginBottom: '22px',
                                                    fontWeight: 'bold',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: '#A7C7E7',
                                                    paddingBottom: '10px',
                                                    paddingLeft: '10px',
                                                    marginLeft: '10px',
                                                    width: '1570px',
                                                    borderRadius: '5px'
                                                }}
                                            >
                                                <Grid item xs={3}>
                                                    <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        Vehicle Category Code : {headerValues.vehcleCategory}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        Description : {headerValues.baggageTransportDesc}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        No of Drivers : {headerValues.noOfDrivers}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        No of Assistant : {headerValues.noOfAssistants}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Formik
                                                enableReinitialize={true}
                                                initialValues={headerInitialValues}
                                                onSubmit={(values, { resetForm }) => {
                                                    handleSubmit(values);
                                                    resetForm('');
                                                }}
                                                validationSchema={validationSchema1}
                                            >
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                            // adapterLocale={locale}
                                                                        >
                                                                            <DatePicker
                                                                                onChange={(value) => {
                                                                                    setFieldValue(`fromDate`, value);
                                                                                }}
                                                                                inputFormat="DD/MM/YYYY"
                                                                                value={values.fromDate}
                                                                                renderInput={(params) => (
                                                                                    <Field
                                                                                        as={TextField}
                                                                                        {...params}
                                                                                        sx={{
                                                                                            width: { xs: 150 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 41
                                                                                            }
                                                                                        }}
                                                                                        InputLabelProps={{
                                                                                            shrink: true
                                                                                        }}
                                                                                        label="From Date"
                                                                                        variant="outlined"
                                                                                        name="fromDate"
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(touched.fromDate && errors.fromDate)}
                                                                                        helperText={
                                                                                            touched.fromDate && errors.fromDate
                                                                                                ? errors.fromDate
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                            // adapterLocale={locale}
                                                                        >
                                                                            <DatePicker
                                                                                onChange={(value) => {
                                                                                    setFieldValue(`toDate`, value);
                                                                                }}
                                                                                inputFormat="DD/MM/YYYY"
                                                                                value={values.toDate}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        sx={{
                                                                                            width: { xs: 150 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 41
                                                                                            }
                                                                                        }}
                                                                                        InputLabelProps={{
                                                                                            shrink: true
                                                                                        }}
                                                                                        label="To Date"
                                                                                        variant="outlined"
                                                                                        name="toDate"
                                                                                        value={values.toDate}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(touched.toDate && errors.toDate)}
                                                                                        helperText={
                                                                                            touched.toDate && errors.toDate
                                                                                                ? errors.toDate
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.currency}
                                                                            name="currency"
                                                                            onChange={(_, value) => {
                                                                                console.log(value);
                                                                                setFieldValue(`currency`, value);
                                                                            }}
                                                                            options={currencyListOptions}
                                                                            getOptionLabel={(option) => `${option.currencyCode}`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.currencyListId === value.currencyListId
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <Field
                                                                                    as={TextField}
                                                                                    {...params}
                                                                                    // label="tax"
                                                                                    sx={{
                                                                                        width: { xs: 150 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    label="Currency"
                                                                                    variant="outlined"
                                                                                    name="currency"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(touched.currency && errors.currency)}
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
                                                                        <TextField
                                                                            label="Max Km"
                                                                            sx={{
                                                                                width: { xs: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="maxKm"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.maxKm}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                setFieldValue('maxKm', e.target.value);
                                                                            }}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.maxKm && errors.maxKm)}
                                                                            helperText={touched.maxKm && errors.maxKm ? errors.maxKm : ''}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.taxCode}
                                                                            name="taxCode"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`taxCode`, value);
                                                                                calculateVehicleTax(
                                                                                    values.vehicleRate,
                                                                                    value,
                                                                                    setFieldValue
                                                                                );
                                                                                calculateDriverRateTax(
                                                                                    values.driverRate,
                                                                                    value,
                                                                                    setFieldValue
                                                                                );
                                                                                calculateAssistantRateTax(
                                                                                    values.assistantRate,
                                                                                    value,
                                                                                    setFieldValue
                                                                                );
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            options={activeTaxGroupandTaxesList}
                                                                            getOptionLabel={(option) => `${option.type}-${option.code}`}
                                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                            renderInput={(params) => (
                                                                                <Field
                                                                                    as={TextField}
                                                                                    {...params}
                                                                                    label="Tax Code"
                                                                                    sx={{
                                                                                        width: { xs: 250 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 41
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    error={Boolean(touched.taxCode && errors.taxCode)}
                                                                                    helperText={
                                                                                        touched.taxCode && errors.taxCode
                                                                                            ? errors.taxCode
                                                                                            : ''
                                                                                    }
                                                                                    variant="outlined"
                                                                                    name="taxCode"
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Vehicle Rate"
                                                                            sx={{
                                                                                width: { xs: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="vehicleRate"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.vehicleRate}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                setFieldValue('vehicleRate', e.target.value);
                                                                                calculateVehicleTax(
                                                                                    e.target.value,
                                                                                    values.taxCode,
                                                                                    setFieldValue
                                                                                );
                                                                            }}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.vehicleRate && errors.vehicleRate)}
                                                                            helperText={
                                                                                touched.vehicleRate && errors.vehicleRate
                                                                                    ? errors.vehicleRate
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid gap="10px" display="flex" style={{ marginTop: '10px' }}>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Vehicle Rate with Tax"
                                                                            sx={{
                                                                                width: { xs: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="vehicleRateWithTax"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.vehicleRateWithTax}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(
                                                                                touched.vehicleRateWithTax && errors.vehicleRateWithTax
                                                                            )}
                                                                            helperText={
                                                                                touched.vehicleRateWithTax && errors.vehicleRateWithTax
                                                                                    ? errors.vehicleRateWithTax
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Driver Rate"
                                                                            sx={{
                                                                                width: { xs: 250 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="driverRate"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.driverRate}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                setFieldValue('driverRate', e.target.value);
                                                                                calculateDriverRateTax(
                                                                                    e.target.value,
                                                                                    values.taxCode,
                                                                                    setFieldValue
                                                                                );
                                                                            }}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.driverRate && errors.driverRate)}
                                                                            helperText={
                                                                                touched.driverRate && errors.driverRate
                                                                                    ? errors.driverRate
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Driver Rate with Tax"
                                                                            sx={{
                                                                                width: { xs: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="driverRateWithTax"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.driverRateWithTax}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(
                                                                                touched.driverRateWithTax && errors.driverRateWithTax
                                                                            )}
                                                                            helperText={
                                                                                touched.driverRateWithTax && errors.driverRateWithTax
                                                                                    ? errors.driverRateWithTax
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Assistant Rate"
                                                                            sx={{
                                                                                width: { xs: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="assistantRate"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.assistantRate}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                setFieldValue('assistantRate', e.target.value);
                                                                                calculateAssistantRateTax(
                                                                                    e.target.value,
                                                                                    values.taxCode,
                                                                                    setFieldValue
                                                                                );
                                                                            }}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.assistantRate && errors.assistantRate)}
                                                                            helperText={
                                                                                touched.assistantRate && errors.assistantRate
                                                                                    ? errors.assistantRate
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Assistant Rate with Tax"
                                                                            sx={{
                                                                                width: { xs: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="assistantWithTax"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.assistantWithTax}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(
                                                                                touched.assistantWithTax && errors.assistantWithTax
                                                                            )}
                                                                            helperText={
                                                                                touched.assistantWithTax && errors.assistantWithTax
                                                                                    ? errors.assistantWithTax
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="status"
                                                                                onChange={handleChange}
                                                                                value={values.status}
                                                                                control={<Switch color="success" />}
                                                                                label="Status"
                                                                                checked={values.status}
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <IconButton aria-label="delete" type="submit">
                                                                            <AddBoxIcon />
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>

                                                            <br />
                                                        </Form>
                                                    );
                                                }}
                                            </Formik>
                                        </>

                                        <Formik
                                            enableReinitialize={true}
                                            initialValues={loadValues}
                                            // initialValues={loadValues}
                                            onSubmit={(values, resetForm) => {
                                                // handleSubmitForm(values);
                                                childToParent(values);
                                                handleClose();
                                            }}
                                            validationSchema={validationSchema}
                                        >
                                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                return (
                                                    <Form>
                                                        <FieldArray name="baggageTransportRateDetails">
                                                            {({ insert, remove, push }) => (
                                                                <Paper>
                                                                    <TableContainer>
                                                                        <Table stickyHeader size="small">
                                                                            <TableHead alignItems="center">
                                                                                <TableRow>
                                                                                    <TableCell>From Date </TableCell>
                                                                                    <TableCell>To Date</TableCell>
                                                                                    <TableCell>Currency</TableCell>
                                                                                    <TableCell>Max KM</TableCell>
                                                                                    <TableCell>Tax Code</TableCell>
                                                                                    <TableCell>Vehicle Rate</TableCell>
                                                                                    <TableCell>Vehicle Rate with Tax</TableCell>
                                                                                    <TableCell>Driver Rate</TableCell>
                                                                                    <TableCell>Driver Rate with Tax</TableCell>
                                                                                    <TableCell>Assistant Rate</TableCell>
                                                                                    <TableCell>Assistant Rate with Tax</TableCell>
                                                                                    <TableCell>Status</TableCell>
                                                                                    <TableCell>Action</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            {/* {tableBodyData ? ( */}
                                                                            <TableBody>
                                                                                {(rowsPerPage > 0
                                                                                    ? values.baggageTransportRateDetails?.slice(
                                                                                          page * rowsPerPage,
                                                                                          page * rowsPerPage + rowsPerPage
                                                                                      )
                                                                                    : values.baggageTransportRateDetails
                                                                                ).map((record, idx) => {
                                                                                    // {values.mainCategoryDetails.map((record, idx) => {
                                                                                    return (
                                                                                        <TableRow key={idx} hover>
                                                                                            <TableCell>
                                                                                                <LocalizationProvider
                                                                                                    dateAdapter={AdapterDayjs}
                                                                                                    // adapterLocale={locale}
                                                                                                >
                                                                                                    <DatePicker
                                                                                                        disabled
                                                                                                        onChange={(value) => {
                                                                                                            console.log(value);
                                                                                                            console.log(ref.current);
                                                                                                            setFieldValue(
                                                                                                                `baggageTransportRateDetails.${idx}.fromDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values
                                                                                                                .baggageTransportRateDetails[
                                                                                                                idx
                                                                                                            ]
                                                                                                                ? values
                                                                                                                      .baggageTransportRateDetails[
                                                                                                                      idx
                                                                                                                  ].fromDate
                                                                                                                : null
                                                                                                        }
                                                                                                        renderInput={(params) => (
                                                                                                            <TextField
                                                                                                                {...params}
                                                                                                                sx={{
                                                                                                                    width: {
                                                                                                                        sm: 200
                                                                                                                    },
                                                                                                                    '& .MuiInputBase-root':
                                                                                                                        {
                                                                                                                            height: 40
                                                                                                                        }
                                                                                                                }}
                                                                                                                variant="outlined"
                                                                                                                name={`baggageTransportRateDetails.${idx}.fromDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </LocalizationProvider>
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <LocalizationProvider
                                                                                                    dateAdapter={AdapterDayjs}
                                                                                                    // adapterLocale={locale}
                                                                                                >
                                                                                                    <DatePicker
                                                                                                        disabled
                                                                                                        onChange={(value) => {
                                                                                                            console.log(value);
                                                                                                            console.log(ref.current);
                                                                                                            setFieldValue(
                                                                                                                `baggageTransportRateDetails.${idx}.toDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values
                                                                                                                .baggageTransportRateDetails[
                                                                                                                idx
                                                                                                            ]
                                                                                                                ? values
                                                                                                                      .baggageTransportRateDetails[
                                                                                                                      idx
                                                                                                                  ].toDate
                                                                                                                : null
                                                                                                        }
                                                                                                        renderInput={(params) => (
                                                                                                            <TextField
                                                                                                                {...params}
                                                                                                                sx={{
                                                                                                                    width: {
                                                                                                                        sm: 200
                                                                                                                    },
                                                                                                                    '& .MuiInputBase-root':
                                                                                                                        {
                                                                                                                            height: 40
                                                                                                                        }
                                                                                                                }}
                                                                                                                variant="outlined"
                                                                                                                name={`baggageTransportRateDetails.${idx}.toDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                                error={false}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </LocalizationProvider>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Autocomplete
                                                                                                    disabled
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].currency
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`baggageTransportRateDetails.${idx}.currency`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value);
                                                                                                        setFieldValue(
                                                                                                            `baggageTransportRateDetails.${idx}.currency`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    options={currencyListOptions}
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.currencyCode}`
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
                                                                                                            variant="outlined"
                                                                                                            name={`baggageTransportRateDetails.${idx}.currency`}
                                                                                                            onBlur={handleBlur}
                                                                                                            error={false}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { xs: 120 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].maxKm
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`baggageTransportRateDetails.${idx}.maxKm`}
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={false}
                                                                                                />
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <Autocomplete
                                                                                                    disabled
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].taxCode
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`baggageTransportRateDetails.${idx}.taxCode`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value);
                                                                                                        setFieldValue(
                                                                                                            `baggageTransportRateDetails.${idx}.taxCode`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    options={activeTaxGroupandTaxesList}
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.type}-${option.code}`
                                                                                                    }
                                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                                        option.id === value.id
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
                                                                                                            variant="outlined"
                                                                                                            name={`baggageTransportRateDetails.${idx}.taxCode`}
                                                                                                            onBlur={handleBlur}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { xs: 120 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    name={`baggageTransportRateDetails.${idx}.vehicleRate`}
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].vehicleRate
                                                                                                            : null
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={false}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { xs: 120 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    name={`baggageTransportRateDetails.${idx}.vehicleRateWithTax`}
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].vehicleRateWithTax
                                                                                                            : null
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={false}
                                                                                                />
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { xs: 120 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    name={`baggageTransportRateDetails.${idx}.driverRate`}
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].driverRate
                                                                                                            : null
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={false}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { xs: 120 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    name={`baggageTransportRateDetails.${idx}.driverRateWithTax`}
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].driverRateWithTax
                                                                                                            : null
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={false}
                                                                                                />
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { xs: 120 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    name={`baggageTransportRateDetails.${idx}.assistantRate`}
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].assistantRate
                                                                                                            : null
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={false}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { xs: 120 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    name={`baggageTransportRateDetails.${idx}.assistantWithTax`}
                                                                                                    value={
                                                                                                        values.baggageTransportRateDetails[
                                                                                                            idx
                                                                                                        ]
                                                                                                            ? values
                                                                                                                  .baggageTransportRateDetails[
                                                                                                                  idx
                                                                                                              ].assistantWithTax
                                                                                                            : null
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={false}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <FormGroup>
                                                                                                    <FormControlLabel
                                                                                                        name={`baggageTransportRateDetails.${idx}.status`}
                                                                                                        onChange={handleChange}
                                                                                                        value={
                                                                                                            values
                                                                                                                .baggageTransportRateDetails[
                                                                                                                idx
                                                                                                            ]
                                                                                                                ? values
                                                                                                                      .baggageTransportRateDetails[
                                                                                                                      idx
                                                                                                                  ].status
                                                                                                                : null
                                                                                                        }
                                                                                                        control={<Switch color="success" />}
                                                                                                        // label="Status"
                                                                                                        checked={
                                                                                                            values
                                                                                                                .baggageTransportRateDetails[
                                                                                                                idx
                                                                                                            ].status
                                                                                                        }
                                                                                                        disabled
                                                                                                        // disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {(values.baggageTransportRateDetails[idx] &&
                                                                                                    values.baggageTransportRateDetails[idx]
                                                                                                        .id) === undefined ? (
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
                                                                                {/* {emptyRows > 0 && (
                                                                                    <TableRow style={{ height: 53 * emptyRows }}>
                                                                                        <TableCell colSpan={6} />
                                                                                    </TableRow>
                                                                                )} */}
                                                                            </TableBody>
                                                                            <TableFooter>
                                                                                <TableRow>
                                                                                    <TablePagination
                                                                                        rowsPerPageOptions={[
                                                                                            5, 10, 25
                                                                                            // { label: 'All', value: -1 }
                                                                                        ]}
                                                                                        count={values.baggageTransportRateDetails.length}
                                                                                        rowsPerPage={rowsPerPage}
                                                                                        page={page}
                                                                                        SelectProps={{
                                                                                            inputProps: {
                                                                                                'aria-label': 'rows per page'
                                                                                            },
                                                                                            native: true
                                                                                        }}
                                                                                        onPageChange={handleChangePage}
                                                                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                                                                        //   ActionsComponent={TablePaginationActions}
                                                                                    />
                                                                                </TableRow>
                                                                            </TableFooter>
                                                                            {/* ) : null} */}
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
                                                        <Box>
                                                            <Grid item>
                                                                {openModal ? (
                                                                    <AlertItemDelete
                                                                        title="dev"
                                                                        open={openModal}
                                                                        handleClose={handleModalClose}
                                                                    />
                                                                ) : null}
                                                            </Grid>

                                                            <Grid item>
                                                                {existOpenModal ? (
                                                                    <AlertItemExist
                                                                        title="Already Exsist !!"
                                                                        open={existOpenModal}
                                                                        handleClose={handleExistModalClose}
                                                                    />
                                                                ) : null}
                                                            </Grid>
                                                        </Box>
                                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                            {mode != 'VIEW' ? (
                                                                <Button
                                                                    variant="outlined"
                                                                    type="button"
                                                                    // onClick={handleClose}
                                                                    style={{
                                                                        // backgroundColor: '#B22222',
                                                                        marginLeft: '10px'
                                                                    }}
                                                                    onClick={(e) => resetForm()}
                                                                >
                                                                    CLEAR
                                                                </Button>
                                                            ) : (
                                                                ''
                                                            )}

                                                            {mode != 'VIEW' ? (
                                                                <Button className="btnSave" variant="contained" type="submit">
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

export default BaggaeTransportRateDetails;
