import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    TablePagination,
    MenuItem
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
    savePaxVehicleRateData,
    getPaxVehicleRateDataById,
    updatePaxVehicleRateData
} from 'store/actions/masterActions/transportActions/PaxVehicleRateActions';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import ExitAlert from 'messages/ExitAlert';
import AlertItemExist from 'messages/AlertItemExist';
import { useNavigate, useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { getAllActiveGuideClassData } from 'store/actions/masterActions/GuideClassAction';
import {
    getAllActiveVehicleCategoryDataByType,
    getAllActiveVehicleTypeDataByType
} from 'store/actions/masterActions/transportActions/MainTransportCategoriesActions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllTaxData } from 'store/actions/masterActions/TaxActions/TaxAction';
import { getActiveTaxGroupandTaxList } from 'store/actions/masterActions/TaxActions/TaxGroupAction';
import { IconEye } from '@tabler/icons';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpenseatLocation from './ExpenseatLocation';
import PaxVehicleRateDetails from './PaxVehicleRateDetails';
import ViewPaxVehicleRateDetails from './ViewPaxVehicleRateDetails';
import ArticleIcon from '@mui/icons-material/Article';
import ErrorAlert from 'messages/ErrorAlert';

const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});

const styles = (theme) => ({
    tableRow: {
        '&$selected, &$selected:hover': {
            backgroundColor: 'purple'
        }
    },
    tableCell: {
        '$selected &': {
            color: 'yellow'
        }
    },
    selected: {}
});

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9)
];

function PaxVehicleRate({ mode, selectedType, setMode }) {
    const classes = useStyles();
    const styles = (theme) => ({
        tableRow: {
            '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: 'purple',
                '& > .MuiTableCell-root': {
                    color: 'yellow'
                }
            }
        }
    });
    const formikRef = useRef();
    const newobj = {
        transportType: selectedType,
        minCount: '',
        maxCount: '',
        vehicleCategory: null,
        noOfDrivers: 1,
        noOfAssistants: 0,
        guideClass: null,
        description: '',
        status: true,
        fromDate: '',
        toDate: '',
        currency: null,
        vehicleType: null,
        rateType: null,
        taxCode: null,
        vehicleRate: '',
        vehicleRateWithTax: '',
        driverRate: '',
        driverRateWithTax: '',
        assistantRate: '',
        assistantWithTax: '',
        deatailStatus: true,
        ratesDetails: [
            {
                transportType: selectedType,
                minCount: '',
                maxCount: '',
                vehicleCategory: null,
                description: '',
                noOfDrivers: '',
                noOfAssistants: '',
                guideClass: null,
                status: true,
                paxVehicleRateDetails: [
                    {
                        fromDate: '',
                        toDate: '',
                        currency: null,
                        vehicleType: null,
                        rateType: null,
                        taxCode: null,
                        vehicleRate: '',
                        vehicleRateWithTax: '',
                        driverRate: '',
                        driverRateWithTax: '',
                        assistantRate: '',
                        assistantWithTax: '',
                        deatailStatus: ''
                    }
                ],

                expensesAtLocations: [
                    {
                        location: null,
                        locationDes: '',
                        expenseTypes: null,
                        expenseDes: '',
                        status: true
                    }
                ]
            }
        ]
    };

    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [mmObject, setnewobj] = useState(newobj);
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);
    const [storeTaxdata, setStoreTaxData] = useState([]);
    const [taxDetails, setTaxDetails] = useState([]);
    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    const [taxListOptions, setTaxListOptions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openExpensesLocation, setOpenExpensesLocation] = useState(false);
    const [existOpenModal, setExistOpenModal] = useState(false);
    const [existOpenModal1, setExistOpenModal1] = useState(false);
    const [openDetailTable, setOpenDetailTable] = useState(false);
    const [vehicleCategoryList, setvehicleCategories] = useState([]);
    const [vehicleTypeList, setvehicleTypes] = useState([]);
    const [detailTableIndex, setDetailTableIndex] = useState(0);
    const [activeGuideClassList, setActiveGuideClassList] = useState([]);
    const [expenseLocationDetails, setexpenseLocationDetails] = useState([]);
    const [paxVehicleRate, setPaxVehicleRate] = useState([]);
    const pages = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    const [selectedID, setSelectedID] = useState(null);
    const [activeTaxGroupandTaxesList, setActiveTaxGroupandTaxesListData] = useState([]);
    const [openPaxDetailDialog, setOpenPaxDetailDialog] = useState(false);
    const [paxDetailHeader, setpaxDetailHeader] = useState({});
    const [openErrorAlert, setOpenErrorAlert] = useState(false);

    const dispatch = useDispatch();

    const error = useSelector((state) => state.seasonReducer.errorMsg);
    const lastModifiedDate = useSelector((state) => state.seasonReducer.lastModifiedDateTime);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const paxVehicleRateToUpdate = useSelector((state) => state.paxVehicleRateReducer.paxVehicleRateToUpdate);
    const guideClassActiveList = useSelector((state) => state.guideClassReducer.guideClassActiveList);
    const vehicleCategories = useSelector((state) => state.mainTransportCategoryReducer.vehicleCategories);
    const vehicleTypes = useSelector((state) => state.mainTransportCategoryReducer.vehicleTypes);
    const activeTaxGroupandTaxesListData = useSelector((state) => state.taxGroupReducer.activeTaxGroupandTaxes);

    const [flag, setFlag] = useState(true);

    const navigate = useNavigate();

    const handleErrorAlertClose = (status) => {
        setOpenErrorAlert(false);
    };

    useEffect(() => {
        console.log(selectedType.categoryId);
        if (selectedType != '') {
            dispatch(getPaxVehicleRateDataById(selectedType.categoryId));
        }
    }, [selectedType]);

    useEffect(() => {
        if (activeTaxGroupandTaxesListData.length != 0) {
            setActiveTaxGroupandTaxesListData(activeTaxGroupandTaxesListData);
        }
    }, [activeTaxGroupandTaxesListData]);

    useEffect(() => {
        console.log(paxVehicleRateToUpdate);
        if (paxVehicleRateToUpdate !== null) {
            setMode('VIEW_UPDATE');
            const data = {
                transportType: selectedType,
                minCount: '',
                maxCount: '',
                vehicleCategory: null,
                noOfDrivers: 1,
                noOfAssistants: 0,
                guideClass: null,
                status: true,
                fromDate: '',
                toDate: '',
                currency: null,
                vehicleType: null,
                rateType: null,
                taxCode: null,
                vehicleRate: '',
                vehicleRateWithTax: '',
                driverRate: '',
                driverRateWithTax: '',
                assistantRate: '',
                assistantWithTax: '',
                deatailStatus: true,
                ratesDetails: [
                    {
                        transportType: selectedType,
                        minCount: '',
                        maxCount: '',
                        vehicleCategory: null,
                        noOfDrivers: '',
                        noOfAssistants: '',
                        guideClass: null,
                        status: true,
                        paxVehicleRateDetails: [
                            {
                                fromDate: '',
                                toDate: '',
                                currency: null,
                                vehicleType: null,
                                rateType: null,
                                taxCode: null,
                                vehicleRate: '',
                                vehicleRateWithTax: '',
                                driverRate: '',
                                driverRateWithTax: '',
                                assistantRate: '',
                                assistantWithTax: '',
                                deatailStatus: ''
                            }
                        ],

                        expensesAtLocations: [
                            {
                                location: null,
                                locationDes: '',
                                expenseTypes: null,
                                expenseDes: '',
                                status: true
                            }
                        ]
                    }
                ]
            };

            data.ratesDetails = paxVehicleRateToUpdate;
            setnewobj(data);
        } else {
            setnewobj(newobj);
            setMode('INSERT');
        }
    }, [paxVehicleRateToUpdate]);

    const handleModalClose = (status) => {
        setOpenModal(false);
    };

    useEffect(() => {
        if (guideClassActiveList.length != 0) {
            setActiveGuideClassList(guideClassActiveList);
        }
    }, [guideClassActiveList]);

    useEffect(() => {
        if (vehicleCategories.length != 0) {
            setvehicleCategories(vehicleCategories);
        }
    }, [vehicleCategories]);

    useEffect(() => {
        if (vehicleTypes.length != 0) {
            setvehicleTypes(vehicleTypes);
        }
    }, [vehicleTypes]);

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
        dispatch(getAllCurrencyListData());
        dispatch(getAllActiveGuideClassData());
        dispatch(getAllActiveVehicleCategoryDataByType('Vehicle Category'));
        dispatch(getAllActiveVehicleTypeDataByType('Vehicle Type'));
        dispatch(getActiveTaxGroupandTaxList('buy'));
    }, []);

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

    const addRows = async (values, formValues) => {
        console.log(formValues);
        const initialValuesNew = {
            transportType: selectedType,
            minCount: values.maxCount + 1,
            maxCount: '',
            vehicleCategory: null,
            noOfDrivers: 1,
            noOfAssistants: 0,
            guideClass: null,
            status: true,
            fromDate: '',
            toDate: '',
            currency: null,
            vehicleType: null,
            rateType: null,
            taxCode: null,
            vehicleRate: '',
            vehicleRateWithTax: '',
            driverRate: '',
            driverRateWithTax: '',
            assistantRate: '',
            assistantWithTax: '',
            deatailStatus: true,
            ratesDetails: []
        };

        // });

        // console.log(initialValuesNew);

        // console.log(mmObject.ratesDetails);
        mmObject.ratesDetails.push({
            transportType: selectedType,
            minCount: values.minCount,
            maxCount: values.maxCount,
            vehicleCategory: values.vehicleCategory,
            noOfDrivers: values.noOfDrivers,
            noOfAssistants: values.noOfAssistants,
            guideClass: values.guideClass,
            status: values.status,
            paxVehicleRateDetails: [
                {
                    fromDate: '',
                    toDate: '',
                    currency: null,
                    vehicleType: null,
                    rateType: null,
                    taxCode: null,
                    vehicleRate: '',
                    vehicleRateWithTax: '',
                    driverRate: '',
                    driverRateWithTax: '',
                    assistantRate: '',
                    assistantWithTax: '',
                    deatailStatus: ''
                }
            ],
            expensesAtLocations: [
                {
                    location: null,
                    locationDes: '',
                    expenseTypes: null,
                    expenseDes: '',
                    status: true
                }
            ]
        });
        mmObject.ratesDetails?.map((s) => {
            console.log(s);
            if (s.minCount !== '') {
                initialValuesNew.ratesDetails.push(s);
            }
        });

        console.log(initialValuesNew);
        setnewobj(initialValuesNew);
    };
    const addDetailsRow = async (values, formValues) => {
        console.log(values);
        console.log(formValues);

        const initialValuesNew = {
            transportType: selectedType,
            minCount: '',
            maxCount: '',
            vehicleCategory: null,
            noOfDrivers: 1,
            noOfAssistants: 0,
            guideClass: null,
            status: true,
            fromDate: '',
            toDate: '',
            currency: null,
            vehicleType: null,
            rateType: null,
            taxCode: null,
            vehicleRate: '',
            vehicleRateWithTax: '',
            driverRate: '',
            driverRateWithTax: '',
            assistantRate: '',
            assistantWithTax: '',
            deatailStatus: true,
            ratesDetails: [
                {
                    transportType: selectedType,
                    minCount: '',
                    maxCount: '',
                    vehicleCategory: null,
                    noOfDrivers: '',
                    noOfAssistants: '',
                    guideClass: null,
                    status: true,
                    paxVehicleRateDetails: [
                        {
                            fromDate: '',
                            toDate: '',
                            currency: null,
                            vehicleType: null,
                            rateType: null,
                            taxCode: null,
                            vehicleRate: '',
                            vehicleRateWithTax: '',
                            driverRate: '',
                            driverRateWithTax: '',
                            assistantRate: '',
                            assistantWithTax: '',
                            deatailStatus: ''
                        }
                    ]
                }
            ]
        };

        // initialValuesNew.ratesDetails = formValues.ratesDetails;
        // initialValuesNew.ratesDetails[detailTableIndex].paxVehicleRateDetails.push({
        //     fromDate: values.fromDate,
        //     toDate: values.toDate,
        //     currency: values.currency,
        //     vehicleType: values.vehicleType,
        //     rateType: values.rateType,
        //     taxCode: values.taxCode,
        //     vehicleRate: values.vehicleRate,
        //     vehicleRateWithTax: values.vehicleRateWithTax,
        //     driverRate: values.driverRate,
        //     driverRateWithTax: values.driverRateWithTax,
        //     assistantRate: values.assistantRate,
        //     assistantWithTax: values.assistantWithTax,
        //     deatailStatus: values.deatailStatus
        // });

        console.log(initialValuesNew);

        setnewobj(initialValuesNew);
    };

    const handleFinalSubmit = async (values) => {
        if (selectedType == '') {
            console.log('selectedType');
            setOpenErrorAlert(true);
        } else {
            if (mode === 'INSERT') {
                dispatch(savePaxVehicleRateData(values.ratesDetails));
            } else {
                dispatch(updatePaxVehicleRateData(values.ratesDetails));
            }
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

    function validationOnMaxCount(value) {
        let error;
        console.log(mmObject.minCount);
        if (!value) {
            error = 'Required';
        } else if (value < mmObject.minCount) {
            error = 'Max Count should be greater than Min Count';
        } else if (value < 0) {
            error = 'Max Count should be greater than 0';
        }
        return error;
    }

    function validationOnMinCount(value) {
        let error;
        console.log(mmObject.minCount);
        if (!value) {
            error = 'Required';
        } else if (value < 0) {
            error = 'Min Count should be greater than 0';
        }
        return error;
    }

    const validate = (values) => {
        console.log(values);
    };

    const handleExistModalClose = () => {
        setExistOpenModal(false);
    };
    const handleExistModalClose1 = () => {
        setExistOpenModal1(false);
    };

    const handleexpenseLocationClose = () => {
        setOpenExpensesLocation(false);
    };

    const handlePaxDetailClose = () => {
        setOpenPaxDetailDialog(false);
    };

    const childToParent = (childData) => {
        console.log(childData);
        console.log(mmObject);
        console.log(mmObject.ratesDetails[detailTableIndex].expensesAtLocations);
        mmObject.ratesDetails[detailTableIndex].expensesAtLocations.splice(0, 1);
        childData.expensesAtLocations.map((s) => {
            mmObject.ratesDetails[detailTableIndex].expensesAtLocations.push(s);
        });

        console.log(mmObject);
    };

    const childToParent2 = (childData) => {
        console.log(childData);
        console.log(mmObject);
        console.log(mmObject.ratesDetails[detailTableIndex].paxVehicleRateDetails);
        mmObject.ratesDetails[detailTableIndex].paxVehicleRateDetails.splice(0, 1);
        childData.paxVehicleRateDetails.map((s) => {
            mmObject.ratesDetails[detailTableIndex].paxVehicleRateDetails.push(s);
        });

        console.log(mmObject);
    };

    const calculateVehicleTax = (value) => {
        console.log(value);
    };

    const calculateDriverRateTax = (value) => {
        console.log(value);
    };

    const calculateAssistantRateTax = (value) => {
        console.log(value);
    };

    function requiredValidation(value) {
        console.log(value);
        let error;
        if (!value) {
            error = 'Required';
        }
        return error;
    }

    return (
        <div>
            <MainCard>
                <div className="row">
                    <Grid container direction="row">
                        <Grid item>
                            <Formik enableReinitialize={true} initialValues={mmObject || newobj} innerRef={formikRef} validate={validate}>
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
                                            <br />
                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                <Grid gap="10px" display="flex">
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Min Count"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="number"
                                                            variant="outlined"
                                                            name="minCount"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            validate={validationOnMinCount}
                                                            value={values.minCount}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.minCount && errors.minCount)}
                                                            helperText={touched.minCount && errors.minCount ? errors.minCount : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="Max Count"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            type="number"
                                                            disabled={mode == 'VIEW'}
                                                            variant="outlined"
                                                            name="maxCount"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.maxCount}
                                                            validate={validationOnMaxCount}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.maxCount && errors.maxCount)}
                                                            helperText={touched.maxCount && errors.maxCount ? errors.maxCount : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.vehicleCategory}
                                                            name="vehicleCategory"
                                                            validate={requiredValidation}
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`vehicleCategory`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={vehicleCategoryList}
                                                            getOptionLabel={(option) => `${option.typeCode}`}
                                                            isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Vehicle Category Code"
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
                                                                    error={Boolean(touched.vehicleCategory && errors.vehicleCategory)}
                                                                    helperText={
                                                                        touched.vehicleCategory && errors.vehicleCategory
                                                                            ? errors.vehicleCategory
                                                                            : ''
                                                                    }
                                                                    variant="outlined"
                                                                    name="vehicleCategory"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="No of Drivers"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="noOfDrivers"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            validate={requiredValidation}
                                                            value={values.noOfDrivers}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.noOfDrivers && errors.noOfDrivers)}
                                                            helperText={touched.noOfDrivers && errors.noOfDrivers ? errors.noOfDrivers : ''}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="No of Asssistants"
                                                            sx={{
                                                                width: { xs: 120 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="noOfAssistants"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.noOfAssistants}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.noOfAssistants && errors.noOfAssistants)}
                                                            helperText={
                                                                touched.noOfAssistants && errors.noOfAssistants ? errors.noOfAssistants : ''
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={Autocomplete}
                                                            value={values.guideClass}
                                                            name="guideClass"
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(_, value) => {
                                                                setFieldValue(`guideClass`, value);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            options={activeGuideClassList}
                                                            getOptionLabel={(option) => `${option.guideCode}`}
                                                            isOptionEqualToValue={(option, value) =>
                                                                option.guideClassId === value.guideClassId
                                                            }
                                                            renderInput={(params) => (
                                                                <Field
                                                                    as={TextField}
                                                                    {...params}
                                                                    label="Guide Class"
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
                                                                    error={Boolean(touched.guideClass && errors.guideClass)}
                                                                    helperText={
                                                                        touched.guideClass && errors.guideClass ? errors.guideClass : ''
                                                                    }
                                                                    variant="outlined"
                                                                    name="guideClass"
                                                                    onBlur={handleBlur}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>

                                                    <Grid item>
                                                        <FormGroup>
                                                            <Field
                                                                as={FormControlLabel}
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
                                                        <IconButton
                                                            aria-label="delete"
                                                            type="button"
                                                            onClick={() => {
                                                                setTouched({
                                                                    minCount: true,
                                                                    maxCount: true,
                                                                    noOfDrivers: true,
                                                                    guideClass: true,
                                                                    vehicleCategory: true
                                                                }).then(() => {
                                                                    console.log(formikRef);
                                                                    console.log(formikRef.current.errors);
                                                                    if (
                                                                        formikRef.current.errors.minCount == undefined &&
                                                                        formikRef.current.errors.maxCount == undefined &&
                                                                        formikRef.current.errors.noOfDrivers == undefined &&
                                                                        formikRef.current.errors.guideClass == undefined &&
                                                                        formikRef.current.errors.vehicleCategory == undefined
                                                                    ) {
                                                                        addRows(values, formikRef.current.values);
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
                                                    <Paper>
                                                        <TableContainer>
                                                            <Table stickyHeader>
                                                                <TableHead alignItems="center">
                                                                    <TableRow>
                                                                        <TableCell>Min Count</TableCell>
                                                                        <TableCell>Max Count </TableCell>
                                                                        <TableCell>Vehicle Category Code</TableCell>
                                                                        <TableCell>Description</TableCell>
                                                                        <TableCell>No of Drivers</TableCell>
                                                                        <TableCell>No of Assistant</TableCell>
                                                                        <TableCell>Guide Class</TableCell>
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
                                                                            <TableRow
                                                                                key={idx}
                                                                                hover
                                                                                onClick={() => {
                                                                                    setSelectedID(idx);
                                                                                }}
                                                                                classes={{ selected: classes.selected }}
                                                                                className={classes.tableRow}
                                                                            >
                                                                                {/* <TableCell>{idx + 1}</TableCell> */}

                                                                                <TableCell>
                                                                                    <TextField
                                                                                        sx={{
                                                                                            width: { xs: 55 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        //   type="number"
                                                                                        variant="outlined"
                                                                                        // placeholder="name"
                                                                                        name={`ratesDetails.${idx}.minCount`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].minCount
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].minCount &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].minCount
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].minCount &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].minCount
                                                                                                ? errors.ratesDetails[idx].minCount
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        sx={{
                                                                                            width: { xs: 55 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        //   type="number"
                                                                                        variant="outlined"
                                                                                        // placeholder="name"
                                                                                        name={`ratesDetails.${idx}.maxCount`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].maxCount
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].maxCount &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].maxCount
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].maxCount &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].maxCount
                                                                                                ? errors.ratesDetails[idx].maxCount
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Autocomplete
                                                                                        disabled
                                                                                        value={
                                                                                            values.ratesDetails[idx]
                                                                                                ? values.ratesDetails[idx].vehicleCategory
                                                                                                : null
                                                                                        }
                                                                                        name={`ratesDetails.${idx}.vehicleCategory`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `ratesDetails.${idx}.vehicleCategory`,
                                                                                                value
                                                                                            );
                                                                                        }}
                                                                                        options={vehicleCategoryList}
                                                                                        getOptionLabel={(option) => `${option.typeCode}`}
                                                                                        isOptionEqualToValue={(option, value) =>
                                                                                            option.categoryId === value.categoryId
                                                                                        }
                                                                                        renderInput={(params) => (
                                                                                            <TextField
                                                                                                {...params}
                                                                                                // label="tax"

                                                                                                sx={{
                                                                                                    width: { sm: 100 },
                                                                                                    '& .MuiInputBase-root': {
                                                                                                        height: 40
                                                                                                    }
                                                                                                }}
                                                                                                variant="outlined"
                                                                                                name={`ratesDetails.${idx}.vehicleCategory`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.ratesDetails &&
                                                                                                    touched.ratesDetails[idx] &&
                                                                                                    touched.ratesDetails[idx]
                                                                                                        .vehicleCategory &&
                                                                                                    errors.ratesDetails &&
                                                                                                    errors.ratesDetails[idx] &&
                                                                                                    errors.ratesDetails[idx].vehicleCategory
                                                                                                        ? errors.ratesDetails[idx]
                                                                                                              .vehicleCategory
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.ratesDetails &&
                                                                                                        touched.ratesDetails[idx] &&
                                                                                                        touched.ratesDetails[idx]
                                                                                                            .vehicleCategory &&
                                                                                                        errors.ratesDetails &&
                                                                                                        errors.ratesDetails[idx] &&
                                                                                                        errors.ratesDetails[idx]
                                                                                                            .vehicleCategory
                                                                                                )}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    <TextField
                                                                                        sx={{
                                                                                            width: { xs: 170 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        //   type="number"
                                                                                        onChange={handleChange}
                                                                                        name={`ratesDetails.${idx}.description`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].vehicleCategory
                                                                                                ?.description
                                                                                        }
                                                                                        onBlur={handleBlur}
                                                                                        disabled
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        sx={{
                                                                                            width: { xs: 55 },
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
                                                                                            values.ratesDetails[idx].noOfDrivers
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].noOfDrivers &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].noOfDrivers
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].noOfDrivers &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].noOfDrivers
                                                                                                ? errors.ratesDetails[idx].noOfDrivers
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        sx={{
                                                                                            width: { xs: 55 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        variant="outlined"
                                                                                        name={`ratesDetails.${idx}.noOfAssistants`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].noOfAssistants
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.ratesDetails &&
                                                                                                touched.ratesDetails[idx] &&
                                                                                                touched.ratesDetails[idx].noOfAssistants &&
                                                                                                errors.ratesDetails &&
                                                                                                errors.ratesDetails[idx] &&
                                                                                                errors.ratesDetails[idx].noOfAssistants
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.ratesDetails &&
                                                                                            touched.ratesDetails[idx] &&
                                                                                            touched.ratesDetails[idx].noOfAssistants &&
                                                                                            errors.ratesDetails &&
                                                                                            errors.ratesDetails[idx] &&
                                                                                            errors.ratesDetails[idx].noOfAssistants
                                                                                                ? errors.ratesDetails[idx].noOfAssistants
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Autocomplete
                                                                                        disabled
                                                                                        value={
                                                                                            values.ratesDetails[idx]
                                                                                                ? values.ratesDetails[idx].guideClass
                                                                                                : null
                                                                                        }
                                                                                        name={`ratesDetails.${idx}.guideClass`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `ratesDetails.${idx}.guideClass`,
                                                                                                value
                                                                                            );
                                                                                        }}
                                                                                        options={activeGuideClassList}
                                                                                        getOptionLabel={(option) => `${option.guideCode}`}
                                                                                        isOptionEqualToValue={(option, value) =>
                                                                                            option.guideClassId === value.guideClassId
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
                                                                                                name={`ratesDetails.${idx}.guideClass`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.ratesDetails &&
                                                                                                    touched.ratesDetails[idx] &&
                                                                                                    touched.ratesDetails[idx].guideClass &&
                                                                                                    errors.ratesDetails &&
                                                                                                    errors.ratesDetails[idx] &&
                                                                                                    errors.ratesDetails[idx].guideClass
                                                                                                        ? errors.ratesDetails[idx]
                                                                                                              .guideClass
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.ratesDetails &&
                                                                                                        touched.ratesDetails[idx] &&
                                                                                                        touched.ratesDetails[idx]
                                                                                                            .guideClass &&
                                                                                                        errors.ratesDetails &&
                                                                                                        errors.ratesDetails[idx] &&
                                                                                                        errors.ratesDetails[idx].guideClass
                                                                                                )}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            name={`ratesDetails.${idx}.status`}
                                                                                            onChange={handleChange}
                                                                                            value={
                                                                                                values.ratesDetails[idx] &&
                                                                                                values.ratesDetails[idx].status
                                                                                            }
                                                                                            control={<Switch color="success" />}
                                                                                            // label="Status"
                                                                                            checked={values.ratesDetails[idx].status}

                                                                                            // disabled={mode == 'VIEW'}
                                                                                        />
                                                                                    </FormGroup>
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    <div>
                                                                                        <IconButton
                                                                                            disabled={
                                                                                                values.ratesDetails[idx].minCount == ''
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            disa
                                                                                            aria-label="delete"
                                                                                            onClick={() => {
                                                                                                remove(idx);
                                                                                            }}
                                                                                        >
                                                                                            <HighlightOffIcon />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            disabled={
                                                                                                values.ratesDetails[idx].minCount == ''
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            disa
                                                                                            aria-label="delete"
                                                                                            color={
                                                                                                flag && selectedID === idx
                                                                                                    ? 'primary'
                                                                                                    : 'secondary'
                                                                                            }
                                                                                            onClick={() => {
                                                                                                console.log('here');
                                                                                                console.log(idx);
                                                                                                console.log(
                                                                                                    values.ratesDetails[idx]
                                                                                                        .paxVehicleRateDetails
                                                                                                );

                                                                                                setDetailTableIndex(idx);
                                                                                                setPaxVehicleRate(
                                                                                                    mmObject.ratesDetails[idx]
                                                                                                        .paxVehicleRateDetails
                                                                                                );
                                                                                                setpaxDetailHeader(
                                                                                                    values.ratesDetails[idx]
                                                                                                );
                                                                                                // setOpenDetailTable(true);
                                                                                                setOpenPaxDetailDialog(true);
                                                                                            }}
                                                                                        >
                                                                                            <IconEye />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            disabled={
                                                                                                values.ratesDetails[idx].minCount == ''
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            disa
                                                                                            aria-label="delete"
                                                                                            color={
                                                                                                flag && selectedID === idx
                                                                                                    ? 'primary'
                                                                                                    : 'secondary'
                                                                                            }
                                                                                            onClick={() => {
                                                                                                console.log('here');
                                                                                                console.log(idx);
                                                                                                console.log(
                                                                                                    values.ratesDetails[idx]
                                                                                                        .paxVehicleRateDetails
                                                                                                );

                                                                                                setDetailTableIndex(idx);
                                                                                                setPaxVehicleRate(
                                                                                                    mmObject.ratesDetails[idx]
                                                                                                        .paxVehicleRateDetails
                                                                                                );
                                                                                                // setOpenDetailTable(true);
                                                                                                setOpenDetailTable(true);
                                                                                            }}
                                                                                        >
                                                                                            <ArticleIcon />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            disabled={
                                                                                                values.ratesDetails[idx].minCount == ''
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            disa
                                                                                            aria-label="delete"
                                                                                            onClick={() => {
                                                                                                console.log('here');
                                                                                                console.log(idx);
                                                                                                setexpenseLocationDetails(
                                                                                                    mmObject.ratesDetails[idx]
                                                                                                        .expensesAtLocations
                                                                                                );
                                                                                                setDetailTableIndex(idx);
                                                                                                setOpenExpensesLocation(true);
                                                                                                // remove(idx);
                                                                                            }}
                                                                                        >
                                                                                            <LocationOnIcon />
                                                                                        </IconButton>
                                                                                    </div>
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
                                                            </Table>
                                                        </TableContainer>
                                                    </Paper>
                                                )}
                                            </FieldArray>
                                            <br />
                                            {openDetailTable ? <ViewPaxVehicleRateDetails paxVehicleRate={paxVehicleRate} /> : ''}
                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                {mode != 'VIEW' ? (
                                                    <Button
                                                        className="btnSave"
                                                        variant="contained"
                                                        type="button"
                                                        onClick={() => {
                                                            console.log(formikRef);
                                                            // handleFinalSubmit(values);
                                                            //

                                                            // setTouched({
                                                            //     operatorGpCode: true,
                                                            //     season: true,
                                                            //     ratePeriod: true,
                                                            //     currency: true
                                                            // }).then(() => {
                                                            //     console.log(formikRef);
                                                            //     console.log(formikRef.current.errors);
                                                            // if (
                                                            //     formikRef.current.errors.operatorGpCode == undefined &&
                                                            //     formikRef.current.errors.season == undefined &&
                                                            //     (formikRef.current.errors.ratePeriod == undefined) &
                                                            //         (formikRef.current.errors.currency == undefined)
                                                            // ) {
                                                            handleFinalSubmit(values);
                                                            // }
                                                            // });
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
                        {openExpensesLocation ? (
                            <ExpenseatLocation
                                open={openExpensesLocation}
                                handleClose={handleexpenseLocationClose}
                                mode={mode}
                                childToParent={childToParent}
                                expenseLocationDetails={expenseLocationDetails}
                            />
                        ) : null}

                        {openPaxDetailDialog ? (
                            <PaxVehicleRateDetails
                                open={openPaxDetailDialog}
                                handleClose={handlePaxDetailClose}
                                mode={mode}
                                childToParent={childToParent2}
                                paxVehicleRate={paxVehicleRate}
                                paxVehicleRateHeader={paxDetailHeader}
                            />
                        ) : null}
                        {openErrorAlert ? (
                            <ErrorAlert open={openErrorAlert} msg={'Please select Transport Type'} handleClose={handleErrorAlertClose} />
                        ) : (
                            ''
                        )}
                    </Grid>
                </div>
            </MainCard>
        </div>
    );
}

export default PaxVehicleRate;
