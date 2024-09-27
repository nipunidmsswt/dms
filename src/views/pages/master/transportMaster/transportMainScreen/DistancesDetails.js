import React from 'react';
//main screen
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
    Autocomplete,
    Button,
    Grid,
    TextField,
    FormGroup,
    FormControlLabel,
    Switch,
    IconButton,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination
} from '@mui/material';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorAlert from 'messages/ErrorAlert';
import ErrorMsg from 'messages/ErrorMsg';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik, Form, FieldArray } from 'formik';
import * as yup from 'yup';
import { Box } from '@mui/system';
import { makeStyles } from '@material-ui/core/styles';
import AlertItemDelete from 'messages/AlertItemDelete';
import AlertItemExist from 'messages/AlertItemExist';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getCodeAndNameDataByType } from 'store/actions/masterActions/CodeAndNameAction';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import { getAllActiveDistanceDataByTransportType, saveDistanceData } from 'store/actions/masterActions/DistanceAction';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
const useStyles = makeStyles({
    content: {
        justifyContent: 'center'
    }
});

function DistancesDetails({ mode, selectedType }) {
    const headerInitialValues = {
        fromLocation: null,
        fromDescription: '',
        toLocation: null,
        toDescription: '',
        distance: '',
        hours: '',
        status: true
    };
    const pages = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const distanceByTransportType = useSelector((state) => state.distanceReducer.distanceByTransportType);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        console.log(mode);
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    }, [mode]);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [initialValues, setInitial] = useState(headerInitialValues);
    const [openModal, setOpenModal] = useState(false);
    const [existOpenModal, setExistOpenModal] = useState(false);
    const [marketListOptions, setMarketListOptions] = useState([]);
    const [activeLocationList, setActiveLocationList] = useState([]);
    const distance = useSelector((state) => state.distanceReducer.distance);
    const [loadValues, setLoadValues] = useState({
        // category: '',
        // code: '',
        // description: '',
        // status: true,
        distanceDetails: [
            { fromLocation: '', fromDescription: '', toLocation: '', toDescription: '', distance: '', hours: '', status: true }
        ]
    });
    yup.addMethod(yup.array, 'uniqueCode', function (message) {
        return this.test('uniqueCode', message, function (list) {
            const mapper = (x) => {
                return x.code;
            };
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length === set.length;
            if (isUnique) {
                return true;
            }

            const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `distanceDetails[${idx}].code`,
                message: message
            });
        });
    });

    const validationSchema = yup.object().shape({
        distanceDetails: yup.array().of(
            yup.object().shape({
                fromLocation: yup.object().typeError('Required field'),
                // fromDescription: yup.string().required('Required field'),
                toLocation: yup.object().typeError('Required field')
                // toDescription: yup.string().required('Required field')
            })
        )
        // .uniqueCodeAndNameCode("Must be unique"),
        // .uniqueCode('Code Already Exist')
    });

    const validationSchema1 = yup.object().shape({
        fromLocation: yup.object().typeError('Required field'),
        // fromDescription: yup.string().required('Required field'),
        toLocation: yup.object().typeError('Required field')
        // toDescription: yup.string().required('Required field')
        // distance: yup.string().required('Required field'),
        // hours:yup.string().required('Required field'),
    });

    //get data from reducers
    const detailsType = useSelector((state) => state.codeAndNameReducer.detailsType);
    const dispatch = useDispatch();

    const [categoryType, setCategoryType] = useState(null);

    const handleModalClose = (status) => {
        setOpenModal(false);

        if (status) {
            dispatch(getCodeAndNameDataByType(categoryType));
        }
    };

    const handleErrorAlertClose = (status) => {
        setOpenErrorAlert(false);
    };

    const handleExistModalClose = (status) => {
        if (status) {
            setExistOpenModal(false);
        }
    };

    useEffect(() => {
        if (distance != null) {
            dispatch(getAllActiveDistanceDataByTransportType(selectedType.categoryId));
        }
    }, [distance]);

    useEffect(() => {
        if (distanceByTransportType != null && selectedType != '') {
            const initialValuesNew = {
                distanceDetails: distanceByTransportType
            };
            setLoadValues(initialValuesNew);

            // const values = {
            //     distanceDetails: distanceByTransportType
            // };
            // setLoadValues(values);
        } else {
            const values = {
                distanceDetails: [
                    { fromLocation: '', fromDescription: '', toLocation: '', toDescription: '', distance: '', hours: '', status: true }
                ]
            };
            // const initialValuesNew = {
            //     distanceDetails: [
            //         {
            //             mainCategories: '',
            //             fromLocation: {
            //                 code: ''
            //             },
            //             fromDescription: '',
            //             toLocation: {
            //                 code: ''
            //             },
            //             toDescription: '',
            //             distance: '',
            //             hours: '',
            //             status: true
            //         }
            //     ]
            // };
            setLoadValues(values);
        }
    }, [distanceByTransportType]);

    useEffect(() => {
        if (categoryType !== null) {
            loadValues.distanceDetails?.map((s) =>
                s.category === ''
                    ? dispatch(getCodeAndNameDataByType(categoryType))
                    : detailsType.distanceDetails.length != loadValues.distanceDetails.length
                    ? setOpenModal(true)
                    : dispatch(getCodeAndNameDataByType(categoryType))
            );
        }
    }, [categoryType]);

    // useEffect(() => {
    //     if (categoryType !== null) {
    //         if (detailsType !== null && detailsType.length != 0) {
    //             setLoadValues(detailsType);
    //         }
    //     }
    // }, [detailsType]);

    useEffect(() => {
        console.log(selectedType.categoryId);
        if (selectedType != '') {
            dispatch(getAllActiveDistanceDataByTransportType(selectedType.categoryId));
        } else {
        }
    }, [selectedType]);

    useEffect(() => {
        setActiveLocationList(activeLocations);
    }, [activeLocations]);

    useEffect(() => {
        dispatch(getActiveLocations());
    }, []);

    const handleSubmitForm = async (data) => {
        console.log(data);
        if (mode === 'INSERT' || mode === 'VIEW_UPDATE') {
            console.log(selectedType);
            if (selectedType == '') {
                console.log('selectedType');
                setOpenErrorAlert(true);
            } else {
                const distanceDetailsArray = data.distanceDetails;

                console.log(distanceDetailsArray);
                dispatch(saveDistanceData(distanceDetailsArray));

                // const initialValuesNew = {
                //     distanceDetails: [
                //         {
                //             mainCategories: '',
                //             fromLocation: {
                //                 code: ''
                //             },
                //             fromDescription: '',
                //             toLocation: {
                //                 code: ''
                //             },
                //             toDescription: '',
                //             distance: '',
                //             hours: '',
                //             status: true
                //         }
                //     ]
                // };
                // setLoadValues(initialValuesNew);
            }
        }
    };

    const handleSubmit = async (values) => {
        const initialValuesNew = {
            distanceDetails: [
                {
                    id: '',
                    mainCategories: selectedType,
                    fromLocation: values.fromLocation,
                    // fromDescription: values.fromLocation.shortDescription,
                    toLocation: values.toLocation,
                    // toDescription: values.toLocation.shortDescription,
                    distance: values.distance,
                    hours: values.hours,
                    status: values.status
                }
            ]
        };

        if (loadValues.distanceDetails.length != 0) {
            loadValues.distanceDetails?.map((s) =>
                s.fromDescription == '' && s.toDescription == '' ? initialValuesNew : initialValuesNew.distanceDetails.push(s)
            );

            setLoadValues(initialValuesNew);
        } else {
            setLoadValues(initialValuesNew);
        }
    };

    return (
        <div className="row">
            <Grid container direction="row">
                <Grid item lg={12} md={12} xs={12}>
                    <>
                        <Formik
                            enableReinitialize={true}
                            initialValues={headerInitialValues || loadValues}
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
                                                        value={values.fromLocation}
                                                        name="fromLocation"
                                                        disabled={mode == 'VIEW'}
                                                        onChange={(_, value) => {
                                                            setFieldValue(`fromLocation`, value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={activeLocationList}
                                                        getOptionLabel={(option) => `${option.code} - ${option.shortDescription}`}
                                                        // isOptionEqualToValue={(option, value) => option.marketId === value.marketId}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="From Location"
                                                                sx={{
                                                                    width: { xs: 175 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 41
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.fromLocation && errors.fromLocation)}
                                                                helperText={
                                                                    touched.fromLocation && errors.fromLocation ? errors.fromLocation : ''
                                                                }
                                                                variant="outlined"
                                                                name="fromLocation"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item>
                                                    <TextField
                                                        label="Description"
                                                        sx={{
                                                            width: { xs: 150 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled
                                                        type="text"
                                                        variant="outlined"
                                                        name="fromDescription"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        value={
                                                            values.fromLocation && values.fromLocation
                                                                ? values.fromLocation.shortDescription
                                                                : ''
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        // error={Boolean(touched.fromDescription && errors.fromDescription)}
                                                        // helperText={
                                                        //     touched.fromDescription && errors.fromDescription ? errors.fromDescription : ''
                                                        // }
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    {' '}
                                                    <Autocomplete
                                                        value={values.toLocation}
                                                        name="toLocation"
                                                        disabled={mode == 'VIEW'}
                                                        onChange={(_, value) => {
                                                            setFieldValue(`toLocation`, value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={activeLocationList}
                                                        getOptionLabel={(option) => `${option.code} - ${option.shortDescription}`}
                                                        // isOptionEqualToValue={(option, value) => option.marketId === value.marketId}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="To Location"
                                                                sx={{
                                                                    width: { xs: 175 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 41
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                error={Boolean(touched.toLocation && errors.toLocation)}
                                                                helperText={
                                                                    touched.toLocation && errors.toLocation ? errors.toLocation : ''
                                                                }
                                                                // placeholder="--Select a Manager Code --"
                                                                variant="outlined"
                                                                name="toLocation"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="Description"
                                                        sx={{
                                                            width: { xs: 150 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled
                                                        type="text"
                                                        variant="outlined"
                                                        name="toDescription"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        value={
                                                            values.toLocation && values.toLocation ? values.toLocation.shortDescription : ''
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        // error={Boolean(touched.toDescription && errors.toDescription)}
                                                        // helperText={
                                                        //     touched.toDescription && errors.toDescription ? errors.toDescription : ''
                                                        // }
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="Distance (km)"
                                                        sx={{
                                                            width: { xs: 150 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        type="text"
                                                        variant="outlined"
                                                        name="distance"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        value={values.distance}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        // error={Boolean(touched.description && errors.description)}
                                                        // helperText={touched.description && errors.description ? errors.description : ''}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        label="Hours"
                                                        sx={{
                                                            width: { xs: 150 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        type="text"
                                                        variant="outlined"
                                                        name="hours"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        value={values.hours}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        // error={Boolean(touched.description && errors.description)}
                                                        // helperText={touched.description && errors.description ? errors.description : ''}
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
                        initialValues={loadValues || initialValues}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmitForm(values);
                            resetForm('');
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                            return (
                                <Form>
                                    <FieldArray name="distanceDetails">
                                        {({ insert, remove, push }) => (
                                            <Paper>
                                                <TableContainer>
                                                    <Table stickyHeader size="small">
                                                        <TableHead alignItems="center">
                                                            <TableRow>
                                                                {/* <TableCell>Transport Type</TableCell> */}
                                                                <TableCell>From Location</TableCell>
                                                                <TableCell>Description </TableCell>
                                                                <TableCell>To Location</TableCell>
                                                                <TableCell>Description</TableCell>
                                                                <TableCell>Distance (Km)</TableCell>
                                                                <TableCell>Duration (h)</TableCell>
                                                                <TableCell>Status</TableCell>
                                                                <TableCell>Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>

                                                        <TableBody>
                                                            {(rowsPerPage > 0
                                                                ? values.distanceDetails.slice(
                                                                      page * rowsPerPage,
                                                                      page * rowsPerPage + rowsPerPage
                                                                  )
                                                                : values.distanceDetails
                                                            ).map((record, idx) => {
                                                                // {values.distanceDetails.map((record, idx) => {
                                                                return (
                                                                    <TableRow key={idx} hover>
                                                                        {/* <TableCell>
                                                                            <TextField
                                                                                sx={{
                                                                                    width: { xs: 120 },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled
                                                                                variant="outlined"
                                                                                name={`distanceDetails.${idx}.mainCategories`}
                                                                                value={
                                                                                    values.distanceDetails[idx] &&
                                                                                    values.distanceDetails[idx].mainCategories
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        </TableCell> */}
                                                                        {/* <TableCell>{idx + 1}</TableCell> */}

                                                                        <TableCell>
                                                                            <TextField
                                                                                sx={{
                                                                                    width: { xs: 120 },
                                                                                    '& .MuiInputBase-root': {
                                                                                        height: 40
                                                                                    }
                                                                                }}
                                                                                disabled
                                                                                variant="outlined"
                                                                                name={`distanceDetails.${idx}.fromLocation`}
                                                                                value={
                                                                                    values.distanceDetails[idx] &&
                                                                                    values.distanceDetails[idx].fromLocation.code
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                error={Boolean(
                                                                                    touched.distanceDetails &&
                                                                                        touched.distanceDetails[idx] &&
                                                                                        touched.distanceDetails[idx].fromLocation &&
                                                                                        errors.distanceDetails &&
                                                                                        errors.distanceDetails[idx] &&
                                                                                        errors.distanceDetails[idx].fromLocation
                                                                                )}
                                                                                helperText={
                                                                                    touched.distanceDetails &&
                                                                                    touched.distanceDetails[idx] &&
                                                                                    touched.distanceDetails[idx].fromLocation &&
                                                                                    errors.distanceDetails &&
                                                                                    errors.distanceDetails[idx] &&
                                                                                    errors.distanceDetails[idx].fromLocation
                                                                                        ? errors.distanceDetails[idx].fromLocation
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
                                                                                disabled
                                                                                variant="outlined"
                                                                                // placeholder="code"
                                                                                // validate={checkDuplicateCodeForCodeAndName}

                                                                                name={`distanceDetails.${idx}.fromDescription`}
                                                                                value={
                                                                                    values.distanceDetails[idx] &&
                                                                                    values.distanceDetails[idx].fromLocation
                                                                                        .shortDescription
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                error={Boolean(
                                                                                    touched.distanceDetails &&
                                                                                        touched.distanceDetails[idx] &&
                                                                                        touched.distanceDetails[idx].fromDescription &&
                                                                                        errors.distanceDetails &&
                                                                                        errors.distanceDetails[idx] &&
                                                                                        errors.distanceDetails[idx].fromDescription
                                                                                )}
                                                                                helperText={
                                                                                    touched.distanceDetails &&
                                                                                    touched.distanceDetails[idx] &&
                                                                                    touched.distanceDetails[idx].fromDescription &&
                                                                                    errors.distanceDetails &&
                                                                                    errors.distanceDetails[idx] &&
                                                                                    errors.distanceDetails[idx].fromDescription
                                                                                        ? errors.distanceDetails[idx].fromDescription
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
                                                                                name={`distanceDetails.${idx}.toLocation`}
                                                                                value={
                                                                                    values.distanceDetails[idx] &&
                                                                                    values.distanceDetails[idx].toLocation.code
                                                                                }
                                                                                disabled
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                error={Boolean(
                                                                                    touched.distanceDetails &&
                                                                                        touched.distanceDetails[idx] &&
                                                                                        touched.distanceDetails[idx].toLocation &&
                                                                                        errors.distanceDetails &&
                                                                                        errors.distanceDetails[idx] &&
                                                                                        errors.distanceDetails[idx].toLocation
                                                                                )}
                                                                                helperText={
                                                                                    touched.distanceDetails &&
                                                                                    touched.distanceDetails[idx] &&
                                                                                    touched.distanceDetails[idx].toLocation &&
                                                                                    errors.distanceDetails &&
                                                                                    errors.distanceDetails[idx] &&
                                                                                    errors.distanceDetails[idx].toLocation
                                                                                        ? errors.distanceDetails[idx].toLocation
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
                                                                                name={`distanceDetails.${idx}.toDescription`}
                                                                                value={
                                                                                    values.distanceDetails[idx] &&
                                                                                    values.distanceDetails[idx].toLocation.shortDescription
                                                                                }
                                                                                disabled
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                error={Boolean(
                                                                                    touched.distanceDetails &&
                                                                                        touched.distanceDetails[idx] &&
                                                                                        touched.distanceDetails[idx].toDescription &&
                                                                                        errors.distanceDetails &&
                                                                                        errors.distanceDetails[idx] &&
                                                                                        errors.distanceDetails[idx].toDescription
                                                                                )}
                                                                                helperText={
                                                                                    touched.distanceDetails &&
                                                                                    touched.distanceDetails[idx] &&
                                                                                    touched.distanceDetails[idx].toDescription &&
                                                                                    errors.distanceDetails &&
                                                                                    errors.distanceDetails[idx] &&
                                                                                    errors.distanceDetails[idx].toDescription
                                                                                        ? errors.distanceDetails[idx].toDescription
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
                                                                                name={`distanceDetails.${idx}.distance`}
                                                                                value={
                                                                                    values.distanceDetails[idx] &&
                                                                                    values.distanceDetails[idx].distance
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
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
                                                                                name={`distanceDetails.${idx}.hours`}
                                                                                value={
                                                                                    values.distanceDetails[idx] &&
                                                                                    values.distanceDetails[idx].hours
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                // error={Boolean(
                                                                                //     touched.distanceDetails &&
                                                                                //         touched.distanceDetails[idx] &&
                                                                                //         touched.distanceDetails[idx].hours &&
                                                                                //         errors.distanceDetails &&
                                                                                //         errors.distanceDetails[idx] &&
                                                                                //         errors.distanceDetails[idx].hours
                                                                                // )}
                                                                                // helperText={
                                                                                //     touched.distanceDetails &&
                                                                                //     touched.distanceDetails[idx] &&
                                                                                //     touched.distanceDetails[idx].hours &&
                                                                                //     errors.distanceDetails &&
                                                                                //     errors.distanceDetails[idx] &&
                                                                                //     errors.distanceDetails[idx].hours
                                                                                //         ? errors.distanceDetails[idx].hours
                                                                                //         : ''
                                                                                // }
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <FormGroup>
                                                                                <FormControlLabel
                                                                                    name={`distanceDetails.${idx}.status`}
                                                                                    onChange={handleChange}
                                                                                    value={
                                                                                        values.distanceDetails[idx] &&
                                                                                        values.distanceDetails[idx].status
                                                                                    }
                                                                                    control={<Switch color="success" />}
                                                                                    // label="Status"
                                                                                    checked={values.distanceDetails[idx].status}

                                                                                    // disabled={mode == 'VIEW'}
                                                                                />
                                                                            </FormGroup>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            {(values.distanceDetails[idx] &&
                                                                                values.distanceDetails[idx].id) === '' ? (
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
                                                                    count={values.distanceDetails.length}
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
                                            {mode === 'VIEW' ? <CreatedUpdatedUserDetailsWithTableFormat formValues={values} /> : null}
                                        </Grid>
                                    </Box>
                                    <Box>
                                        <Grid item>
                                            {openModal ? (
                                                <AlertItemDelete title="dev" open={openModal} handleClose={handleModalClose} />
                                            ) : null}
                                        </Grid>

                                        <Grid item>
                                            {existOpenModal ? (
                                                <AlertItemExist
                                                    title="Already Exist"
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
                    {openErrorAlert ? (
                        <ErrorAlert open={openErrorAlert} msg={'Please select Transport Type'} handleClose={handleErrorAlertClose} />
                    ) : (
                        ''
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

export default DistancesDetails;
