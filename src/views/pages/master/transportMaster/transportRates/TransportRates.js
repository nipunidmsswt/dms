import { useEffect, useState } from 'react';
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
    Checkbox,
    Button,
    Typography,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Switch,
    Paper,
    TableContainer,
    Collapse,
    Autocomplete
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';

import { checkDuplicateSeasonCode, getSeasonDataById, saveSeasonData, updateSeasonData } from 'store/actions/masterActions/SeasonAction';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import { getAllChargeMethods, getAllModeofTransports } from 'store/actions/masterActions/TransportRateAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getAllCurrencyListData } from 'store/actions/masterActions/ExpenseTypeAction';
import { getAllTaxData } from 'store/actions/masterActions/TaxActions/TaxAction';
import { getAllActiveMarketData } from 'store/actions/masterActions/operatorActions/MarketAction';
function TransportRates({ open, handleClose, mode, code }) {
    const initialValues = {
        chargeMethod2: 'BY_DISTANCE',
        chargeMethod1: '',
        transportMode: '',
        code: '',
        description: '',
        status: true,
        direction: '',
        maxPax: '',
        newTransport: true,
        distances: [
            {
                fromLocation: null,
                toLocation: null,
                fromDescription: '',
                toDescription: '',
                distance: '',
                duration: ''
            }
        ],
        paxBaggages: [
            {
                paxPaggegeType: '',
                minPax: '',
                vehicleName: '',
                noOfDrivers: '',
                maxPax: '',
                defaultGuide: '',
                status: '',
                noOfAssistant: '',
                fromDate: '',
                toDate: '',
                currencyCode: null,
                rateType: '',
                taxCodeKmRate: null,
                taxKmRate: '',
                rateKmRate: '',
                rateWithoutTaxKmRate: '',
                rateWithTaxKmRate: '',
                taxCodeDriverRate: null,
                taxDriverRate: '',
                rateDriverRate: '',
                rateWithoutTaxDriverRate: '',
                rateWithTaxDriverRate: '',
                taxCodeAssistantRate: null,
                taxAssistantRate: '',
                rateAssistantRate: '',
                rateWithoutTaxAssistantRatee: '',
                rateWithTaxAssistantRate: ''
            }
        ],
        locationWiseExpenses: [
            {
                location: null,
                locationDescription: '',
                expenseCode: '',
                expenseDescription: '',
                status: ''
            }
        ],
        vehiclePaxRates: [
            {
                fromDate: '',
                toDate: '',
                marketCode: null,
                operatorCode: null,
                operatorGroupCode: null,
                currency: null,
                taxCode: null,
                tax: '',
                charterRate: '',
                charterRatewithTax: '',
                charterRatewithoutTax: ''
            }
        ]
    };

    const [taxListOptions, setTaxListOptions] = useState([]);
    const [getchargeMethod, setchargeMethod] = useState('');
    const [loadValues, setLoadValues] = useState(null);
    const [chargeMethodArrayList, setChargeMethodArrayList] = useState([]);
    const [modeofTransportArrayList, setModeofTransportArrayList] = useState([]);
    const [activeLocationList, setActiveocationList] = useState([]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);
    const [activeMarketList, setActiveMarketList] = useState([]);

    const [enableFeature, setEnableFeature] = useState('');
    const [openRow, setOpenRow] = useState(-1);

    //Distances
    const [enableblock1, setEnableblock1] = useState(false);
    //Pax/Baggage Vs Vehicle
    const [enableblock2, setEnableblock2] = useState(false);
    //Location wise Expenses
    const [enableblock3, setEnableblock3] = useState(false);
    //Per Km Rate
    const [enableblock4, setEnableblock4] = useState(false);
    //Per Hr Rate
    const [enableblock5, setEnableblock5] = useState(false);
    //Per Vehicle  Rate or  Per Pax  Rate
    const [enableblock6, setEnableblock6] = useState(false);

    const featureList = [];
    useEffect(() => {
        if (enableFeature === 'BY_DISTANCE') {
            setEnableblock1(true);
            setEnableblock2(true);
            setEnableblock3(true);
            setEnableblock4(true);
            setEnableblock6(false);
        } else if (enableFeature === 'BY_TIME') {
            setEnableblock1(true);
            setEnableblock2(true);
            setEnableblock3(true);
            setEnableblock5(true);
            setEnableblock4(false);
        } else if (enableFeature === 'PER_VEHICLE') {
            setchargeMethod('PER_VEHICLE');
            setEnableblock1(true);
            setEnableblock6(true);
            setEnableblock2(false);
            setEnableblock3(false);
            setEnableblock4(false);
            setEnableblock5(false);
        } else if (enableFeature === 'PER_PAX') {
            setchargeMethod('PER_PAX');
            setEnableblock1(true);
            setEnableblock6(true);
            setEnableblock2(false);
            setEnableblock3(false);
            setEnableblock4(false);
            setEnableblock5(false);
        }
    }, [enableFeature]);

    const validationSchema = yup.object().shape({
        mainSeason: yup.string().required('Required field'),
        //   .checkDuplicateSeason("Duplicate Code"),
        distances: yup.array().of(
            yup.object().shape({
                subSeason: yup.string().required('Required field'),
                toDate: yup.date().required('Required field'),
                fromDate: yup.date().required('Required field')
            })
        )
        //   .uniqueTaxOrder("Must be unique")
        //   .uniqueTaxCode("Must be unique"),
    });

    //get data from reducers

    const seasonToUpdate = useSelector((state) => state.seasonReducer.seasonToUpdate);
    const duplicateSeason = useSelector((state) => state.seasonReducer.duplicateSeason);
    const modeofTransportList = useSelector((state) => state.modeOfTransortReducer.modeofTransports);
    const chargeMethodList = useSelector((state) => state.chargeMethodReducer.chargeofMethods);
    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const taxListData = useSelector((state) => state.taxReducer.taxes);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const marketActiveListData = useSelector((state) => state.marketReducer.marketActiveList);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('update');
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log(code);
            dispatch(getSeasonDataById(code));
        }
    }, [mode]);

    useEffect(() => {
        if (taxListData != null) {
            setTaxListOptions(taxListData);
        }
    }, [taxListData]);

    useEffect(() => {
        if (marketActiveListData != null) {
            setActiveMarketList(marketActiveListData);
        }
    }, [marketActiveListData]);

    useEffect(() => {
        console.log(activeLocations);
        setActiveocationList(activeLocations);
    }, [activeLocations]);

    useEffect(() => {
        setModeofTransportArrayList(modeofTransportList);
        console.log(modeofTransportList);
    }, [modeofTransportList]);

    useEffect(() => {
        setChargeMethodArrayList(chargeMethodList);
    }, [chargeMethodList]);

    useEffect(() => {
        console.log(currencyListData);
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);

    useEffect(() => {
        console.log(seasonToUpdate);

        if ((mode === 'VIEW_UPDATE' && seasonToUpdate != null) || (mode === 'VIEW' && seasonToUpdate != null)) {
            setLoadValues(seasonToUpdate);
        }
    }, [seasonToUpdate]);

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            // dispatch(saveSeasonData(data));
        } else if (mode === 'VIEW_UPDATE') {
            console.log('yes click');
            // dispatch(updateSeasonData(data));
        }
        handleClose();
    };

    useEffect(() => {
        dispatch(getAllChargeMethods());
        dispatch(getAllModeofTransports());
        dispatch(getActiveLocations());
        dispatch(getAllCurrencyListData());
        dispatch(getAllTaxData());
        dispatch(getAllActiveMarketData());
        setEnableblock1(true);
        setEnableblock2(true);
        setEnableblock3(true);
    }, []);

    const handleCancel = () => {
        setLoadValues(initialValues);
    };
    return (
        <div>
            <Dialog maxWidth="220px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}{' '}
                            Transport Rates
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
                                                            <Grid display="flex" style={{ marginBottom: '10px', marginTop: '10px' }}>
                                                                <Grid item>
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Mode of Transport"
                                                                        name="transportMode"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.transportMode}
                                                                        error={Boolean(touched.transportMode && errors.transportMode)}
                                                                        helperText={
                                                                            touched.transportMode && errors.transportMode
                                                                                ? errors.transportMode
                                                                                : ''
                                                                        }
                                                                    >
                                                                        {modeofTransportArrayList.length != 0
                                                                            ? modeofTransportArrayList.map((data, key) => {
                                                                                  return (
                                                                                      <MenuItem key={key} value={data}>
                                                                                          {data}
                                                                                      </MenuItem>
                                                                                  );
                                                                              })
                                                                            : null}
                                                                    </TextField>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid display="flex" style={{ marginBottom: '10px', marginTop: '10px' }}>
                                                                <Grid item>
                                                                    <Typography variant="h4">Type of Transport</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid gap="10px" display="flex">
                                                                <Grid
                                                                    item
                                                                    display="flex"
                                                                    style={{
                                                                        alignItems: 'center',
                                                                        //   marginTop: "10px",
                                                                        marginBottom: '10px'
                                                                    }}
                                                                >
                                                                    <Typography variant="" component="p" style={{ marginRight: '10px' }}>
                                                                        Create New Type of Transport
                                                                    </Typography>

                                                                    <FormGroup>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    name="newTransport"
                                                                                    onChange={handleChange}
                                                                                    checked={values.newTransport}
                                                                                    value={values.newTransport}
                                                                                />
                                                                            }
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid gap="10px" display="flex" style={{ marginBottom: '10px' }}>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Code"
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE'}
                                                                        type="text"
                                                                        variant="outlined"
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
                                                                        label="Description"
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        name="description"
                                                                        value={values.description}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        error={Boolean(touched.description && errors.description)}
                                                                        helperText={
                                                                            touched.description && errors.description
                                                                                ? errors.description
                                                                                : ''
                                                                        }
                                                                    />
                                                                </Grid>
                                                                <Grid>
                                                                    {/* <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Change Method"
                                                                        name="chargeMethod1"
                                                                        onChange={(value) => {
                                                                            handleChange;
                                                                            // setEnableFeature(value.target.value);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        value={values.chargeMethod1}
                                                                        // error={Boolean(touched.chargeMethod1 && errors.chargeMethod1)}
                                                                        // helperText={
                                                                        //     touched.chargeMethod && errors.chargeMethod
                                                                        //         ? errors.chargeMethod
                                                                        //         : ''
                                                                        // }
                                                                    >
                                                                        {chargeMethodArrayList.length != 0
                                                                            ? chargeMethodArrayList.map((data, key) => {
                                                                                  return (
                                                                                      <MenuItem key={key} value={data}>
                                                                                          {data}
                                                                                      </MenuItem>
                                                                                  );
                                                                              })
                                                                            : null}
                                                                    </TextField> */}
                                                                    {/* <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Charge Method"
                                                                        name="chargeMethod1"
                                                                        onChange={(value) => {
                                                                            handleChange;
                                                                            setEnableFeature(value.target.value);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        value={values.chargeMethod1}
                                                                        error={Boolean(touched.chargeMethod1 && errors.chargeMethod1)}
                                                                        helperText={
                                                                            touched.chargeMethod1 && errors.chargeMethod1
                                                                                ? errors.chargeMethod1
                                                                                : ''
                                                                        }
                                                                    >
                                                                        {chargeMethodArrayList.length != 0
                                                                            ? chargeMethodArrayList.map((data, key) => {
                                                                                  return (
                                                                                      <MenuItem key={key} value={data}>
                                                                                          {data}
                                                                                      </MenuItem>
                                                                                  );
                                                                              })
                                                                            : null}
                                                                    </TextField> */}
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Charge Method"
                                                                        name="chargeMethod2"
                                                                        // onChange={handleChange}
                                                                        onChange={(e) => {
                                                                            // console.log("field value change");
                                                                            handleChange(e);
                                                                            setEnableFeature(e.target.value);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        value={values.chargeMethod2}
                                                                        error={Boolean(touched.chargeMethod2 && errors.chargeMethod2)}
                                                                        helperText={
                                                                            touched.chargeMethod2 && errors.chargeMethod2
                                                                                ? errors.chargeMethod2
                                                                                : ''
                                                                        }
                                                                    >
                                                                        {chargeMethodArrayList.length != 0
                                                                            ? chargeMethodArrayList.map((data, key) => {
                                                                                  return (
                                                                                      <MenuItem key={key} value={data}>
                                                                                          {data}
                                                                                      </MenuItem>
                                                                                  );
                                                                              })
                                                                            : null}
                                                                    </TextField>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid gap="10px" display="flex">
                                                                <Grid item>
                                                                    {' '}
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Direction"
                                                                        name="direction"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.direction}
                                                                        error={Boolean(touched.direction && errors.direction)}
                                                                        helperText={
                                                                            touched.direction && errors.direction ? errors.direction : ''
                                                                        }
                                                                    >
                                                                        <MenuItem dense={true} value={'One Way'}>
                                                                            One Way
                                                                        </MenuItem>
                                                                        <MenuItem dense={true} value={'Return'}>
                                                                            Return
                                                                        </MenuItem>
                                                                    </TextField>
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Max Pax"
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        name="maxPax"
                                                                        value={values.maxPax}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        error={Boolean(touched.maxPax && errors.maxPax)}
                                                                        helperText={touched.maxPax && errors.maxPax ? errors.maxPax : ''}
                                                                    />
                                                                </Grid>
                                                                <Grid>
                                                                    <FormGroup>
                                                                        <FormControlLabel
                                                                            name="status"
                                                                            onChange={handleChange}
                                                                            value={values.status}
                                                                            control={<Switch color="success" />}
                                                                            label="Status"
                                                                            checked={values.status}
                                                                            disabled={mode == 'VIEW'}
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock1 ? 'flex' : 'none'}
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <Typography variant="h4">Distances</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock1 ? 'flex' : 'none'}
                                                                gap="10px"
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <FieldArray name="distances">
                                                                        {({ insert, remove, push }) => (
                                                                            <Paper>
                                                                                {mode != 'VIEW' ? (
                                                                                    <Box display="flex" flexDirection="row-reverse">
                                                                                        <IconButton
                                                                                            aria-label="delete"
                                                                                            onClick={() => {
                                                                                                push({
                                                                                                    fromLocation: null,
                                                                                                    toLocation: null,
                                                                                                    fromDescription: '',
                                                                                                    toDescription: true,
                                                                                                    distance: '',
                                                                                                    duration: ''
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
                                                                                                <TableCell>From Location</TableCell>
                                                                                                <TableCell>Description</TableCell>
                                                                                                <TableCell>To Location</TableCell>
                                                                                                <TableCell>Description</TableCell>
                                                                                                <TableCell>Distances(KM)</TableCell>
                                                                                                <TableCell>Duration(Hours)</TableCell>
                                                                                                <TableCell>Status</TableCell>
                                                                                                <TableCell>Action</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {values.distances.map((record, idx) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <TableRow key={idx} hover>
                                                                                                            <TableCell>
                                                                                                                <Autocomplete
                                                                                                                    value={
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            ? values
                                                                                                                                  .distances[
                                                                                                                                  idx
                                                                                                                              ].fromLocation
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    name={`distances.${idx}.fromLocation`}
                                                                                                                    onChange={(
                                                                                                                        _,
                                                                                                                        value
                                                                                                                    ) => {
                                                                                                                        setFieldValue(
                                                                                                                            `distances.${idx}.fromLocation`,
                                                                                                                            value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    options={
                                                                                                                        activeLocationList
                                                                                                                    }
                                                                                                                    getOptionLabel={(
                                                                                                                        option
                                                                                                                    ) => `${option.code}`}
                                                                                                                    isOptionEqualToValue={(
                                                                                                                        option,
                                                                                                                        value
                                                                                                                    ) =>
                                                                                                                        option.location_id ===
                                                                                                                        value.location_id
                                                                                                                    }
                                                                                                                    renderInput={(
                                                                                                                        params
                                                                                                                    ) => (
                                                                                                                        <TextField
                                                                                                                            {...params}
                                                                                                                            // label="tax"
                                                                                                                            sx={{
                                                                                                                                width: {
                                                                                                                                    sm: 200
                                                                                                                                },
                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                    {
                                                                                                                                        height: 40
                                                                                                                                    }
                                                                                                                            }}
                                                                                                                            placeholder="--Select a Location --"
                                                                                                                            variant="outlined"
                                                                                                                            name={`distances.${idx}.fromLocation`}
                                                                                                                            onBlur={
                                                                                                                                handleBlur
                                                                                                                            }
                                                                                                                            helperText={
                                                                                                                                touched.distances &&
                                                                                                                                touched
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .fromLocation &&
                                                                                                                                errors.distances &&
                                                                                                                                errors
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .fromLocation
                                                                                                                                    ? errors
                                                                                                                                          .distances[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .fromLocation
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            error={Boolean(
                                                                                                                                touched.distances &&
                                                                                                                                    touched
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .fromLocation &&
                                                                                                                                    errors.distances &&
                                                                                                                                    errors
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .fromLocation
                                                                                                                            )}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`distances.${idx}.fromDescription`}
                                                                                                                    value={
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ].fromDescription
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.distances &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .fromDescription &&
                                                                                                                            errors.distances &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .fromDescription
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.distances &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ].fromDescription &&
                                                                                                                        errors.distances &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ].fromDescription
                                                                                                                            ? errors
                                                                                                                                  .distances[
                                                                                                                                  idx
                                                                                                                              ]
                                                                                                                                  .fromDescription
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <Autocomplete
                                                                                                                    value={
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            ? values
                                                                                                                                  .distances[
                                                                                                                                  idx
                                                                                                                              ].toLocation
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    name={`distances.${idx}.toLocation`}
                                                                                                                    onChange={(
                                                                                                                        _,
                                                                                                                        value
                                                                                                                    ) => {
                                                                                                                        setFieldValue(
                                                                                                                            `distances.${idx}.toLocation`,
                                                                                                                            value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    options={
                                                                                                                        activeLocationList
                                                                                                                    }
                                                                                                                    getOptionLabel={(
                                                                                                                        option
                                                                                                                    ) => `${option.code}`}
                                                                                                                    isOptionEqualToValue={(
                                                                                                                        option,
                                                                                                                        value
                                                                                                                    ) =>
                                                                                                                        option.location_id ===
                                                                                                                        value.location_id
                                                                                                                    }
                                                                                                                    renderInput={(
                                                                                                                        params
                                                                                                                    ) => (
                                                                                                                        <TextField
                                                                                                                            {...params}
                                                                                                                            // label="tax"
                                                                                                                            sx={{
                                                                                                                                width: {
                                                                                                                                    sm: 200
                                                                                                                                },
                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                    {
                                                                                                                                        height: 40
                                                                                                                                    }
                                                                                                                            }}
                                                                                                                            placeholder="--Select a Location --"
                                                                                                                            variant="outlined"
                                                                                                                            name={`distances.${idx}.fromLocation`}
                                                                                                                            onBlur={
                                                                                                                                handleBlur
                                                                                                                            }
                                                                                                                            helperText={
                                                                                                                                touched.distances &&
                                                                                                                                touched
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .toLocation &&
                                                                                                                                errors.distances &&
                                                                                                                                errors
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .distances[
                                                                                                                                    idx
                                                                                                                                ].toLocation
                                                                                                                                    ? errors
                                                                                                                                          .distances[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .toLocation
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            error={Boolean(
                                                                                                                                touched.distances &&
                                                                                                                                    touched
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .toLocation &&
                                                                                                                                    errors.distances &&
                                                                                                                                    errors
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .toLocation
                                                                                                                            )}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TableCell>

                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`distances.${idx}.toDescription`}
                                                                                                                    value={
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ].toDescription
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.distances &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .toDescription &&
                                                                                                                            errors.distances &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ].toDescription
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.distances &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ].toDescription &&
                                                                                                                        errors.distances &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ].toDescription
                                                                                                                            ? errors
                                                                                                                                  .distances[
                                                                                                                                  idx
                                                                                                                              ]
                                                                                                                                  .toDescription
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`distances.${idx}.distance`}
                                                                                                                    value={
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ].distance
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.distances &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ].distance &&
                                                                                                                            errors.distances &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ].distance
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.distances &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ].distance &&
                                                                                                                        errors.distances &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ].distance
                                                                                                                            ? errors
                                                                                                                                  .distances[
                                                                                                                                  idx
                                                                                                                              ].distance
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`distances.${idx}.duration`}
                                                                                                                    value={
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.distances[
                                                                                                                            idx
                                                                                                                        ].duration
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.distances &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ].duration &&
                                                                                                                            errors.distances &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .distances[
                                                                                                                                idx
                                                                                                                            ].duration
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.distances &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.distances[
                                                                                                                            idx
                                                                                                                        ].duration &&
                                                                                                                        errors.distances &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.distances[
                                                                                                                            idx
                                                                                                                        ].duration
                                                                                                                            ? errors
                                                                                                                                  .distances[
                                                                                                                                  idx
                                                                                                                              ].duration
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <FormGroup>
                                                                                                                    <FormControlLabel
                                                                                                                        control={
                                                                                                                            <Checkbox
                                                                                                                                name={`distances.${idx}.status`}
                                                                                                                                onChange={
                                                                                                                                    handleChange
                                                                                                                                }
                                                                                                                                checked={
                                                                                                                                    values
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ].status
                                                                                                                                }
                                                                                                                                value={
                                                                                                                                    values
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    values
                                                                                                                                        .distances[
                                                                                                                                        idx
                                                                                                                                    ].status
                                                                                                                                }
                                                                                                                            />
                                                                                                                        }
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
                                                                                                    </>
                                                                                                );
                                                                                            })}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Paper>
                                                                        )}
                                                                    </FieldArray>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock2 ? 'flex' : 'none'}
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <Typography variant="h4">Pax/Baggage Vs Vehicle</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock2 ? 'flex' : 'none'}
                                                                gap="10px"
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <FieldArray name="paxBaggages">
                                                                        {({ insert, remove, push }) => (
                                                                            <Paper>
                                                                                {mode != 'VIEW' ? (
                                                                                    <Box display="flex" flexDirection="row-reverse">
                                                                                        <IconButton
                                                                                            aria-label="delete"
                                                                                            onClick={() => {
                                                                                                push({
                                                                                                    paxPaggegeType: '',
                                                                                                    minPax: '',
                                                                                                    vehicleName: '',
                                                                                                    noOfDrivers: '',
                                                                                                    maxPax: '',
                                                                                                    defaultGuide: '',
                                                                                                    status: '',
                                                                                                    noOfAssistant: '',
                                                                                                    fromDate: '',
                                                                                                    toDate: '',
                                                                                                    currencyCode: null,
                                                                                                    rateType: '',
                                                                                                    taxCodeKmRate: null,
                                                                                                    // taxKmRate: '',
                                                                                                    rateKmRate: '',
                                                                                                    rateWithoutTaxKmRate: '',
                                                                                                    rateWithTaxKmRate: '',
                                                                                                    taxCodeDriverRate: null,
                                                                                                    // taxDriverRate: '',
                                                                                                    rateDriverRate: '',
                                                                                                    rateWithoutTaxDriverRate: '',
                                                                                                    rateWithTaxDriverRate: '',
                                                                                                    taxCodeAssistantRate: null,
                                                                                                    // taxAssistantRate: '',
                                                                                                    rateAssistantRate: '',
                                                                                                    rateWithoutTaxAssistantRatee: '',
                                                                                                    rateWithTaxAssistantRate: ''
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
                                                                                                <TableCell>Collapsed?</TableCell>
                                                                                                <TableCell>Pax/Baggage Type</TableCell>
                                                                                                <TableCell>Min Pax</TableCell>
                                                                                                <TableCell>Vehicle Name</TableCell>
                                                                                                {/* <TableCell>Free</TableCell> */}
                                                                                                <TableCell>No of Drivers</TableCell>
                                                                                                <TableCell>Max Pax</TableCell>
                                                                                                <TableCell>Default Guide</TableCell>
                                                                                                <TableCell>No of Assistant</TableCell>
                                                                                                <TableCell>Status</TableCell>
                                                                                                <TableCell>Action</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {values.paxBaggages.map((record, idx) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <TableRow key={idx} hover>
                                                                                                            <TableCell>
                                                                                                                <IconButton
                                                                                                                    aria-label="expand row"
                                                                                                                    size="small"
                                                                                                                    onClick={() =>
                                                                                                                        setOpenRow(
                                                                                                                            openRow === idx
                                                                                                                                ? -1
                                                                                                                                : idx
                                                                                                                        )
                                                                                                                    }
                                                                                                                >
                                                                                                                    {openRow === idx ? (
                                                                                                                        <KeyboardArrowUpIcon />
                                                                                                                    ) : (
                                                                                                                        <KeyboardArrowDownIcon />
                                                                                                                    )}
                                                                                                                </IconButton>
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    select
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`paxBaggages.${idx}.paxPaggegeType`}
                                                                                                                    disabled={
                                                                                                                        mode ==
                                                                                                                        'VIEW_UPDATE'
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].paxPaggegeType
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.paxBaggages &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .paxPaggegeType &&
                                                                                                                            errors.paxBaggages &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].paxPaggegeType
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.paxBaggages &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].paxPaggegeType &&
                                                                                                                        errors.paxBaggages &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].paxPaggegeType
                                                                                                                            ? errors
                                                                                                                                  .paxBaggages[
                                                                                                                                  idx
                                                                                                                              ]
                                                                                                                                  .paxPaggegeType
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                >
                                                                                                                    <MenuItem
                                                                                                                        dense={true}
                                                                                                                        value={'Client'}
                                                                                                                    >
                                                                                                                        Client
                                                                                                                    </MenuItem>
                                                                                                                    <MenuItem
                                                                                                                        dense={true}
                                                                                                                        value={'Baggage'}
                                                                                                                    >
                                                                                                                        Baggage
                                                                                                                    </MenuItem>
                                                                                                                </TextField>
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`paxBaggages.${idx}.minPax`}
                                                                                                                    value={
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].minPax
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.paxBaggages &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].minPax &&
                                                                                                                            errors.paxBaggages &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].minPax
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.paxBaggages &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].minPax &&
                                                                                                                        errors.paxBaggages &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].minPax
                                                                                                                            ? errors
                                                                                                                                  .paxBaggages[
                                                                                                                                  idx
                                                                                                                              ].minPax
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>

                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`paxBaggages.${idx}.vehicleName`}
                                                                                                                    value={
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].vehicleName
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.paxBaggages &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].vehicleName &&
                                                                                                                            errors.paxBaggages &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].vehicleName
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.paxBaggages &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].vehicleName &&
                                                                                                                        errors.paxBaggages &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].vehicleName
                                                                                                                            ? errors
                                                                                                                                  .paxBaggages[
                                                                                                                                  idx
                                                                                                                              ].vehicleName
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>

                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`paxBaggages.${idx}.noOfDrivers`}
                                                                                                                    value={
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].noOfDrivers
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.paxBaggages &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].noOfDrivers &&
                                                                                                                            errors.paxBaggages &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].noOfDrivers
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.paxBaggages &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].noOfDrivers &&
                                                                                                                        errors.paxBaggages &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].noOfDrivers
                                                                                                                            ? errors
                                                                                                                                  .paxBaggages[
                                                                                                                                  idx
                                                                                                                              ].noOfDrivers
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`paxBaggages.${idx}.maxPax`}
                                                                                                                    value={
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].maxPax
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.paxBaggages &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].maxPax &&
                                                                                                                            errors.paxBaggages &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].maxPax
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.paxBaggages &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].maxPax &&
                                                                                                                        errors.paxBaggages &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].maxPax
                                                                                                                            ? errors
                                                                                                                                  .paxBaggages[
                                                                                                                                  idx
                                                                                                                              ].maxPax
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`paxBaggages.${idx}.defaultGuide`}
                                                                                                                    value={
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].defaultGuide
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.paxBaggages &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .defaultGuide &&
                                                                                                                            errors.paxBaggages &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].defaultGuide
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.paxBaggages &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].defaultGuide &&
                                                                                                                        errors.paxBaggages &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].defaultGuide
                                                                                                                            ? errors
                                                                                                                                  .paxBaggages[
                                                                                                                                  idx
                                                                                                                              ].defaultGuide
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`paxBaggages.${idx}.noOfAssistant`}
                                                                                                                    value={
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].noOfAssistant
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.paxBaggages &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .noOfAssistant &&
                                                                                                                            errors.paxBaggages &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .paxBaggages[
                                                                                                                                idx
                                                                                                                            ].noOfAssistant
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.paxBaggages &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].noOfAssistant &&
                                                                                                                        errors.paxBaggages &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors.paxBaggages[
                                                                                                                            idx
                                                                                                                        ].noOfAssistant
                                                                                                                            ? errors
                                                                                                                                  .paxBaggages[
                                                                                                                                  idx
                                                                                                                              ]
                                                                                                                                  .noOfAssistant
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <FormGroup>
                                                                                                                    <FormControlLabel
                                                                                                                        control={
                                                                                                                            <Checkbox
                                                                                                                                name={`distances.${idx}.status`}
                                                                                                                                onChange={
                                                                                                                                    handleChange
                                                                                                                                }
                                                                                                                                checked={
                                                                                                                                    values
                                                                                                                                        .paxBaggages[
                                                                                                                                        idx
                                                                                                                                    ].status
                                                                                                                                }
                                                                                                                                value={
                                                                                                                                    values
                                                                                                                                        .paxBaggages[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    values
                                                                                                                                        .paxBaggages[
                                                                                                                                        idx
                                                                                                                                    ].status
                                                                                                                                }
                                                                                                                            />
                                                                                                                        }
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
                                                                                                        <TableRow>
                                                                                                            <TableCell
                                                                                                                colSpan={5}
                                                                                                                sx={{
                                                                                                                    paddingBottom: 0,
                                                                                                                    paddingTop: 0,
                                                                                                                    border: '0px'
                                                                                                                }}
                                                                                                            >
                                                                                                                <Collapse
                                                                                                                    in={openRow === idx}
                                                                                                                    timeout="auto"
                                                                                                                    unmountOnExit
                                                                                                                >
                                                                                                                    <Box
                                                                                                                        sx={{
                                                                                                                            width: '100%',
                                                                                                                            // backgroundColor:
                                                                                                                            //     'rgba(50,50,50,0.4)',
                                                                                                                            minHeight: 36,
                                                                                                                            textAlign:
                                                                                                                                'center',
                                                                                                                            alignItems:
                                                                                                                                'center',
                                                                                                                            fontSize: 18,
                                                                                                                            marginLeft: 10,
                                                                                                                            marginTop: 1,
                                                                                                                            marginBottom: 1
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Grid
                                                                                                                            gap="10px"
                                                                                                                            display="flex"
                                                                                                                        >
                                                                                                                            <Grid item>
                                                                                                                                <LocalizationProvider
                                                                                                                                    dateAdapter={
                                                                                                                                        AdapterDayjs
                                                                                                                                    }
                                                                                                                                    // adapterLocale={locale}
                                                                                                                                >
                                                                                                                                    <DatePicker
                                                                                                                                        disabled={
                                                                                                                                            mode ==
                                                                                                                                            'VIEW_UPDATE'
                                                                                                                                        }
                                                                                                                                        onChange={(
                                                                                                                                            value
                                                                                                                                        ) => {
                                                                                                                                            console.log(
                                                                                                                                                value
                                                                                                                                            );
                                                                                                                                            console.log(
                                                                                                                                                ref.current
                                                                                                                                            );
                                                                                                                                            setFieldValue(
                                                                                                                                                `paxBaggages.${idx}.fromDate`,
                                                                                                                                                value
                                                                                                                                            );
                                                                                                                                        }}
                                                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                                                        value={
                                                                                                                                            values
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            values
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .fromDate
                                                                                                                                        }
                                                                                                                                        renderInput={(
                                                                                                                                            params
                                                                                                                                        ) => (
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
                                                                                                                                                name={`paxBaggages.${idx}.fromDate`}
                                                                                                                                                onBlur={
                                                                                                                                                    handleBlur
                                                                                                                                                }
                                                                                                                                                error={Boolean(
                                                                                                                                                    touched.paxBaggages &&
                                                                                                                                                        touched
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ] &&
                                                                                                                                                        touched
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ]
                                                                                                                                                            .fromDate &&
                                                                                                                                                        errors.paxBaggages &&
                                                                                                                                                        errors
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ] &&
                                                                                                                                                        errors
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ]
                                                                                                                                                            .fromDate
                                                                                                                                                )}
                                                                                                                                                helperText={
                                                                                                                                                    touched.paxBaggages &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .fromDate &&
                                                                                                                                                    errors.paxBaggages &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .fromDate
                                                                                                                                                        ? errors
                                                                                                                                                              .paxBaggages[
                                                                                                                                                              idx
                                                                                                                                                          ]
                                                                                                                                                              .fromDate
                                                                                                                                                        : ''
                                                                                                                                                }
                                                                                                                                            />
                                                                                                                                        )}
                                                                                                                                    />
                                                                                                                                </LocalizationProvider>
                                                                                                                            </Grid>
                                                                                                                            <Grid item>
                                                                                                                                <LocalizationProvider
                                                                                                                                    dateAdapter={
                                                                                                                                        AdapterDayjs
                                                                                                                                    }
                                                                                                                                    // adapterLocale={locale}
                                                                                                                                >
                                                                                                                                    <DatePicker
                                                                                                                                        disabled={
                                                                                                                                            mode ==
                                                                                                                                            'VIEW_UPDATE'
                                                                                                                                        }
                                                                                                                                        onChange={(
                                                                                                                                            value
                                                                                                                                        ) => {
                                                                                                                                            setFieldValue(
                                                                                                                                                `paxBaggages.${idx}.toDate`,
                                                                                                                                                value
                                                                                                                                            );
                                                                                                                                        }}
                                                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                                                        value={
                                                                                                                                            values
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            values
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .toDate
                                                                                                                                        }
                                                                                                                                        renderInput={(
                                                                                                                                            params
                                                                                                                                        ) => (
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
                                                                                                                                                name={`paxBaggages.${idx}.toDate`}
                                                                                                                                                onBlur={
                                                                                                                                                    handleBlur
                                                                                                                                                }
                                                                                                                                                error={Boolean(
                                                                                                                                                    touched.paxBaggages &&
                                                                                                                                                        touched
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ] &&
                                                                                                                                                        touched
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ]
                                                                                                                                                            .toDate &&
                                                                                                                                                        errors.paxBaggages &&
                                                                                                                                                        errors
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ] &&
                                                                                                                                                        errors
                                                                                                                                                            .paxBaggages[
                                                                                                                                                            idx
                                                                                                                                                        ]
                                                                                                                                                            .toDate
                                                                                                                                                )}
                                                                                                                                                helperText={
                                                                                                                                                    touched.paxBaggages &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .toDate &&
                                                                                                                                                    errors.paxBaggages &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .toDate
                                                                                                                                                        ? errors
                                                                                                                                                              .paxBaggages[
                                                                                                                                                              idx
                                                                                                                                                          ]
                                                                                                                                                              .toDate
                                                                                                                                                        : ''
                                                                                                                                                }
                                                                                                                                            />
                                                                                                                                        )}
                                                                                                                                    />
                                                                                                                                </LocalizationProvider>
                                                                                                                            </Grid>
                                                                                                                            <Grid>
                                                                                                                                <Autocomplete
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            ? values
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .currencyCode
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                    name={`paxBaggages.${idx}.currencyCode`}
                                                                                                                                    onChange={(
                                                                                                                                        _,
                                                                                                                                        value
                                                                                                                                    ) => {
                                                                                                                                        console.log(
                                                                                                                                            value
                                                                                                                                        );
                                                                                                                                        setFieldValue(
                                                                                                                                            `paxBaggages.${idx}.currencyCode`,
                                                                                                                                            value
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                    options={
                                                                                                                                        currencyListOptions
                                                                                                                                    }
                                                                                                                                    getOptionLabel={(
                                                                                                                                        option
                                                                                                                                    ) =>
                                                                                                                                        `${option.currencyCode} - (${option.currencyDescription})`
                                                                                                                                    }
                                                                                                                                    isOptionEqualToValue={(
                                                                                                                                        option,
                                                                                                                                        value
                                                                                                                                    ) =>
                                                                                                                                        option.currencyListId ===
                                                                                                                                        value.currencyListId
                                                                                                                                    }
                                                                                                                                    renderInput={(
                                                                                                                                        params
                                                                                                                                    ) => (
                                                                                                                                        <TextField
                                                                                                                                            {...params}
                                                                                                                                            // label="tax"
                                                                                                                                            sx={{
                                                                                                                                                width: {
                                                                                                                                                    sm: 200
                                                                                                                                                },
                                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                                    {
                                                                                                                                                        height: 40
                                                                                                                                                    }
                                                                                                                                            }}
                                                                                                                                            // placeholder="--Select a Tax Code --"
                                                                                                                                            variant="outlined"
                                                                                                                                            name={`paxBaggages.${idx}.currencyCode`}
                                                                                                                                            onBlur={
                                                                                                                                                handleBlur
                                                                                                                                            }
                                                                                                                                            helperText={
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .currencyCode &&
                                                                                                                                                errors.paxBaggages &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .currencyCode
                                                                                                                                                    ? errors
                                                                                                                                                          .paxBaggages[
                                                                                                                                                          idx
                                                                                                                                                      ]
                                                                                                                                                          .currencyCode
                                                                                                                                                    : ''
                                                                                                                                            }
                                                                                                                                            error={Boolean(
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .currencyCode &&
                                                                                                                                                    errors.paxBaggages &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .currencyCode
                                                                                                                                            )}
                                                                                                                                        />
                                                                                                                                    )}
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                    </Box>
                                                                                                                    <Grid
                                                                                                                        display="flex"
                                                                                                                        style={{
                                                                                                                            marginBottom:
                                                                                                                                '10px',
                                                                                                                            marginTop:
                                                                                                                                '10px'
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Grid item>
                                                                                                                            <Typography variant="h5">
                                                                                                                                Per Km Rate
                                                                                                                            </Typography>
                                                                                                                        </Grid>
                                                                                                                    </Grid>
                                                                                                                    <Box
                                                                                                                        sx={{
                                                                                                                            width: '100%',
                                                                                                                            // backgroundColor:
                                                                                                                            //     'rgba(50,50,50,0.4)',
                                                                                                                            minHeight: 36,
                                                                                                                            textAlign:
                                                                                                                                'center',
                                                                                                                            alignItems:
                                                                                                                                'center',
                                                                                                                            fontSize: 18,
                                                                                                                            marginLeft: 10,
                                                                                                                            marginTop: 1,
                                                                                                                            marginBottom: 1
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        {/* It's me! Index:{' '}
                                                                                                                        {idx}. */}
                                                                                                                        <Grid
                                                                                                                            gap="10px"
                                                                                                                            display="flex"
                                                                                                                        >
                                                                                                                            <Grid item>
                                                                                                                                <Autocomplete
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            ? values
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .taxCodeKmRate
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                    name={`paxBaggages.${idx}.taxCodeKmRate`}
                                                                                                                                    onChange={(
                                                                                                                                        _,
                                                                                                                                        value
                                                                                                                                    ) => {
                                                                                                                                        setFieldValue(
                                                                                                                                            `paxBaggages.${idx}.taxCodeKmRate`,
                                                                                                                                            value
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                    options={
                                                                                                                                        taxListOptions
                                                                                                                                    }
                                                                                                                                    getOptionLabel={(
                                                                                                                                        option
                                                                                                                                    ) =>
                                                                                                                                        `${option.taxCode} - (${option.taxDescription})`
                                                                                                                                    }
                                                                                                                                    isOptionEqualToValue={(
                                                                                                                                        option,
                                                                                                                                        value
                                                                                                                                    ) =>
                                                                                                                                        option.taxId ===
                                                                                                                                        value.taxId
                                                                                                                                    }
                                                                                                                                    renderInput={(
                                                                                                                                        params
                                                                                                                                    ) => (
                                                                                                                                        <TextField
                                                                                                                                            {...params}
                                                                                                                                            // label="tax"
                                                                                                                                            sx={{
                                                                                                                                                width: {
                                                                                                                                                    sm: 200
                                                                                                                                                },
                                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                                    {
                                                                                                                                                        height: 40
                                                                                                                                                    }
                                                                                                                                            }}
                                                                                                                                            // placeholder="--Select a Tax Code --"
                                                                                                                                            variant="outlined"
                                                                                                                                            name={`paxBaggages.${idx}.taxCodeKmRate`}
                                                                                                                                            onBlur={
                                                                                                                                                handleBlur
                                                                                                                                            }
                                                                                                                                            helperText={
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .taxCodeKmRate &&
                                                                                                                                                errors.paxBaggages &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .taxCodeKmRate
                                                                                                                                                    ? errors
                                                                                                                                                          .paxBaggages[
                                                                                                                                                          idx
                                                                                                                                                      ]
                                                                                                                                                          .taxCodeKmRate
                                                                                                                                                    : ''
                                                                                                                                            }
                                                                                                                                            error={Boolean(
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .taxCodeKmRate &&
                                                                                                                                                    errors.paxBaggages &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .taxCodeKmRate
                                                                                                                                            )}
                                                                                                                                        />
                                                                                                                                    )}
                                                                                                                                />
                                                                                                                            </Grid>

                                                                                                                            <Grid item>
                                                                                                                                {values
                                                                                                                                    .paxBaggages[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                values
                                                                                                                                    .paxBaggages[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .taxCodeKmRate
                                                                                                                                    ? values
                                                                                                                                          .paxBaggages[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .taxCodeKmRate
                                                                                                                                          .tax
                                                                                                                                    : 0}
                                                                                                                            </Grid>

                                                                                                                            <Grid>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateKmRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateKmRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateKmRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateKmRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateKmRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateKmRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateKmRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                            <Grid>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateWithoutTaxKmRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxKmRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithoutTaxKmRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithoutTaxKmRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxKmRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxKmRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateWithoutTaxKmRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                            <Grid>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateWithTaxKmRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxKmRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithTaxKmRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithTaxKmRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxKmRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxKmRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateWithTaxKmRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                    </Box>
                                                                                                                    <Grid
                                                                                                                        display="flex"
                                                                                                                        style={{
                                                                                                                            marginBottom:
                                                                                                                                '10px',
                                                                                                                            marginTop:
                                                                                                                                '10px'
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Grid item>
                                                                                                                            <Typography variant="h5">
                                                                                                                                Driver Rate
                                                                                                                            </Typography>
                                                                                                                        </Grid>
                                                                                                                    </Grid>
                                                                                                                    <Box
                                                                                                                        sx={{
                                                                                                                            width: '100%',
                                                                                                                            // backgroundColor:
                                                                                                                            //     'rgba(50,50,50,0.4)',
                                                                                                                            minHeight: 36,
                                                                                                                            textAlign:
                                                                                                                                'center',
                                                                                                                            alignItems:
                                                                                                                                'center',
                                                                                                                            fontSize: 18,
                                                                                                                            marginLeft: 10,
                                                                                                                            marginTop: 1,
                                                                                                                            marginBottom: 1
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        {/* It's me! Index:{' '}
                                                                                                                        {idx}. */}
                                                                                                                        <Grid
                                                                                                                            gap="10px"
                                                                                                                            display="flex"
                                                                                                                        >
                                                                                                                            <Grid item>
                                                                                                                                <Autocomplete
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            ? values
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .taxCodeDriverRate
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                    name={`paxBaggages.${idx}.taxCodeDriverRate`}
                                                                                                                                    onChange={(
                                                                                                                                        _,
                                                                                                                                        value
                                                                                                                                    ) => {
                                                                                                                                        console.log(
                                                                                                                                            value
                                                                                                                                        );
                                                                                                                                        setFieldValue(
                                                                                                                                            `paxBaggages.${idx}.taxCodeDriverRate`,
                                                                                                                                            value
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                    options={
                                                                                                                                        taxListOptions
                                                                                                                                    }
                                                                                                                                    getOptionLabel={(
                                                                                                                                        option
                                                                                                                                    ) =>
                                                                                                                                        `${option.taxCode} - (${option.taxDescription})`
                                                                                                                                    }
                                                                                                                                    isOptionEqualToValue={(
                                                                                                                                        option,
                                                                                                                                        value
                                                                                                                                    ) =>
                                                                                                                                        option.taxId ===
                                                                                                                                        value.taxId
                                                                                                                                    }
                                                                                                                                    renderInput={(
                                                                                                                                        params
                                                                                                                                    ) => (
                                                                                                                                        <TextField
                                                                                                                                            {...params}
                                                                                                                                            // label="tax"
                                                                                                                                            sx={{
                                                                                                                                                width: {
                                                                                                                                                    sm: 200
                                                                                                                                                },
                                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                                    {
                                                                                                                                                        height: 40
                                                                                                                                                    }
                                                                                                                                            }}
                                                                                                                                            // placeholder="--Select a Tax Code --"
                                                                                                                                            variant="outlined"
                                                                                                                                            name={`paxBaggages.${idx}.taxCodeDriverRate`}
                                                                                                                                            onBlur={
                                                                                                                                                handleBlur
                                                                                                                                            }
                                                                                                                                            helperText={
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .taxCodeDriverRate &&
                                                                                                                                                errors.paxBaggages &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .taxCodeDriverRate
                                                                                                                                                    ? errors
                                                                                                                                                          .paxBaggages[
                                                                                                                                                          idx
                                                                                                                                                      ]
                                                                                                                                                          .taxCodeDriverRate
                                                                                                                                                    : ''
                                                                                                                                            }
                                                                                                                                            error={Boolean(
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .taxCodeDriverRate &&
                                                                                                                                                    errors.paxBaggages &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .taxCodeDriverRate
                                                                                                                                            )}
                                                                                                                                        />
                                                                                                                                    )}
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                            <Grid item>
                                                                                                                                {values
                                                                                                                                    .paxBaggages[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                values
                                                                                                                                    .paxBaggages[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .taxCodeDriverRate
                                                                                                                                    ? values
                                                                                                                                          .paxBaggages[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .taxCodeDriverRate
                                                                                                                                          .tax
                                                                                                                                    : 0}
                                                                                                                            </Grid>
                                                                                                                            <Grid item>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateDriverRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateDriverRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateDriverRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateDriverRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateDriverRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateDriverRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateDriverRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                            <Grid item>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateWithoutTaxDriverRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxDriverRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithoutTaxDriverRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithoutTaxDriverRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxDriverRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxDriverRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateWithoutTaxDriverRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                            <Grid item>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateWithTaxDriverRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxDriverRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithTaxDriverRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithTaxDriverRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxDriverRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxDriverRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateWithTaxDriverRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                    </Box>

                                                                                                                    <Grid
                                                                                                                        display="flex"
                                                                                                                        style={{
                                                                                                                            marginBottom:
                                                                                                                                '10px',
                                                                                                                            marginTop:
                                                                                                                                '10px'
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Grid item>
                                                                                                                            <Typography variant="h5">
                                                                                                                                Assistant
                                                                                                                                Rate
                                                                                                                            </Typography>
                                                                                                                        </Grid>
                                                                                                                    </Grid>
                                                                                                                    <Box
                                                                                                                        sx={{
                                                                                                                            width: '100%',
                                                                                                                            // backgroundColor:
                                                                                                                            //     'rgba(50,50,50,0.4)',
                                                                                                                            minHeight: 36,
                                                                                                                            textAlign:
                                                                                                                                'center',
                                                                                                                            alignItems:
                                                                                                                                'center',
                                                                                                                            fontSize: 18,
                                                                                                                            marginLeft: 10,
                                                                                                                            marginTop: 1,
                                                                                                                            marginBottom: 1
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        {/* It's me! Index:{' '}
                                                                                                                        {idx}. */}
                                                                                                                        <Grid
                                                                                                                            gap="10px"
                                                                                                                            display="flex"
                                                                                                                        >
                                                                                                                            <Grid item>
                                                                                                                                <Autocomplete
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            ? values
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .taxCodeAssistantRate
                                                                                                                                            : null
                                                                                                                                    }
                                                                                                                                    name={`paxBaggages.${idx}.taxCodeAssistantRate`}
                                                                                                                                    onChange={(
                                                                                                                                        _,
                                                                                                                                        value
                                                                                                                                    ) => {
                                                                                                                                        setFieldValue(
                                                                                                                                            `paxBaggages.${idx}.taxCodeAssistantRate`,
                                                                                                                                            value
                                                                                                                                        );
                                                                                                                                    }}
                                                                                                                                    options={
                                                                                                                                        taxListOptions
                                                                                                                                    }
                                                                                                                                    getOptionLabel={(
                                                                                                                                        option
                                                                                                                                    ) =>
                                                                                                                                        `${option.taxCode} - (${option.taxDescription})`
                                                                                                                                    }
                                                                                                                                    isOptionEqualToValue={(
                                                                                                                                        option,
                                                                                                                                        value
                                                                                                                                    ) =>
                                                                                                                                        option.taxId ===
                                                                                                                                        value.taxId
                                                                                                                                    }
                                                                                                                                    renderInput={(
                                                                                                                                        params
                                                                                                                                    ) => (
                                                                                                                                        <TextField
                                                                                                                                            {...params}
                                                                                                                                            // label="tax"
                                                                                                                                            sx={{
                                                                                                                                                width: {
                                                                                                                                                    sm: 200
                                                                                                                                                },
                                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                                    {
                                                                                                                                                        height: 40
                                                                                                                                                    }
                                                                                                                                            }}
                                                                                                                                            // placeholder="--Select a Tax Code --"
                                                                                                                                            variant="outlined"
                                                                                                                                            name={`paxBaggages.${idx}.taxCodeAssistantRate`}
                                                                                                                                            onBlur={
                                                                                                                                                handleBlur
                                                                                                                                            }
                                                                                                                                            helperText={
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                touched
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .taxCodeAssistantRate &&
                                                                                                                                                errors.paxBaggages &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ] &&
                                                                                                                                                errors
                                                                                                                                                    .paxBaggages[
                                                                                                                                                    idx
                                                                                                                                                ]
                                                                                                                                                    .taxCodeAssistantRate
                                                                                                                                                    ? errors
                                                                                                                                                          .paxBaggages[
                                                                                                                                                          idx
                                                                                                                                                      ]
                                                                                                                                                          .taxCodeAssistantRate
                                                                                                                                                    : ''
                                                                                                                                            }
                                                                                                                                            error={Boolean(
                                                                                                                                                touched.paxBaggages &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    touched
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .taxCodeAssistantRate &&
                                                                                                                                                    errors.paxBaggages &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ] &&
                                                                                                                                                    errors
                                                                                                                                                        .paxBaggages[
                                                                                                                                                        idx
                                                                                                                                                    ]
                                                                                                                                                        .taxCodeAssistantRate
                                                                                                                                            )}
                                                                                                                                        />
                                                                                                                                    )}
                                                                                                                                />
                                                                                                                            </Grid>

                                                                                                                            <Grid item>
                                                                                                                                {values
                                                                                                                                    .paxBaggages[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                values
                                                                                                                                    .paxBaggages[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .taxCodeDriverRate
                                                                                                                                    ? values
                                                                                                                                          .paxBaggages[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .taxCodeDriverRate
                                                                                                                                          .tax
                                                                                                                                    : 0}
                                                                                                                            </Grid>

                                                                                                                            <Grid item>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateAssistantRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateAssistantRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateAssistantRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateAssistantRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateAssistantRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateAssistantRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateAssistantRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                            <Grid item>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateWithoutTaxAssistantRatee`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxAssistantRatee
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithoutTaxAssistantRatee &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithoutTaxAssistantRatee
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxAssistantRatee &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithoutTaxAssistantRatee
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateWithoutTaxAssistantRatee
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                            <Grid item>
                                                                                                                                <TextField
                                                                                                                                    sx={{
                                                                                                                                        width: {
                                                                                                                                            sm: 200
                                                                                                                                        },
                                                                                                                                        '& .MuiInputBase-root':
                                                                                                                                            {
                                                                                                                                                height: 40
                                                                                                                                            }
                                                                                                                                    }}
                                                                                                                                    // label="Additional Price"
                                                                                                                                    type="number"
                                                                                                                                    variant="outlined"
                                                                                                                                    placeholder="0"
                                                                                                                                    name={`paxBaggages.${idx}.rateWithTaxAssistantRate`}
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxAssistantRate
                                                                                                                                    }
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    onBlur={
                                                                                                                                        handleBlur
                                                                                                                                    }
                                                                                                                                    error={Boolean(
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            touched
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithTaxAssistantRate &&
                                                                                                                                            errors.paxBaggages &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ] &&
                                                                                                                                            errors
                                                                                                                                                .paxBaggages[
                                                                                                                                                idx
                                                                                                                                            ]
                                                                                                                                                .rateWithTaxAssistantRate
                                                                                                                                    )}
                                                                                                                                    helperText={
                                                                                                                                        touched.paxBaggages &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxAssistantRate &&
                                                                                                                                        errors.paxBaggages &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .paxBaggages[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .rateWithTaxAssistantRate
                                                                                                                                            ? errors
                                                                                                                                                  .paxBaggages[
                                                                                                                                                  idx
                                                                                                                                              ]
                                                                                                                                                  .rateWithTaxAssistantRate
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </Grid>
                                                                                                                        </Grid>
                                                                                                                    </Box>
                                                                                                                </Collapse>
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                    </>
                                                                                                );
                                                                                            })}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Paper>
                                                                        )}
                                                                    </FieldArray>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock3 ? 'flex' : 'none'}
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <Typography variant="h4">Location Wise Expenses</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock3 ? 'flex' : 'none'}
                                                                gap="10px"
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <FieldArray name="locationWiseExpenses">
                                                                        {({ insert, remove, push }) => (
                                                                            <Paper>
                                                                                {mode != 'VIEW' ? (
                                                                                    <Box display="flex" flexDirection="row-reverse">
                                                                                        <IconButton
                                                                                            aria-label="delete"
                                                                                            onClick={() => {
                                                                                                push({
                                                                                                    location: null,
                                                                                                    locationDescription: '',
                                                                                                    expenseCode: '',
                                                                                                    expenseDescription: '',
                                                                                                    status: ''
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
                                                                                                <TableCell>Location</TableCell>
                                                                                                <TableCell>Location Description</TableCell>
                                                                                                <TableCell>Expense Code</TableCell>
                                                                                                <TableCell>Expense Description</TableCell>
                                                                                                <TableCell>Status</TableCell>
                                                                                                <TableCell>Action</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {values.locationWiseExpenses.map(
                                                                                                (record, idx) => {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <TableRow key={idx} hover>
                                                                                                                <TableCell>
                                                                                                                    <Autocomplete
                                                                                                                        value={
                                                                                                                            values
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                ? values
                                                                                                                                      .locationWiseExpenses[
                                                                                                                                      idx
                                                                                                                                  ].location
                                                                                                                                : null
                                                                                                                        }
                                                                                                                        name={`locationWiseExpenses.${idx}.location`}
                                                                                                                        onChange={(
                                                                                                                            _,
                                                                                                                            value
                                                                                                                        ) => {
                                                                                                                            setFieldValue(
                                                                                                                                `locationWiseExpenses.${idx}.location`,
                                                                                                                                value
                                                                                                                            );
                                                                                                                        }}
                                                                                                                        options={
                                                                                                                            activeLocationList
                                                                                                                        }
                                                                                                                        getOptionLabel={(
                                                                                                                            option
                                                                                                                        ) =>
                                                                                                                            `${option.code}`
                                                                                                                        }
                                                                                                                        isOptionEqualToValue={(
                                                                                                                            option,
                                                                                                                            value
                                                                                                                        ) =>
                                                                                                                            option.location_id ===
                                                                                                                            value.location_id
                                                                                                                        }
                                                                                                                        renderInput={(
                                                                                                                            params
                                                                                                                        ) => (
                                                                                                                            <TextField
                                                                                                                                {...params}
                                                                                                                                // label="tax"
                                                                                                                                sx={{
                                                                                                                                    width: {
                                                                                                                                        sm: 200
                                                                                                                                    },
                                                                                                                                    '& .MuiInputBase-root':
                                                                                                                                        {
                                                                                                                                            height: 40
                                                                                                                                        }
                                                                                                                                }}
                                                                                                                                placeholder="--Select a Location --"
                                                                                                                                variant="outlined"
                                                                                                                                name={`locationWiseExpenses.${idx}.location`}
                                                                                                                                onBlur={
                                                                                                                                    handleBlur
                                                                                                                                }
                                                                                                                                helperText={
                                                                                                                                    touched.locationWiseExpenses &&
                                                                                                                                    touched
                                                                                                                                        .locationWiseExpenses[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .locationWiseExpenses[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .location &&
                                                                                                                                    errors.locationWiseExpenses &&
                                                                                                                                    errors
                                                                                                                                        .locationWiseExpenses[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .locationWiseExpenses[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .location
                                                                                                                                        ? errors
                                                                                                                                              .locationWiseExpenses[
                                                                                                                                              idx
                                                                                                                                          ]
                                                                                                                                              .location
                                                                                                                                        : ''
                                                                                                                                }
                                                                                                                                error={Boolean(
                                                                                                                                    touched.locationWiseExpenses &&
                                                                                                                                        touched
                                                                                                                                            .locationWiseExpenses[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .locationWiseExpenses[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .location &&
                                                                                                                                        errors.locationWiseExpenses &&
                                                                                                                                        errors
                                                                                                                                            .locationWiseExpenses[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .locationWiseExpenses[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .location
                                                                                                                                )}
                                                                                                                            />
                                                                                                                        )}
                                                                                                                    />
                                                                                                                </TableCell>
                                                                                                                <TableCell>
                                                                                                                    <TextField
                                                                                                                        // label="taxOrder"
                                                                                                                        sx={{
                                                                                                                            width: {
                                                                                                                                sm: 200
                                                                                                                            },
                                                                                                                            '& .MuiInputBase-root':
                                                                                                                                {
                                                                                                                                    height: 40
                                                                                                                                }
                                                                                                                        }}
                                                                                                                        type="text"
                                                                                                                        variant="outlined"
                                                                                                                        name={`locationWiseExpenses.${idx}.locationDescription`}
                                                                                                                        value={
                                                                                                                            values
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            values
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .locationDescription
                                                                                                                        }
                                                                                                                        onChange={
                                                                                                                            handleChange
                                                                                                                        }
                                                                                                                        onBlur={handleBlur}
                                                                                                                        error={Boolean(
                                                                                                                            touched.locationWiseExpenses &&
                                                                                                                                touched
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .locationDescription &&
                                                                                                                                errors.locationWiseExpenses &&
                                                                                                                                errors
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .locationDescription
                                                                                                                        )}
                                                                                                                        helperText={
                                                                                                                            touched.locationWiseExpenses &&
                                                                                                                            touched
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .locationDescription &&
                                                                                                                            errors.locationWiseExpenses &&
                                                                                                                            errors
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .locationDescription
                                                                                                                                ? errors
                                                                                                                                      .locationWiseExpenses[
                                                                                                                                      idx
                                                                                                                                  ]
                                                                                                                                      .locationDescription
                                                                                                                                : ''
                                                                                                                        }
                                                                                                                    />
                                                                                                                </TableCell>
                                                                                                                <TableCell>
                                                                                                                    <TextField
                                                                                                                        // label="taxOrder"
                                                                                                                        sx={{
                                                                                                                            width: {
                                                                                                                                sm: 200
                                                                                                                            },
                                                                                                                            '& .MuiInputBase-root':
                                                                                                                                {
                                                                                                                                    height: 40
                                                                                                                                }
                                                                                                                        }}
                                                                                                                        type="text"
                                                                                                                        variant="outlined"
                                                                                                                        name={`locationWiseExpenses.${idx}.expenseCode`}
                                                                                                                        value={
                                                                                                                            values
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            values
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ].expenseCode
                                                                                                                        }
                                                                                                                        onChange={
                                                                                                                            handleChange
                                                                                                                        }
                                                                                                                        onBlur={handleBlur}
                                                                                                                        error={Boolean(
                                                                                                                            touched.locationWiseExpenses &&
                                                                                                                                touched
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .expenseCode &&
                                                                                                                                errors.locationWiseExpenses &&
                                                                                                                                errors
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .expenseCode
                                                                                                                        )}
                                                                                                                        helperText={
                                                                                                                            touched.locationWiseExpenses &&
                                                                                                                            touched
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ].expenseCode &&
                                                                                                                            errors.locationWiseExpenses &&
                                                                                                                            errors
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ].expenseCode
                                                                                                                                ? errors
                                                                                                                                      .locationWiseExpenses[
                                                                                                                                      idx
                                                                                                                                  ]
                                                                                                                                      .expenseCode
                                                                                                                                : ''
                                                                                                                        }
                                                                                                                    />
                                                                                                                </TableCell>
                                                                                                                <TableCell>
                                                                                                                    <TextField
                                                                                                                        // label="taxOrder"
                                                                                                                        sx={{
                                                                                                                            width: {
                                                                                                                                sm: 200
                                                                                                                            },
                                                                                                                            '& .MuiInputBase-root':
                                                                                                                                {
                                                                                                                                    height: 40
                                                                                                                                }
                                                                                                                        }}
                                                                                                                        type="text"
                                                                                                                        variant="outlined"
                                                                                                                        name={`locationWiseExpenses.${idx}.expenseDescription`}
                                                                                                                        value={
                                                                                                                            values
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            values
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .expenseDescription
                                                                                                                        }
                                                                                                                        onChange={
                                                                                                                            handleChange
                                                                                                                        }
                                                                                                                        onBlur={handleBlur}
                                                                                                                        error={Boolean(
                                                                                                                            touched.locationWiseExpenses &&
                                                                                                                                touched
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .expenseDescription &&
                                                                                                                                errors.locationWiseExpenses &&
                                                                                                                                errors
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .locationWiseExpenses[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .expenseDescription
                                                                                                                        )}
                                                                                                                        helperText={
                                                                                                                            touched.locationWiseExpenses &&
                                                                                                                            touched
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .expenseDescription &&
                                                                                                                            errors.locationWiseExpenses &&
                                                                                                                            errors
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .locationWiseExpenses[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .expenseDescription
                                                                                                                                ? errors
                                                                                                                                      .locationWiseExpenses[
                                                                                                                                      idx
                                                                                                                                  ]
                                                                                                                                      .expenseDescription
                                                                                                                                : ''
                                                                                                                        }
                                                                                                                    />
                                                                                                                </TableCell>

                                                                                                                <TableCell>
                                                                                                                    <FormGroup>
                                                                                                                        <FormControlLabel
                                                                                                                            control={
                                                                                                                                <Checkbox
                                                                                                                                    name={`locationWiseExpenses.${idx}.status`}
                                                                                                                                    onChange={
                                                                                                                                        handleChange
                                                                                                                                    }
                                                                                                                                    checked={
                                                                                                                                        values
                                                                                                                                            .locationWiseExpenses[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .status
                                                                                                                                    }
                                                                                                                                    value={
                                                                                                                                        values
                                                                                                                                            .locationWiseExpenses[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        values
                                                                                                                                            .locationWiseExpenses[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .status
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            }
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
                                                                                                        </>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Paper>
                                                                        )}
                                                                    </FieldArray>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock6 ? 'flex' : 'none'}
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <Typography variant="h4">
                                                                        {getchargeMethod === 'PER_PAX'
                                                                            ? 'Per Pax Buy Rate'
                                                                            : 'Per Vehicle Rate'}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                display={enableblock6 ? 'flex' : 'none'}
                                                                gap="10px"
                                                                style={{ marginBottom: '10px', marginTop: '10px' }}
                                                            >
                                                                <Grid item>
                                                                    <FieldArray name="vehiclePaxRates">
                                                                        {({ insert, remove, push }) => (
                                                                            <Paper>
                                                                                {mode != 'VIEW' ? (
                                                                                    <Box display="flex" flexDirection="row-reverse">
                                                                                        <IconButton
                                                                                            aria-label="delete"
                                                                                            onClick={() => {
                                                                                                push({
                                                                                                    fromDate: '',
                                                                                                    toDate: '',
                                                                                                    marketCode: null,
                                                                                                    operatorCode: null,
                                                                                                    operatorGroupCode: null,
                                                                                                    currency: null,
                                                                                                    taxCode: null,
                                                                                                    tax: '',
                                                                                                    charterRate: '',
                                                                                                    charterRatewithTax: '',
                                                                                                    charterRatewithoutTax: ''
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
                                                                                                <TableCell>Market Group</TableCell>
                                                                                                <TableCell>Operator Code</TableCell>
                                                                                                <TableCell>Operator Group Code</TableCell>
                                                                                                <TableCell>Currency</TableCell>
                                                                                                <TableCell>Tax Code</TableCell>
                                                                                                <TableCell>Tax</TableCell>
                                                                                                <TableCell>Charter Rate</TableCell>
                                                                                                <TableCell>
                                                                                                    Charter Rate without Tax
                                                                                                </TableCell>
                                                                                                <TableCell>Charter Rate wth Tax</TableCell>
                                                                                                <TableCell>Status</TableCell>
                                                                                                <TableCell>Action</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {values.vehiclePaxRates.map((record, idx) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <TableRow key={idx} hover>
                                                                                                            <TableCell>
                                                                                                                <LocalizationProvider
                                                                                                                    dateAdapter={
                                                                                                                        AdapterDayjs
                                                                                                                    }
                                                                                                                    // adapterLocale={locale}
                                                                                                                >
                                                                                                                    <DatePicker
                                                                                                                        disabled={
                                                                                                                            mode ==
                                                                                                                            'VIEW_UPDATE'
                                                                                                                        }
                                                                                                                        onChange={(
                                                                                                                            value
                                                                                                                        ) => {
                                                                                                                            setFieldValue(
                                                                                                                                `vehiclePaxRates.${idx}.fromDate`,
                                                                                                                                value
                                                                                                                            );
                                                                                                                        }}
                                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                                        value={
                                                                                                                            values
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            values
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ].fromDate
                                                                                                                        }
                                                                                                                        renderInput={(
                                                                                                                            params
                                                                                                                        ) => (
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
                                                                                                                                name={`paxBaggages.${idx}.fromDate`}
                                                                                                                                onBlur={
                                                                                                                                    handleBlur
                                                                                                                                }
                                                                                                                                error={Boolean(
                                                                                                                                    touched.vehiclePaxRates &&
                                                                                                                                        touched
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .fromDate &&
                                                                                                                                        errors.vehiclePaxRates &&
                                                                                                                                        errors
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .fromDate
                                                                                                                                )}
                                                                                                                                helperText={
                                                                                                                                    touched.vehiclePaxRates &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .fromDate &&
                                                                                                                                    errors.vehiclePaxRates &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .fromDate
                                                                                                                                        ? errors
                                                                                                                                              .vehiclePaxRates[
                                                                                                                                              idx
                                                                                                                                          ]
                                                                                                                                              .fromDate
                                                                                                                                        : ''
                                                                                                                                }
                                                                                                                            />
                                                                                                                        )}
                                                                                                                    />
                                                                                                                </LocalizationProvider>
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <LocalizationProvider
                                                                                                                    dateAdapter={
                                                                                                                        AdapterDayjs
                                                                                                                    }
                                                                                                                    // adapterLocale={locale}
                                                                                                                >
                                                                                                                    <DatePicker
                                                                                                                        disabled={
                                                                                                                            mode ==
                                                                                                                            'VIEW_UPDATE'
                                                                                                                        }
                                                                                                                        onChange={(
                                                                                                                            value
                                                                                                                        ) => {
                                                                                                                            setFieldValue(
                                                                                                                                `vehiclePaxRates.${idx}.toDate`,
                                                                                                                                value
                                                                                                                            );
                                                                                                                        }}
                                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                                        value={
                                                                                                                            values
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            values
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ].toDate
                                                                                                                        }
                                                                                                                        renderInput={(
                                                                                                                            params
                                                                                                                        ) => (
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
                                                                                                                                name={`vehiclePaxRates.${idx}.toDate`}
                                                                                                                                onBlur={
                                                                                                                                    handleBlur
                                                                                                                                }
                                                                                                                                error={Boolean(
                                                                                                                                    touched.vehiclePaxRates &&
                                                                                                                                        touched
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        touched
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .toDate &&
                                                                                                                                        errors.vehiclePaxRates &&
                                                                                                                                        errors
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ] &&
                                                                                                                                        errors
                                                                                                                                            .vehiclePaxRates[
                                                                                                                                            idx
                                                                                                                                        ]
                                                                                                                                            .toDate
                                                                                                                                )}
                                                                                                                                helperText={
                                                                                                                                    touched.vehiclePaxRates &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .toDate &&
                                                                                                                                    errors.vehiclePaxRates &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ].toDate
                                                                                                                                        ? errors
                                                                                                                                              .vehiclePaxRates[
                                                                                                                                              idx
                                                                                                                                          ]
                                                                                                                                              .toDate
                                                                                                                                        : ''
                                                                                                                                }
                                                                                                                            />
                                                                                                                        )}
                                                                                                                    />
                                                                                                                </LocalizationProvider>
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <Autocomplete
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            ? values
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ].marketCode
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    name={`vehiclePaxRates.${idx}.marketCode`}
                                                                                                                    onChange={(
                                                                                                                        _,
                                                                                                                        value
                                                                                                                    ) => {
                                                                                                                        setFieldValue(
                                                                                                                            `vehiclePaxRates.${idx}.marketCode`,
                                                                                                                            value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    options={
                                                                                                                        activeMarketList
                                                                                                                    }
                                                                                                                    getOptionLabel={(
                                                                                                                        option
                                                                                                                    ) => `${option.code}`}
                                                                                                                    isOptionEqualToValue={(
                                                                                                                        option,
                                                                                                                        value
                                                                                                                    ) =>
                                                                                                                        option.marketId ===
                                                                                                                        value.marketId
                                                                                                                    }
                                                                                                                    renderInput={(
                                                                                                                        params
                                                                                                                    ) => (
                                                                                                                        <TextField
                                                                                                                            {...params}
                                                                                                                            // label="tax"
                                                                                                                            sx={{
                                                                                                                                width: {
                                                                                                                                    sm: 200
                                                                                                                                },
                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                    {
                                                                                                                                        height: 40
                                                                                                                                    }
                                                                                                                            }}
                                                                                                                            // placeholder="--Select a Location --"
                                                                                                                            variant="outlined"
                                                                                                                            name={`vehiclePaxRates.${idx}.marketCode`}
                                                                                                                            onBlur={
                                                                                                                                handleBlur
                                                                                                                            }
                                                                                                                            helperText={
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .marketCode &&
                                                                                                                                errors.vehiclePaxRates &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ].marketCode
                                                                                                                                    ? errors
                                                                                                                                          .vehiclePaxRates[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .marketCode
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            error={Boolean(
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .marketCode &&
                                                                                                                                    errors.vehiclePaxRates &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .marketCode
                                                                                                                            )}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <Autocomplete
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            ? values
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ].operatorCode
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    name={`vehiclePaxRates.${idx}.operatorCode`}
                                                                                                                    onChange={(
                                                                                                                        _,
                                                                                                                        value
                                                                                                                    ) => {
                                                                                                                        setFieldValue(
                                                                                                                            `vehiclePaxRates.${idx}.operatorCode`,
                                                                                                                            value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    options={
                                                                                                                        activeLocationList
                                                                                                                    }
                                                                                                                    getOptionLabel={(
                                                                                                                        option
                                                                                                                    ) => `${option.code}`}
                                                                                                                    isOptionEqualToValue={(
                                                                                                                        option,
                                                                                                                        value
                                                                                                                    ) =>
                                                                                                                        option.location_id ===
                                                                                                                        value.location_id
                                                                                                                    }
                                                                                                                    renderInput={(
                                                                                                                        params
                                                                                                                    ) => (
                                                                                                                        <TextField
                                                                                                                            {...params}
                                                                                                                            // label="tax"
                                                                                                                            sx={{
                                                                                                                                width: {
                                                                                                                                    sm: 200
                                                                                                                                },
                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                    {
                                                                                                                                        height: 40
                                                                                                                                    }
                                                                                                                            }}
                                                                                                                            // placeholder="--Select a Location --"
                                                                                                                            variant="outlined"
                                                                                                                            name={`vehiclePaxRates.${idx}.operatorCode`}
                                                                                                                            onBlur={
                                                                                                                                handleBlur
                                                                                                                            }
                                                                                                                            helperText={
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .operatorCode &&
                                                                                                                                errors.vehiclePaxRates &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .operatorCode
                                                                                                                                    ? errors
                                                                                                                                          .vehiclePaxRates[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .operatorCode
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            error={Boolean(
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .operatorCode &&
                                                                                                                                    errors.vehiclePaxRates &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .operatorCode
                                                                                                                            )}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <Autocomplete
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            ? values
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ]
                                                                                                                                  .operatorGroupCode
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    name={`vehiclePaxRates.${idx}.operatorGroupCode`}
                                                                                                                    onChange={(
                                                                                                                        _,
                                                                                                                        value
                                                                                                                    ) => {
                                                                                                                        setFieldValue(
                                                                                                                            `vehiclePaxRates.${idx}.operatorGroupCode`,
                                                                                                                            value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    options={
                                                                                                                        activeLocationList
                                                                                                                    }
                                                                                                                    getOptionLabel={(
                                                                                                                        option
                                                                                                                    ) => `${option.code}`}
                                                                                                                    isOptionEqualToValue={(
                                                                                                                        option,
                                                                                                                        value
                                                                                                                    ) =>
                                                                                                                        option.location_id ===
                                                                                                                        value.location_id
                                                                                                                    }
                                                                                                                    renderInput={(
                                                                                                                        params
                                                                                                                    ) => (
                                                                                                                        <TextField
                                                                                                                            {...params}
                                                                                                                            // label="tax"
                                                                                                                            sx={{
                                                                                                                                width: {
                                                                                                                                    sm: 200
                                                                                                                                },
                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                    {
                                                                                                                                        height: 40
                                                                                                                                    }
                                                                                                                            }}
                                                                                                                            placeholder="--Select a Location --"
                                                                                                                            variant="outlined"
                                                                                                                            name={`vehiclePaxRates.${idx}.fromLocation`}
                                                                                                                            onBlur={
                                                                                                                                handleBlur
                                                                                                                            }
                                                                                                                            helperText={
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .operatorGroupCode &&
                                                                                                                                errors.vehiclePaxRates &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .operatorGroupCode
                                                                                                                                    ? errors
                                                                                                                                          .vehiclePaxRates[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .operatorGroupCode
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            error={Boolean(
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .operatorGroupCode &&
                                                                                                                                    errors.vehiclePaxRates &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .operatorGroupCode
                                                                                                                            )}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <Autocomplete
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            ? values
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ].currency
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    name={`vehiclePaxRates.${idx}.currency`}
                                                                                                                    onChange={(
                                                                                                                        _,
                                                                                                                        value
                                                                                                                    ) => {
                                                                                                                        setFieldValue(
                                                                                                                            `vehiclePaxRates.${idx}.currency`,
                                                                                                                            value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    options={
                                                                                                                        activeLocationList
                                                                                                                    }
                                                                                                                    getOptionLabel={(
                                                                                                                        option
                                                                                                                    ) => `${option.code}`}
                                                                                                                    isOptionEqualToValue={(
                                                                                                                        option,
                                                                                                                        value
                                                                                                                    ) =>
                                                                                                                        option.location_id ===
                                                                                                                        value.location_id
                                                                                                                    }
                                                                                                                    renderInput={(
                                                                                                                        params
                                                                                                                    ) => (
                                                                                                                        <TextField
                                                                                                                            {...params}
                                                                                                                            // label="tax"
                                                                                                                            sx={{
                                                                                                                                width: {
                                                                                                                                    sm: 200
                                                                                                                                },
                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                    {
                                                                                                                                        height: 40
                                                                                                                                    }
                                                                                                                            }}
                                                                                                                            // placeholder="--Select a Location --"
                                                                                                                            variant="outlined"
                                                                                                                            name={`vehiclePaxRates.${idx}.currency`}
                                                                                                                            onBlur={
                                                                                                                                handleBlur
                                                                                                                            }
                                                                                                                            helperText={
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ]
                                                                                                                                    .currency &&
                                                                                                                                errors.vehiclePaxRates &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ].currency
                                                                                                                                    ? errors
                                                                                                                                          .vehiclePaxRates[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .currency
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            error={Boolean(
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .currency &&
                                                                                                                                    errors.vehiclePaxRates &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .currency
                                                                                                                            )}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <Autocomplete
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            ? values
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ].taxCode
                                                                                                                            : null
                                                                                                                    }
                                                                                                                    name={`vehiclePaxRates.${idx}.taxCode`}
                                                                                                                    onChange={(
                                                                                                                        _,
                                                                                                                        value
                                                                                                                    ) => {
                                                                                                                        setFieldValue(
                                                                                                                            `vehiclePaxRates.${idx}.taxCode`,
                                                                                                                            value
                                                                                                                        );
                                                                                                                    }}
                                                                                                                    options={taxListOptions}
                                                                                                                    getOptionLabel={(
                                                                                                                        option
                                                                                                                    ) =>
                                                                                                                        `${option.taxCode}-${option.taxDescription}`
                                                                                                                    }
                                                                                                                    isOptionEqualToValue={(
                                                                                                                        option,
                                                                                                                        value
                                                                                                                    ) =>
                                                                                                                        option.taxId ===
                                                                                                                        value.taxId
                                                                                                                    }
                                                                                                                    renderInput={(
                                                                                                                        params
                                                                                                                    ) => (
                                                                                                                        <TextField
                                                                                                                            {...params}
                                                                                                                            // label="tax"
                                                                                                                            sx={{
                                                                                                                                width: {
                                                                                                                                    sm: 200
                                                                                                                                },
                                                                                                                                '& .MuiInputBase-root':
                                                                                                                                    {
                                                                                                                                        height: 40
                                                                                                                                    }
                                                                                                                            }}
                                                                                                                            // placeholder="--Select a Location --"
                                                                                                                            variant="outlined"
                                                                                                                            name={`vehiclePaxRates.${idx}.taxCode`}
                                                                                                                            onBlur={
                                                                                                                                handleBlur
                                                                                                                            }
                                                                                                                            helperText={
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                touched
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ].taxCode &&
                                                                                                                                errors.vehiclePaxRates &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ] &&
                                                                                                                                errors
                                                                                                                                    .vehiclePaxRates[
                                                                                                                                    idx
                                                                                                                                ].taxCode
                                                                                                                                    ? errors
                                                                                                                                          .vehiclePaxRates[
                                                                                                                                          idx
                                                                                                                                      ]
                                                                                                                                          .taxCode
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            error={Boolean(
                                                                                                                                touched.vehiclePaxRates &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    touched
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .taxCode &&
                                                                                                                                    errors.vehiclePaxRates &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    errors
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ]
                                                                                                                                        .taxCode
                                                                                                                            )}
                                                                                                                        />
                                                                                                                    )}
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>tax</TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`vehiclePaxRates.${idx}.charterRate`}
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ].charterRate
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.vehiclePaxRates &&
                                                                                                                            touched
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ].charterRate &&
                                                                                                                            errors.vehiclePaxRates &&
                                                                                                                            errors
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ].charterRate
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.vehiclePaxRates &&
                                                                                                                        touched
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ].charterRate &&
                                                                                                                        errors.vehiclePaxRates &&
                                                                                                                        errors
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ].charterRate
                                                                                                                            ? errors
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ].charterRate
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`vehiclePaxRates.${idx}.charterRatewithTax`}
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ].charterRatewithTax
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.vehiclePaxRates &&
                                                                                                                            touched
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .charterRatewithTax &&
                                                                                                                            errors.vehiclePaxRates &&
                                                                                                                            errors
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .charterRatewithTax
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.vehiclePaxRates &&
                                                                                                                        touched
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            .charterRatewithTax &&
                                                                                                                        errors.vehiclePaxRates &&
                                                                                                                        errors
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ].charterRatewithTax
                                                                                                                            ? errors
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ]
                                                                                                                                  .charterRatewithTax
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <TextField
                                                                                                                    // label="taxOrder"
                                                                                                                    sx={{
                                                                                                                        width: { sm: 200 },
                                                                                                                        '& .MuiInputBase-root':
                                                                                                                            {
                                                                                                                                height: 40
                                                                                                                            }
                                                                                                                    }}
                                                                                                                    type="text"
                                                                                                                    variant="outlined"
                                                                                                                    name={`distances.${idx}.charterRatewithoutTax`}
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            .charterRatewithoutTax
                                                                                                                    }
                                                                                                                    onChange={handleChange}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.vehiclePaxRates &&
                                                                                                                            touched
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .charterRatewithoutTax &&
                                                                                                                            errors.vehiclePaxRates &&
                                                                                                                            errors
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .vehiclePaxRates[
                                                                                                                                idx
                                                                                                                            ]
                                                                                                                                .charterRatewithoutTax
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.vehiclePaxRates &&
                                                                                                                        touched
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            .charterRatewithoutTax &&
                                                                                                                        errors.vehiclePaxRates &&
                                                                                                                        errors
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .vehiclePaxRates[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            .charterRatewithoutTax
                                                                                                                            ? errors
                                                                                                                                  .vehiclePaxRates[
                                                                                                                                  idx
                                                                                                                              ]
                                                                                                                                  .charterRatewithoutTax
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            </TableCell>
                                                                                                            <TableCell>
                                                                                                                <FormGroup>
                                                                                                                    <FormControlLabel
                                                                                                                        control={
                                                                                                                            <Checkbox
                                                                                                                                name={`vehiclePaxRates.${idx}.status`}
                                                                                                                                onChange={
                                                                                                                                    handleChange
                                                                                                                                }
                                                                                                                                checked={
                                                                                                                                    values
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ].status
                                                                                                                                }
                                                                                                                                value={
                                                                                                                                    values
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ] &&
                                                                                                                                    values
                                                                                                                                        .vehiclePaxRates[
                                                                                                                                        idx
                                                                                                                                    ].status
                                                                                                                                }
                                                                                                                            />
                                                                                                                        }
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
                                                                                                    </>
                                                                                                );
                                                                                            })}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Paper>
                                                                        )}
                                                                    </FieldArray>
                                                                </Grid>
                                                            </Grid>
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

export default TransportRates;
