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
import CreatedUpdatedUserDetails from '../userTimeDetails/CreatedUpdatedUserDetails';
import {
    checkDuplicateTourTypeCode,
    getTourTypeDataById,
    saveTourTypeData,
    updateTourTypeData
} from 'store/actions/masterActions/TourTypeAction';
import { checkDuplicateTourCategoryCode } from 'store/actions/masterActions/TourCategoryActions';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function TourType({ open, mode, handleClose, tourTypeCode }) {
    // const phoneRegExp=/^[2-9]{2}[0-9]{8}/
    // const passwordRegExp=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    const [duplicateError, setDuplicateError] = useState(false);

    const dispatch = useDispatch();

    const initialValues = {
        code: '',
        name: '',
        status: true,
        tourOperator: true
    };

    const tourTypeToUpdate = useSelector((state) => state.tourTypeDataReducer.tourTypeToUpdate);
    const [error, setError] = useState(false);

    const [loadValues, setLoadValues] = useState(null);

    const duplicatetourType = useSelector((state) => state.tourTypeDataReducer.duplicatetourType);
    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        console.log(duplicatetourType);
        if (duplicatetourType != null) {
            if (duplicatetourType.length != 0) {
                let data = [];
                setDuplicateError(true);
            } else {
                let data = null;
                setDuplicateError(false);
            }
        }
    }, [duplicatetourType]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (formValues.code.length == 0 || formValues.name.length == 0) {
            setError(true);
        } else {
            if (mode === 'INSERT') {
                dispatch(saveTourTypeData(formValues));
            } else if (mode === 'VIEW_UPDATE') {
                dispatch(updateTourTypeData(formValues));
            }

            handleClose();
            setDuplicateError(false);
        }
    };

    const clearForm = () => {
        if (mode == 'INSERT') {
            setFormValues(initialValues);
        } else {
            setFormValues(tourTypeToUpdate);
        }
        setDuplicateError(false);
    };

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && tourTypeToUpdate != null) || (mode === 'VIEW' && tourTypeToUpdate != null)) {
            setFormValues(tourTypeToUpdate.body.payload[0].tourType);
        }
    }, [tourTypeToUpdate]);

    const checkTourTypeCode = (e) => {
        if (e.target.value != '') {
            dispatch(checkDuplicateTourTypeCode(formValues.code));
        }
    };

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getTourTypeDataById(tourTypeCode));
        }
        setDuplicateError(false);
    }, [mode]);

    const handleReset = (resetForm) => {
        resetForm();
    };

    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setFormValues({
            ...formValues,
            [name]: value
        });
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
                            {(() => {
                                if (mode === 'INSERT') {
                                    return 'Add Tour Type';
                                } else if (mode === 'VIEW') {
                                    return 'View Tour Type';
                                } else {
                                    return 'Edit Tour Type';
                                }
                            })()}
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <form onSubmit={handleSubmitForm}>
                    <DialogContent>
                        <div>
                            <Grid container direction="column" gap={'15px'} justifyContent="center" alignContent="center">
                                {/* <Grid item>
                                <Typography variant="subtitle1" component="h2">
                                    Category Code
                                </Typography>
                            </Grid> */}
                                <Grid item>
                                    <TextField
                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                        label="Code"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        sx={{
                                            width: { sm: 200, md: 300 },
                                            '& .MuiInputBase-root': {
                                                height: 40
                                            }
                                        }}
                                        type="text"
                                        className="txt"
                                        id="code"
                                        name="code"
                                        onChange={handleInputChange}
                                        error={(error && formValues.code.length === 0) || duplicateError}
                                        helperText={
                                            error && formValues.code.length === 0
                                                ? 'Required Field'
                                                : '' || duplicateError
                                                ? 'Code Already Exists'
                                                : ''
                                        }
                                        value={formValues.code}
                                        onBlur={(e) => checkTourTypeCode(e)}
                                    />
                                </Grid>

                                <Grid item>
                                    <TextField
                                        // label={tourDescription}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        sx={{
                                            width: { sm: 200, md: 300 },
                                            '& .MuiInputBase-root': {
                                                height: 40
                                            }
                                        }}
                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                        label="Description"
                                        id="name"
                                        name="name"
                                        type="text"
                                        onChange={handleInputChange}
                                        error={error && formValues.name.length === 0}
                                        helperText={error && formValues.name.length === 0 ? 'Required Field' : ''}
                                        value={formValues.name}
                                    />
                                </Grid>

                                <Grid item>
                                    <Grid item>
                                        <FormGroup>
                                            <FormControlLabel
                                                name="tourOperator"
                                                control={<Switch color="success" />}
                                                label="Tour Operator Included"
                                                disabled={mode == 'VIEW'}
                                                onChange={handleInputChange}
                                                value={formValues.tourOperator}
                                                checked={formValues.tourOperator}
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>

                                <Grid item>
                                    <Grid item>
                                        <FormGroup>
                                            <FormControlLabel
                                                name="status"
                                                control={<Switch color="success" />}
                                                label="Status"
                                                disabled={mode == 'VIEW'}
                                                onChange={handleInputChange}
                                                value={formValues.status}
                                                checked={formValues.status}
                                            />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                                {mode === 'VIEW' ? <CreatedUpdatedUserDetails formValues={formValues} mode={mode} /> : null}
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className="btnSave"
                            variant="contained"
                            type="submit"
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
                            onClick={clearForm}
                        >
                            CLEAR
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
        // <div>
        //     <Dialog open={open} TransitionComponent={Transition} keepMounted aria-describedby="alert-dialog-slide-description">
        //         <DialogTitle>
        //             <Box display="flex" alignItems="center" className="dialog-title">
        //                 <Box flexGrow={1}>
        //                     {(() => {
        //                         if (mode === 'INSERT') {
        //                             return 'Add Tour Type';
        //                             // <Text>Add</Text>
        //                         } else if (mode === 'VIEW') {
        //                             return 'View Tour Type';
        //                         } else {
        //                             return 'Edit Tour Type';
        //                         }

        //                         return null;
        //                     })()}

        //                     {/* {mode === "INSERT" ? "Add " : "Edit "} Tour Category */}
        //                 </Box>
        //                 <Box>
        //                     <IconButton onClick={handleClose}>
        //                         <CloseIcon />
        //                     </IconButton>
        //                 </Box>
        //             </Box>
        //         </DialogTitle>

        //         <Formik
        //             //initialValues={{ ...formValues }}
        //             initialValues={loadValues || formValues}
        //             enableReinitialize={true}
        //             validationSchema={validationSchema}
        //             onSubmit={handleSubmitForm}
        //         >
        //             {(props) => (
        //                 <Form noValidate>
        //                     <DialogContent>
        //                         <div>
        //                             <Grid container direction="column" gap={'15px'} justifyContent="center" alignContent="center">
        //                                 <Grid item>
        //                                     <Typography variant="subtitle1" component="h2">
        //                                         Code
        //                                     </Typography>
        //                                 </Grid>

        //                                 <Grid item>
        //                                     <Field
        //                                         as={TextField}
        //                                         name="code"
        //                                         disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
        //                                         fullWidth
        //                                         sx={{
        //                                             width: { sm: 200, md: 300 },
        //                                             '& .MuiInputBase-root': {
        //                                                 height: 30
        //                                             }
        //                                         }}
        //                                         error={props.errors.code && props.touched.code}
        //                                         // helperText={
        //                                         //   error && formValues.tourCategoryCode.length === 0
        //                                         //     ? "Required Field"
        //                                         //     : "" || duplicateError
        //                                         //     ? "Category Code Already Exists"
        //                                         //     : ""
        //                                         // }
        //                                         helperText={<ErrorMessage name="code" value="" />}
        //                                         required
        //                                         // onBlur={(e) => checkDuplicateProductCode(e)}
        //                                     />
        //                                 </Grid>

        //                                 <Grid item>
        //                                     <Typography variant="subtitle1" component="h2">
        //                                         Name
        //                                     </Typography>
        //                                 </Grid>

        //                                 <Grid item>
        //                                     <Field
        //                                         as={TextField}
        //                                         name="name"
        //                                         sx={{
        //                                             width: { sm: 200, md: 300 },
        //                                             '& .MuiInputBase-root': {
        //                                                 height: 30
        //                                             }
        //                                         }}
        //                                         disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
        //                                         error={props.errors.name && props.touched.name}
        //                                         helperText={<ErrorMessage name="name" value={formValues.name} />}
        //                                         values={props.values.name}
        //                                         required
        //                                     />
        //                                 </Grid>

        //                                 <Grid item>
        //                                     <FormGroup>
        //                                         <FormControlLabel
        //                                             name="status"
        //                                             onChange={handleInputChange}
        //                                             value={formValues.status}
        //                                             control={<Switch color="success" />}
        //                                             label="Status"
        //                                             checked={formValues.status}
        //                                             disabled={mode == 'VIEW'}
        //                                         />
        //                                     </FormGroup>
        //                                 </Grid>
        //                                 {mode === 'VIEW' ? <CreatedUpdatedUserDetails formValues={props.values} mode={mode} /> : null}
        //                             </Grid>
        //                         </div>
        //                     </DialogContent>
        //                     <DialogActions>
        //                         <Button
        //                             variant="contained"
        //                             type="submit"
        //                             style={{
        //                                 display: mode == 'VIEW' ? 'none' : 'block'
        //                             }}
        //                             className="btnSave"
        //                         >
        //                             {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
        //                         </Button>
        //                         <Button
        //                             variant="outlined"
        //                             type="button"
        //                             style={{
        //                                 //   backgroundColor: '#B22222',
        //                                 display: mode == 'VIEW' ? 'none' : 'block'
        //                             }}
        //                             // onClick={clearForm}
        //                             onClick={handleReset.bind(null, props.resetForm)}
        //                         >
        //                             Cancel
        //                         </Button>
        //                     </DialogActions>
        //                 </Form>
        //             )}
        //         </Formik>
        //     </Dialog>
        // </div>
    );
}

export default TourType;
