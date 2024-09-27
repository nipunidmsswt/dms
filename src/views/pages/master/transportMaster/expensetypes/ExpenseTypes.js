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
    Button
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
    checkDuplicateExpenseRateDescription,
    getAllCurrencyListData,
    getExpenseTypesById,
    saveExpenseTypesData,
    updateExpenseTypesData
} from 'store/actions/masterActions/ExpenseTypeAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import { getActiveTaxGroupandTaxList, getActiveTaxGroupandTaxListTypeBase } from 'store/actions/masterActions/TaxActions/TaxGroupAction';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ExpenseTypes({ open, handleClose, mode, code, handleCloseSubmit }) {
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);
    const activeTaxGroupandTaxesByType = useSelector((state) => state.taxGroupReducer.activeTaxGroupandTaxes);

    const [activeTaxGroupandTaxesList, setActiveTaxGroupandTaxesListData] = useState([]);
    useEffect(() => {
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);

    const currencyLists = [];
    const dafaultTaxLists = [];

    const initialValues = {
        currencyListNew: currencyListOptions.forEach((element) => {
            if (element.currencyCode === 'LKR') {
                currencyLists.push(element);
            }
        }),

        taxListNew: activeTaxGroupandTaxesList.forEach((element) => {
            if (element.code === 'None') {
                dafaultTaxLists.push(element);
            }
        }),

        expenseCode: '',
        description: '',
        status: true,
        expenseTypeDetails: [
            {
                expenseTypesDetailsId: '',
                fromDate: '',
                toDate: '',
                currencyList: {
                    currencyCode: currencyLists[0]?.currencyCode,
                    currencyDescription: currencyLists[0]?.currencyDescription,
                    currencyListId: currencyLists[0]?.currencyListId
                },
                tax: {
                    code: dafaultTaxLists[0]?.code,
                    description: dafaultTaxLists[0]?.description,
                    id: dafaultTaxLists[0]?.id
                },

                expenseRate: 0.0,
                rateWithoutTax: 0.0,
                rateWithTax: 0.0,
                status: true,
                enableRow: false
            }
        ]
    };

    const [loadValues, setLoadValues] = useState(null);

    const ref = useRef(null);
    yup.addMethod(yup.string, 'checkDuplicateExpenseCode', function (message) {
        return this.test('checkDuplicateExpenseCode', 'Expense Code already exists', async function validateValue(value) {
            try {
                if (mode == 'INSERT') {
                    dispatch(checkDuplicateExpenseRateCode(value));
                    console.log(duplicateCode);
                    if (duplicateCode != null && duplicateCode.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            } catch (error) {}
            return true;
        });
    });

    yup.addMethod(yup.string, 'checkDuplicateExpenseDescription', function (message) {
        return this.test('checkDuplicateExpenseDescription', 'Expense Description already exists', async function validateValue(value) {
            try {
                if (mode == 'INSERT') {
                    dispatch(checkDuplicateExpenseRateDescription(value));
                    console.log(duplicateExpenseDescription);
                    if (duplicateExpenseDescription != null && duplicateExpenseDescription.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            } catch (error) {}
            return true;
        });
    });

    const validationSchema = yup.object().shape({
        expenseCode: yup
            .string()
            .matches(/^[a-zA-Z0-9]+$/, 'Expense code must be alphanumeric')
            .required('Required field')
            .checkDuplicateExpenseCode('ggg'),
        description: yup.string().required('Required field').checkDuplicateExpenseDescription('ggg'),

        expenseTypeDetails: yup.array().of(
            yup.object().shape({
                tax: yup.object().typeError('Required field'),
                fromDate: yup
                    .date()
                    .required('Required field')
                    .nullable()
                    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
                toDate: yup
                    .date()
                    .min(yup.ref('fromDate'), "End date can't be before start date")
                    .required('Required field')
                    .nullable()
                    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
                currencyList: yup.object().typeError('Required field'),
                expenseRate: yup
                    .number()
                    .typeError('Expense rate must be a number')
                    .min(0, 'Expense rate must be greater than or equal to 0')
                // expenseRate: yup.number().integer().min(0).required('Required field')
            })
        )
    });

    const expenseTypeToUpdate = useSelector((state) => state.expenseTypesReducer.expenseTypeToUpdate);
    const dispatch = useDispatch();

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getExpenseTypesById(code));
        }
    }, [mode]);

    const taxToUpdate = useSelector((state) => state.taxReducer.taxToUpdate);
    const taxToEdit = useSelector((state) => state.taxReducer.taxToEdit);

    const [taxData, setData] = useState(null);
    const [closeButton, setCloseButton] = useState(true);

    const calculateExpenseRateTax = (value, tax, idx, setFieldValue) => {
        if (tax != null) {
            if (tax.type === 'Group') {
                let amountWithTax = value;
                for (let i in tax.taxOrder) {
                    amountWithTax = (+amountWithTax * tax.taxOrder[i]) / 100 + +amountWithTax;
                }

                setFieldValue(`expenseTypeDetails.${idx}.rateWithTax`, +amountWithTax.toFixed(4));
            } else if (tax.type === 'individual') {
                let amountWithTax = 0;
                amountWithTax = (+value * tax.tax) / 100 + +value;

                setFieldValue(`expenseTypeDetails.${idx}.rateWithTax`, +amountWithTax.toFixed(4));
            }
        }
    };

    useEffect(() => {
        if (expenseTypeToUpdate != null) {
            const dataArray = [];
            if ((mode === 'VIEW_UPDATE' && expenseTypeToUpdate != null) || (mode === 'VIEW' && expenseTypeToUpdate != null)) {
                expenseTypeToUpdate.expenseTypeDetails.map((item) => {
                    const expenseTypeDetails = {
                        enableRow: true,
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        currencyList: item.currencyList,

                        tax: item.tax,
                        expenseRate: item.expenseRate,
                        rateWithoutTax: item.expenseRate,
                        rateWithTax: item.rateWithTax,
                        status: item.status
                    };
                    dataArray.push(expenseTypeDetails);
                });

                const saveValues = {
                    expenseCode: expenseTypeToUpdate.expenseCode,
                    description: expenseTypeToUpdate.description,
                    status: expenseTypeToUpdate.status,
                    expenseTypeDetails: dataArray
                };

                setLoadValues(saveValues);
            }
        }
    }, [expenseTypeToUpdate]);

    const handleSubmitForm = (data) => {
        if (mode === 'INSERT') {
            const dataArray = [];
            if (data.expenseTypeDetails.length > 0) {
                data.expenseTypeDetails.map((item) => {
                    const expenseTypeDetails = {
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        currencyList: item.currencyList.currencyListId,
                        tax: item.tax.id,
                        expenseRate: item.expenseRate,
                        rateWithoutTax: item.expenseRate,
                        rateWithTax: item.rateWithTax,
                        status: item.status
                    };
                    dataArray.push(expenseTypeDetails);
                });

                const saveValues = {
                    expenseCode: data.expenseCode,
                    description: data.description,
                    status: data.status,
                    expenseTypeDetails: dataArray
                };
                dispatch(saveExpenseTypesData(saveValues));
            }
        } else if (mode === 'VIEW_UPDATE') {
            const dataArray = [];
            if (data.expenseTypeDetails.length > 0) {
                data.expenseTypeDetails.map((item) => {
                    const expenseTypeDetails = {
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        currencyList: item.currencyList.currencyListId,
                        tax: item.tax.id,
                        expenseRate: item.expenseRate,
                        rateWithoutTax: item.expenseRate,
                        rateWithTax: item.rateWithTax,
                        status: item.status
                    };
                    dataArray.push(expenseTypeDetails);
                });

                const saveValues = {
                    expenseCode: data.expenseCode,
                    description: data.description,
                    status: data.status,
                    expenseTypeDetails: dataArray
                };
                dispatch(updateExpenseTypesData(saveValues));
            }
        }
        handleCloseSubmit();
    };

    useEffect(() => {}, [ref]);

    const taxListData = useSelector((state) => state.taxReducer.taxes);

    const duplicateCode = useSelector((state) => state.expenseTypesReducer.duplicateExpenseType);
    const duplicateExpenseDescription = useSelector((state) => state.expenseTypesReducer.duplicateExpenseDescription);
    const [taxListOptions, setTaxListOptions] = useState([]);

    useEffect(() => {
        dispatch(getActiveTaxGroupandTaxList('Buy'));
        dispatch(getAllCurrencyListData());
    }, []);

    useEffect(() => {
        console.log(activeTaxGroupandTaxesByType);
        if (activeTaxGroupandTaxesByType != null) {
            setActiveTaxGroupandTaxesListData(activeTaxGroupandTaxesByType);
        }
    }, [activeTaxGroupandTaxesByType]);

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
                            Expense Types
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
                                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                return (
                                                    <Form>
                                                        <div style={{ marginTop: '6px', margin: '10px' }}>
                                                            <Grid container spacing={gridSpacing}>
                                                                <Grid item>
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="expenseCode"
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        label="Expense Code"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.expenseCode}
                                                                        error={Boolean(touched.expenseCode && errors.expenseCode)}
                                                                        helperText={
                                                                            touched.expenseCode && errors.expenseCode
                                                                                ? errors.expenseCode
                                                                                : ''
                                                                        }
                                                                    ></TextField>
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        name="description"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        label="Description"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.description}
                                                                        error={Boolean(touched.description && errors.description)}
                                                                        helperText={
                                                                            touched.description && errors.description
                                                                                ? errors.description
                                                                                : ''
                                                                        }
                                                                    ></TextField>
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
                                                        </div>
                                                        <FieldArray name="expenseTypeDetails">
                                                            {({ insert, remove, push }) => (
                                                                <Paper>
                                                                    {mode != 'VIEW' ? (
                                                                        <Box display="flex" flexDirection="row-reverse">
                                                                            <IconButton
                                                                                aria-label="delete"
                                                                                onClick={() => {
                                                                                    push({
                                                                                        expenseTypesDetailsId: '',
                                                                                        fromDate: '',
                                                                                        toDate: '',
                                                                                        currencyList: {
                                                                                            currencyCode: currencyLists[0]?.currencyCode,
                                                                                            currencyDescription:
                                                                                                currencyLists[0]?.currencyDescription,
                                                                                            currencyListId: currencyLists[0]?.currencyListId
                                                                                        },
                                                                                        tax: {
                                                                                            code: dafaultTaxLists[0]?.code,
                                                                                            description: dafaultTaxLists[0]?.description,
                                                                                            id: dafaultTaxLists[0]?.id
                                                                                        },
                                                                                        expenseRate: 0.0,
                                                                                        rateWithoutTax: 0.0,
                                                                                        rateWithTax: 0.0,
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
                                                                                    <TableCell>Expense Rate</TableCell>
                                                                                    <TableCell>Rate Without Tax</TableCell>
                                                                                    <TableCell>Rate With Tax</TableCell>
                                                                                    <TableCell>Status</TableCell>
                                                                                    <TableCell>Actions</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {values.expenseTypeDetails.map((record, idx) => {
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
                                                                                                                `expenseTypeDetails.${idx}.fromDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .enableRow || mode == 'VIEW'
                                                                                                        }
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values.expenseTypeDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.expenseTypeDetails[idx]
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
                                                                                                                variant="outlined"
                                                                                                                name={`expenseTypeDetails.${idx}.fromDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                                error={Boolean(
                                                                                                                    touched.expenseTypeDetails &&
                                                                                                                        touched
                                                                                                                            .expenseTypeDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .expenseTypeDetails[
                                                                                                                            idx
                                                                                                                        ].fromDate &&
                                                                                                                        errors.expenseTypeDetails &&
                                                                                                                        errors
                                                                                                                            .expenseTypeDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .expenseTypeDetails[
                                                                                                                            idx
                                                                                                                        ].fromDate
                                                                                                                )}
                                                                                                                helperText={
                                                                                                                    touched.expenseTypeDetails &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ].fromDate &&
                                                                                                                    errors.expenseTypeDetails &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ].fromDate
                                                                                                                        ? errors
                                                                                                                              .expenseTypeDetails[
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
                                                                                                                `expenseTypeDetails.${idx}.toDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        minDate={
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .fromDate
                                                                                                        }
                                                                                                        // disabled={
                                                                                                        //     values.expenseTypeDetails[idx]
                                                                                                        //         .enableRow || mode == 'VIEW'
                                                                                                        // }
                                                                                                        disabled={
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .fromDate === null ||
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .fromDate === '' ||
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .enableRow ||
                                                                                                            mode == 'VIEW'
                                                                                                        }
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values.expenseTypeDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.expenseTypeDetails[idx]
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
                                                                                                                variant="outlined"
                                                                                                                name={`expenseTypeDetails.${idx}.toDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                                helperText={
                                                                                                                    touched.expenseTypeDetails &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ].toDate &&
                                                                                                                    errors.expenseTypeDetails &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ].toDate
                                                                                                                        ? errors
                                                                                                                              .expenseTypeDetails[
                                                                                                                              idx
                                                                                                                          ].toDate
                                                                                                                        : ''
                                                                                                                }
                                                                                                                error={Boolean(
                                                                                                                    touched.expenseTypeDetails &&
                                                                                                                        touched
                                                                                                                            .expenseTypeDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .expenseTypeDetails[
                                                                                                                            idx
                                                                                                                        ].toDate &&
                                                                                                                        errors.expenseTypeDetails &&
                                                                                                                        errors
                                                                                                                            .expenseTypeDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .expenseTypeDetails[
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
                                                                                                    id="combo-box-demo"
                                                                                                    value={
                                                                                                        values.expenseTypeDetails[idx]
                                                                                                            ? values.expenseTypeDetails[idx]
                                                                                                                  .currencyList
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`expenseTypeDetails.${idx}.currencyList`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value.currencyListId);
                                                                                                        setFieldValue(
                                                                                                            `expenseTypeDetails.${idx}.currencyList`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    disabled={
                                                                                                        values.expenseTypeDetails[idx]
                                                                                                            .enableRow || mode == 'VIEW'
                                                                                                    }
                                                                                                    // disablePortal
                                                                                                    autoSelect={true}
                                                                                                    options={currencyListOptions}
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.currencyCode}`
                                                                                                    }
                                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                                        option.currencyListId ===
                                                                                                        value.currencyListId
                                                                                                    }
                                                                                                    renderOption={(props, option) => (
                                                                                                        <li {...props}>
                                                                                                            {option.currencyCode}&nbsp;-
                                                                                                            {option.currencyDescription}
                                                                                                        </li>
                                                                                                    )}
                                                                                                    // renderOption={(option) => (
                                                                                                    //     <>{`${option.currencyCode} + ${option.currencyCodee}`}</>
                                                                                                    // )}
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
                                                                                                            placeholder="--Select a Value --"
                                                                                                            variant="outlined"
                                                                                                            name={`expenseTypeDetails.${idx}.currencyList`}
                                                                                                            onBlur={handleBlur}
                                                                                                            autoSelect={true}
                                                                                                            // defaultValue={{
                                                                                                            //     currencyCode: 'LKR'
                                                                                                            // }}
                                                                                                            helperText={
                                                                                                                touched.expenseTypeDetails &&
                                                                                                                touched.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ].currencyList &&
                                                                                                                errors.expenseTypeDetails &&
                                                                                                                errors.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ].currencyList
                                                                                                                    ? errors
                                                                                                                          .expenseTypeDetails[
                                                                                                                          idx
                                                                                                                      ].currencyList
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.expenseTypeDetails &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ].currencyList &&
                                                                                                                    errors.expenseTypeDetails &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
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
                                                                                                        values.expenseTypeDetails[idx]
                                                                                                            ? values.expenseTypeDetails[idx]
                                                                                                                  .tax
                                                                                                            : null
                                                                                                    }
                                                                                                    disabled={
                                                                                                        values.expenseTypeDetails[idx]
                                                                                                            .enableRow || mode == 'VIEW'
                                                                                                    }
                                                                                                    autoSelect={true}
                                                                                                    name={`expenseTypeDetails.${idx}.tax`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value);
                                                                                                        setFieldValue(
                                                                                                            `expenseTypeDetails.${idx}.tax`,
                                                                                                            value
                                                                                                        );

                                                                                                        calculateExpenseRateTax(
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .expenseRate,
                                                                                                            value,
                                                                                                            idx,
                                                                                                            setFieldValue
                                                                                                        );
                                                                                                    }}
                                                                                                    // options={taxListOptions}
                                                                                                    options={activeTaxGroupandTaxesList}
                                                                                                    // getOptionLabel={(option) =>
                                                                                                    //     `${option.code}`
                                                                                                    // }
                                                                                                    // isOptionEqualToValue={(option, value) =>
                                                                                                    //     option.id === value.id
                                                                                                    // }
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.code}`
                                                                                                    }
                                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                                        option.id === value.id
                                                                                                    }
                                                                                                    renderOption={(props, option) => (
                                                                                                        <li {...props}>
                                                                                                            {option.type}&nbsp;-
                                                                                                            {option.code}
                                                                                                        </li>
                                                                                                    )}
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
                                                                                                            placeholder="--Select a Value --"
                                                                                                            variant="outlined"
                                                                                                            name={`expenseTypeDetails.${idx}.tax`}
                                                                                                            onBlur={handleBlur}
                                                                                                            helperText={
                                                                                                                touched.expenseTypeDetails &&
                                                                                                                touched.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ].tax &&
                                                                                                                errors.expenseTypeDetails &&
                                                                                                                errors.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.expenseTypeDetails[
                                                                                                                    idx
                                                                                                                ].tax
                                                                                                                    ? errors
                                                                                                                          .expenseTypeDetails[
                                                                                                                          idx
                                                                                                                      ].tax
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.expenseTypeDetails &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ].tax &&
                                                                                                                    errors.expenseTypeDetails &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .expenseTypeDetails[
                                                                                                                        idx
                                                                                                                    ].tax
                                                                                                            )}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.expenseTypeDetails[idx] &&
                                                                                                values.expenseTypeDetails[idx].tax
                                                                                                    ? values.expenseTypeDetails[idx].tax.tax
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
                                                                                                    type="number"
                                                                                                    variant="outlined"
                                                                                                    disabled={
                                                                                                        values.expenseTypeDetails[idx]
                                                                                                            .enableRow || mode == 'VIEW'
                                                                                                    }
                                                                                                    placeholder="0"
                                                                                                    name={`expenseTypeDetails.${idx}.expenseRate`}
                                                                                                    value={
                                                                                                        values.expenseTypeDetails[idx] &&
                                                                                                        values.expenseTypeDetails[idx]
                                                                                                            .expenseRate
                                                                                                    }
                                                                                                    // onChange={handleChange}
                                                                                                    // onChange={(e) =>
                                                                                                    //     setRateWithTax(e.target.value)
                                                                                                    // }

                                                                                                    onChange={(e) => {
                                                                                                        console.log(e.target.value);
                                                                                                        console.log(
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .tax
                                                                                                        );
                                                                                                        setFieldValue(
                                                                                                            `expenseTypeDetails.${idx}.expenseRate`,
                                                                                                            e.target.value
                                                                                                        );

                                                                                                        calculateExpenseRateTax(
                                                                                                            e.target.value,
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .tax,
                                                                                                            idx,
                                                                                                            setFieldValue
                                                                                                        );
                                                                                                    }}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.expenseTypeDetails &&
                                                                                                            touched.expenseTypeDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.expenseTypeDetails[idx]
                                                                                                                .expenseRate &&
                                                                                                            errors.expenseTypeDetails &&
                                                                                                            errors.expenseTypeDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.expenseTypeDetails[idx]
                                                                                                                .expenseRate
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.expenseTypeDetails &&
                                                                                                        touched.expenseTypeDetails[idx] &&
                                                                                                        touched.expenseTypeDetails[idx]
                                                                                                            .expenseRate &&
                                                                                                        errors.expenseTypeDetails &&
                                                                                                        errors.expenseTypeDetails[idx] &&
                                                                                                        errors.expenseTypeDetails[idx]
                                                                                                            .expenseRate
                                                                                                            ? errors.expenseTypeDetails[idx]
                                                                                                                  .expenseRate
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.expenseTypeDetails[idx] &&
                                                                                                values.expenseTypeDetails[idx].expenseRate
                                                                                                    ? values.expenseTypeDetails[idx]
                                                                                                          .expenseRate
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
                                                                                                    disabled
                                                                                                    placeholder="0.0"
                                                                                                    name={`expenseTypeDetails.${idx}.rateWithTax`}
                                                                                                    value={
                                                                                                        values.expenseTypeDetails[idx] &&
                                                                                                        values.expenseTypeDetails[idx]
                                                                                                            .rateWithTax
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    // onChange={(e) =>
                                                                                                    //     setRateWithTax(e.target.value)
                                                                                                    // }
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.expenseTypeDetails &&
                                                                                                            touched.expenseTypeDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.expenseTypeDetails[idx]
                                                                                                                .rateWithTax &&
                                                                                                            errors.expenseTypeDetails &&
                                                                                                            errors.expenseTypeDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.expenseTypeDetails[idx]
                                                                                                                .rateWithTax
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.expenseTypeDetails &&
                                                                                                        touched.expenseTypeDetails[idx] &&
                                                                                                        touched.expenseTypeDetails[idx]
                                                                                                            .rateWithTax &&
                                                                                                        errors.expenseTypeDetails &&
                                                                                                        errors.expenseTypeDetails[idx] &&
                                                                                                        errors.expenseTypeDetails[idx]
                                                                                                            .rateWithTax
                                                                                                            ? errors.expenseTypeDetails[idx]
                                                                                                                  .rateWithTax
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                                {/* {values.expenseTypeDetails[idx] &&
                                                                                                values.expenseTypeDetails[idx].expenseRate
                                                                                                    ? values.expenseTypeDetails[idx]
                                                                                                          .expenseRate *
                                                                                                          (values.expenseTypeDetails[idx]
                                                                                                              .tax.percentage /
                                                                                                              100) +
                                                                                                      values.expenseTypeDetails[idx]
                                                                                                          .expenseRate
                                                                                                    : 0} */}
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <FormGroup>
                                                                                                    <FormControlLabel
                                                                                                        name={`expenseTypeDetails.${idx}.status`}
                                                                                                        onChange={handleChange}
                                                                                                        // value={formValues.status}
                                                                                                        control={<Switch color="success" />}
                                                                                                        // label="Status"
                                                                                                        checked={
                                                                                                            values.expenseTypeDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.expenseTypeDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                {(values.expenseTypeDetails[idx] &&
                                                                                                    values.expenseTypeDetails[idx]
                                                                                                        .expenseTypesDetailsId) === '' ? (
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
                                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                            {mode != 'VIEW' ? (
                                                                <Button
                                                                    variant="outlined"
                                                                    type="button"
                                                                    style={{
                                                                        marginLeft: '10px'
                                                                    }}
                                                                    onClick={(e) => resetForm()}
                                                                >
                                                                    Clear
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

export default ExpenseTypes;
