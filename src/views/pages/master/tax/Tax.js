import { useEffect, forwardRef, useState } from 'react';

import {
    Dialog,
    Slide,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    Grid,
    Switch
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'assets/scss/style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { checkDuplicateTaxCode, getTaxDataById, saveTaxData, updateTaxData } from 'store/actions/masterActions/TaxActions/TaxAction';
import CreatedUpdatedUserDetails from '../userTimeDetails/CreatedUpdatedUserDetails';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function Tax({ open, handleClose, mode, rowTaxCode }) {
    const initialValues = {
        taxCode: '',
        taxDescription: '',
        status: true,
        percentage: '',
        fromDate: '',
        toDate: '',
        createdBy: 'admin'
    };

    const taxCode = (
        <p>
            Tax Code<span style={{ color: 'red' }}>*</span>
        </p>
    );
    const taxDescription = (
        <p>
            Tax Description<span style={{ color: 'red' }}>*</span>
        </p>
    );
    const percentage = (
        <p>
            Percentage<span style={{ color: 'red' }}>*</span>
        </p>
    );
    const [formValues, setFormValues] = useState(initialValues);
    const [loadValues, setLoadValues] = useState(null);
    const dispatch = useDispatch();

    const taxToUpdate = useSelector((state) => state.taxReducer.taxToUpdate);
    const duplicateTax = useSelector((state) => state.taxReducer.duplicateTax);

    yup.addMethod(yup.string, 'checkDuplicateTax', function (message) {
        return this.test('checkDuplicateTax', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateTaxCode(value));

                    if (duplicateTax != null && duplicateTax.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                    return false; // or true as you see fit
                } catch (error) {}
            }
            return true;
        });
    });

    const validationSchema = yup.object().shape({
        status: yup.boolean(),
        taxCode: yup.string().required('Required field').checkDuplicateTax('Duplicate Code'),
        taxDescription: yup.string().required('Required field'),
        fromDate: yup.date().required('Required field'),
        toDate: yup
            .date()
            .min(yup.ref('fromDate'), "End date can't be before start date")
            .when('status', {
                is: false && mode === 'VIEW_UPDATE',
                then: yup.date().required('Field is required')
            })
    });

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveTaxData(data));
        } else if (mode === 'VIEW_UPDATE') {
            console.log('yes click');
            dispatch(updateTaxData(data));
        }

        handleClose();
    };

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getTaxDataById(rowTaxCode));
        }
    }, [mode]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && taxToUpdate != null) || (mode === 'VIEW' && taxToUpdate != null)) {
            console.log(taxToUpdate);
            if (taxToUpdate.toDate === null) {
                taxToUpdate.toDate = '';
            }
            setLoadValues(taxToUpdate);
        }
    }, [taxToUpdate]);

    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Tax
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={loadValues || initialValues}
                            onSubmit={(values) => {
                                console.log(values);
                                handleSubmitForm(values);
                            }}
                            validationSchema={validationSchema}
                        >
                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                return (
                                    <Form>
                                        <Box sx={{ width: '100%' }}>
                                            <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                                <Grid item xs={6}>
                                                    {/* <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE'}
                                                        label="Company Name"
                                                        name="companyName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.companyName}
                                                        error={Boolean(touched.companyName && errors.companyName)}
                                                        helperText={touched.companyName && errors.companyName ? errors.companyName : ''}
                                                    ></TextField> */}
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        // label={taxCode}
                                                        label="Tax Code"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        sx={{
                                                            width: { xs: 150, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        type="text"
                                                        variant="outlined"
                                                        // className="txt"
                                                        id="taxCode"
                                                        name="taxCode"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.taxCode}
                                                        error={Boolean(touched.taxCode && errors.taxCode)}
                                                        helperText={touched.taxCode && errors.taxCode ? errors.taxCode : ''}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Tax Description"
                                                        sx={{
                                                            width: { xs: 150, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        // label={taxDescription}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        className="required"
                                                        type="text"
                                                        variant="outlined"
                                                        id="taxDescription"
                                                        name="taxDescription"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.taxDescription}
                                                        error={Boolean(touched.taxDescription && errors.taxDescription)}
                                                        helperText={
                                                            touched.taxDescription && errors.taxDescription ? errors.taxDescription : ''
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        // label={percentage}
                                                        label="Percentage (%)"
                                                        sx={{
                                                            width: { xs: 150, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        id="percentage"
                                                        name="percentage"
                                                        type="number"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.percentage}
                                                        error={Boolean(touched.percentage && errors.percentage)}
                                                        helperText={touched.percentage && errors.percentage ? errors.percentage : ''}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        // adapterLocale={locale}
                                                    >
                                                        <DatePicker
                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                            onChange={(value) => {
                                                                setFieldValue(`fromDate`, value);
                                                            }}
                                                            inputFormat="DD/MM/YYYY"
                                                            value={values.fromDate}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        width: { xs: 150, sm: 250 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 40
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
                                                                    helperText={touched.fromDate && errors.fromDate ? errors.fromDate : ''}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        // adapterLocale={locale}
                                                    >
                                                        <DatePicker
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(value) => {
                                                                setFieldValue(`toDate`, value);
                                                            }}
                                                            inputFormat="DD/MM/YYYY"
                                                            value={values.toDate}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        width: { xs: 150, sm: 250 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 40
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
                                                <Grid item xs={6}>
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
                                        </Box>
                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                            {mode != 'VIEW' ? (
                                                <Button
                                                    variant="outlined"
                                                    type="button"
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
                                        <Box>
                                            <Grid item>
                                                {mode === 'VIEW' ? <CreatedUpdatedUserDetailsWithTableFormat formValues={values} /> : null}
                                            </Grid>
                                        </Box>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Tax;
