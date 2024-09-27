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
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from '@mui/icons-material';
import {
    checkDuplicateHotelCategoryCode,
    getHotelCategoryDataById,
    saveHotelCategoryData,
    updateHotelCategoryData
} from 'store/actions/masterActions/HotelCategoryAction';
import CreatedUpdatedUserDetails from '../../userTimeDetails/CreatedUpdatedUserDetails';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function HotelCategory({ open, mode, handleClose, hotelCategoryCode }) {
    const [duplicateError, setDuplicateError] = useState(false);

    const dispatch = useDispatch();

    const initialValues = {
        code: '',
        name: '',
        status: true
    };

    const hotelCategoryToUpdate = useSelector((state) => state.hotelCategoryReducer.hotelCategoryToUpdate);
    console.log(hotelCategoryToUpdate);

    const [loadValues, setLoadValues] = useState(null);

    const duplicatehotelCategory = useSelector((state) => state.hotelCategoryReducer.duplicatehotelCategory);

    Yup.addMethod(Yup.string, 'checkDuplicateCode', function (message) {
        return this.test('checkDuplicateCode', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    console.log('code:' + value);
                    await dispatch(checkDuplicateHotelCategoryCode(value));

                    if (duplicatehotelCategory != null && duplicatehotelCategory.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                } catch (error) {}
            }
            return true;
        });
    });

    const validationSchema = Yup.object().shape({
        code: Yup.string().required('Required').checkDuplicateCode('Duplicate Code'),
        // .test('Unique', 'Hotel Category Code Already Exists', async function validateValue(value) {
        //     if (mode === 'INSERT') {
        //         try {
        //             dispatch(checkDuplicateHotelCategory(value));

        //             if (duplicatehotelCategory != null && duplicatehotelCategory.errorMessages.length != 0) {
        //                 return false;
        //             } else {
        //                 return true;
        //             }
        //             return false; // or true as you see fit
        //         } catch (error) {}
        //     }
        //     return true;
        // }),
        name: Yup.string().required('Required'),
        status: Yup.boolean()
    });

    const [formValues, setFormValues] = useState(initialValues);

    const handleSubmitForm = (values, props) => {
        if (mode === 'INSERT') {
            dispatch(saveHotelCategoryData(values));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateHotelCategoryData(values));
        }
        handleClose();
    };

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && hotelCategoryToUpdate != null) || (mode === 'VIEW' && hotelCategoryToUpdate != null)) {
            setLoadValues(hotelCategoryToUpdate.body.payload[0].hotelCategory);
        }
    }, [hotelCategoryToUpdate]);

    // const checkDuplicateHotelCategory = (values) => {
    //     if (values != '') {
    //         dispatch(checkDuplicateHotelCategoryCode(values));
    //     }
    // };

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getHotelCategoryDataById(hotelCategoryCode));
        }
        setDuplicateError(false);
    }, [mode]);

    const handleReset = (resetForm) => {
        resetForm();
    };

    return (
        <div>
            <Dialog open={open} TransitionComponent={Transition} keepMounted aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {(() => {
                                if (mode === 'INSERT') {
                                    return 'Add Hotel Category';
                                    // <Text>Add</Text>
                                } else if (mode === 'VIEW') {
                                    return 'View Hotel Category';
                                } else {
                                    return 'Edit Hotel Category';
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
                                                    label="Name"
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
                                                    id="name"
                                                    name="name"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.name}
                                                    error={Boolean(touched.name && errors.name)}
                                                    helperText={touched.name && errors.name ? errors.name : ''}
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

export default HotelCategory;
