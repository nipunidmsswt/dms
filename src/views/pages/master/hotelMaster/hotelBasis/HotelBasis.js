import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Slide,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';
import { useEffect, forwardRef, useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { CheckBox } from '@mui/icons-material';
import {
    checkDuplicateHotelBasisCodee,
    getHotelBasisDataById,
    saveHotelBasisData,
    updateHotelBasisData
} from 'store/actions/masterActions/operatorActions/HotelBasisAction';
import CreatedUpdatedUserDetails from '../../userTimeDetails/CreatedUpdatedUserDetails';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function HotelBasis({ open, mode, handleClose, rowHotelBasisCode }) {
    // const phoneRegExp=/^[2-9]{2}[0-9]{8}/
    // const passwordRegExp=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    const [duplicateError, setDuplicateError] = useState(false);

    const dispatch = useDispatch();

    const initialValues = {
        code: '',
        basisDesc: '',
        status: true
    };

    const hotelBasisToUpdate = useSelector((state) => state.hotelBasisReducer.hotelBasisToUpdate);

    const duplicatehotelBasis = useSelector((state) => state.hotelBasisReducer.duplicatehotelBasis);
    const [loadValues, setLoadValues] = useState(null);

    yup.addMethod(yup.string, 'checkDuplicateHotelBasis', function (message) {
        return this.test('checkDuplicateHotelBasis', 'Duplicate Hotel Basis Code', async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    dispatch(checkDuplicateHotelBasisCodee(value));

                    if (duplicatehotelBasis != null && duplicatehotelBasis.errorMessages.length != 0) {
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
        code: yup.string().required('Required field').checkDuplicateHotelBasis('ggg'),
        basisDesc: yup.string().required('Required field'),
        status: yup.boolean()
    });

    const [formValues, setFormValues] = useState(initialValues);

    const handleSubmitForm = (values, props) => {
        if (mode === 'INSERT') {
            dispatch(saveHotelBasisData(values));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateHotelBasisData(values));
        }
        handleClose();
        // setDuplicateError(false);
        // props.resetForm()
    };

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && hotelBasisToUpdate != null) || (mode === 'VIEW' && hotelBasisToUpdate != null)) {
            setLoadValues(hotelBasisToUpdate);
        }
    }, [hotelBasisToUpdate]);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getHotelBasisDataById(rowHotelBasisCode));
        }
        setDuplicateError(false);
    }, [mode]);

    const clearForm = () => {};

    return (
        <div>
            <Dialog open={open} TransitionComponent={Transition} keepMounted aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {(() => {
                                if (mode === 'INSERT') {
                                    return 'Add Hotel Basis';
                                    // <Text>Add</Text>
                                } else if (mode === 'VIEW') {
                                    return 'View Hotel Basis';
                                } else {
                                    return 'Edit Hotel Basis';
                                }

                                return null;
                            })()}

                            {/* {mode === "INSERT" ? "Add " : "Edit "} Tour Category */}
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <Formik
                    //initialValues={{ ...formValues }}
                    initialValues={loadValues || formValues}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                >
                    {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                        return (
                            <Form noValidate>
                                <DialogContent>
                                    <div>
                                        <Grid container direction="column" gap={'15px'} justifyContent="center" alignContent="center">
                                            {/* <Grid item>
                                        <Typography variant="subtitle1" component="h2">
                                            Code
                                        </Typography>
                                    </Grid> */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                    label="Code"
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
                                                    id="code"
                                                    name="code"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.code}
                                                    error={Boolean(touched.code && errors.code)}
                                                    helperText={touched.code && errors.code ? errors.code : ''}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                    label="Basis Description"
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
                                                    id="basisDesc"
                                                    basisDesc="basisDesc"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.basisDesc}
                                                    error={Boolean(touched.basisDesc && errors.basisDesc)}
                                                    helperText={touched.basisDesc && errors.basisDesc ? errors.basisDesc : ''}
                                                />
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
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        className="btnSave"
                                        style={{
                                            // backgroundColor: '#00AB55',
                                            display: mode == 'VIEW' ? 'none' : 'block'
                                        }}
                                    >
                                        {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        type="button"
                                        style={{
                                            // backgroundColor: '#B22222',
                                            display: mode == 'VIEW' ? 'none' : 'block'
                                        }}
                                        onClick={resetForm}
                                        // onClick={handleReset.bind(null, props.resetForm)}
                                    >
                                        CLEAR
                                    </Button>
                                </DialogActions>
                            </Form>
                        );
                    }}
                </Formik>
            </Dialog>
        </div>
    );
}

export default HotelBasis;
