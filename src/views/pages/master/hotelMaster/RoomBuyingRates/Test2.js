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
                default: false,
                guideRate: '',
                tourLeadrate: ''
            }
        ]
    };
    const headerInitialValues = {
        roomCategory: null,
        basis: null,
        singleRate: '',
        doubleRate: '',
        trippleRate: '',
        family: '',
        child: '',
        taxApplicable: true,
        default: false
    };
    const mainValues = {
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
        currency: null
    };
    const [loadValues, setLoadValues] = useState({
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
                default: false,
                guideRate: '',
                tourLeadrate: ''
            }
        ]
    });

    
    const headerInitialValues2 = {
        basis: null,
        guideRate: '',
        tourLeadRate: '',
        taxApplicable: true
    };
    const [secondLoadValues, setSecondLoadValues] = useState({
        tourGuideDetails: [
            {
                basis: null,
                guideRate: '',
                tourLeadRate: '',
                taxApplicable: true
            }
        ]
    });
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
    const [initialValues, setInitial] = useState(headerInitialValues);
    const [initialValues2, setInitial2] = useState(headerInitialValues2);
    const [mainDetails, setMainDetails] = useState(mainValues);
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
        setHotelData([location.state.data.rowdata]);
        setMainDetails({
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
            currency: null
        });
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
                    default: false,
                    guideRate: '',
                    tourLeadrate: ''
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
        console.log(' activeHotelChildrenFacilityListData activeHotelChildrenFacilityListData');
        if (activeHotelBasisListData != null) {
            setActiveHotelBasis(activeHotelBasisListData);
        }
    }, [activeHotelBasisListData]);

    useEffect(() => {}, [activeOperatordata]);

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
        // dispatch(getAllActiveOperatorGroupData());
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
    const handleSubmit = async (values) => {
        console.log(values);

        const initialValuesNew = {
            // hotelCode: '',
            // hotelName: '',
            // operatorGpCode: null,
            // operatorCode: null,
            // season: null,
            // ratePeriod: null,
            // fromDate: '',
            // toDate: '',
            // taxGpCode: null,
            // taxAmount: '',
            // currency: '',
            ratesDetails: [
                {
                    roomCategory: values.roomCategory,
                    basis: values.basis,
                    singleRate: values.singleRate,
                    doubleRate: values.doubleRate,
                    trippleRate: values.trippleRate,
                    family: values.family,
                    child: values.child,
                    taxApplicable: values.taxApplicable,
                    default: values.default
                }
            ]
        };
        // console.log(loadValues);
        // loadValues.ratesDetails?.map((s) => initialValuesNew.ratesDetails.push(s));

        // setLoadValues(initialValuesNew);
    };
    const handleSubmitForm = async (data) => {
        console.log(data);
        // if (mode === 'INSERT') {
        //     dispatch(saveClusterAndMarketMappingData(data));
        // }
        // handleClose();
    };
    const handleGuideandTourSubmit = async (values) => {
        console.log(values);

        const initialValuesNew = {
            tourGuideDetails: [
                {
                    basis: values.basis,
                    guideRate: values.guideRate,
                    tourLeadRate: values.tourLeadRate,
                    taxApplicable: values.taxApplicable
                }
            ]
        };
        console.log(secondLoadValues);
        secondLoadValues.tourGuideDetails?.map((s) => initialValuesNew.tourGuideDetails.push(s));
        // console.log(initialValuesNew);
        // initialValuesNew.tourGuideDetails.push(initialValuesNew);
        setSecondLoadValues(initialValuesNew);
    };
    const handleAllSubmitForm = async (values) => {
        console.log(values);
        console.log(loadValues);
        console.log(secondLoadValues);
        console.log(mainDetails);

        let data = {};
        // dispatch(saveRoomBuyingRateData());
    };

    function validateEmail(value) {
        console.log(value);
        let error;
        if (!value) {
            error = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = 'Invalid email address';
        }
        return error;
    }

    function validateUsername(value) {
        let error;
        if (value === 'admin') {
            error = 'Nice try!';
        }
        return error;
    }
    return (
        <div>
            <h1>Signup</h1>
            <Formik
                initialValues={{
                    username: '',
                    email: ''
                }}
                onSubmit={(values) => {
                    // same shape as initial values
                    console.log(values);
                }}
            >
                {({ errors, touched, validateField, validateForm, values, isValid, handleBlur, handleChange, dirty }) => (
                    <Form>
                        {/* <Field
                            as={TextField}
                            name="code"
                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                            fullWidth
                            sx={{
                                width: { sm: 200, md: 300 },
                                '& .MuiInputBase-root': {
                                    height: 30
                                }
                            }}
                            error={props.errors.code && props.touched.code}
                            // helperText={
                            //   error && formValues.tourCategoryCode.length === 0
                            //     ? "Required Field"
                            //     : "" || duplicateError
                            //     ? "Category Code Already Exists"
                            //     : ""
                            // }
                            helperText={<ErrorMessage name="code" value="" />}
                            required
                            // onBlur={(e) => checkDuplicateProductCode(e)}
                        />
                        <Field
                            as={TextField}
                            name="code"
                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                            fullWidth
                            sx={{
                                width: { sm: 200, md: 300 },
                                '& .MuiInputBase-root': {
                                    height: 30
                                }
                            }}
                            error={props.errors.code && props.touched.code}
                            // helperText={
                            //   error && formValues.tourCategoryCode.length === 0
                            //     ? "Required Field"
                            //     : "" || duplicateError
                            //     ? "Category Code Already Exists"
                            //     : ""
                            // }
                            helperText={<ErrorMessage name="code" value="" />}
                            required
                            // onBlur={(e) => checkDuplicateProductCode(e)}
                        /> */}

                        {/* <Field name="email" validate={validateEmail} error={errors.email && touched.email} />

                        {errors.email && touched.email && <div>{errors.email}</div>} */}

                        <Field
                            as={TextField}
                            label="Single Rate"
                            sx={{
                                width: { xs: 120 },
                                '& .MuiInputBase-root': {
                                    height: 40
                                }
                            }}
                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                            type="text"
                            variant="outlined"
                            name="email"
                            InputLabelProps={{
                                shrink: true
                            }}
                            validate={validateEmail}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email ? errors.email : ''}
                        />

                        <Field name="username" validate={validateUsername} />
                        {errors.username && touched.username && <div>{errors.username}</div>}
                        {/** Trigger field-level validation
               imperatively */}
                        <button type="button" onClick={() => validateField('username')}>
                            Check Username
                        </button>
                        {/** Trigger form-level validation
               imperatively */}
                        <button type="button" onClick={() => validateForm().then(() => console.log(dirty))}>
                            Validate All
                        </button>
                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default RoomBuyingRates;
