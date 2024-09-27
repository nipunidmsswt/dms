import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import * as yup from 'yup';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { getAllCurrencyListData } from 'store/actions/masterActions/ExpenseTypeAction';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getActiveRoomcategory } from 'store/actions/masterActions/RoomCategoryAction';
import { getActiveHotelBasisList } from 'store/actions/masterActions/operatorActions/HotelBasisAction';
import {
    saveRoomBuyingRateData,
    getRoomBuyingRateDataById,
    updateRoomBuyingRateData,
    clearRoomBuyingRate,
    checkDuplicateRoomBuyingRateCode
} from 'store/actions/masterActions/RoomBuyongRateAction';
import ArticleIcon from '@mui/icons-material/Article';
import ShowTaxDetails from './ShowTaxDetails';
import { withStyles } from '@material-ui/core/styles';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import ExitAlert from 'messages/ExitAlert';
import AlertItemExist from 'messages/AlertItemExist';
import { useNavigate, useLocation } from 'react-router-dom';
const styles = (theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 200
    }
});

function RoomBuyingRates(props) {
    const { classes } = props;
    const formikRef = useRef();
    const newobj = {
        roomBuyingRateId: '',
        hotelCode: null,
        hotelName: null,
        operatorGpCode: null,
        operatorCode: [],
        newOperatorCode: [],
        season: null,
        ratePeriod: null,
        fromDate: '',
        toDate: '',
        taxGpCode: null,
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
        guideBasis: null,
        guideRate: '',
        tourLeadRate: '',
        taxApplicableGuide: true,
        rateStatus: true,
        guideStatus: true,
        status: true,
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
                rateStatus: true,
                singleRateAmountWithTax: '',
                doubleRateAmountWithTax: '',
                tripleRateAmountWithTax: '',
                familyRateAmountWithTax: '',
                childRateAmountWithTax: ''
            }
        ],
        tourGuideDetails: [
            {
                guideBasis: null,
                guideRate: '',
                tourLeadRate: '',
                taxApplicableGuide: true,
                guideStatus: true,
                guideRateAmountWithTax: '',
                tourLeadRateAmountWithTaxtourLeadValue: ''
            }
        ],
        ignoreValidation: false
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
    const [openTaxDetails, setOpenTaxDetails] = useState(false);
    const [openTaxDetails2, setOpenTaxDetails2] = useState(false);
    const [storeTaxdata, setStoreTaxData] = useState([]);
    const [taxDetails, setTaxDetails] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [hotelData, setHotelData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [existOpenModal, setExistOpenModal] = useState(false);
    const [existOpenModal1, setExistOpenModal1] = useState(false);

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
    const roomBuyingRateToUpdate = useSelector((state) => state.roomBuyingRateReducer.roomBuyingRateToUpdate);
    const roomBuyingRate = useSelector((state) => state.roomBuyingRateReducer.roomBuyingRate);
    const duplicateRoomBuyingRate = useSelector((state) => state.roomBuyingRateReducer.duplicateRoomBuyingRate);

    let location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        console.log('roomBuyingRate roomBuyingRate roomBuyingRate');
        if (roomBuyingRate && mode === 'INSERT') {
            console.log('roomBuyingRate roomBuyingRate roomBuyingRate');
            console.log(roomBuyingRate);
            setnewobj({
                hotelCode: location.state.data.rowdata,
                hotelName: location.state.data.rowdata,
                operatorGpCode: null,
                operatorCode: [],
                newOperatorCode: [],
                season: null,
                ratePeriod: null,
                fromDate: '',
                toDate: '',
                taxGpCode: null,
                currency: null,
                roomCategory: null,
                basis: null,
                guideBasis: null,
                singleRate: '',
                doubleRate: '',
                trippleRate: '',
                family: '',
                child: '',
                taxApplicable: true,
                taxApplicableGuide: true,
                default: false,
                rateStatus: true,
                guideStatus: true,
                guideRate: '',
                status: true,
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
                        rateStatus: true,
                        singleRateAmountWithTax: '',
                        doubleRateAmountWithTax: '',
                        tripleRateAmountWithTax: '',
                        familyRateAmountWithTax: '',
                        childRateAmountWithTax: ''
                    }
                ],
                tourGuideDetails: [
                    {
                        guideBasis: null,
                        guideRate: '',
                        tourLeadRate: '',
                        taxApplicableGuide: true,
                        guideStatus: true,
                        guideRateAmountWithTax: '',
                        tourLeadRateAmountWithTaxtourLeadValue: ''
                    }
                ],
                ignoreValidation: false,
                status: true
            });
            setHandleToast(true);
            setOpenModal(true);
            dispatch(clearRoomBuyingRate());
        } else if (roomBuyingRate && mode === 'VIEW_UPDATE') {
            console.log('heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
            setHandleToast(true);
            dispatch(clearRoomBuyingRate());
        }
    }, [roomBuyingRate]);

    useEffect(() => {
        console.log(location.state);

        if (location.state.mode === 'INSERT') {
            console.log(location.state.data.rowdata);
            setMode(location.state.mode);
            setnewobj({
                hotelCode: location.state.data.rowdata,
                hotelName: location.state.data.rowdata,
                operatorGpCode: null,
                operatorCode: [],
                newOperatorCode: [],
                season: null,
                ratePeriod: null,
                fromDate: '',
                toDate: '',
                taxGpCode: null,
                currency: null,
                roomCategory: null,
                basis: null,
                guideBasis: null,
                singleRate: '',
                doubleRate: '',
                trippleRate: '',
                family: '',
                child: '',
                taxApplicable: true,
                taxApplicableGuide: true,
                default: false,
                rateStatus: true,
                guideStatus: true,
                guideRate: '',
                status: true,
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
                        rateStatus: true,
                        singleRateAmountWithTax: '',
                        doubleRateAmountWithTax: '',
                        tripleRateAmountWithTax: '',
                        familyRateAmountWithTax: '',
                        childRateAmountWithTax: ''
                    }
                ],
                tourGuideDetails: [
                    {
                        guideBasis: null,
                        guideRate: '',
                        tourLeadRate: '',
                        taxApplicableGuide: true,
                        guideStatus: true,
                        guideRateAmountWithTax: '',
                        tourLeadRateAmountWithTaxtourLeadValue: ''
                    }
                ],
                status: true
            });
        } else if (location.state.mode === 'VIEW_UPDATE') {
            setMode(location.state.mode);
            dispatch(getRoomBuyingRateDataById(location.state.data.roomBuyingRateId));
        }
    }, [location]);

    useEffect(() => {
        console.log('roomBuyingRateToUpdate roomBuyingRateToUpdate roomBuyingRateToUpdate');
        console.log(roomBuyingRateToUpdate);
        console.log(mode);
        if (roomBuyingRateToUpdate !== null && mode !== 'INSERT') {
            dispatch(getAllActiveOperatorByOperatorGpId(roomBuyingRateToUpdate.operatorGpCode.marketGroupOperatorGroupId));
            setnewobj({
                hotelCode: location.state.data.hotelCode,
                hotelName: location.state.data.hotelCode,
                newOperatorCode: [],
                roomBuyingRateId: roomBuyingRateToUpdate.roomBuyingRateId,
                operatorGpCode: roomBuyingRateToUpdate.operatorGpCode,
                operatorCode: roomBuyingRateToUpdate.operatorCode,
                season: roomBuyingRateToUpdate.season,
                ratePeriod: roomBuyingRateToUpdate.seasonDetails,
                fromDate: roomBuyingRateToUpdate.fromDate,
                toDate: roomBuyingRateToUpdate.toDate,
                taxGpCode: roomBuyingRateToUpdate.taxGpCode,
                currency: roomBuyingRateToUpdate.currency,
                roomCategory: null,
                basis: null,
                guideBasis: null,
                singleRate: '',
                doubleRate: '',
                trippleRate: '',
                family: '',
                child: '',
                taxApplicable: true,
                taxApplicableGuide: true,
                rateStatus: true,
                guideStatus: true,
                guideRate: '',
                status: roomBuyingRateToUpdate.status,
                ratesDetails: roomBuyingRateToUpdate.ratesDetails,
                tourGuideDetails: roomBuyingRateToUpdate.tourGuideDetails
            });
        } else {
        }
    }, [roomBuyingRateToUpdate]);

    const handleModalClose = (status) => {
        setOpenModal(false);
    };

    useEffect(() => {
        if (activeSeasonData.length != 0) {
            setactiveSeasonList(activeSeasonData);
        }
    }, [activeSeasonData]);

    useEffect(() => {
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
        if (activeOperatordata.length != 0) {
            setActiveOperatorList(activeOperatordata);
        }
    }, [activeOperatordata]);

    useEffect(() => {
        if (activeHotelChildrenFacilityListData.length != 0) {
            setActiveRoomCategories(activeHotelChildrenFacilityListData);
        }
    }, [activeHotelChildrenFacilityListData]);

    useEffect(() => {
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
        dispatch(getAllActiveOperatorGroupData());
        dispatch(getAllCurrencyListData());
    }, []);

    const handleClose = () => {
        setOpenTaxDetails(false);
    };

    const handleClose2 = () => {
        setOpenTaxDetails2(false);
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

    const handleSubmit = async (values, formValues) => {
        console.log(values);
        // console.log(formValues);
        let single = values.singleRate;
        let double = values.doubleRate;
        let tripple = values.trippleRate;
        let family = values.family;
        let child = values.child;
        if (storeTaxdata != null) {
            console.log(storeTaxdata);
            let jsonArray = storeTaxdata;
            jsonArray.sort(function (a, b) {
                return a.taxOrder - b.taxOrder;
            });
            console.log(jsonArray);
            if (values.taxApplicable) {
                jsonArray.map((data) => {
                    let singleValue = +single * (data.tax.percentage / 100);
                    single = +single + +singleValue;

                    let doubleValue = +double * (data.tax.percentage / 100);
                    double = +double + +doubleValue;

                    let trippleValue = +tripple * (data.tax.percentage / 100);
                    tripple = +tripple + +trippleValue;

                    let familyValue = +family * (data.tax.percentage / 100);
                    family = +family + +familyValue;

                    let childVaue = +child * (data.tax.percentage / 100);
                    child = +child + +childVaue;
                });
            }
        }

        const initialValuesNew = {
            roomBuyingRateId: values.roomBuyingRateId,
            hotelCode: values.hotelCode,
            hotelName: values.hotelName,
            operatorGpCode: values.operatorGpCode,
            operatorCode: values.operatorCode,
            newOperatorCode: values.newOperatorCode,
            season: values.season,
            ratePeriod: values.ratePeriod,
            fromDate: values.fromDate,
            toDate: values.toDate,
            taxGpCode: values.taxGpCode,
            currency: values.currency,
            roomCategory: null,
            basis: null,
            singleRate: '',
            doubleRate: '',
            trippleRate: '',
            family: '',
            child: '',
            taxApplicable: true,
            default: values.default,
            guideBasis: null,
            guideRate: '',
            tourLeadRate: '',
            taxApplicableGuide: true,
            rateStatus: values.rateStatus,
            guideStatus: values.guideStatus,
            status: values.status,
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
                    rateStatus: values.rateStatus,
                    singleRateAmountWithTax: single,
                    doubleRateAmountWithTax: double,
                    tripleRateAmountWithTax: tripple,
                    familyRateAmountWithTax: family,
                    childRateAmountWithTax: child
                }
            ],
            tourGuideDetails: formValues.tourGuideDetails
        };
        console.log(mmObject.ratesDetails);
        mmObject.ratesDetails?.map((s) => {
            console.log(s);
            if (s.roomCategory !== null) {
                s.roomCategory.id === values.roomCategory.id && s.basis.id === values.basis.id
                    ? setExistOpenModal(true)
                    : initialValuesNew.ratesDetails.push(s);
            }
        });

        console.log(initialValuesNew);
        setnewobj(initialValuesNew);
    };
    const handleSubmit2 = async (values, formValues) => {
        console.log(values);
        let guide = values.guideRate;
        let tourLead = values.tourLeadRate;

        if (storeTaxdata != null) {
            console.log(storeTaxdata);
            let jsonArray = storeTaxdata;
            jsonArray.sort(function (a, b) {
                return a.taxOrder - b.taxOrder;
            });
            console.log(jsonArray);
            if (values.taxApplicableGuide) {
                jsonArray.map((data) => {
                    let guideValue = +guide * (data.tax.percentage / 100);
                    guide = +guide + +guideValue;

                    let tourLeadValue = +tourLead * (data.tax.percentage / 100);
                    tourLead = +tourLead + +tourLeadValue;
                });
            }
        }
        const initialValuesNew = {
            roomBuyingRateId: values.roomBuyingRateId,
            hotelCode: values.hotelCode,
            hotelName: values.hotelName,
            operatorGpCode: values.operatorGpCode,
            operatorCode: values.operatorCode,
            newOperatorCode: values.newOperatorCode,
            season: values.season,
            ratePeriod: values.ratePeriod,
            fromDate: values.fromDate,
            toDate: values.toDate,
            taxGpCode: values.taxGpCode,
            currency: values.currency,
            roomCategory: values.roomCategory,
            basis: null,
            singleRate: '',
            doubleRate: '',
            trippleRate: '',
            family: '',
            child: '',
            taxApplicable: true,
            default: values.default,
            guideBasis: null,
            guideRate: '',
            tourLeadRate: '',
            taxApplicableGuide: true,
            ratesDetails: formValues.ratesDetails,
            rateStatus: values.rateStatus,
            guideStatus: values.guideStatus,
            status: values.status,
            tourGuideDetails: [
                {
                    guideBasis: values.guideBasis,
                    guideRate: values.guideRate,
                    tourLeadRate: values.tourLeadRate,
                    taxApplicableGuide: values.taxApplicableGuide,
                    guideStatus: values.guideStatus,
                    guideRateAmountWithTax: guide,
                    tourLeadRateAmountWithTaxtourLeadValue: tourLead
                }
            ]
        };

        mmObject.tourGuideDetails?.map((s) => {
            if (s.guideBasis !== null) {
                s.guideBasis.id === values.guideBasis.id ? setExistOpenModal1(true) : initialValuesNew.tourGuideDetails.push(s);
            }
        });
        setnewobj(initialValuesNew);
    };

    const handleFinalSubmit = async (values) => {
        console.log(values);
        delete values.hotelCode.createdDate;
        delete values.hotelCode.updatedDate;

        // let data = {
        //     hotelCode: values.hotelCode,
        //     operatorGpCode: values.operatorGpCode,
        //     operatorCode: values.operatorCode,
        //     season: values.season,
        //     ratePeriod: values.ratePeriod
        // };
        // if (values.hotelCode && values.operatorGpCode && values.operatorCode && values.season && values.ratePeriod) {
        //     dispatch(checkDuplicateRoomBuyingRateCode(data));
        // }

        for (let i in values.newOperatorCode) {
            values.operatorCode.push(values.newOperatorCode[i]);
        }

        if (mode === 'INSERT') {
            dispatch(saveRoomBuyingRateData(values));
        } else {
            dispatch(updateRoomBuyingRateData(values));
        }
    };

    function requiredValidation(value) {
        console.log(value);
        let error;
        if (!value) {
            error = 'Required';
        }
        return error;
    }

    useEffect(() => {
        console.log(duplicateRoomBuyingRate);
        // if(duplicateRoomBuyingRate){
        //     if(duplicateRoomBuyingRate.errormessages.length < 0){

        //     }
        // }
    }, [duplicateRoomBuyingRate]);

    const validate = (values) => {
        console.log(values);
    };

    const handleExistModalClose = () => {
        setExistOpenModal(false);
    };
    const handleExistModalClose1 = () => {
        setExistOpenModal1(false);
    };
    return (
        <div>
            <MainCard title="Room Buying Rates">
                <div className="row">
                    <Grid container direction="row">
                        <Grid item>
                            <Formik
                                enableReinitialize={true}
                                initialValues={mmObject || newobj}
                                innerRef={formikRef}
                                validate={validate}
                                // onSubmit={(values) => {
                                //     handleFinalSubmit(values);
                                // }}
                                // validationSchema={validationSchema}
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
                                    dirty,
                                    setFieldTouched,
                                    setTouched,
                                    setErrors
                                }) => {
                                    return (
                                        <Form>
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        <Autocomplete
                                                            value={values.hotelCode}
                                                            name="hotelCode"
                                                            disabled
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
                                                                        width: { xs: 300 },
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
                                                            disabled
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
                                                                        width: { xs: 300 },
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
                                                    <Grid item>
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
                                                    <Grid item style={{ marginLeft: '500px' }}>
                                                        {' '}
                                                        <Button
                                                            className="btnSave"
                                                            variant="contained"
                                                            type="button"
                                                            onClick={() => {
                                                                navigate('/master/hotelview');
                                                            }}
                                                        >
                                                            {'Hotel Master'}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <hr />
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        {' '}
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.operatorGpCode}
                                                            name="operatorGpCode"
                                                            disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                            onChange={(_, value) => {
                                                                if (value != null) {
                                                                    loadOperatorCode(value);
                                                                }

                                                                setFieldValue(`operatorGpCode`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeOperatorGroupList}
                                                            getOptionLabel={(option) => `${option.code}`}
                                                            isOptionEqualToValue={(option, value) =>
                                                                option.marketGroupOperatorGroupId === value.marketGroupOperatorGroupId
                                                            }
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Operator Group Code"
                                                                    sx={{
                                                                        width: { xs: 300 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    validate={requiredValidation}
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
                                                            disableClearable
                                                            disablePortal
                                                            value={values.operatorCode}
                                                            name="operatorCode"
                                                            fullWidth
                                                            disabled={mode !== 'INSERT'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`operatorCode`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            multiple
                                                            options={activeOperatorList}
                                                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                                            isOptionEqualToValue={(option, value) => option.operatorId === value.operatorId}
                                                            getOptionDisabled={(option) => {
                                                                if (values.operatorCode.some((day) => day.code === option.code)) {
                                                                    return true;
                                                                }

                                                                return false;
                                                            }}
                                                            renderInput={(params) => {
                                                                return (
                                                                    <TextField
                                                                        {...params}
                                                                        label={
                                                                            mode !== 'INSERT' ? 'Selected Operator Code' : 'Operator Code'
                                                                        }
                                                                        sx={{
                                                                            width: { xs: 600 },
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
                                                                );
                                                            }}
                                                        />
                                                    </Grid>
                                                    {mode === 'VIEW_UPDATE' ? (
                                                        <Grid item>
                                                            <Autocomplete
                                                                disableClearable
                                                                disablePortal
                                                                // value={values.newOperatorCode}
                                                                name="newOperatorCode"
                                                                fullWidth
                                                                disabled={mode == 'VIEW'}
                                                                onChange={(_, value) => {
                                                                    setFieldValue(`newOperatorCode`, value);
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                multiple
                                                                options={activeOperatorList}
                                                                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                                                isOptionEqualToValue={(option, value) =>
                                                                    option.operatorId === value.operatorId
                                                                }
                                                                getOptionDisabled={(option) => {
                                                                    if (values.operatorCode.some((day) => day.code === option.code)) {
                                                                        return true;
                                                                    }

                                                                    return false;
                                                                }}
                                                                renderInput={(params) => {
                                                                    return (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Add New Operator Code"
                                                                            sx={{
                                                                                width: { xs: 600 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 41
                                                                                }
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            error={Boolean(
                                                                                touched.newOperatorCode && errors.newOperatorCode
                                                                            )}
                                                                            helperText={
                                                                                touched.newOperatorCode && errors.newOperatorCode
                                                                                    ? errors.newOperatorCode
                                                                                    : ''
                                                                            }
                                                                            // placeholder="--Select a Manager Code --"
                                                                            variant="outlined"
                                                                            name="newOperatorCode"
                                                                            onBlur={handleBlur}
                                                                        />
                                                                    );
                                                                }}
                                                            />
                                                        </Grid>
                                                    ) : (
                                                        ''
                                                    )}

                                                    {/* <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Child"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="child"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.child}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.child && errors.child)}
                                                            helperText={touched.child && errors.child ? errors.child : ''}
                                                        />
                                                    </Grid> */}
                                                </Grid>
                                            </div>
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.season}
                                                            name="season"
                                                            disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                            onChange={(_, value) => {
                                                                loadRatesBySeason(value);
                                                                setFieldValue(`season`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            validate={requiredValidation}
                                                            options={activeSeasonList}
                                                            getOptionLabel={(option) => `${option.mainSeason}`}
                                                            isOptionEqualToValue={(option, value) => option.seasonId === value.seasonId}
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Season"
                                                                    sx={{
                                                                        width: { xs: 300 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    validate={requiredValidation}
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
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.ratePeriod}
                                                            name="ratePeriod"
                                                            disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                            onChange={(_, value) => {
                                                                console.log(value);
                                                                setFieldValue(`ratePeriod`, value);

                                                                if (value !== null) {
                                                                    setFieldValue(`fromDate`, value.fromDate);
                                                                    setFieldValue(`toDate`, value.toDate);
                                                                }
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
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Rate Period"
                                                                    sx={{
                                                                        width: { xs: 300 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    validate={requiredValidation}
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
                                                                disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                                onChange={(_, value) => {
                                                                    console.log(value);
                                                                    if (value != null) {
                                                                        setStoreTaxData(value.taxGroupDetails);
                                                                    }

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
                                                                            width: { xs: 300 },
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
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.currency}
                                                            name="currency"
                                                            onChange={(_, value) => {
                                                                console.log(value);
                                                                setFieldValue(`currency`, value);
                                                            }}
                                                            disabled={mode == 'VIEW' || mode == 'VIEW_UPDATE'}
                                                            options={currencyListOptions}
                                                            getOptionLabel={(option) =>
                                                                `${option.currencyCode} - ${option.currencyDescription}`
                                                            }
                                                            isOptionEqualToValue={(option, value) =>
                                                                option.currencyListId === value.currencyListId
                                                            }
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    // label="tax"
                                                                    sx={{
                                                                        width: { xs: 300 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 40
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    label="Currency"
                                                                    variant="outlined"
                                                                    validate={requiredValidation}
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
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.roomCategory}
                                                            name="roomCategory"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`roomCategory`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeRoomCategories}
                                                            getOptionLabel={(option) => `${option.code}`}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Room Category"
                                                                    sx={{
                                                                        width: { xs: 120 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    validate={requiredValidation}
                                                                    error={Boolean(touched.roomCategory && errors.roomCategory)}
                                                                    helperText={
                                                                        touched.roomCategory && errors.roomCategory
                                                                            ? errors.roomCategory
                                                                            : ''
                                                                    }
                                                                    // placeholder="--Select a Manager Code --"
                                                                    variant="outlined"
                                                                    name="roomCategory"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid item>
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.basis}
                                                            name="basis"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`basis`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeotelBasis}
                                                            getOptionLabel={(option) => `${option.code}`}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Basis"
                                                                    sx={{
                                                                        width: { xs: 120 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    validate={requiredValidation}
                                                                    error={Boolean(touched.basis && errors.basis)}
                                                                    helperText={touched.basis && errors.basis ? errors.basis : ''}
                                                                    variant="outlined"
                                                                    name="basis"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Single Rate"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="singleRate"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.singleRate}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.singleRate && errors.singleRate)}
                                                            helperText={touched.singleRate && errors.singleRate ? errors.singleRate : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Double Rate"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="doubleRate"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.doubleRate}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.doubleRate && errors.doubleRate)}
                                                            helperText={touched.doubleRate && errors.doubleRate ? errors.doubleRate : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Tripple Rate"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="trippleRate"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.trippleRate}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.trippleRate && errors.trippleRate)}
                                                            helperText={touched.trippleRate && errors.trippleRate ? errors.trippleRate : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="family"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="family"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.family}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.family && errors.family)}
                                                            helperText={touched.family && errors.family ? errors.family : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Child"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="child"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.child}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.child && errors.child)}
                                                            helperText={touched.child && errors.child ? errors.child : ''}
                                                        />
                                                    </Grid>

                                                    <Grid item>
                                                        <FormGroup>
                                                            <Field
                                                                as={FormControlLabel}
                                                                name="taxApplicable"
                                                                onChange={handleChange}
                                                                value={values.taxApplicable}
                                                                control={<Switch color="success" />}
                                                                label="Tax Applicable"
                                                                checked={values.taxApplicable}
                                                                // disabled={mode == 'VIEW'}
                                                            />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton
                                                            aria-label="delete"
                                                            type="button"
                                                            onClick={() => {
                                                                setTouched({ roomCategory: true, basis: true }).then(() => {
                                                                    console.log(formikRef);
                                                                    console.log(formikRef.current.errors);
                                                                    if (
                                                                        formikRef.current.errors.roomCategory == undefined &&
                                                                        formikRef.current.errors.basis == undefined
                                                                    ) {
                                                                        handleSubmit(values, formikRef.current.values);
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <AddBoxIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <br />
                                            <FieldArray name="ratesDetails">
                                                {({ insert, remove, push }) => (
                                                    <Paper className={classes.root}>
                                                        <TableContainer>
                                                            <Table
                                                                stickyHeader
                                                                className={classes.table}
                                                                // size="small"
                                                                // sx={{
                                                                //     height: 200
                                                                // }}
                                                            >
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
                                                                        <TableCell>Tax Applicable</TableCell>
                                                                        <TableCell>Status</TableCell>
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
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            name={`ratesDetails.${idx}.rateStatus`}
                                                                                            onChange={handleChange}
                                                                                            value={
                                                                                                values.ratesDetails[idx] &&
                                                                                                values.ratesDetails[idx].rateStatus
                                                                                            }
                                                                                            control={<Switch color="success" />}
                                                                                            // label="Status"
                                                                                            checked={values.ratesDetails[idx].rateStatus}

                                                                                            // disabled={mode == 'VIEW'}
                                                                                        />
                                                                                    </FormGroup>
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    <IconButton
                                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                        disa
                                                                                        aria-label="delete"
                                                                                        onClick={() => {
                                                                                            remove(idx);
                                                                                        }}
                                                                                    >
                                                                                        <HighlightOffIcon />
                                                                                    </IconButton>
                                                                                    <IconButton
                                                                                        disabled={mode == 'VIEW'}
                                                                                        disa
                                                                                        aria-label="delete"
                                                                                        onClick={() => {
                                                                                            console.log('here');
                                                                                            console.log(values);
                                                                                            setTaxDetails(values);
                                                                                            setOpenTaxDetails(true);

                                                                                            // remove(idx);
                                                                                        }}
                                                                                    >
                                                                                        <ArticleIcon />
                                                                                    </IconButton>
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
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.guideBasis}
                                                            name="guideBasis"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`guideBasis`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeotelBasis}
                                                            getOptionLabel={(option) => `${option.code}`}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Guide Basis"
                                                                    sx={{
                                                                        width: { xs: 250 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 41
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    validate={requiredValidation}
                                                                    error={Boolean(touched.guideBasis && errors.guideBasis)}
                                                                    helperText={touched.guideBasis && errors.basis ? errors.guideBasis : ''}
                                                                    variant="outlined"
                                                                    name="guideBasis"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Guide Rate"
                                                            sx={{
                                                                width: { xs: 250 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            type="text"
                                                            variant="outlined"
                                                            name="guideRate"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.guideRate}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.guideRate && errors.guideRate)}
                                                            helperText={touched.guideRate && errors.guideRate ? errors.guideRate : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Tour Lead Rate"
                                                            sx={{
                                                                width: { xs: 250 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="tourLeadRate"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.tourLeadRate}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.tourLeadRate && errors.tourLeadRate)}
                                                            helperText={
                                                                touched.tourLeadRate && errors.tourLeadRate ? errors.tourLeadRate : ''
                                                            }
                                                        />
                                                    </Grid>

                                                    <Grid item>
                                                        <FormGroup>
                                                            <Field
                                                                as={FormControlLabel}
                                                                name="taxApplicableGuide"
                                                                onChange={handleChange}
                                                                value={values.taxApplicableGuide}
                                                                control={<Switch color="success" />}
                                                                label="Tax Applicable"
                                                                checked={values.taxApplicableGuide}
                                                                // disabled={mode == 'VIEW'}
                                                            />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton
                                                            aria-label="delete"
                                                            type="button"
                                                            onClick={() => {
                                                                setTouched({ guideBasis: true }).then(() => {
                                                                    console.log(formikRef.current.isValid);
                                                                    console.log(formikRef.current.errors);

                                                                    if (formikRef.current.errors.guideBasis == undefined) {
                                                                        handleSubmit2(values, formikRef.current.values);
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            {mode === 'INSERT' ? <AddBoxIcon /> : null}
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <br />
                                            <FieldArray name="tourGuideDetails">
                                                {({ insert, remove, push }) => (
                                                    <Paper>
                                                        <TableContainer>
                                                            <Table stickyHeader size="small">
                                                                <TableHead alignItems="center">
                                                                    <TableRow>
                                                                        {/* <TableCell>Sequence</TableCell> */}

                                                                        <TableCell>Basis </TableCell>
                                                                        <TableCell>Guide</TableCell>
                                                                        <TableCell>Tour Lead</TableCell>
                                                                        <TableCell>Tax Applicable</TableCell>
                                                                        <TableCell>Status</TableCell>
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
                                                                                                ? values.tourGuideDetails[idx].guideBasis
                                                                                                : null
                                                                                        }
                                                                                        name={`tourGuideDetails.${idx}.guideBasis`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `tourGuideDetails.${idx}.guideBasis`,
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
                                                                                                name={`tourGuideDetails.${idx}.guideBasis`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.tourGuideDetails &&
                                                                                                    touched.tourGuideDetails[idx] &&
                                                                                                    touched.tourGuideDetails[idx]
                                                                                                        .guideBasis &&
                                                                                                    errors.tourGuideDetails &&
                                                                                                    errors.tourGuideDetails[idx] &&
                                                                                                    errors.tourGuideDetails[idx].guideBasis
                                                                                                        ? errors.tourGuideDetails[idx]
                                                                                                              .guideBasis
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.tourGuideDetails &&
                                                                                                        touched.tourGuideDetails[idx] &&
                                                                                                        touched.tourGuideDetails[idx]
                                                                                                            .guideBasis &&
                                                                                                        errors.tourGuideDetails &&
                                                                                                        errors.tourGuideDetails[idx] &&
                                                                                                        errors.tourGuideDetails[idx]
                                                                                                            .guideBasis
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
                                                                                            name={`tourGuideDetails.${idx}.taxApplicableGuide`}
                                                                                            onChange={handleChange}
                                                                                            value={
                                                                                                values.tourGuideDetails[idx] &&
                                                                                                values.tourGuideDetails[idx]
                                                                                                    .taxApplicableGuide
                                                                                            }
                                                                                            control={<Switch color="success" />}
                                                                                            // label="Status"
                                                                                            checked={
                                                                                                values.tourGuideDetails[idx]
                                                                                                    .taxApplicableGuide
                                                                                            }
                                                                                            disabled
                                                                                            // disabled={mode == 'VIEW'}
                                                                                        />
                                                                                    </FormGroup>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            name={`tourGuideDetails.${idx}.guideStatus`}
                                                                                            onChange={handleChange}
                                                                                            value={
                                                                                                values.tourGuideDetails[idx] &&
                                                                                                values.tourGuideDetails[idx].guideStatus
                                                                                            }
                                                                                            control={<Switch color="success" />}
                                                                                            // label="Status"
                                                                                            checked={
                                                                                                values.tourGuideDetails[idx].guideStatus
                                                                                            }

                                                                                            // disabled={mode == 'VIEW'}
                                                                                        />
                                                                                    </FormGroup>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <IconButton
                                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                        disa
                                                                                        aria-label="delete"
                                                                                        onClick={() => {
                                                                                            remove(idx);
                                                                                        }}
                                                                                    >
                                                                                        <HighlightOffIcon />
                                                                                    </IconButton>
                                                                                    <IconButton
                                                                                        disabled={mode == 'VIEW'}
                                                                                        disa
                                                                                        aria-label="delete"
                                                                                        onClick={() => {
                                                                                            console.log('here');
                                                                                            console.log(values);
                                                                                            setTaxDetails(values);
                                                                                            setOpenTaxDetails2(true);

                                                                                            // remove(idx);
                                                                                        }}
                                                                                    >
                                                                                        <ArticleIcon />
                                                                                    </IconButton>
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
                                                            </Table>
                                                        </TableContainer>
                                                    </Paper>
                                                )}
                                            </FieldArray>
                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                {mode != 'VIEW' ? (
                                                    <Button
                                                        className="btnSave"
                                                        variant="contained"
                                                        // type="button"
                                                        // onClick={() => {
                                                        //     setTouched({
                                                        //         hotelCode: true,
                                                        //         hotelName: true,
                                                        //         operatorGpCode: true,
                                                        //         operatorCode: true,
                                                        //         season: true,
                                                        //         ratePeriod: true
                                                        //     }).then(() => {});
                                                        // }}
                                                        type="button"
                                                        onClick={() => {
                                                            console.log(formikRef);
                                                            // handleFinalSubmit(values);
                                                            //

                                                            setTouched({
                                                                operatorGpCode: true,
                                                                season: true,
                                                                ratePeriod: true,
                                                                currency: true
                                                            }).then(() => {
                                                                console.log(formikRef);
                                                                console.log(formikRef.current.errors);
                                                                if (
                                                                    formikRef.current.errors.operatorGpCode == undefined &&
                                                                    formikRef.current.errors.season == undefined &&
                                                                    (formikRef.current.errors.ratePeriod == undefined) &
                                                                        (formikRef.current.errors.currency == undefined)
                                                                ) {
                                                                    handleFinalSubmit(values);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                                    </Button>
                                                ) : (
                                                    ''
                                                )}
                                            </Box>
                                            {/* ) : null} */}
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </Grid>
                        {openTaxDetails ? (
                            <ShowTaxDetails open={openTaxDetails} handleClose={handleClose} taxDetails={taxDetails} mode={'Rate'} />
                        ) : (
                            ''
                        )}
                        {openTaxDetails2 ? (
                            <ShowTaxDetails open={openTaxDetails2} handleClose={handleClose2} taxDetails={taxDetails} mode={'Tour'} />
                        ) : (
                            ''
                        )}
                        {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                        {openModal ? <ExitAlert title="dev" open={openModal} handleClose={handleModalClose} /> : null}
                        {existOpenModal ? (
                            <AlertItemExist
                                title="Room Category and Basis should be unique"
                                open={existOpenModal}
                                handleClose={handleExistModalClose}
                            />
                        ) : null}
                        {existOpenModal1 ? (
                            <AlertItemExist title="Basis should be unique" open={existOpenModal1} handleClose={handleExistModalClose1} />
                        ) : null}
                    </Grid>
                </div>
            </MainCard>
        </div>
    );
}
RoomBuyingRates.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RoomBuyingRates);
