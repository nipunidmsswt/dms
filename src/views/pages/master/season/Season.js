import { useEffect, forwardRef, useState, Fragment, useRef } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    Typography,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    DialogContentText,
    Switch
} from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Formik, Form, FieldArray } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { checkDuplicateSeasonCode, getSeasonDataById, saveSeasonData, updateSeasonData } from 'store/actions/masterActions/SeasonAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

function Season({ open, handleClose, mode, code }) {
    const initialValues = {
        mainSeason: '',
        status: true,
        seasonFromDate: '',
        seasonToDate: '',
        seasonDetails: [
            {
                ratePeriod: '',
                // specialOfferSeason: '',
                toDate: '',
                status: true,
                fromDate: ''
            }
        ]
    };

    const [loadValues, setLoadValues] = useState(null);
    const [openDialogBox, setOpenDialogBox] = useState(false);
    const ref = useRef(null);

    //   yup.addMethod(yup.array, "uniqueTaxOrder", function (message) {
    //     return this.test("uniqueTaxOrder", message, function (list) {
    //       const mapper = (x) => {
    //         return x.taxOrder;
    //       };
    //       const set = [...new Set(list.map(mapper))];
    //       const isUnique = list.length === set.length;
    //       if (isUnique) {
    //         return true;
    //       }

    //       const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    //       return this.createError({
    //         path: `seasonDetails[${idx}].taxOrder`,
    //         message: message,
    //       });
    //     });
    //   });

    //   yup.addMethod(yup.array, "uniqueTaxCode", function (message) {
    //     return this.test("uniqueTaxCode", message, function (list) {
    //       const mapper = (x) => {
    //         return x.tax?.taxCode;
    //       };
    //       const set = [...new Set(list.map(mapper))];
    //       const isUnique = list.length === set.length;
    //       if (isUnique) {
    //         return true;
    //       }

    //       const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    //       return this.createError({
    //         path: `seasonDetails[${idx}].tax`,
    //         message: message,
    //       });
    //     });
    //   });

    yup.addMethod(yup.string, 'checkDuplicateSeason', function (message) {
        return this.test('checkDuplicateSeason', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateSeasonCode(value));
                    if (duplicateSeason != null && duplicateSeason.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                } catch (error) {}
            }
            return true;
        });
    });

    const validationSchema = yup.object().shape({
        mainSeason: yup.string().required('Required field'),
        //   .checkDuplicateSeason("Duplicate Code"),
        seasonFromDate: yup.date().required('Required field'),
        // toDate: yup.date(),
        seasonToDate: yup.date().required('Required field').min(yup.ref('seasonFromDate'), "End date can't be before start date"),
        seasonDetails: yup.array().of(
            yup.object().shape({
                ratePeriod: yup.string().required('Required field'),
                fromDate: yup.date().required('Required field'),
                toDate: yup.date().required('Required field').min(yup.ref('fromDate'), "End date can't be before start date")
                // .min(yup.ref('seasonToDate'), "End date can't be before season start date")
            })
        )
    });

    //get data from reducers

    const seasonToUpdate = useSelector((state) => state.seasonReducer.seasonToUpdate);

    const duplicateSeason = useSelector((state) => state.seasonReducer.duplicateSeason);
    console.log(duplicateSeason);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('update');
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log(code);
            dispatch(getSeasonDataById(code));
        }
    }, [mode]);

    useEffect(() => {
        console.log(seasonToUpdate);

        if ((mode === 'VIEW_UPDATE' && seasonToUpdate != null) || (mode === 'VIEW' && seasonToUpdate != null)) {
            setLoadValues(seasonToUpdate);
        }
    }, [seasonToUpdate]);

    const handleSubmitForm = (data) => {
        console.log(data);
        console.log(data.seasonFromDate);
        console.log(data.seasonDetails[data.seasonDetails.length - 1].toDate);
        const x = new Date(data.seasonToDate).toISOString().split('T')[0];
        const y = new Date(data.seasonDetails[data.seasonDetails.length - 1].toDate).toISOString().split('T')[0];
        console.log(x);
        console.log(y);
        if (x < y || x > y) {
            console.log('yuiy');
            setOpenDialogBox(true);
        } else {
            if (mode === 'INSERT') {
                dispatch(saveSeasonData(data));
            } else if (mode === 'VIEW_UPDATE') {
                console.log('yes click');
                dispatch(updateSeasonData(data));
            }
            handleClose();
        }
    };

    const handleCancel = () => {
        setLoadValues(initialValues);
    };

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    return (
        <div>
            <Dialog maxWidth="220px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Season
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
                                                                        <TextField
                                                                            label="Main Season"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode != 'INSERT'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="mainSeason"
                                                                            value={values.mainSeason}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.mainSeason && errors.mainSeason)}
                                                                            helperText={
                                                                                touched.mainSeason && errors.mainSeason
                                                                                    ? errors.mainSeason
                                                                                    : ''
                                                                            }
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
                                                                                    let idx = 0;
                                                                                    setFieldValue(`seasonFromDate`, value);
                                                                                    setFieldValue(`seasonDetails.${idx}.fromDate`, value);
                                                                                }}
                                                                                inputFormat="DD/MM/YYYY"
                                                                                value={values.seasonFromDate}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        sx={{
                                                                                            width: { sm: 200, md: 300 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        InputLabelProps={{
                                                                                            shrink: true
                                                                                        }}
                                                                                        label="From Date"
                                                                                        variant="outlined"
                                                                                        name="seasonFromDate"
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.seasonFromDate && errors.seasonFromDate
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.seasonFromDate && errors.seasonFromDate
                                                                                                ? errors.seasonFromDate
                                                                                                : ''
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
                                                                                    setFieldValue(`seasonToDate`, value);
                                                                                }}
                                                                                inputFormat="DD/MM/YYYY"
                                                                                value={values.seasonToDate}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        sx={{
                                                                                            width: { sm: 200, md: 300 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        InputLabelProps={{
                                                                                            shrink: true
                                                                                        }}
                                                                                        label="To Date"
                                                                                        variant="outlined"
                                                                                        name="seasonToDate"
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.seasonToDate && errors.seasonToDate
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.seasonToDate && errors.seasonToDate
                                                                                                ? errors.seasonToDate
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        display="flex"
                                                                        style={{
                                                                            alignItems: 'center'
                                                                            //   marginTop: "10px",
                                                                            //   marginBottom: "10px",
                                                                        }}
                                                                    >
                                                                        {/* <Typography
                                                                            variant=""
                                                                            component="p"
                                                                            style={{ marginRight: '10px' }}
                                                                        >
                                                                            Active
                                                                        </Typography> */}

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
                                                                </Grid>
                                                            </div>

                                                            <FieldArray name="seasonDetails">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    onClick={() => {
                                                                                        console.log(ref.current.values.seasonToDate);
                                                                                        console.log(
                                                                                            ref.current.values.seasonDetails[
                                                                                                ref.current.values.seasonDetails.length - 1
                                                                                            ].toDate
                                                                                        );
                                                                                        const x = new Date(ref.current.values.seasonToDate);

                                                                                        const y = new Date(
                                                                                            ref.current.values.seasonDetails[
                                                                                                ref.current.values.seasonDetails.length - 1
                                                                                            ].toDate
                                                                                        );

                                                                                        if (x < y) {
                                                                                            // alert('sry cant');
                                                                                            setOpenDialogBox(true);
                                                                                        } else {
                                                                                            console.log(x);
                                                                                            console.log(y);
                                                                                            push({
                                                                                                ratePeriod: '',
                                                                                                // specialOfferSeason: '',
                                                                                                toDate: '',
                                                                                                status: true,
                                                                                                fromDate: ''
                                                                                            });
                                                                                            var date = addDays(y, 1);
                                                                                            console.log(date);
                                                                                            setFieldValue(
                                                                                                `seasonDetails.${ref.current.values.seasonDetails.length}.fromDate`,
                                                                                                date
                                                                                            );
                                                                                        }
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
                                                                                        <TableCell>Rate Period</TableCell>
                                                                                        {/* <TableCell>Special Offer Season</TableCell> */}
                                                                                        {/* <TableCell>Free</TableCell> */}
                                                                                        <TableCell>From Date</TableCell>
                                                                                        <TableCell>To Date</TableCell>
                                                                                        <TableCell>Status</TableCell>
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.seasonDetails.map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        // label="taxOrder"

                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        type="text"
                                                                                                        variant="outlined"
                                                                                                        name={`seasonDetails.${idx}.ratePeriod`}
                                                                                                        disabled={mode != 'INSERT'}
                                                                                                        value={
                                                                                                            values.seasonDetails[idx] &&
                                                                                                            values.seasonDetails[idx]
                                                                                                                .ratePeriod
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.seasonDetails &&
                                                                                                                touched.seasonDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.seasonDetails[idx]
                                                                                                                    .ratePeriod &&
                                                                                                                errors.seasonDetails &&
                                                                                                                errors.seasonDetails[idx] &&
                                                                                                                errors.seasonDetails[idx]
                                                                                                                    .ratePeriod
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.seasonDetails &&
                                                                                                            touched.seasonDetails[idx] &&
                                                                                                            touched.seasonDetails[idx]
                                                                                                                .ratePeriod &&
                                                                                                            errors.seasonDetails &&
                                                                                                            errors.seasonDetails[idx] &&
                                                                                                            errors.seasonDetails[idx]
                                                                                                                .ratePeriod
                                                                                                                ? errors.seasonDetails[idx]
                                                                                                                      .ratePeriod
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell>
                                                                                                {/* <TableCell>
                                                                                                    <TextField
                                                                                                        // label="taxOrder"
                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        type="text"
                                                                                                        variant="outlined"
                                                                                                        name={`seasonDetails.${idx}.specialOfferSeason`}
                                                                                                        value={
                                                                                                            values.seasonDetails[idx] &&
                                                                                                            values.seasonDetails[idx]
                                                                                                                .specialOfferSeason
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.seasonDetails &&
                                                                                                                touched.seasonDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.seasonDetails[idx]
                                                                                                                    .specialOfferSeason &&
                                                                                                                errors.seasonDetails &&
                                                                                                                errors.seasonDetails[idx] &&
                                                                                                                errors.seasonDetails[idx]
                                                                                                                    .specialOfferSeason
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.seasonDetails &&
                                                                                                            touched.seasonDetails[idx] &&
                                                                                                            touched.seasonDetails[idx]
                                                                                                                .specialOfferSeason &&
                                                                                                            errors.seasonDetails &&
                                                                                                            errors.seasonDetails[idx] &&
                                                                                                            errors.seasonDetails[idx]
                                                                                                                .specialOfferSeason
                                                                                                                ? errors.seasonDetails[idx]
                                                                                                                      .specialOfferSeason
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell> */}

                                                                                                <TableCell>
                                                                                                    <LocalizationProvider
                                                                                                        dateAdapter={AdapterDayjs}
                                                                                                        // adapterLocale={locale}
                                                                                                    >
                                                                                                        <DatePicker
                                                                                                            disabled={mode != 'INSERT'}
                                                                                                            onChange={(value) => {
                                                                                                                console.log(value);
                                                                                                                console.log(ref.current);
                                                                                                                setFieldValue(
                                                                                                                    `seasonDetails.${idx}.fromDate`,
                                                                                                                    value
                                                                                                                );
                                                                                                            }}
                                                                                                            inputFormat="DD/MM/YYYY"
                                                                                                            value={
                                                                                                                values.seasonDetails[idx] &&
                                                                                                                values.seasonDetails[idx]
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
                                                                                                                    name={`seasonDetails.${idx}.fromDate`}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.seasonDetails &&
                                                                                                                            touched
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ].fromDate &&
                                                                                                                            errors.seasonDetails &&
                                                                                                                            errors
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ].fromDate
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.seasonDetails &&
                                                                                                                        touched
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ].fromDate &&
                                                                                                                        errors.seasonDetails &&
                                                                                                                        errors
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ].fromDate
                                                                                                                            ? errors
                                                                                                                                  .seasonDetails[
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
                                                                                                        // adapterLocale={locale}
                                                                                                    >
                                                                                                        <DatePicker
                                                                                                            disabled={mode != 'INSERT'}
                                                                                                            onChange={(value) => {
                                                                                                                console.log(value);
                                                                                                                console.log(ref.current);
                                                                                                                setFieldValue(
                                                                                                                    `seasonDetails.${idx}.toDate`,
                                                                                                                    value
                                                                                                                );
                                                                                                            }}
                                                                                                            inputFormat="DD/MM/YYYY"
                                                                                                            value={
                                                                                                                values.seasonDetails[idx] &&
                                                                                                                values.seasonDetails[idx]
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
                                                                                                                    name={`seasonDetails.${idx}.toDate`}
                                                                                                                    onBlur={handleBlur}
                                                                                                                    error={Boolean(
                                                                                                                        touched.seasonDetails &&
                                                                                                                            touched
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            touched
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ].toDate &&
                                                                                                                            errors.seasonDetails &&
                                                                                                                            errors
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ] &&
                                                                                                                            errors
                                                                                                                                .seasonDetails[
                                                                                                                                idx
                                                                                                                            ].toDate
                                                                                                                    )}
                                                                                                                    helperText={
                                                                                                                        touched.seasonDetails &&
                                                                                                                        touched
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ].toDate &&
                                                                                                                        errors.seasonDetails &&
                                                                                                                        errors
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ].toDate
                                                                                                                            ? errors
                                                                                                                                  .seasonDetails[
                                                                                                                                  idx
                                                                                                                              ].toDate
                                                                                                                            : ''
                                                                                                                    }
                                                                                                                />
                                                                                                            )}
                                                                                                        />
                                                                                                    </LocalizationProvider>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        {/* <FormControlLabel
                                                                                                            control={
                                                                                                                <Checkbox
                                                                                                                    name={`seasonDetails.${idx}.status`}
                                                                                                                    onChange={handleChange}
                                                                                                                    checked={
                                                                                                                        values
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ].status
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        values
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        values
                                                                                                                            .seasonDetails[
                                                                                                                            idx
                                                                                                                        ].status
                                                                                                                    }
                                                                                                                />
                                                                                                            }
                                                                                                        /> */}
                                                                                                        <FormGroup>
                                                                                                            <FormControlLabel
                                                                                                                name={`seasonDetails.${idx}.status`}
                                                                                                                control={<Switch />}
                                                                                                                label="Status"
                                                                                                                disabled={mode == 'VIEW'}
                                                                                                                onChange={handleChange}
                                                                                                                checked={
                                                                                                                    values.seasonDetails[
                                                                                                                        idx
                                                                                                                    ].status
                                                                                                                }
                                                                                                                value={
                                                                                                                    values.seasonDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    values.seasonDetails[
                                                                                                                        idx
                                                                                                                    ].status
                                                                                                                }
                                                                                                            />
                                                                                                        </FormGroup>
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
                                                            {openDialogBox ? (
                                                                <Dialog
                                                                    open={open}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="alert-dialog-title"
                                                                    aria-describedby="alert-dialog-description"
                                                                >
                                                                    <DialogTitle id="alert-dialog-title" style={{ color: 'red' }}>
                                                                        {'Error Msg'}
                                                                    </DialogTitle>
                                                                    <DialogContent>
                                                                        <DialogContentText id="alert-dialog-description">
                                                                            to date is lower than sub level to date
                                                                        </DialogContentText>
                                                                    </DialogContent>
                                                                    <DialogActions>
                                                                        {/* <Button onClick={handleClose}>Disagree</Button> */}
                                                                        <Button
                                                                            className="btnSave"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenDialogBox(false);
                                                                            }}
                                                                        >
                                                                            OK
                                                                        </Button>
                                                                    </DialogActions>
                                                                </Dialog>
                                                            ) : (
                                                                ''
                                                            )}
                                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                                {mode != 'VIEW' ? (
                                                                    <Button
                                                                        variant="outlined"
                                                                        type="button"
                                                                        style={{
                                                                            // backgroundColor: '#B22222',
                                                                            marginLeft: '10px'
                                                                        }}
                                                                        onClick={handleCancel}
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
                                                            <Box>
                                                                <Grid item>
                                                                    {mode === 'VIEW' ? (
                                                                        <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                    ) : null}
                                                                </Grid>
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

export default Season;
