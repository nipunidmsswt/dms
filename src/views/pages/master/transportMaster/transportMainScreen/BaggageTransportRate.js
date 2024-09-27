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
    saveBaggageTransportRateData,
    getBaggageTransportRateDataById,
    updateBaggageTransportRateData
} from 'store/actions/masterActions/transportActions/BaggageTransportRateAction';
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
import BaggaeTransportRateDetails from './BaggaeTransportRateDetails';
import ViewBaggeTransportRateDetails from './ViewBaggeTransportRateDetails';
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

function BaggageTransportRate({ mode, selectedType, setMode }) {
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
        vehicleCategory: null,
        noOfDrivers: 1,
        noOfAssistants: 0,
        baggageTransportDesc: '',
        status: true,
        ratesDetails: [
            {
                transportType: selectedType,
                vehicleCategory: null,
                noOfDrivers: '',
                noOfAssistants: '',
                guideClass: null,
                baggageTransportDesc: '',
                status: true,
                baggageTransportRateDetails: [
                    {
                        fromDate: '',
                        toDate: '',
                        currency: null,
                        vehicleType: null,
                        maxKm: null,
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
    const bagggeTransportRateToUpdate = useSelector((state) => state.bagggeTransportRateReducer.bagggeTransportRateToUpdate);
    const roomBuyingRate = useSelector((state) => state.roomBuyingRateReducer.roomBuyingRate);
    const duplicateRoomBuyingRate = useSelector((state) => state.roomBuyingRateReducer.duplicateRoomBuyingRate);
    const guideClassActiveList = useSelector((state) => state.guideClassReducer.guideClassActiveList);
    const vehicleCategories = useSelector((state) => state.mainTransportCategoryReducer.vehicleCategories);
    const vehicleTypes = useSelector((state) => state.mainTransportCategoryReducer.vehicleTypes);
    const taxListData = useSelector((state) => state.taxReducer.taxes);
    const activeTaxGroupandTaxesListData = useSelector((state) => state.taxGroupReducer.activeTaxGroupandTaxes);

    const [flag, setFlag] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(selectedType.categoryId);
        if (selectedType != '') {
            dispatch(getBaggageTransportRateDataById(selectedType.categoryId));
        }
    }, [selectedType]);

    const handleErrorAlertClose = (status) => {
        setOpenErrorAlert(false);
    };

    useEffect(() => {
        if (activeTaxGroupandTaxesListData.length != 0) {
            setActiveTaxGroupandTaxesListData(activeTaxGroupandTaxesListData);
        }
    }, [activeTaxGroupandTaxesListData]);

    useEffect(() => {
        console.log(bagggeTransportRateToUpdate);
        if (bagggeTransportRateToUpdate !== null) {
            setMode('VIEW_UPDATE');
            const data = {
                transportType: selectedType,
                vehicleCategory: null,
                noOfDrivers: 1,
                noOfAssistants: 0,
                baggageTransportDesc: '',
                status: true,
                ratesDetails: [
                    {
                        transportType: selectedType,
                        vehicleCategory: null,
                        noOfDrivers: '',
                        noOfAssistants: '',
                        guideClass: null,
                        baggageTransportDesc: '',
                        status: true,
                        baggageTransportRateDetails: [
                            {
                                fromDate: '',
                                toDate: '',
                                currency: null,
                                vehicleType: null,
                                maxKm: null,
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

            data.ratesDetails = bagggeTransportRateToUpdate;
            setnewobj(data);
        } else {
            setnewobj(newobj);
            setMode('INSERT');
        }
    }, [bagggeTransportRateToUpdate]);

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
        if (taxListData != null) {
            setTaxListOptions(taxListData);
        }
    }, [taxListData]);

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
        dispatch(getAllTaxData());
        dispatch(getActiveTaxGroupandTaxList());
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
            vehicleCategory: null,
            noOfDrivers: 1,
            noOfAssistants: 0,
            status: true,
            baggageTransportDesc: '',
            ratesDetails: []
        };

        mmObject.ratesDetails.push({
            transportType: selectedType,
            vehicleCategory: values.vehicleCategory,
            noOfDrivers: values.noOfDrivers,
            noOfAssistants: values.noOfAssistants,
            baggageTransportDesc: values.baggageTransportDesc,
            status: values.status,
            baggageTransportRateDetails: [
                {
                    fromDate: '',
                    toDate: '',
                    currency: null,
                    vehicleType: null,
                    maxKm: '',
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
            if (s.noOfAssistants !== '') {
                initialValuesNew.ratesDetails.push(s);
            }
        });

        console.log(initialValuesNew);
        setnewobj(initialValuesNew);
    };

    const handleFinalSubmit = async (values) => {
        console.log(values);
        if (selectedType == '') {
            setOpenErrorAlert(true);
        } else {
            if (mode === 'INSERT') {
                dispatch(saveBaggageTransportRateData(values.ratesDetails));
            } else {
                dispatch(updateBaggageTransportRateData(values.ratesDetails));
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
        console.log(mmObject.ratesDetails[detailTableIndex].baggageTransportRateDetails);
        mmObject.ratesDetails[detailTableIndex].baggageTransportRateDetails.splice(0, 1);
        childData.baggageTransportRateDetails.map((s) => {
            mmObject.ratesDetails[detailTableIndex].baggageTransportRateDetails.push(s);
        });

        console.log(mmObject);
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
                                                                        width: { xs: 200 },
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
                                                            label="Baggage Transport Description"
                                                            sx={{
                                                                width: { xs: 400 },
                                                                '& .MuiInputBase-root': {
                                                                    height: 40
                                                                }
                                                            }}
                                                            validate={requiredValidation}
                                                            disabled={mode == 'VIEW'}
                                                            type="text"
                                                            variant="outlined"
                                                            name="baggageTransportDesc"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            value={values.baggageTransportDesc}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.baggageTransportDesc && errors.baggageTransportDesc)}
                                                            helperText={
                                                                touched.baggageTransportDesc && errors.baggageTransportDesc
                                                                    ? errors.baggageTransportDesc
                                                                    : ''
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Field
                                                            as={TextField}
                                                            label="No of Drivers"
                                                            sx={{
                                                                width: { xs: 200 },
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
                                                                width: { xs: 200 },
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
                                                        <FormGroup>
                                                            <Field
                                                                as={FormControlLabel}
                                                                name="status"
                                                                onChange={handleChange}
                                                                value={values.status}
                                                                control={<Switch color="success" />}
                                                                label="Status"
                                                                checked={values.status}
                                                            />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton
                                                            aria-label="delete"
                                                            type="button"
                                                            onClick={() => {
                                                                setTouched({
                                                                    noOfDrivers: true,

                                                                    vehicleCategory: true,
                                                                    baggageTransportDesc: true
                                                                }).then(() => {
                                                                    console.log(formikRef);
                                                                    console.log(formikRef.current.errors);
                                                                    if (
                                                                        formikRef.current.errors.noOfDrivers == undefined &&
                                                                        formikRef.current.errors.vehicleCategory == undefined &&
                                                                        formikRef.current.errors.baggageTransportDesc == undefined
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
                                                                        <TableCell>Vehicle Category Code</TableCell>
                                                                        <TableCell>Description</TableCell>
                                                                        <TableCell>No of Drivers</TableCell>
                                                                        <TableCell>No of Assistant</TableCell>
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
                                                                                // classes={{ selected: classes.selected }}
                                                                                // className={classes.tableRow}
                                                                            >
                                                                                {/* <TableCell>{idx + 1}</TableCell> */}

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
                                                                                                    width: { sm: 200 },
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
                                                                                            width: { xs: 200 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        //   type="number"

                                                                                        name={`ratesDetails.${idx}.baggageTransportDesc`}
                                                                                        value={
                                                                                            values.ratesDetails[idx] &&
                                                                                            values.ratesDetails[idx].baggageTransportDesc
                                                                                        }
                                                                                        disabled
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        sx={{
                                                                                            width: { xs: 200 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        //   type="number"
                                                                                        variant="outlined"
                                                                                        // placeholder="name"
                                                                                        name={`ratesDetails.${idx}.noOfDrivers`}
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
                                                                                            width: { xs: 200 },
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
                                                                                                values.ratesDetails[idx].vehicleCategory ==
                                                                                                null
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            aria-label="delete"
                                                                                            onClick={() => {
                                                                                                remove(idx);
                                                                                            }}
                                                                                        >
                                                                                            <HighlightOffIcon />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            disabled={
                                                                                                values.ratesDetails[idx].vehicleCategory ==
                                                                                                null
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
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
                                                                                                        .baggageTransportRateDetails
                                                                                                );

                                                                                                setDetailTableIndex(idx);
                                                                                                setPaxVehicleRate(
                                                                                                    mmObject.ratesDetails[idx]
                                                                                                        .baggageTransportRateDetails
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
                                                                                                values.ratesDetails[idx].vehicleCategory ==
                                                                                                null
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
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
                                                                                                        .baggageTransportRateDetails
                                                                                                );

                                                                                                setDetailTableIndex(idx);
                                                                                                setPaxVehicleRate(
                                                                                                    mmObject.ratesDetails[idx]
                                                                                                        .baggageTransportRateDetails
                                                                                                );
                                                                                                // setOpenDetailTable(true);
                                                                                                setOpenDetailTable(true);
                                                                                            }}
                                                                                        >
                                                                                            <ArticleIcon />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            disabled={
                                                                                                values.ratesDetails[idx].vehicleCategory ==
                                                                                                null
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
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
                                            {openDetailTable ? <ViewBaggeTransportRateDetails paxVehicleRate={paxVehicleRate} /> : ''}
                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                {mode != 'VIEW' ? (
                                                    <Button
                                                        className="btnSave"
                                                        variant="contained"
                                                        type="button"
                                                        onClick={() => {
                                                            console.log(formikRef);

                                                            handleFinalSubmit(values);
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
                            <BaggaeTransportRateDetails
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

export default BaggageTransportRate;
