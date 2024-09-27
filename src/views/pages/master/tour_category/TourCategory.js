import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect, forwardRef, useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog,
    Slide,
    DialogActions,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Switch,
    Button,
    Typography,
    Grid
} from '@mui/material';

import './tourCategory.scss';
import {
    checkDuplicateTourCategoryCode,
    getTourCategoryDataById,
    saveTourCategoryData,
    updateTourCategoryData
} from 'store/actions/masterActions/TourCategoryActions';
import CreatedUpdatedUserDetails from '../userTimeDetails/CreatedUpdatedUserDetails';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function TourCategory({ open, handleClose, mode, rowTourCategoryCode }) {
    const initialValues = {
        tourCategoryCode: '',
        name: '',
        status: true,
        createdBy: 'admin'
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [error, setError] = useState(false);
    const [duplicateError, setDuplicateError] = useState(false);
    // const inputRef = useRef(null);
    const inputRef = React.useRef < HTMLInputElement > null;

    const duplicateTourCategory = useSelector((state) => state.tourCategoryReducer.duplicateTourCategory);

    const tourToUpdate = useSelector((state) => state.tourCategoryReducer.tourToUpdate);

    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const tourCode = (
        <p>
            Tour Code<span style={{ color: 'red' }}>*</span>
        </p>
    );
    const tourDescription = (
        <p>
            Tour Description<span style={{ color: 'red' }}>*</span>
        </p>
    );

    useEffect(() => {
        if (duplicateTourCategory != null) {
            if (duplicateTourCategory.length != 0) {
                let data = [];
                setDuplicateError(true);
            } else {
                let data = null;
                setDuplicateError(false);
            }
        }
    }, [duplicateTourCategory]);

    const DynamicElement = () => {
        // const createdDateTime=formValues.createdDate.replace("T"," ").substring(0, formValues.createdDate.indexOf('.'))
        // const updatedDateTime=formValues.updatedDate.replace("T"," ").substring(0, rowData.updatedDate.indexOf('.'))
        return (
            <Fragment>
                <Grid item>
                    <Typography variant="subtitle1" component="h2" hidden={mode == 'VIEW' ? false : true}>
                        Created Date
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        disabled
                        className="txt"
                        style={{ display: mode == 'VIEW' ? 'block' : 'none' }}
                        sx={{
                            width: { sm: 200, md: 300 },
                            '& .MuiInputBase-root': {
                                height: 30
                            }
                        }}
                        type="text"
                        onChange={handleInputChange}
                        value={formValues.createdDate}
                    />
                </Grid>

                <Grid item>
                    <Typography variant="subtitle1" component="h2" hidden={mode == 'VIEW' ? false : true}>
                        Created User
                    </Typography>
                </Grid>

                <Grid item>
                    <TextField
                        disabled
                        style={{ display: mode == 'VIEW' ? 'block' : 'none' }}
                        sx={{
                            width: { sm: 200, md: 300 },
                            '& .MuiInputBase-root': {
                                height: 30
                            }
                        }}
                        type="text"
                        onChange={handleInputChange}
                        value={formValues.createdBy}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" component="h2" hidden={mode == 'VIEW' ? false : true}>
                        Updated Date
                    </Typography>
                </Grid>

                <Grid item>
                    <TextField
                        disabled
                        style={{ display: mode == 'VIEW' ? 'block' : 'none' }}
                        sx={{
                            width: { sm: 200, md: 300 },
                            '& .MuiInputBase-root': {
                                height: 30
                            }
                        }}
                        type="text"
                        onChange={handleInputChange}
                        value={formValues.updatedDate}
                    />
                </Grid>

                <Grid item>
                    <Typography variant="subtitle1" component="h2" hidden={mode == 'VIEW' ? false : true}>
                        Updated User
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        disabled
                        style={{ display: mode == 'VIEW' ? 'block' : 'none' }}
                        sx={{
                            width: { sm: 200, md: 300 },
                            '& .MuiInputBase-root': {
                                height: 30
                            }
                        }}
                        type="text"
                        onChange={handleInputChange}
                        value={formValues.updatedBy}
                    />
                </Grid>
            </Fragment>
            // <li onClick={()=>alert(0)} className="dynamic-link">I am New</li>
        );
    };

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && tourToUpdate != null) || (mode === 'VIEW' && tourToUpdate != null)) {
            setFormValues(tourToUpdate);
        }
    }, [tourToUpdate]);

    useEffect(() => {
        console.log('mode:' + mode);
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getTourCategoryDataById(rowTourCategoryCode));
        }
        setDuplicateError(false);
    }, [mode]);

    const checkDuplicateTourCode = (e) => {
        if (e.target.value != '') {
            dispatch(checkDuplicateTourCategoryCode(formValues.tourCategoryCode));
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (formValues.tourCategoryCode.length == 0 || formValues.name.length == 0) {
            setError(true);
        } else {
            if (mode === 'INSERT') {
                dispatch(saveTourCategoryData(formValues));
            } else if (mode === 'VIEW_UPDATE') {
                dispatch(updateTourCategoryData(formValues));
            }

            handleClose();
            setDuplicateError(false);
        }
    };

    const clearForm = () => {
        if (mode == 'INSERT') {
            setFormValues(initialValues);
        } else {
            setFormValues(tourToUpdate);
        }
        setDuplicateError(false);
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
                                    return 'Add Tour Category';
                                    // <Text>Add</Text>
                                } else if (mode === 'VIEW') {
                                    return 'View Tour Category';
                                } else {
                                    return 'Edit Tour Category';
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
                                        // autoFocus
                                        // label={tourCode}
                                        label="Tour Code"
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
                                        id="tourCategoryCode"
                                        name="tourCategoryCode"
                                        onChange={handleInputChange}
                                        error={(error && formValues.tourCategoryCode.length === 0) || duplicateError}
                                        helperText={
                                            error && formValues.tourCategoryCode.length === 0
                                                ? 'Required Field'
                                                : '' || duplicateError
                                                ? 'Category Code Already Exists'
                                                : ''
                                        }
                                        value={formValues.tourCategoryCode}
                                        onBlur={(e) => checkDuplicateTourCode(e)}
                                    />
                                </Grid>
                                {/* <Grid item>
                                    <Typography variant="subtitle1" component="h2">
                                        Category Description
                                    </Typography>
                                </Grid> */}
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
                                        {/* <Typography variant="subtitle1" component="h2">
                                            Status
                                        </Typography> */}

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

                                {/* {mode === "VIEW" ? <DynamicElement /> : null} */}
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
    );
}

export default TourCategory;
