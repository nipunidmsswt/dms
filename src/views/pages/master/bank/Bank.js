import { useEffect, forwardRef, useState } from 'react';

import { Dialog, Box, DialogContent, TextField, DialogTitle, Button, Grid } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'assets/scss/style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { checkDuplicateTaxCode, getTaxDataById, saveTaxData, updateTaxData } from 'store/actions/masterActions/TaxActions/TaxAction';
import { saveBankData } from 'store/actions/masterActions/BankAction';
import * as yup from 'yup';
import { Formik, Form } from 'formik';

function Bank({ open, handleClose, mode, id }) {
    const initialValues = {
        bankCode: '',
        bankName: '',
        bankPrefix: '',
        bankDesc: ''
    };

    const dispatch = useDispatch();

    const [loadValues, setLoadValues] = useState(null);
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
        bankCode: yup.string().required('Required field'),
        bankName: yup.string().required('Required field'),
        bankPrefix: yup.string().required('Required field')
    });

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'BANK') {
            dispatch(saveBankData(data));
        }

        handleClose();
    };

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getTaxDataById(id));
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
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'BANK' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Bank
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
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Bank Code"
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
                                                        id="bankCode"
                                                        name="bankCode"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.bankCode}
                                                        error={Boolean(touched.bankCode && errors.bankCode)}
                                                        helperText={touched.bankCode && errors.bankCode ? errors.bankCode : ''}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Bank Name"
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
                                                        id="bankName"
                                                        name="bankName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.bankName}
                                                        error={Boolean(touched.bankName && errors.bankName)}
                                                        helperText={touched.bankName && errors.bankName ? errors.bankName : ''}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Bank Prefix"
                                                        sx={{
                                                            width: { xs: 150, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        id="bankPrefix"
                                                        name="bankPrefix"
                                                        type="text"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.bankPrefix}
                                                        error={Boolean(touched.bankPrefix && errors.bankPrefix)}
                                                        helperText={touched.bankPrefix && errors.bankPrefix ? errors.bankPrefix : ''}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Bank Description"
                                                        sx={{
                                                            width: { xs: 150, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        className="required"
                                                        type="text"
                                                        variant="outlined"
                                                        id="bankDesc"
                                                        name="bankDesc"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.bankDesc}
                                                        error={Boolean(touched.bankDesc && errors.bankDesc)}
                                                        helperText={touched.bankDesc && errors.bankDesc ? errors.bankDesc : ''}
                                                    />
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
                                                    {mode === 'BANK' ? 'SAVE' : ''}
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

export default Bank;
