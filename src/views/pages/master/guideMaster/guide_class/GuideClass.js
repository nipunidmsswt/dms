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
    getAllCurrencyListData,
    getExpenseTypesById,
    saveExpenseTypesData,
    updateExpenseTypesData
} from 'store/actions/masterActions/ExpenseTypeAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import {
    getGuideClassDetailsByCode,
    saveGuideClassData,
    updateGuideClassData,
    checkDuplicateGuideClasssCode
} from 'store/actions/masterActions/GuideClassAction';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function GuideClass({ open, handleClose, mode, guideCode }) {
    const initialValues = {
        guideCode: '',
        description: '',
        status: true,
        guideClassDetails: [
            {
                fromDate: '',
                toDate: '',
                currencyList: null,
                tax: null,
                perDayRate: '',
                rateWithoutTax: '',
                rateWithTax: '',
                status: false
            }
        ]
    };

    const [existOpenModal, setExistOpenModal] = useState(false);

    const [loadValues, setLoadValues] = useState(initialValues);
    const [currencyListArray, setCurrecyListArray] = useState([]);
    const ref = useRef(null);
    const [appearing, setAppearing] = useState(false);

    // const handleChangeStatus = (event) => {
    //     console.log(event.target.checked);
    //     // this.setState({ checked: event.target.checked });
    // };
    const handleExistModalClose = (status) => {
        if (status) {
            setExistOpenModal(false);
        }
    };

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
    //       path: `guideClassDetails[${idx}].taxOrder`,
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

    yup.addMethod(yup.string, 'checkDuplicatecode', function (message) {
        return this.test('checkDuplicatecode', 'Duplicate Code', async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    console.log(value);
                    dispatch(checkDuplicateGuideClasssCode(value));
                    console.log(duplicateCode);
                    if (duplicateCode != null && duplicateCode.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                } catch (error) {}
                return true;
            }
        });
    });

    yup.addMethod(yup.array, 'uniqueStatus', function (message) {
        return this.test('uniqueStatus', message, function (list) {
            const mapper = (x) => {
                console.log(x);
                return x.status;
            };
            let set = [...list.map(mapper)];
            console.log(set);
            let trueCount = 0;
            // let id = -1;
            let idList = [];
            let rowId = -1;
            set.map((data) => {
                // data.id = id + 1;
                rowId = rowId + 1;
                if (data === true) {
                    idList.push(rowId);
                    trueCount = trueCount + 1;
                }
            });
            console.log(trueCount);
            if (trueCount === 1 || trueCount === 0) {
                return true;
                // return this.createError({
                //     path: `guideClassDetails[1].status`,
                //     message: 'wrrrrrrrr'

                // });
            }
            console.log('here');
            console.log(idList);
            // let idx = list.findIndex((l, i) => {
            //     console.log(l);
            //     console.log(i);
            //     console.log(mapper(l) !== set[i]);
            // });
            // console.log('idx');
            // console.log(i  let idx = 1;
            // idList.map((data) => {
            //     console.log(typeof data);
            //     this.createError({
            //         path: `guideClassDetails[${1}].status`,
            //         message: 'wrrrrrrrr'
            //     });
            // });
            return this.createError({
                path: `guideClassDetails[${idList[0]}].status`,
                message: 'Only one can be true'
            });
        });
    });

    // yup.addMethod(yup.array, 'uniqueStatus', function (message) {
    //     return this.test('uniqueStatus', message, function (list) {
    //         const mapper = (x) => {
    //             return x.status;
    //         };
    //         const set = [...new Set(list.map(mapper))];
    //         console.log(list.map(mapper));

    //         // const isUnique = list !== set;
    //         // if (isUnique) {
    //         //     return true;
    //         // }
    //         // console.log('list length:' + list[0]);
    //         // if(list[0]==true){

    //         // }
    //         // const isUnique = list.length === new Set(list.map(mapper)).size;
    //         // console.log('isUn:' + new Set(list.map(mapper)).size);

    //         const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    //         // console.log('idx:' + set[i]);

    //         return this.createError({
    //             path: `guideClassDetails[${idx}].status`,
    //             message: message
    //         });
    //     });
    // });

    const validationSchema = yup.object().shape({
        guideCode: yup.string().required('Required field'),
        // .checkDuplicatecode('Duplicate Code'),
        description: yup.string().required('Required field'),
        guideClassDetails: yup
            .array()
            .of(
                yup.object().shape({
                    tax: yup.object().typeError('Required field'),
                    fromDate: yup.date().required('Required field'),
                    toDate: yup.date().min(yup.ref('fromDate'), "End date can't be before start date"),
                    currencyList: yup.object().typeError('Required field'),
                    // perDayRate: yup.number().required('Required field').positive('entry should be greater than 0'),
                    status: yup.boolean()
                    // status: yup.bool().when('appearing', {
                    //     is: true,s
                    //     then: yup.bool().oneOf([false], 'You need to accept the terms and conditions')
                    // })
                    // status: yup.bool().test({
                    //     name: 'one-true',
                    //     message: 'Required',
                    //     test: (val) => !every(val, ['value', false])
                    // })
                    // status: yup.bool().oneOf([true], 'You need to accept the terms and conditions')
                    // .test('unique', 'Only unique values allowed.', (value) => (console.log(value) ? value === new Set(value) : true))

                    // status: yup.bool().oneOf(status, 'The profession you chose does not exist')
                    // status: yup.bool().when('status', {
                    //     is: true,
                    //     then: yup.bool().oneOf([true], '').required('Required field')
                    // }) // status: yup.boolean().when('status', {
                    //     is: true,
                    //     then: 'error'
                    // })
                    // status: yup.boolean().when('status', {
                    //     is: true && mode === 'VIEW_UPDATE',
                    //     // then: yup.date().required('Field is required')
                    // })
                    // perDayRate: yup
                    //     .number()
                    //     .transform((_, value) => {
                    //         if (value.includes('.')) {
                    //             return null;
                    //         }
                    //         return +value.replace(/,/, '.');
                    //     })
                    //     .positive()
                })
            )
            .uniqueStatus('Already Existing Active Record.')
    });

    // const  checkStatus()=>{

    // }
    // let checkStatus = function (value) {
    //     console.log(value);
    //     console.log(loadValues.guideClassDetails);
    //     loadValues.guideClassDetails?.map((s) => (s.status == true ? alert('true') : ''));
    //     // console.log('value:' + value);
    // };

    const guideClassToUpdate = useSelector((state) => state.guideClassReducer.guideClassToUpdate);

    const dispatch = useDispatch();
    const [taxIdValues, setTaxIdValues] = useState(null);
    const [taxValues, setTaxValues] = useState(null);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getGuideClassDetailsByCode(guideCode));
        }
    }, [mode]);

    useEffect(() => {
        if (guideClassToUpdate != null) {
            const dataArray = [];
            if ((mode === 'VIEW_UPDATE' && guideClassToUpdate != null) || (mode === 'VIEW' && guideClassToUpdate != null)) {
                if (guideClassToUpdate.guideClassDetails.length > 0) {
                    guideClassToUpdate.guideClassDetails.map((item) => {
                        const guideClassDetails = {
                            fromDate: item.fromDate,
                            toDate: item.toDate,
                            currencyList: item.currencyList,
                            tax: item.tax,
                            perDayRate: item.perDayRate,
                            rateWithÓutTax: item.rateWithÓutTax,
                            rateWithTax: item.rateWithTax,
                            status: item.status
                        };
                        dataArray.push(guideClassDetails);
                    });

                    const saveValues = {
                        guideCode: guideClassToUpdate.guideCode,
                        description: guideClassToUpdate.description,
                        status: guideClassToUpdate.status,
                        guideClassDetails: dataArray
                    };
                    setLoadValues(saveValues);
                }
            }
        }
    }, [guideClassToUpdate]);

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            const dataArray = [];
            if (data.guideClassDetails.length > 0) {
                data.guideClassDetails.map((item) => {
                    const guideClassDetails = {
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        currencyList: item.currencyList.currencyListId,
                        tax: item.tax.taxId,
                        perDayRate: item.perDayRate == null ? 0.0 : item.perDayRate,
                        rateWithÓutTax: item.perDayRate,
                        rateWithTax: item.perDayRate,
                        status: item.status
                    };
                    dataArray.push(guideClassDetails);
                });

                const saveValues = {
                    guideCode: data.guideCode,
                    description: data.description,
                    status: data.status,
                    guideClassDetails: dataArray
                };
                console.log(saveValues);
                dispatch(saveGuideClassData(saveValues));
            }
        } else if (mode === 'VIEW_UPDATE') {
            const dataArray = [];
            if (data.guideClassDetails.length > 0) {
                data.guideClassDetails.map((item) => {
                    const guideClassDetails = {
                        fromDate: item.fromDate,
                        toDate: item.toDate,
                        currencyList: item.currencyList.currencyListId,
                        tax: item.tax.taxId,
                        perDayRate: item.perDayRate == null ? 0.0 : item.perDayRate,
                        rateWithÓutTax: item.perDayRate,
                        rateWithTax: item.perDayRate,
                        status: item.status
                    };
                    dataArray.push(guideClassDetails);
                });

                const saveValues = {
                    guideCode: data.guideCode,
                    description: data.description,
                    status: data.status,
                    guideClassDetails: dataArray
                };
                dispatch(updateGuideClassData(saveValues));
            }
        }
        handleClose();
    };

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    const taxListData = useSelector((state) => state.taxReducer.taxes);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const duplicateCode = useSelector((state) => state.guideClassReducer.duplicateCode);
    const [taxListOptions, setTaxListOptions] = useState([]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);

    useEffect(() => {
        dispatch(getAllTaxData());
        dispatch(getAllCurrencyListData());
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
                            Guide Class
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
                                            initialValues={loadValues}
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
                                                                            width: { sm: 200, md: 250 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        name="guideCode"
                                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                        label="Guide Code"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.guideCode}
                                                                        error={Boolean(touched.guideCode && errors.guideCode)}
                                                                        helperText={
                                                                            touched.guideCode && errors.guideCode ? errors.guideCode : ''
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
                                                        <FieldArray name="guideClassDetails">
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
                                                                                        currency: '',
                                                                                        tax: null,
                                                                                        perDayRate: '',
                                                                                        rateWithoutTax: '',
                                                                                        rateWithTax: '',
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
                                                                                    <TableCell>From Date</TableCell>
                                                                                    <TableCell>To Date</TableCell>
                                                                                    <TableCell>Currency</TableCell>
                                                                                    <TableCell>Tax Code</TableCell>
                                                                                    <TableCell>Tax %</TableCell>
                                                                                    <TableCell>Per Day Rate</TableCell>
                                                                                    <TableCell>Rate Without Tax</TableCell>
                                                                                    <TableCell>Rate With Tax</TableCell>
                                                                                    <TableCell>Status</TableCell>
                                                                                    <TableCell>Actions</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {values.guideClassDetails.map((record, idx) => {
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
                                                                                                                `guideClassDetails.${idx}.fromDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        // disabled={
                                                                                                        //     mode == 'VIEW_UPDATE' ||
                                                                                                        //     mode == 'VIEW'
                                                                                                        // }
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values.guideClassDetails[idx] &&
                                                                                                            values.guideClassDetails[idx]
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
                                                                                                                name={`guideClassDetails.${idx}.fromDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                                error={Boolean(
                                                                                                                    touched.guideClassDetails &&
                                                                                                                        touched
                                                                                                                            .guideClassDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .guideClassDetails[
                                                                                                                            idx
                                                                                                                        ].fromDate &&
                                                                                                                        errors.guideClassDetails &&
                                                                                                                        errors
                                                                                                                            .guideClassDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .guideClassDetails[
                                                                                                                            idx
                                                                                                                        ].fromDate
                                                                                                                )}
                                                                                                                helperText={
                                                                                                                    touched.guideClassDetails &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].fromDate &&
                                                                                                                    errors.guideClassDetails &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].fromDate
                                                                                                                        ? errors
                                                                                                                              .guideClassDetails[
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
                                                                                                                `guideClassDetails.${idx}.toDate`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        // disabled={
                                                                                                        //     mode == 'VIEW_UPDATE' ||
                                                                                                        //     mode == 'VIEW'
                                                                                                        // }
                                                                                                        inputFormat="DD/MM/YYYY"
                                                                                                        value={
                                                                                                            values.guideClassDetails[idx] &&
                                                                                                            values.guideClassDetails[idx]
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
                                                                                                                name={`guideClassDetails.${idx}.toDate`}
                                                                                                                onBlur={handleBlur}
                                                                                                                helperText={
                                                                                                                    touched.guideClassDetails &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].toDate &&
                                                                                                                    errors.guideClassDetails &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].toDate
                                                                                                                        ? errors
                                                                                                                              .guideClassDetails[
                                                                                                                              idx
                                                                                                                          ].toDate
                                                                                                                        : ''
                                                                                                                }
                                                                                                                error={Boolean(
                                                                                                                    touched.guideClassDetails &&
                                                                                                                        touched
                                                                                                                            .guideClassDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .guideClassDetails[
                                                                                                                            idx
                                                                                                                        ].toDate &&
                                                                                                                        errors.guideClassDetails &&
                                                                                                                        errors
                                                                                                                            .guideClassDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .guideClassDetails[
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
                                                                                                        values.guideClassDetails[idx]
                                                                                                            ? values.guideClassDetails[idx]
                                                                                                                  .currencyList
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`guideClassDetails.${idx}.currencyList`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value.currencyListId);
                                                                                                        setFieldValue(
                                                                                                            `guideClassDetails.${idx}.currencyList`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    // disabled={
                                                                                                    //     mode == 'VIEW_UPDATE' ||
                                                                                                    //     mode == 'VIEW'
                                                                                                    // }
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
                                                                                                            name={`guideClassDetails.${idx}.currencyList`}
                                                                                                            onBlur={handleBlur}
                                                                                                            helperText={
                                                                                                                touched.guideClassDetails &&
                                                                                                                touched.guideClassDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.guideClassDetails[
                                                                                                                    idx
                                                                                                                ].currencyList &&
                                                                                                                errors.guideClassDetails &&
                                                                                                                errors.guideClassDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.guideClassDetails[
                                                                                                                    idx
                                                                                                                ].currencyList
                                                                                                                    ? errors
                                                                                                                          .guideClassDetails[
                                                                                                                          idx
                                                                                                                      ].currencyList
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.guideClassDetails &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].currencyList &&
                                                                                                                    errors.guideClassDetails &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
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
                                                                                                        values.guideClassDetails[idx]
                                                                                                            ? values.guideClassDetails[idx]
                                                                                                                  .tax
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`guideClassDetails.${idx}.tax`}
                                                                                                    onChange={(_, value) => {
                                                                                                        setFieldValue(
                                                                                                            `guideClassDetails.${idx}.tax`,
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
                                                                                                            name={`guideClassDetails.${idx}.tax`}
                                                                                                            // disabled={
                                                                                                            //     mode == 'VIEW_UPDATE' ||
                                                                                                            //     mode == 'VIEW'
                                                                                                            // }
                                                                                                            onBlur={handleBlur}
                                                                                                            helperText={
                                                                                                                touched.guideClassDetails &&
                                                                                                                touched.guideClassDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.guideClassDetails[
                                                                                                                    idx
                                                                                                                ].tax &&
                                                                                                                errors.guideClassDetails &&
                                                                                                                errors.guideClassDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.guideClassDetails[
                                                                                                                    idx
                                                                                                                ].tax
                                                                                                                    ? errors
                                                                                                                          .guideClassDetails[
                                                                                                                          idx
                                                                                                                      ].tax
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.guideClassDetails &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].tax &&
                                                                                                                    errors.guideClassDetails &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].tax
                                                                                                            )}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.guideClassDetails[idx] &&
                                                                                                values.guideClassDetails[idx].tax
                                                                                                    ? values.guideClassDetails[idx].tax
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
                                                                                                    // disabled={
                                                                                                    //     mode == 'VIEW_UPDATE' ||
                                                                                                    //     mode == 'VIEW'
                                                                                                    // }
                                                                                                    placeholder="0"
                                                                                                    name={`guideClassDetails.${idx}.perDayRate`}
                                                                                                    value={
                                                                                                        values.guideClassDetails[idx] &&
                                                                                                        values.guideClassDetails[idx]
                                                                                                            .perDayRate
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    // onChange={(e) =>
                                                                                                    //     setRateWithTax(e.target.value)
                                                                                                    // }
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.guideClassDetails &&
                                                                                                            touched.guideClassDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.guideClassDetails[idx]
                                                                                                                .perDayRate &&
                                                                                                            errors.guideClassDetails &&
                                                                                                            errors.guideClassDetails[idx] &&
                                                                                                            errors.guideClassDetails[idx]
                                                                                                                .perDayRate
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.guideClassDetails &&
                                                                                                        touched.guideClassDetails[idx] &&
                                                                                                        touched.guideClassDetails[idx]
                                                                                                            .perDayRate &&
                                                                                                        errors.guideClassDetails &&
                                                                                                        errors.guideClassDetails[idx] &&
                                                                                                        errors.guideClassDetails[idx]
                                                                                                            .perDayRate
                                                                                                            ? errors.guideClassDetails[idx]
                                                                                                                  .perDayRate
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.guideClassDetails[idx] &&
                                                                                                values.guideClassDetails[idx].perDayRate
                                                                                                    ? values.guideClassDetails[idx]
                                                                                                          .perDayRate
                                                                                                    : 0}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {values.guideClassDetails[idx] &&
                                                                                                values.guideClassDetails[idx].perDayRate
                                                                                                    ? values.guideClassDetails[idx]
                                                                                                          .perDayRate *
                                                                                                          (values.guideClassDetails[idx].tax
                                                                                                              .percentage /
                                                                                                              100) +
                                                                                                      values.guideClassDetails[idx]
                                                                                                          .perDayRate
                                                                                                    : 0}
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <FormGroup>
                                                                                                    <FormControlLabel
                                                                                                        name={`guideClassDetails.${idx}.status`}
                                                                                                        // onChange={handleChangeStatus}
                                                                                                        value={
                                                                                                            values.guideClassDetails[idx] &&
                                                                                                            values.guideClassDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        control={<Switch color="success" />}
                                                                                                        error={Boolean(
                                                                                                            touched.guideClassDetails &&
                                                                                                                touched.guideClassDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.guideClassDetails[
                                                                                                                    idx
                                                                                                                ].status &&
                                                                                                                errors.guideClassDetails &&
                                                                                                                errors.guideClassDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.guideClassDetails[
                                                                                                                    idx
                                                                                                                ].status
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.guideClassDetails &&
                                                                                                            touched.guideClassDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.guideClassDetails[idx]
                                                                                                                .status &&
                                                                                                            errors.guideClassDetails &&
                                                                                                            errors.guideClassDetails[idx] &&
                                                                                                            errors.guideClassDetails[idx]
                                                                                                                .status
                                                                                                                ? errors.guideClassDetails[
                                                                                                                      idx
                                                                                                                  ].status
                                                                                                                : ''
                                                                                                        }
                                                                                                        onChange={(_, value) => {
                                                                                                            // checkStatus();
                                                                                                            // checkStatus(value);
                                                                                                            // console.log(value.currencyListId);
                                                                                                            // setAppearing(value);
                                                                                                            setFieldValue(
                                                                                                                `guideClassDetails.${idx}.status`,
                                                                                                                value
                                                                                                            );
                                                                                                            // console.log(
                                                                                                            //     values.guideClassDetails
                                                                                                            // );

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
                                                                                                            values.guideClassDetails[idx] &&
                                                                                                            values.guideClassDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                    {/* {errors.guideClassDetails &&
                                                                                                        errors.guideClassDetails[idx] &&
                                                                                                        errors.guideClassDetails[idx]
                                                                                                            .status && (
                                                                                                            <p
                                                                                                                style={{
                                                                                                                    color: 'red',
                                                                                                                    fontSize: '0.75rem'
                                                                                                                }}
                                                                                                            >
                                                                                                                {
                                                                                                                    errors
                                                                                                                        .guideClassDetails[
                                                                                                                        idx
                                                                                                                    ].status
                                                                                                                }
                                                                                                            </p>
                                                                                                        )} */}
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
                                                                    title="Already Exist"
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

export default GuideClass;
