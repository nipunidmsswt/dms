import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, FormControlLabel, Box, DialogContent, TextField, DialogTitle, FormGroup, Button, MenuItem, Switch } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    saveDepartmentDesignationData,
    getDepartmentDesignationDataById,
    updateDepartmentDesignationData,
    checkDuplicateDepartmentDesignationCode
} from '../../../../store/actions/masterActions/DepartmentDesignationAction';

import { Formik, Form } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

function DepartmentDesignation({ open, handleClose, mode, code, type }) {
    const initialValues = {
        type: '',
        description: '',
        status: true
    };

    const [loadValues, setLoadValues] = useState(null);

    yup.addMethod(yup.string, 'checkDuplicateCode', function (message) {
        return this.test('checkDuplicateCode', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateDepartmentDesignationCode(value));
                    if (duplicateDepartmentDesignation != null && duplicateDepartmentDesignation.errorMessages.length != 0) {
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
        type: yup.string().required('Required field'),
        description: yup.string().required('Required field').checkDuplicateCode('Duplicate Code'),
        status: yup.boolean()
    });

    //get data from reducers...
    const departmentDesignationToUpdate = useSelector((state) => state.departmentDesignationReducer.departmentDesignationToUpdate);
    const duplicateDepartmentDesignation = useSelector((state) => state.departmentDesignationReducer.duplicateDepartmentDesignation);

    const dispatch = useDispatch();

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getDepartmentDesignationDataById(code, type));
        }
    }, [mode]);

    useEffect(() => {
        if (
            (mode === 'VIEW_UPDATE' && departmentDesignationToUpdate != null) ||
            (mode === 'VIEW' && departmentDesignationToUpdate != null)
        ) {
            setLoadValues(departmentDesignationToUpdate);
        }
    }, [departmentDesignationToUpdate]);

    const handleSubmitForm = (data) => {
        if (mode === 'INSERT') {
            dispatch(saveDepartmentDesignationData(data));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateDepartmentDesignationData(data));
        }
        handleClose();
    };

    return (
        <div>
            <Dialog fullWidth open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}
                            Department / Designation
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
                        <Formik
                            maxWidth
                            enableReinitialize={true}
                            initialValues={loadValues || initialValues}
                            onSubmit={(values, resetForm) => {
                                handleSubmitForm(values);
                                // resetForm('');
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
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        select
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="type"
                                                        name="type"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.type}
                                                        error={Boolean(touched.type && errors.type)}
                                                        helperText={touched.type && errors.type ? errors.type : ''}
                                                    >
                                                        <MenuItem dense={true} value={'Department'}>
                                                            Department
                                                        </MenuItem>
                                                        <MenuItem dense={true} value={'Designation'}>
                                                            Designation
                                                        </MenuItem>
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Description"
                                                        name="description"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.description}
                                                        error={Boolean(touched.description && errors.description)}
                                                        helperText={touched.description && errors.description ? errors.description : ''}
                                                    ></TextField>
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
                                                            disabled={mode == 'VIEW'}
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
                    </DialogContent>
                </>
            </Dialog>
        </div>
    );
}

export default DepartmentDesignation;
