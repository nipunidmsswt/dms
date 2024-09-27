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
    checkDuplicateRoomCategoryCodee,
    getRoomCategoryDataById,
    saveRoomCategoryData,
    updateRoomCategoryData
} from 'store/actions/masterActions/RoomCategoryAction';
import CreatedUpdatedUserDetails from '../../userTimeDetails/CreatedUpdatedUserDetails';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function RoomCategory({ open, mode, handleClose, rowHotelChildrenFacilityCode }) {
    const [duplicateError, setDuplicateError] = useState(false);
    const [openToast, setHandleToast] = useState(false);
    const dispatch = useDispatch();

    const initialValues = {
        code: '',
        roomDescription: '',
        status: true
    };

    const hotelChildrenFacilityToUpdate = useSelector((state) => state.roomCategoryReducer.hotelChildrenFacilityToUpdate);

    const duplicateRoomCategoryCode = useSelector((state) => state.roomCategoryReducer.duplicateRoomCategoryCode);

    Yup.addMethod(Yup.string, 'checkDuplicateRoomCategory', function (message) {
        return this.test('checkDuplicateRoomCategory', 'Duplicate Room Category Code', async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    dispatch(checkDuplicateRoomCategoryCodee(value));

                    if (duplicateRoomCategoryCode != null && duplicateRoomCategoryCode.errorMessages.length != 0) {
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

    const validationSchema = Yup.object().shape({
        code: Yup.string().required('Required').checkDuplicateRoomCategory('ggg'),
        roomDescription: Yup.string().required('Required'),
        status: Yup.boolean()
    });

    const [formValues, setFormValues] = useState(initialValues);

    const handleSubmitForm = (values, props) => {
        if (mode === 'INSERT') {
            dispatch(saveRoomCategoryData(values));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateRoomCategoryData(values));
        }
        handleClose();
        // setDuplicateError(false);
        // props.resetForm()
    };

    useEffect(() => {
        if (
            (mode === 'VIEW_UPDATE' && hotelChildrenFacilityToUpdate != null) ||
            (mode === 'VIEW' && hotelChildrenFacilityToUpdate != null)
        ) {
            setFormValues(hotelChildrenFacilityToUpdate);
        }
    }, [hotelChildrenFacilityToUpdate]);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getRoomCategoryDataById(rowHotelChildrenFacilityCode));
        }
        setDuplicateError(false);
    }, [mode]);

    const handleReset = (resetForm) => {
        resetForm();
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                disableBackdropClick
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Room
                            Category
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
                    initialValues={formValues}
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
                                                    id="roomDescription"
                                                    name="roomDescription"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.roomDescription}
                                                    error={Boolean(touched.roomDescription && errors.roomDescription)}
                                                    helperText={
                                                        touched.roomDescription && errors.roomDescription ? errors.roomDescription : ''
                                                    }
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

export default RoomCategory;
