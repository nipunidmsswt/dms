import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
    Grid,
    FormGroup,
    FormControlLabel,
    Switch,
    Autocomplete,
    TextField,
    Box,
    Button,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination
} from '@mui/material';
import { activeSeasonsData, activeRatesSeasonId } from 'store/actions/masterActions/SeasonAction';
import {
    getAllActiveOperatorGroupData,
    getAllActiveOperatorByOperatorGpId
} from 'store/actions/masterActions/operatorActions/MarketGroupAction';
import { getActiveTaxGroupList } from 'store/actions/masterActions/TaxActions/TaxGroupAction';
import MainCard from 'ui-component/cards/MainCard';
import { Formik, Form, FieldArray, Field } from 'formik';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as yup from 'yup';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { getAllCurrencyListData } from 'store/actions/masterActions/ExpenseTypeAction';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getActiveRoomcategory } from 'store/actions/masterActions/RoomCategoryAction';
import { getActiveHotelBasisList } from 'store/actions/masterActions/operatorActions/HotelBasisAction';
import { saveRoomBuyingRateData } from 'store/actions/masterActions/RoomBuyongRateAction';

function RoomBuyingRates() {
    const newobj = {
        hotelCode: null,
        hotelName: null,
        operatorGpCode: null,
        operatorCode: null,
        season: null,
        ratePeriod: null,
        fromDate: '',
        toDate: '',
        taxGpCode: null,
        taxAmount: '',
        currency: null,
        roomCategory: null,
        basis: null,
        singleRate: '',
        doubleRate: '',
        trippleRate: '',
        family: '',
        child: '',
        taxApplicable: true,
        default: false,
        basis: null,
        guideRate: '',
        tourLeadRate: '',
        taxApplicable: true,
        ratesDetails: [
            {
                roomCategory: null,
                basis: null,
                singleRate: '',
                doubleRate: '',
                trippleRate: '',
                family: '',
                child: '',
                taxApplicable: true,
                default: false
            }
        ],
        tourGuideDetails: [
            {
                basis: null,
                guideRate: '',
                tourLeadRate: '',
                taxApplicable: true
            }
        ]
    };

    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [mmObject, setnewobj] = useState(newobj);
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [activeOperatorGroupList, setActiveOperatorGroupList] = useState([]);
    const [activeOperatorList, setActiveOperatorList] = useState([]);
    const [activeSeasonList, setactiveSeasonList] = useState([]);
    const [activeRateListBySeason, setActiveRateListBySeason] = useState([]);
    const [activeaxGroupList, setActiveTaxGroupList] = useState([]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);
    const [activeRoomCategories, setActiveRoomCategories] = useState([]);
    const [activeotelBasis, setActiveHotelBasis] = useState([]);

    const [tableData, setTableData] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [marketListOptions, setMarketListOptions] = useState([]);
    const [hotelData, setHotelData] = useState([]);

    const pages = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

    const dispatch = useDispatch();

    const error = useSelector((state) => state.seasonReducer.errorMsg);
    const lastModifiedDate = useSelector((state) => state.seasonReducer.lastModifiedDateTime);
    const activeOperatorGroupData = useSelector((state) => state.marketGroupReducer.activeOperatorGroupList);
    const activeOperatordata = useSelector((state) => state.marketGroupReducer.activeOpListPerOpGroup);
    const activeSeasonData = useSelector((state) => state.seasonReducer.activeSeasons);
    const activeRatesBySeason = useSelector((state) => state.seasonReducer.activeRatesBySeason);
    const activeTaxGrupData = useSelector((state) => state.taxGroupReducer.activeTaxGrups);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const activeHotelChildrenFacilityListData = useSelector((state) => state.roomCategoryReducer.activeHotelChildrenFacilityList);
    const activeHotelBasisListData = useSelector((state) => state.hotelBasisReducer.activeHotelBasisList);

    let location = useLocation();

    useEffect(() => {
        setnewobj({
            hotelCode: location.state.data.rowdata,
            hotelName: location.state.data.rowdata,
            operatorGpCode: null,
            operatorCode: null,
            season: null,
            ratePeriod: null,
            fromDate: '',
            toDate: '',
            taxGpCode: null,
            taxAmount: '',
            currency: null,
            roomCategory: null,
            basis: null,
            singleRate: '',
            doubleRate: '',
            trippleRate: '',
            family: '',
            child: '',
            taxApplicable: true,
            default: false,
            ratesDetails: [
                {
                    roomCategory: null,
                    basis: null,
                    singleRate: '',
                    doubleRate: '',
                    trippleRate: '',
                    family: '',
                    child: '',
                    taxApplicable: true,
                    default: false
                }
            ],
            tourGuideDetails: [
                {
                    basis: null,
                    guideRate: '',
                    tourLeadRate: '',
                    taxApplicable: true
                }
            ]
        });
    }, [location]);

    useEffect(() => {
        if (activeSeasonData.length != 0) {
            setactiveSeasonList(activeSeasonData);
        }
    }, [activeSeasonData]);

    useEffect(() => {
        console.log(activeRatesBySeason);
        if (activeRatesBySeason.length != 0) {
            setActiveRateListBySeason(activeRatesBySeason);
        }
    }, [activeRatesBySeason]);

    useEffect(() => {
        if (activeOperatorGroupData.length != 0) {
            setActiveOperatorGroupList(activeOperatorGroupData);
        }
    }, [activeOperatorGroupData]);

    useEffect(() => {
        if (activeHotelChildrenFacilityListData.length != 0) {
            setActiveRoomCategories(activeHotelChildrenFacilityListData);
        }
    }, [activeHotelChildrenFacilityListData]);

    useEffect(() => {
        console.log(activeHotelBasisListData);

        if (activeHotelBasisListData != null) {
            setActiveHotelBasis(activeHotelBasisListData);
        }
    }, [activeHotelBasisListData]);

    useEffect(() => {
        console.log(activeOperatordata);
        console.log(' activeHotelChildrenFacilityListData activeHotelChildrenFacilityListData');
        if (activeOperatordata.length != 0) {
            console.log(' activeHotelChildrenFacilityListData activeHotelChildrenFacilityListData');
            setActiveOperatorList(activeOperatordata);
        }
    }, [activeOperatordata]);

    useEffect(() => {
        if (activeTaxGrupData.length != 0) {
            setActiveTaxGroupList(activeTaxGrupData);
        }
    }, [activeTaxGrupData]);

    useEffect(() => {
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);
    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        setLastModifiedTimeDate(
            lastModifiedDate === ''
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
        dispatch(activeSeasonsData());
        dispatch(getActiveTaxGroupList());
        dispatch(getActiveRoomcategory());
        dispatch(getActiveHotelBasisList());
        // dispatch(activeRatesSeasonId());
        dispatch(getAllActiveOperatorGroupData());
        // dispatch(getAllActiveOperatorByOperatorGpId());
        dispatch(getAllCurrencyListData());
    }, []);

    const handleClickOpen = (type, data) => {
        console.log(type);
        console.log(data);
        if (type === 'VIEW_UPDATE') {
            setMode(type);
            setCode(data.mainSeason);
        } else if (type === 'INSERT') {
            setCode('');
            setMode(type);
        } else {
            setMode(type);
            setCode(data.mainSeason);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const loadRatesBySeason = (value) => {
        console.log(value);
        dispatch(activeRatesSeasonId(value.seasonId));
    };

    const loadOperatorCode = (value) => {
        console.log(value);
        dispatch(getAllActiveOperatorByOperatorGpId(value.marketGroupOperatorGroupId));
    };

    const validationSchema = yup.object().shape({
        season: yup.object().typeError('Required field'),

        ratesDetails: yup.array().of(
            yup.object().shape({
                roomCategory: yup.object().typeError('Required field'),
                basis: yup.object().typeError('Required field')
                // onOriginal: yup.string().required('Required field')
            })
        ),
        tourGuideDetails: yup.array().of(
            yup.object().shape({
                basis: yup.object().typeError('Required field')
            })
        )
    });

    return (
        <div>
            <MainCard title="Room Buying Rates">
                <div className="row">
                    <Grid container direction="row">
                        <Grid item>
                            <Formik
                                enableReinitialize={true}
                                initialValues={mmObject}
                                // onSubmit={(values) => {
                                //     handleSubmit(values);
                                // }}
                                validationSchema={validationSchema}
                            >
                                {({
                                    values,
                                    handleChange,
                                    setFieldValue,
                                    errors,
                                    handleBlur,
                                    touched,
                                    resetForm,
                                    validateField,
                                    validateForm,
                                    isValid,
                                    dirty
                                }) => {
                                    return (
                                        <Form>
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        <Autocomplete
                                                            value={values.hotelCode}
                                                            name="hotelCode"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`hotelCode`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={hotelData}
                                                            getOptionLabel={(option) => `${option.hotelCode}`}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Hotel Code"
                                                                    sx={{
                                                                        // width: { xs: 150 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    error={Boolean(touched.hotelCode && errors.hotelCode)}
                                                                    helperText={
                                                                        touched.hotelCode && errors.hotelCode ? errors.hotelCode : ''
                                                                    }
                                                                    variant="outlined"
                                                                    name="hotelCode"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid item>
                                                        <Autocomplete
                                                            value={values.hotelName}
                                                            name="hotelName"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`hotelName`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={hotelData}
                                                            getOptionLabel={(option) => `${option.hotelCode}`}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Hotel Name"
                                                                    sx={{
                                                                        width: { xs: 120 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    error={Boolean(touched.hotelName && errors.hotelName)}
                                                                    helperText={
                                                                        touched.hotelName && errors.hotelName ? errors.hotelName : ''
                                                                    }
                                                                    // placeholder="--Select a Manager Code --"
                                                                    variant="outlined"
                                                                    name="hotelName"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <hr />
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        {' '}
                                                        <Autocomplete
                                                            value={values.operatorGpCode}
                                                            name="operatorGpCode"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                loadOperatorCode(value);
                                                                setFieldValue(`operatorGpCode`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeOperatorGroupList}
                                                            getOptionLabel={(option) => `${option.code}`}
                                                            isOptionEqualToValue={(option, value) => option.marketId === value.marketId}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Operator Group Code"
                                                                    sx={{
                                                                        width: { xs: 120 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    error={Boolean(touched.operatorGpCode && errors.operatorGpCode)}
                                                                    helperText={
                                                                        touched.operatorGpCode && errors.operatorGpCode
                                                                            ? errors.operatorGpCode
                                                                            : ''
                                                                    }
                                                                    // placeholder="--Select a Manager Code --"
                                                                    variant="outlined"
                                                                    name="operatorGpCode"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid item>
                                                        <Autocomplete
                                                            value={values.operatorCode}
                                                            name="operatorCode"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`operatorCode`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeOperatorList}
                                                            getOptionLabel={(option) => `${option.code}`}
                                                            isOptionEqualToValue={(option, value) => option.marketId === value.marketId}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Operator Code"
                                                                    sx={{
                                                                        width: { xs: 120 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    error={Boolean(touched.operatorCode && errors.operatorCode)}
                                                                    helperText={
                                                                        touched.operatorCode && errors.operatorCode
                                                                            ? errors.operatorCode
                                                                            : ''
                                                                    }
                                                                    // placeholder="--Select a Manager Code --"
                                                                    variant="outlined"
                                                                    name="operatorCode"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Autocomplete
                                                            value={values.season}
                                                            name="season"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                loadRatesBySeason(value);
                                                                setFieldValue(`season`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeSeasonList}
                                                            getOptionLabel={(option) => `${option.mainSeason}`}
                                                            isOptionEqualToValue={(option, value) => option.seasonId === value.seasonId}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Season"
                                                                    sx={{
                                                                        width: { xs: 120 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    error={Boolean(touched.season && errors.season)}
                                                                    helperText={touched.season && errors.season ? errors.season : ''}
                                                                    // placeholder="--Select a Manager Code --"
                                                                    variant="outlined"
                                                                    name="season"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        {' '}
                                                        <Autocomplete
                                                            value={values.ratePeriod}
                                                            name="ratePeriod"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                console.log(value);
                                                                setFieldValue(`ratePeriod`, value);
                                                                setFieldValue(`fromDate`, value.fromDate);
                                                                setFieldValue(`toDate`, value.toDate);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeRateListBySeason}
                                                            getOptionLabel={(option) => `${option.ratePeriod}`}
                                                            isOptionEqualToValue={(option, value) =>
                                                                option.seasonDetailsId === value.seasonDetailsId
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Rate Period"
                                                                    sx={{
                                                                        width: { xs: 120 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    error={Boolean(touched.ratePeriod && errors.ratePeriod)}
                                                                    helperText={
                                                                        touched.ratePeriod && errors.ratePeriod ? errors.ratePeriod : ''
                                                                    }
                                                                    // placeholder="--Select a Manager Code --"
                                                                    variant="outlined"
                                                                    name="ratePeriod"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}
                                                            // adapterLocale={locale}
                                                        >
                                                            <DatePicker
                                                                disabled={mode != 'INSERT'}
                                                                onChange={(value) => {
                                                                    setFieldValue(`fromDate`, value);
                                                                }}
                                                                inputFormat="DD/MM/YYYY"
                                                                value={values.fromDate}
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
                                                                        label="From Date"
                                                                        variant="outlined"
                                                                        name="fromDate"
                                                                        onBlur={handleBlur}
                                                                        error={Boolean(touched.fromDate && errors.fromDate)}
                                                                        helperText={
                                                                            touched.fromDate && errors.fromDate ? errors.fromDate : ''
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
                                                                disabled={mode != 'INSERT'}
                                                                onChange={(value) => {
                                                                    let idx = 0;
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
                                                                        onBlur={handleBlur}
                                                                        error={Boolean(touched.toDate && errors.toDate)}
                                                                        helperText={touched.toDate && errors.toDate ? errors.toDate : ''}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid item>
                                                        <Grid item>
                                                            <Autocomplete
                                                                value={values.taxGpCode}
                                                                name="taxGpCode"
                                                                disabled={mode == 'VIEW'}
                                                                onChange={(_, value) => {
                                                                    setFieldValue(`taxGpCode`, value);
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                options={activeaxGroupList}
                                                                getOptionLabel={(option) => `${option.taxGroupCode}`}
                                                                isOptionEqualToValue={(option, value) =>
                                                                    option.taxGroupId === value.taxGroupId
                                                                }
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Tax Group Code"
                                                                        sx={{
                                                                            width: { xs: 120 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 41
                                                                            }
                                                                        }}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        error={Boolean(touched.taxGpCode && errors.taxGpCode)}
                                                                        helperText={
                                                                            touched.taxGpCode && errors.taxGpCode ? errors.taxGpCode : ''
                                                                        }
                                                                        // placeholder="--Select a Manager Code --"
                                                                        variant="outlined"
                                                                        name="taxGpCode"
                                                                        onBlur={handleBlur}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item>
                                                        <Autocomplete
                                                            value={values.currency}
                                                            name="currency"
                                                            onChange={(_, value) => {
                                                                console.log(value);
                                                                setFieldValue(`currency`, value);
                                                            }}
                                                            disabled={mode == 'VIEW_UPDATE'}
                                                            options={currencyListOptions}
                                                            getOptionLabel={(option) =>
                                                                `${option.currencyCode} - ${option.currencyDescription}`
                                                            }
                                                            isOptionEqualToValue={(option, value) =>
                                                                option.currencyListId === value.currencyListId
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
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    label="Currency"
                                                                    variant="outlined"
                                                                    name="currency"
                                                                    onBlur={handleBlur}
                                                                    error={Boolean(touched.currency && errors.currency)}
                                                                    helperText={touched.currency && errors.currency ? errors.currency : ''}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <hr />

                                            <br />

                                            <br />
                                            <FieldArray name="ratesDetails">
                                                {({ insert, remove, push }) => (
                                                    <Paper>
                                                        {mode != 'VIEW' ? (
                                                            <Box display="flex" flexDirection="row-reverse">
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                    onClick={() => {
                                                                        // setFieldValue(
                                                                        //   `taxGroupDetails.${ref.current.values.taxGroupDetails.length}.taxOrder`,
                                                                        //   ref.current.values.taxGroupDetails.length+1
                                                                        // );
                                                                        push({
                                                                            roomCategory: null,
                                                                            basis: null,
                                                                            singleRate: '',
                                                                            doubleRate: '',
                                                                            trippleRate: '',
                                                                            family: '',
                                                                            child: '',
                                                                            taxApplicable: true,
                                                                            default: false
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
                                                                <TableHead alignItems="center">
                                                                    <TableRow>
                                                                        {/* <TableCell>Sequence</TableCell> */}
                                                                        <TableCell>Room Category</TableCell>
                                                                        <TableCell>Basis </TableCell>
                                                                        <TableCell>Single</TableCell>
                                                                        <TableCell>Double</TableCell>
                                                                        <TableCell>Tripple</TableCell>
                                                                        <TableCell>Family</TableCell>
                                                                        <TableCell>Child</TableCell>
                                                                        <TableCell>Actions</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                {/* {tableBodyData ? ( */}
                                                                <TableBody>
                                                                    {(rowsPerPage > 0
                                                                        ? values.ratesDetails.slice(
                                                                              page * rowsPerPage,
                                                                              page * rowsPerPage + rowsPerPage
                                                                          )
                                                                        : values.ratesDetails
                                                                    ).map((record, idx) => {
                                                                        // {values.codeAndNameDetails.map((record, idx) => {
                                                                        return (
                                                                            <TableRow key={idx} hover>
                                                                                {/* <TableCell>{idx + 1}</TableCell> */}

                                                                                <TableCell>
                                                                                    <Autocomplete
                                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                        value={
                                                                                            values.ratesDetails[idx]
                                                                                                ? values.ratesDetails[idx].roomCategory
                                                                                                : null
                                                                                        }
                                                                                        name={`ratesDetails.${idx}.roomCategory`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `ratesDetails.${idx}.roomCategory`,
                                                                                                value
                                                                                            );
                                                                                        }}
                                                                                        options={activeRoomCategories}
                                                                                        getOptionLabel={(option) => `${option.code}`}
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
                                                                                                name={`ratesDetails.${idx}.roomCategory`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.ratesDetails &&
                                                                                                    touched.ratesDetails[idx] &&
                                                                                                    touched.ratesDetails[idx]
                                                                                                        .roomCategory &&
                                                                                                    errors.ratesDetails &&
                                                                                                    errors.ratesDetails[idx] &&
                                                                                                    errors.ratesDetails[idx].roomCategory
                                                                                                        ? errors.ratesDetails[idx]
                                                                                                              .roomCategory
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.ratesDetails &&
                                                                                                        touched.ratesDetails[idx] &&
                                                                                                        touched.ratesDetails[idx]
                                                                                                            .roomCategory &&
                                                                                                        errors.ratesDetails &&
                                                                                                        errors.ratesDetails[idx] &&
                                                                                                        errors.ratesDetails[idx]
                                                                                                            .roomCategory
                                                                                                )}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Autocomplete
                                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                        value={
                                                                                            values.ratesDetails[idx]
                                                                                                ? values.ratesDetails[idx].basis
                                                                                                : null
                                                                                        }
                                                                                        name={`ratesDetails.${idx}.basis`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `ratesDetails.${idx}.basis`,
                                                                                                value
                                                                                            );
                                                                                        }}
                                                                                        options={activeotelBasis}
                                                                                        getOptionLabel={(option) => `${option.code}`}
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
                                                                                                name={`ratesDetails.${idx}.basis`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.ratesDetails &&
                                                                                                    touched.ratesDetails[idx] &&
                                                                                                    touched.ratesDetails[idx].basis &&
                                                                                                    errors.ratesDetails &&
                                                                                                    errors.ratesDetails[idx] &&
                                                                                                    errors.ratesDetails[idx].basis
                                                                                                        ? errors.ratesDetails[idx].basis
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.ratesDetails &&
                                                                                                        touched.ratesDetails[idx] &&
                                                                                                        touched.ratesDetails[idx].basis &&
                                                                                                        errors.ratesDetails &&
                                                                                                        errors.ratesDetails[idx] &&
                                                                                                        errors.ratesDetails[idx].basis
                                                                                                )}
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
                                                                                        name={`ratesDetails.${idx}.singleRate`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].singleRate
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].singleRate &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].singleRate
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].singleRate &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].singleRate
                                                                                                ? errors.ratesDetails[idx].singleRate
                                                                                                : ''
                                                                                        }
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
                                                                                        name={`ratesDetails.${idx}.doubleRate`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].doubleRate
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].doubleRate &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].doubleRate
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].doubleRate &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].doubleRate
                                                                                                ? errors.ratesDetails[idx].doubleRate
                                                                                                : ''
                                                                                        }
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
                                                                                        name={`ratesDetails.${idx}.trippleRate`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].trippleRate
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].trippleRate &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].trippleRate
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].trippleRate &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].trippleRate
                                                                                                ? errors.ratesDetails[idx].trippleRate
                                                                                                : ''
                                                                                        }
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
                                                                                        name={`ratesDetails.${idx}.family`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].family
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].family &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].family
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].family &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].family
                                                                                                ? errors.ratesDetails[idx].family
                                                                                                : ''
                                                                                        }
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
                                                                                        name={`ratesDetails.${idx}.family`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].child
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].child &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].child
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].child &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].child
                                                                                                ? errors.ratesDetails[idx].child
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            name={`ratesDetails.${idx}.taxApplicable`}
                                                                                            onChange={handleChange}
                                                                                            value={
                                                                                                values.ratesDetails[idx] &&
                                                                                                values.ratesDetails[idx].taxApplicable
                                                                                            }
                                                                                            control={<Switch color="success" />}
                                                                                            // label="Status"
                                                                                            checked={values.ratesDetails[idx].taxApplicable}
                                                                                            disabled
                                                                                            // disabled={mode == 'VIEW'}
                                                                                        />
                                                                                    </FormGroup>
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    {(values.ratesDetails[idx] &&
                                                                                        values.ratesDetails[idx].id) === '' ? (
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
                                                                            count={values.ratesDetails.length}
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
                                            <FieldArray name="tourGuideDetails">
                                                {({ insert, remove, push }) => (
                                                    <Paper>
                                                        {mode != 'VIEW' ? (
                                                            <Box display="flex" flexDirection="row-reverse">
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                    onClick={() => {
                                                                        // setFieldValue(
                                                                        //   `taxGroupDetails.${ref.current.values.taxGroupDetails.length}.taxOrder`,
                                                                        //   ref.current.values.taxGroupDetails.length+1
                                                                        // );
                                                                        push({
                                                                            basis: null,
                                                                            guideRate: '',
                                                                            tourLeadRate: '',
                                                                            taxApplicable: true
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
                                                                <TableHead alignItems="center">
                                                                    <TableRow>
                                                                        {/* <TableCell>Sequence</TableCell> */}

                                                                        <TableCell>Basis </TableCell>
                                                                        <TableCell>Guide</TableCell>
                                                                        <TableCell>Tour Lead</TableCell>

                                                                        <TableCell>Actions</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                {/* {tableBodyData ? ( */}
                                                                <TableBody>
                                                                    {(rowsPerPage > 0
                                                                        ? values.tourGuideDetails.slice(
                                                                              page * rowsPerPage,
                                                                              page * rowsPerPage + rowsPerPage
                                                                          )
                                                                        : values.tourGuideDetails
                                                                    ).map((record, idx) => {
                                                                        // {values.codeAndNameDetails.map((record, idx) => {
                                                                        return (
                                                                            <TableRow key={idx} hover>
                                                                                {/* <TableCell>{idx + 1}</TableCell> */}

                                                                                <TableCell>
                                                                                    <Autocomplete
                                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                        value={
                                                                                            values.tourGuideDetails[idx]
                                                                                                ? values.tourGuideDetails[idx].basis
                                                                                                : null
                                                                                        }
                                                                                        name={`tourGuideDetails.${idx}.basis`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `tourGuideDetails.${idx}.basis`,
                                                                                                value
                                                                                            );
                                                                                        }}
                                                                                        options={activeotelBasis}
                                                                                        getOptionLabel={(option) => `${option.code}`}
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
                                                                                                name={`tourGuideDetails.${idx}.basis`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.tourGuideDetails &&
                                                                                                    touched.tourGuideDetails[idx] &&
                                                                                                    touched.tourGuideDetails[idx].basis &&
                                                                                                    errors.tourGuideDetails &&
                                                                                                    errors.tourGuideDetails[idx] &&
                                                                                                    errors.tourGuideDetails[idx].basis
                                                                                                        ? errors.tourGuideDetails[idx].basis
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.tourGuideDetails &&
                                                                                                        touched.tourGuideDetails[idx] &&
                                                                                                        touched.tourGuideDetails[idx]
                                                                                                            .basis &&
                                                                                                        errors.tourGuideDetails &&
                                                                                                        errors.tourGuideDetails[idx] &&
                                                                                                        errors.tourGuideDetails[idx].basis
                                                                                                )}
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
                                                                                        name={`tourGuideDetails.${idx}.singleRate`}
                                                                                        value={
                                                                                            values.tourGuideDetails[idx] &&
                                                                                            values.tourGuideDetails[idx].guideRate
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.tourGuideDetails &&
                                                                                                touched.tourGuideDetails[idx] &&
                                                                                                touched.tourGuideDetails[idx].guideRate &&
                                                                                                errors.tourGuideDetails &&
                                                                                                errors.tourGuideDetails[idx] &&
                                                                                                errors.tourGuideDetails[idx].guideRate
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.tourGuideDetails &&
                                                                                            touched.tourGuideDetails[idx] &&
                                                                                            touched.tourGuideDetails[idx].guideRate &&
                                                                                            errors.tourGuideDetails &&
                                                                                            errors.tourGuideDetails[idx] &&
                                                                                            errors.tourGuideDetails[idx].guideRate
                                                                                                ? errors.tourGuideDetails[idx].guideRate
                                                                                                : ''
                                                                                        }
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
                                                                                        name={`tourGuideDetails.${idx}.tourLeadRate`}
                                                                                        value={
                                                                                            values.tourGuideDetails[idx] &&
                                                                                            values.tourGuideDetails[idx].tourLeadRate
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.tourGuideDetails &&
                                                                                                touched.tourGuideDetails[idx] &&
                                                                                                touched.tourGuideDetails[idx]
                                                                                                    .tourLeadRate &&
                                                                                                errors.tourGuideDetails &&
                                                                                                errors.tourGuideDetails[idx] &&
                                                                                                errors.tourGuideDetails[idx].tourLeadRate
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.tourGuideDetails &&
                                                                                            touched.tourGuideDetails[idx] &&
                                                                                            touched.tourGuideDetails[idx].tourLeadRate &&
                                                                                            errors.tourGuideDetails &&
                                                                                            errors.tourGuideDetails[idx] &&
                                                                                            errors.tourGuideDetails[idx].tourLeadRate
                                                                                                ? errors.tourGuideDetails[idx].tourLeadRate
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            name={`tourGuideDetails.${idx}.taxApplicable`}
                                                                                            onChange={handleChange}
                                                                                            value={
                                                                                                values.tourGuideDetails[idx] &&
                                                                                                values.tourGuideDetails[idx].taxApplicable
                                                                                            }
                                                                                            control={<Switch color="success" />}
                                                                                            // label="Status"
                                                                                            checked={
                                                                                                values.tourGuideDetails[idx].taxApplicable
                                                                                            }
                                                                                            disabled
                                                                                            // disabled={mode == 'VIEW'}
                                                                                        />
                                                                                    </FormGroup>
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    {(values.tourGuideDetails[idx] &&
                                                                                        values.tourGuideDetails[idx].id) === '' ? (
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
                                                                            count={values.tourGuideDetails.length}
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
                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
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
            </MainCard>
        </div>
    );
}

export default RoomBuyingRates;
