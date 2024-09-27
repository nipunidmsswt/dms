import { useEffect, forwardRef, useState, Fragment, useRef } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    Slide,
    Switch,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Checkbox,
    Button,
    Autocomplete,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';
import {
    saveExChangeRateData,
    updateExChangeRateData,
    getExChangeRateDataById
} from 'store/actions/masterActions/exchangeRateActions/ExchangeRateActions';
import { currencies } from './Currency';
import { getAllCurrencyListData } from 'store/actions/masterActions/ExpenseTypeAction';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ExchangeRateTypes({ open, handleClose, mode, code }) {
    const initialValues = {
        exchangeType: '',
        baseCurrencyCode: null,
        currencyISOCode: null,
        description: '',
        status: true,
        exchangeRates: [
            {
                fromDate: '',
                toDate: '',
                rate: '',
                status: true
            }
        ]
    };

    const [loadValues, setLoadValues] = useState(null);
    const [currencyListArray, setCurrecyListArray] = useState([]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);

    const ref = useRef(null);
    useEffect(() => {
        dispatch(getAllCurrencyListData());
    }, []);

    // yup.addMethod(yup.array, "uniqueTaxOrder", function (message) {
    //   return this.test("uniqueTaxOrder", message, function (list) {
    //     const mapper = (x) => {
    //       return x.taxOrder;
    //     };
    //     const set = [...new Set(list.map(mapper))];
    //     const isUnique = list.length === set.length;
    //     if (isUnique) {
    //       return true;
    //     }

    //     const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    //     return this.createError({
    //       path: `exchangeRates[${idx}].taxOrder`,
    //       message: message,
    //     });
    //   });
    // });

    // yup.addMethod(yup.array, "uniqueTaxCode", function (message) {
    //   return this.test("uniqueTaxCode", message, function (list) {
    //     const mapper = (x) => {
    //       return x.tax?.taxCode;
    //     };
    //     const set = [...new Set(list.map(mapper))];
    //     const isUnique = list.length === set.length;
    //     if (isUnique) {
    //       return true;
    //     }

    //     const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    //     return this.createError({
    //       path: `exchangeRates[${idx}].tax`,
    //       message: message,
    //     });
    //   });
    // });

    // yup.addMethod(yup.string, "checkDuplicateTaxGroup", function (message) {
    //   return this.test(
    //     "checkDuplicateTaxGroup",
    //     "Duplicate Tax group",
    //     async function validateValue(value) {
    //       try {
    //         dispatch(checkDuplicateTaxGroupCode(value));

    //         if (
    //           duplicateTaxGroup != null &&
    //           duplicateTaxGroup.errorMessages.length != 0
    //         ) {
    //           return false;
    //         } else {
    //           return true;
    //         }
    //         return false; // or true as you see fit
    //       } catch (error) {}
    //     }
    //   );
    // });

    const validationSchema = yup.object().shape({
        exchangeType: yup.string().required('Required field'),
        baseCurrencyCode: yup.object().required('Required field'),
        currencyISOCode: yup.object().required('Required field'),
        description: yup.string().required('Required field'),
        // baseCurrencyCode: yup
        //   .string()
        //   .required("Required field")
        //   .checkDuplicateTaxGroup("ggg"),
        // description: yup.string().required("Required field"),
        // exchangeRates: yup.array().of(
        //   yup.object().shape({
        //     // tax: yup.object().typeError("Required field"),
        //     // taxOrder: yup.string(),
        //     // onOriginal: yup.string().required("Required field"),
        //     // fromDate: yup.date().required('Required').nullable(),
        //     // toDate: ,
        //     rate: yup.string().required("Required")
        //   })
        // ),
        //   .uniqueTaxOrder("Must be unique")
        //   .uniqueTaxCode("Must be unique"),
        exchangeRates: yup.array().of(
            yup.object().shape({
                // tax: yup.object().typeError("Required field"),
                fromDate: yup.date().required('Required field'),
                rate: yup
                    .number()
                    .test('maxDigitsAfterDecimal', 'number field must have 4 digits after decimal or less', (number) =>
                        Number.isInteger(number * 10 ** 4)
                    ),
                toDate: yup.date().required('Required field').min(yup.ref('fromDate'), "End date can't be before start date")
            })
        )
    });

    const exchnageRateTypeToUpdate = useSelector((state) => state.exchangeRateTypesReducer.exchnageRateTypeToUpdate);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    console.log(exchnageRateTypeToUpdate);

    useEffect(() => {
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (currencies.length != 0) {
            let array = [];

            for (let [key, value] of Object.entries(currencies.currencies)) {
                array.push({ name: key, value: value });
            }
            console.log(array);
            setCurrecyListArray(array);
        }
    }, [currencies]);
    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getExChangeRateDataById(code));
        }
    }, [mode]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && exchnageRateTypeToUpdate != null) || (mode === 'VIEW' && exchnageRateTypeToUpdate != null)) {
            setLoadValues(exchnageRateTypeToUpdate);
        }
    }, [exchnageRateTypeToUpdate]);

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveExChangeRateData(data));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateExChangeRateData(data));
        }
        handleClose();
    };
    useEffect(() => {
        console.log(ref.current);
    }, [ref]);
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
                            Exchange Rate Type
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
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 250 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            select
                                                                            name="exchangeType"
                                                                            label="Exchnage Type"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.exchangeType}
                                                                            error={Boolean(touched.exchangeType && errors.exchangeType)}
                                                                            helperText={
                                                                                touched.exchangeType && errors.exchangeType
                                                                                    ? errors.exchangeType
                                                                                    : ''
                                                                            }
                                                                            // MenuProps={{
                                                                            //   PaperProps: { sx: { maxHeight: 120 } },
                                                                            // }}
                                                                        >
                                                                            <MenuItem dense={true} value={'NORMAL'}>
                                                                                Normal
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'ADVANCE'}>
                                                                                Advance
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.baseCurrencyCode}
                                                                            name="baseCurrencyCode"
                                                                            onChange={(_, value) => {
                                                                                console.log(value);
                                                                                setFieldValue(`baseCurrencyCode`, value);
                                                                                if (value != null) {
                                                                                    loadExchangeRates(value);
                                                                                }
                                                                            }}
                                                                            options={currencyListOptions}
                                                                            getOptionLabel={(option) => `${option.currencyCode}`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.currencyListId === value.currencyListId
                                                                            }
                                                                            fullWidth
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    // label="tax"
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 250 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    disabled={mode == 'VIEW_UPDATE'}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    name="baseCurrencyCode"
                                                                                    label="Base Currency Code"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.baseCurrencyCode && errors.baseCurrencyCode
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.baseCurrencyCode && errors.baseCurrencyCode
                                                                                            ? errors.baseCurrencyCode
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.currencyISOCode}
                                                                            name="currencyISOCode"
                                                                            onChange={(_, value) => {
                                                                                console.log(value);
                                                                                setFieldValue(`currencyISOCode`, value);
                                                                            }}
                                                                            options={currencyListOptions}
                                                                            getOptionLabel={(option) => `${option.currencyCode}`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.currencyListId === value.currencyListId
                                                                            }
                                                                            fullWidth
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    // label="tax"
                                                                                    sx={{
                                                                                        width: { sm: 200, md: 250 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    disabled={mode == 'VIEW_UPDATE'}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    name="currencyISOCode"
                                                                                    label="Currency ISO Code"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.currencyISOCode && errors.currencyISOCode
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.currencyISOCode && errors.currencyISOCode
                                                                                            ? errors.currencyISOCode
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>

                                                                    <Grid>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 250 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Description"
                                                                            name="description"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.description}
                                                                            error={Boolean(touched.description && errors.description)}
                                                                            helperText={
                                                                                touched.description && errors.description
                                                                                    ? errors.description
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid>
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
                                                            </div>

                                                            <FieldArray name="exchangeRates">
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
                                                                                            fromDate: '',
                                                                                            toDate: '',
                                                                                            rate: '',
                                                                                            status: true
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

                                                                                        <TableCell>Rate</TableCell>
                                                                                        <TableCell>Status</TableCell>
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.exchangeRates.map((record, idx) => {
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
                                                                                                                console.log(value);
                                                                                                                console.log(ref.current);
                                                                                                                setFieldValue(
                                                                                                                    `exchangeRates.${idx}.fromDate`,
                                                                                                                    value
                                                                                                                );
                                                                                                            }}
                                                                                                            inputFormat="DD/MM/YYYY"
                                                                                                            value={
                                                                                                                values.exchangeRates[idx] &&
                                                                                                                values.exchangeRates[idx]
                                                                                                                    .fromDate
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
                                                                                                                    name={`exchangeRates.${idx}.fromDate`}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.exchangeRates &&
                                                                                                                            touched
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ].fromDate &&
                                                                                                                            errors.exchangeRates &&
                                                                                                                            errors
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ].fromDate
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.exchangeRates &&
                                                                                                                        touched
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ].fromDate &&
                                                                                                                        errors.exchangeRates &&
                                                                                                                        errors
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ].fromDate
                                                                                                                            ? errors
                                                                                                                                  .exchangeRates[
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
                                                                                                                    `exchangeRates.${idx}.toDate`,
                                                                                                                    value
                                                                                                                );
                                                                                                            }}
                                                                                                            inputFormat="DD/MM/YYYY"
                                                                                                            value={
                                                                                                                values.exchangeRates[idx] &&
                                                                                                                values.exchangeRates[idx]
                                                                                                                    .toDate
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
                                                                                                                    name={`exchangeRates.${idx}.toDate`}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    helperText={
                                                                                                                        touched.exchangeRates &&
                                                                                                                        touched
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ].toDate &&
                                                                                                                        errors.exchangeRates &&
                                                                                                                        errors
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .exchangeRates[
                                                                                                                            idx
                                                                                                                        ].toDate
                                                                                                                            ? errors
                                                                                                                                  .exchangeRates[
                                                                                                                                  idx
                                                                                                                              ].toDate
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                    error={Boolean(
                                                                                                                        touched.exchangeRates &&
                                                                                                                            touched
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ].toDate &&
                                                                                                                            errors.exchangeRates &&
                                                                                                                            errors
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .exchangeRates[
                                                                                                                                idx
                                                                                                                            ].toDate
                                                                                                                    )}
                                                                                                                />
                                                                                                            )}
                                                                                                        />
                                                                                                    </LocalizationProvider>
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        // label="Additional Price"
                                                                                                        type="number"
                                                                                                        variant="outlined"
                                                                                                        placeholder="0"
                                                                                                        name={`exchangeRates.${idx}.rate`}
                                                                                                        value={
                                                                                                            values.exchangeRates[idx] &&
                                                                                                            values.exchangeRates[idx].rate
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.exchangeRates &&
                                                                                                                touched.exchangeRates[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.exchangeRates[idx]
                                                                                                                    .rate &&
                                                                                                                errors.exchangeRates &&
                                                                                                                errors.exchangeRates[idx] &&
                                                                                                                errors.exchangeRates[idx]
                                                                                                                    .rate
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.exchangeRates &&
                                                                                                            touched.exchangeRates[idx] &&
                                                                                                            touched.exchangeRates[idx]
                                                                                                                .rate &&
                                                                                                            errors.exchangeRates &&
                                                                                                            errors.exchangeRates[idx] &&
                                                                                                            errors.exchangeRates[idx].rate
                                                                                                                ? errors.exchangeRates[idx]
                                                                                                                      .rate
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        <FormControlLabel
                                                                                                            name={`exchangeRates.${idx}.status`}
                                                                                                            control={<Switch />}
                                                                                                            label="Status"
                                                                                                            disabled={mode == 'VIEW'}
                                                                                                            onChange={handleChange}
                                                                                                            checked={
                                                                                                                values.exchangeRates[idx]
                                                                                                                    .status
                                                                                                            }
                                                                                                            value={
                                                                                                                values.exchangeRates[idx] &&
                                                                                                                values.exchangeRates[idx]
                                                                                                                    .status
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
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    </Paper>
                                                                )}
                                                            </FieldArray>
                                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                                {mode != 'VIEW' ? (
                                                                    <Button
                                                                        variant="outlined"
                                                                        type="button"
                                                                        style={{
                                                                            // backgroundColor: '#B22222',
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

export default ExchangeRateTypes;
