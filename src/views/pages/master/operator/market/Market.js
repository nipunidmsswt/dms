import React from 'react';
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
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, forwardRef, useState, Fragment, useRef } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkDuplicateMarketsCode,
    getMarketDetailsByCode,
    saveMarketData,
    updateMarketData
} from 'store/actions/masterActions/operatorActions/MarketAction';
import { getAllActiveManagerData } from 'store/actions/masterActions/operatorActions/ManagerAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

const Market = ({ open, handleClose, mode, marketCode }) => {
    const initialValues1 = {
        code: '',
        name: '',
        manager: null,
        status: true
    };

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveMarketData(data));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateMarketData(data));
        }
        handleClose();
    };

    const managerListData = useSelector((state) => state.managerReducer.activeManagerList);
    const [loadValues, setLoadValues] = useState(null);
    const ref = useRef(null);
    const [clusterListOptions, setManagerListOptions] = useState([]);
    const dispatch = useDispatch();
    const managerToUpdate = useSelector((state) => state.managerReducer.managerToUpdate);

    const marketToUpdate = useSelector((state) => state.marketReducer.marketToUpdate);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && marketToUpdate != null) || (mode === 'VIEW' && marketToUpdate != null)) {
            setLoadValues(marketToUpdate);
        }
    }, [marketToUpdate]);

    useEffect(() => {
        if (managerListData != null) {
            setManagerListOptions(managerListData);
        }
    }, [managerListData]);

    const duplicateCode = useSelector((state) => state.marketReducer.duplicateCode);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getMarketDetailsByCode(marketCode));
        }
    }, [mode]);

    useEffect(() => {
        dispatch(getAllActiveManagerData());
    }, []);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && managerToUpdate != null) || (mode === 'VIEW' && managerToUpdate != null)) {
            setLoadValues(managerToUpdate);
        }
    }, [managerToUpdate]);

    yup.addMethod(yup.string, 'checkDuplicateMarketCode', function (message) {
        return this.test('checkDuplicateMarketCode', 'Duplicate Market Code', async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    dispatch(checkDuplicateMarketsCode(value));

                    if (duplicateCode != null && duplicateCode.errorMessages.length != 0) {
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
        code: yup.string().required('Required field').checkDuplicateMarketCode('ggg'),
        name: yup.string().required('Required field')
    });

    var handleReset = (values, formProps) => {
        // return window.confirm('Reset?'); // still resets after you Cancel :(
    };

    return (
        <div>
            <Dialog
                maxWidth="100px"
                open={open}
                keepMounted
                onClose={handleClose}
                // maxWidth="sm"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Market
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
                                                initialValues={loadValues || initialValues1}
                                                onSubmit={(values) => {
                                                    handleSubmitForm(values);
                                                }}
                                                onReset={handleReset}
                                                validationSchema={validationSchema}
                                            >
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Market Code"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="code"
                                                                            value={values.code}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.code && errors.code)}
                                                                            helperText={touched.code && errors.code ? errors.code : ''}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Name"
                                                                            name="name"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.name}
                                                                            error={Boolean(touched.name && errors.name)}
                                                                            helperText={touched.name && errors.name ? errors.name : ''}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <br />

                                                                <Grid gap="10px" display="flex">
                                                                    <Grid>
                                                                        <Autocomplete
                                                                            value={values.manager}
                                                                            name="manager"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={(_, value) => {
                                                                                setFieldValue(`manager`, value);
                                                                            }}
                                                                            options={clusterListOptions}
                                                                            getOptionLabel={(option) =>
                                                                                `${option.code} - ${option.shortName}`
                                                                            }
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    // label="tax"
                                                                                    sx={{
                                                                                        width: { sm: 300 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 41
                                                                                        }
                                                                                    }}
                                                                                    placeholder="--Select a Manager Code --"
                                                                                    variant="outlined"
                                                                                    name="manager"
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>

                                                                    <Grid>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Manager Name"
                                                                            //   name="shortName"
                                                                            disabled
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={
                                                                                values.manager && values.manager
                                                                                    ? values.manager.shortName
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <br />
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <Typography variant="" component="p">
                                                                            Status
                                                                        </Typography>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                control={
                                                                                    <Checkbox
                                                                                        name="status"
                                                                                        onChange={handleChange}
                                                                                        checked={values.status}
                                                                                        value={values.status}
                                                                                        disabled={mode == 'VIEW'}
                                                                                    />
                                                                                }
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>

                                                            {/* <br /> */}
                                                            <Box>
                                                                <Grid item>
                                                                    {mode === 'VIEW' ? (
                                                                        <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                    ) : null}
                                                                </Grid>
                                                            </Box>

                                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                                {mode != 'VIEW' ? (
                                                                    <Button
                                                                        variant="outlined"
                                                                        type="reset"
                                                                        style={{
                                                                            // backgroundColor: '#B22222',
                                                                            marginLeft: '10px'
                                                                        }}
                                                                        // onClick={handleCancel}
                                                                    >
                                                                        Clear
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
};

export default Market;
