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
    Autocomplete
} from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Formik, Form, FieldArray } from 'formik';
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
import { ViewPaxVehicleRateDetails } from './ViewPaxVehicleRateDetails';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ExpenseatLocation({ open, handleClose, mode, childToParent, expenseLocationDetails }) {
    const headerInitialValues = {
        location: null,
        locationDes: '',
        expenseTypes: null,
        expenseDes: '',
        status: true
    };
    const pages = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

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
        expensesAtLocations: [{ location: null, locationDes: '', expenseTypes: null, expenseDes: '', status: true }]
    });
    const [activeLocationList, setActiveLocationList] = useState([]);
    const [activeExpenseTypeList, setExpenseTypes] = useState([]);

    //get data from reducers
    const detailsType = useSelector((state) => state.mainTransportCategoryReducer.detailsType);
    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const activeExpenseTypes = useSelector((state) => state.expenseTypesReducer.activeExpenseTypes);
    const dispatch = useDispatch();

    const validationSchema = yup.object().shape({
        mainCategoryDetails: yup.array().of(
            yup.object().shape({
                location: yup.object().nullable().required('Required field'),
                locationDes: yup.string().required('Required field'),
                expenseTypes: yup.object().nullable().required('Required field'),
                expenseDes: yup.string().required('Required field')
            })
        )
    });
    const validationSchema1 = yup.object().shape({
        location: yup.object().nullable().required('Required field'),
        locationDes: yup.string().required('Required field'),
        expenseTypes: yup.object().nullable().required('Required field'),
        expenseDes: yup.string().required('Required field')
    });

    const [categoryType, setCategoryType] = useState(null);

    useEffect(() => {
        let values;
        console.log(expenseLocationDetails);
        if (expenseLocationDetails.length === 0) {
            values = {
                expensesAtLocations: [{ location: null, locationDes: '', expenseTypes: null, expenseDes: '', status: true }]
            };
        } else {
            values = {
                expensesAtLocations: expenseLocationDetails
            };
        }

        setLoadValues(values);
    }, [expenseLocationDetails]);

    useEffect(() => {
        dispatch(getActiveLocations());
        dispatch(getAllActiveExpenseTypesData());
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
        if (categoryType !== null) {
            if (detailsType !== null && detailsType.length != 0) {
                console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');

                console.log(detailsType);

                const values = {
                    mainCategoryDetails: detailsType
                };
                setLoadValues(values);
            } else {
                const values = {
                    mainCategoryDetails: [{ categoryType: '', typeCode: '', description: '', status: true, enableRow: false }]
                };
                setLoadValues(values);
            }
        }
    }, [detailsType]);

    useEffect(() => {
        if (categoryType !== null && loadValues.mainCategoryDetails != null) {
            loadValues?.mainCategoryDetails?.map((s) =>
                s.categoryType === ''
                    ? dispatch(getTransportMainCategoryDataByType(categoryType))
                    : detailsType?.length != loadValues?.mainCategoryDetails?.length && s.categoryType != categoryType
                    ? setOpenModal(true)
                    : dispatch(getTransportMainCategoryDataByType(categoryType))
            );
        }
    }, [categoryType]);

    useEffect(() => {
        console.log(activeExpenseTypes);
        if (activeExpenseTypes.length != 0) {
            setExpenseTypes(activeExpenseTypes);
        }
    }, [activeExpenseTypes]);

    useEffect(() => {
        setActiveLocationList(activeLocations);
    }, [activeLocations]);

    const handleSubmit = async (values) => {
        console.log(values);
        const initialValuesNew = {
            expensesAtLocations: [
                {
                    location: values.location,
                    locationDes: values.locationDes,
                    expenseTypes: values.expenseTypes,
                    expenseDes: values.expenseDes,
                    status: true
                }
            ]
        };
        if (loadValues.expensesAtLocations.length != 0) {
            loadValues.expensesAtLocations?.map((s) =>
                s.expenseTypes == null && s.location == null
                    ? initialValuesNew
                    : s.expenseTypes.expenseTypesId === values.expenseTypes.expenseTypesId &&
                      s.location.location_id == values.location.location_id
                    ? setExistOpenModal(true)
                    : initialValuesNew.expensesAtLocations.push(s)
            );

            setLoadValues(initialValuesNew);
        } else {
            setLoadValues(initialValuesNew);
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
                            Expenses at Locations
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
                                                                        {' '}
                                                                        <Autocomplete
                                                                            value={values.location}
                                                                            name="location"
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`location`, value);
                                                                                if (value != null) {
                                                                                    setFieldValue(`locationDes`, value.shortDescription);
                                                                                } else {
                                                                                    setFieldValue(`locationDes`, '');
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW'}
                                                                            options={activeLocationList}
                                                                            getOptionLabel={(option) => `${option.code}`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.location_id === value.location_id
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Location "
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    sx={{
                                                                                        width: {
                                                                                            sm: 250
                                                                                        },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    disabled={mode == 'VIEW'}
                                                                                    variant="outlined"
                                                                                    name="location"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(touched.location && errors.location)}
                                                                                    helperText={
                                                                                        touched.location && errors.location
                                                                                            ? errors.location
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Description"
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="locationDes"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.locationDes}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.locationDes && errors.locationDes)}
                                                                            helperText={
                                                                                touched.locationDes && errors.locationDes
                                                                                    ? errors.locationDes
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.expenseTypes}
                                                                            name="expenseTypes"
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`expenseTypes`, value);
                                                                                if (value != null) {
                                                                                    setFieldValue(`expenseDes`, value.description);
                                                                                } else {
                                                                                    setFieldValue(`expenseDes`, '');
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW'}
                                                                            options={activeExpenseTypeList}
                                                                            getOptionLabel={(option) => `${option.expenseCode}`}
                                                                            isOptionEqualToValue={(option, value) =>
                                                                                option.expenseTypesId === value.expenseTypesId
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Expense Type"
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    sx={{
                                                                                        width: {
                                                                                            sm: 250
                                                                                        },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    disabled={mode == 'VIEW'}
                                                                                    variant="outlined"
                                                                                    name="expenseTypes"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.expenseTypes && errors.expenseTypes
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.expenseTypes && errors.expenseTypes
                                                                                            ? errors.expenseTypes
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Description"
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="expenseDes"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.expenseDes}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.expenseDes && errors.expenseDes)}
                                                                            helperText={
                                                                                touched.expenseDes && errors.expenseDes
                                                                                    ? errors.expenseDes
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>

                                                                    <Grid item xs={3}>
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
                                                        <FieldArray name="expensesAtLocations">
                                                            {({ insert, remove, push }) => (
                                                                <Paper>
                                                                    <TableContainer>
                                                                        <Table stickyHeader size="small">
                                                                            <TableHead alignItems="center">
                                                                                <TableRow>
                                                                                    {/* <TableCell>Sequence</TableCell> */}
                                                                                    <TableCell>Location</TableCell>
                                                                                    <TableCell>Description</TableCell>
                                                                                    <TableCell>Expense Code</TableCell>
                                                                                    <TableCell>Description</TableCell>
                                                                                    <TableCell>Status</TableCell>
                                                                                    <TableCell>Actions</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            {/* {tableBodyData ? ( */}
                                                                            <TableBody>
                                                                                {(rowsPerPage > 0
                                                                                    ? values.expensesAtLocations?.slice(
                                                                                          page * rowsPerPage,
                                                                                          page * rowsPerPage + rowsPerPage
                                                                                      )
                                                                                    : values.expensesAtLocations
                                                                                ).map((record, idx) => {
                                                                                    // {values.mainCategoryDetails.map((record, idx) => {
                                                                                    return (
                                                                                        <TableRow key={idx} hover>
                                                                                            {/* <TableCell>{idx + 1}</TableCell> */}

                                                                                            <TableCell>
                                                                                                <Autocomplete
                                                                                                    disabled
                                                                                                    value={
                                                                                                        values.expensesAtLocations[idx]
                                                                                                            ? values.expensesAtLocations[
                                                                                                                  idx
                                                                                                              ].location
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`expensesAtLocations.${idx}.location`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value);
                                                                                                        setFieldValue(
                                                                                                            `expensesAtLocations.${idx}.location`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    options={activeLocationList}
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.code}`
                                                                                                    }
                                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                                        option.location_id ===
                                                                                                        value.location_id
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
                                                                                                            name={`expensesAtLocations.${idx}.location`}
                                                                                                            onBlur={handleBlur}
                                                                                                            helperText={
                                                                                                                touched.expensesAtLocations &&
                                                                                                                touched.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ].location &&
                                                                                                                errors.expensesAtLocations &&
                                                                                                                errors.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ].location
                                                                                                                    ? errors
                                                                                                                          .expensesAtLocations[
                                                                                                                          idx
                                                                                                                      ].location
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.expensesAtLocations &&
                                                                                                                    touched
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ].location &&
                                                                                                                    errors.expensesAtLocations &&
                                                                                                                    errors
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ].location
                                                                                                            )}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { sm: 200 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    disabled
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="code"
                                                                                                    // validate={checkDuplicateCodeForCodeAndName}

                                                                                                    name={`expensesAtLocations.${idx}.locationDes`}
                                                                                                    value={
                                                                                                        values.expensesAtLocations[idx] &&
                                                                                                        values.expensesAtLocations[idx]
                                                                                                            .location?.shortDescription
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    // error={Boolean(
                                                                                                    //     touched.expensesAtLocations &&
                                                                                                    //         touched.expensesAtLocations[
                                                                                                    //             idx
                                                                                                    //         ] &&
                                                                                                    //         touched.expensesAtLocations[idx]
                                                                                                    //             .locationDes &&
                                                                                                    //         errors.expensesAtLocations &&
                                                                                                    //         errors.expensesAtLocations[
                                                                                                    //             idx
                                                                                                    //         ] &&
                                                                                                    //         errors.expensesAtLocations[idx]
                                                                                                    //             .locationDes
                                                                                                    // )}
                                                                                                    // helperText={
                                                                                                    //     touched.expensesAtLocations &&
                                                                                                    //     touched.expensesAtLocations[idx] &&
                                                                                                    //     touched.expensesAtLocations[idx]
                                                                                                    //         .locationDes &&
                                                                                                    //     errors.expensesAtLocations &&
                                                                                                    //     errors.expensesAtLocations[idx] &&
                                                                                                    //     errors.expensesAtLocations[idx]
                                                                                                    //         .locationDes
                                                                                                    //         ? errors.expensesAtLocations[
                                                                                                    //               idx
                                                                                                    //           ].locationDes
                                                                                                    //         : ''
                                                                                                    // }
                                                                                                />
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <Autocomplete
                                                                                                    disabled
                                                                                                    value={
                                                                                                        values.expensesAtLocations[idx]
                                                                                                            ? values.expensesAtLocations[
                                                                                                                  idx
                                                                                                              ].expenseTypes
                                                                                                            : null
                                                                                                    }
                                                                                                    name={`expensesAtLocations.${idx}.expenseTypes`}
                                                                                                    onChange={(_, value) => {
                                                                                                        console.log(value);
                                                                                                        setFieldValue(
                                                                                                            `expensesAtLocations.${idx}.expenseTypes`,
                                                                                                            value
                                                                                                        );
                                                                                                    }}
                                                                                                    options={activeExpenseTypeList}
                                                                                                    getOptionLabel={(option) =>
                                                                                                        `${option.expenseCode}`
                                                                                                    }
                                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                                        option.expenseTypesId ===
                                                                                                        value.expenseTypesId
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
                                                                                                            name={`expensesAtLocations.${idx}.expenseTypes`}
                                                                                                            onBlur={handleBlur}
                                                                                                            helperText={
                                                                                                                touched.expensesAtLocations &&
                                                                                                                touched.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ].expenseTypes &&
                                                                                                                errors.expensesAtLocations &&
                                                                                                                errors.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.expensesAtLocations[
                                                                                                                    idx
                                                                                                                ].expenseTypes
                                                                                                                    ? errors
                                                                                                                          .expensesAtLocations[
                                                                                                                          idx
                                                                                                                      ].expenseTypes
                                                                                                                    : ''
                                                                                                            }
                                                                                                            error={Boolean(
                                                                                                                touched.expensesAtLocations &&
                                                                                                                    touched
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ].expenseTypes &&
                                                                                                                    errors.expensesAtLocations &&
                                                                                                                    errors
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .expensesAtLocations[
                                                                                                                        idx
                                                                                                                    ].expenseTypes
                                                                                                            )}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { sm: 200 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    disabled
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="code"
                                                                                                    // validate={checkDuplicateCodeForCodeAndName}

                                                                                                    name={`expensesAtLocations.${idx}.expenseDes`}
                                                                                                    value={
                                                                                                        values.expensesAtLocations[idx] &&
                                                                                                        values.expensesAtLocations[idx]
                                                                                                            .expenseTypes?.description
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    // error={Boolean(
                                                                                                    //     touched.expensesAtLocations &&
                                                                                                    //         touched.expensesAtLocations[
                                                                                                    //             idx
                                                                                                    //         ] &&
                                                                                                    //         touched.expensesAtLocations[idx]
                                                                                                    //             .expenseDes &&
                                                                                                    //         errors.expensesAtLocations &&
                                                                                                    //         errors.expensesAtLocations[
                                                                                                    //             idx
                                                                                                    //         ] &&
                                                                                                    //         errors.expensesAtLocations[idx]
                                                                                                    //             .expenseDes
                                                                                                    // )}
                                                                                                    // helperText={
                                                                                                    //     touched.expensesAtLocations &&
                                                                                                    //     touched.expensesAtLocations[idx] &&
                                                                                                    //     touched.expensesAtLocations[idx]
                                                                                                    //         .expenseDes &&
                                                                                                    //     errors.expensesAtLocations &&
                                                                                                    //     errors.expensesAtLocations[idx] &&
                                                                                                    //     errors.expensesAtLocations[idx]
                                                                                                    //         .expenseDes
                                                                                                    //         ? errors.expensesAtLocations[
                                                                                                    //               idx
                                                                                                    //           ].expenseDes
                                                                                                    //         : ''
                                                                                                    // }
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <FormGroup>
                                                                                                    <FormControlLabel
                                                                                                        name={`expensesAtLocations.${idx}.status`}
                                                                                                        onChange={handleChange}
                                                                                                        value={
                                                                                                            values.expensesAtLocations[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.expensesAtLocations[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        control={<Switch color="success" />}
                                                                                                        // label="Status"
                                                                                                        checked={
                                                                                                            values.expensesAtLocations[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                {(values.expensesAtLocations[idx] &&
                                                                                                    values.expensesAtLocations[idx].id) ===
                                                                                                undefined ? (
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
                                                                                        count={values.expensesAtLocations.length}
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

export default ExpenseatLocation;
