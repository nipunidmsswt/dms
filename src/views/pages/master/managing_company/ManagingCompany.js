import React from 'react';
import { useEffect, forwardRef, useState, Fragment } from 'react';
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
    Checkbox,
    Button,
    Typography,
    Switch
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';

import {
    saveManagingCompanyData,
    updateManagingCompanyData,
    getManagingCompanyDataById,
    checkDuplicateManagingCompanyCode
} from '../../../../store/actions/masterActions/ManagingComapanyAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

function ManagingCompany({ open, handleClose, mode, code }) {
    const initialValues = {
        code: '',
        name: '',
        address: '',
        phoneNumber1: '',
        phoneNumber2: '',
        status: true,
        fax1: '',
        fax2: '',
        email: '',
        webSite: ''
    };

    const [loadValues, setLoadValues] = useState(null);

    yup.addMethod(yup.string, 'checkDuplicateCode', function (message) {
        return this.test('checkDuplicateCode', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    dispatch(checkDuplicateManagingCompanyCode(value));

                    if (duplicateManagingCompany != null && duplicateManagingCompany.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                } catch (error) {}
            }
            return true;
        });
    });
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const validationSchema = yup.object().shape({
        code: yup.string().required('Required field').checkDuplicateCode('Duplicate Code'),
        name: yup.string().required('Required field'),
        status: yup.boolean(),
        phoneNumber1: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        phoneNumber2: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        email: yup.string().email()
    });

    //get data from reducers
    const managingCompanyToUpdate = useSelector((state) => state.ManagingCompanyReducer.managingCompanyToUpdate);

    const duplicateManagingCompany = useSelector((state) => state.ManagingCompanyReducer.duplicateManagingCompany);

    const dispatch = useDispatch();

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            // alert(code);
            dispatch(getManagingCompanyDataById(code));
        }
    }, [mode]);

    useEffect(() => {
        console.log(managingCompanyToUpdate);

        if ((mode === 'VIEW_UPDATE' && managingCompanyToUpdate != null) || (mode === 'VIEW' && managingCompanyToUpdate != null)) {
            setLoadValues(managingCompanyToUpdate.ManagingCompany);
        }
    }, [managingCompanyToUpdate]);

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveManagingCompanyData(data));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateManagingCompanyData(data));
        }
        handleClose();
    };

    const handleCancel = () => {
        setLoadValues(initialValues);
    };

    return (
        <div>
            <Dialog maxWidth="220px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" alignItems="center" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}{' '}
                            Managing Company
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
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            label="Code"
                                                                            name="code"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.code}
                                                                            error={Boolean(touched.code && errors.code)}
                                                                            helperText={touched.code && errors.code ? errors.code : ''}
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Description"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="name"
                                                                            value={values.name}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.name && errors.name)}
                                                                            helperText={touched.name && errors.name ? errors.name : ''}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Address"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="address"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.address}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.address && errors.address)}
                                                                            helperText={
                                                                                touched.address && errors.address ? errors.address : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid
                                                                    gap="10px"
                                                                    display="flex"
                                                                    style={{
                                                                        marginTop: '10px',
                                                                        marginBottom: '10px'
                                                                    }}
                                                                >
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            label="Primary Phone"
                                                                            name="phoneNumber1"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.phoneNumber1}
                                                                            error={Boolean(touched.phoneNumber1 && errors.phoneNumber1)}
                                                                            helperText={
                                                                                touched.phoneNumber1 && errors.phoneNumber1
                                                                                    ? errors.phoneNumber1
                                                                                    : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Additional Phone"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            name="phoneNumber2"
                                                                            value={values.phoneNumber2}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.phoneNumber2 && errors.phoneNumber2)}
                                                                            helperText={
                                                                                touched.phoneNumber2 && errors.phoneNumber2
                                                                                    ? errors.phoneNumber2
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Fax 1"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            variant="outlined"
                                                                            name="fax1"
                                                                            value={values.fax1}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.fax1 && errors.fax1)}
                                                                            helperText={touched.fax1 && errors.fax1 ? errors.fax1 : ''}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Fax 2"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            name="fax2"
                                                                            value={values.fax2}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.fax2 && errors.fax2)}
                                                                            helperText={touched.fax2 && errors.fax2 ? errors.fax2 : ''}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Email"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="email"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.email}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.email && errors.email)}
                                                                            helperText={touched.email && errors.email ? errors.email : ''}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            label="Website"
                                                                            name="webSite"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.webSite}
                                                                            error={Boolean(touched.webSite && errors.webSite)}
                                                                            helperText={
                                                                                touched.webSite && errors.webSite ? errors.webSite : ''
                                                                            }
                                                                        ></TextField>
                                                                    </Grid>
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
                                                            </div>

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

                                                                {/* <Box>
                                                                    <Grid item>
                                                                        {mode === 'VIEW' ? (
                                                                            // <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                        ) : null}
                                                                    </Grid>
                                                                </Box> */}
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

export default ManagingCompany;
