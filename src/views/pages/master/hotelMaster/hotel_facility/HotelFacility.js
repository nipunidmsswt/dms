import { useEffect, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Switch
} from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    saveHotelFacilityData,
    getHotelFacilityDataById,
    updateHotelFacilityData,
    checkDuplicateHotelFacilityCode,
    getAllFacilityTypes
} from 'store/actions/masterActions/HotelFacilityAction';
import Autocomplete from '@mui/material/Autocomplete';
import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

function HotelFacility({ open, handleClose, mode, hotelFacilityId }) {
    const initialValues1 = {
        hotelFacilityType: null,
        status: true,
        hotelFacilityDetails: [
            {
                code: '',
                name: '',
                status: true
            }
        ]
    };

    const [hotelFacilityTypes, setHotelFacilityTypes] = useState([]);
    const [loadValues, setLoadValues] = useState(null);

    yup.addMethod(yup.array, 'uniqueCode', function (message) {
        return this.test('uniqueCode', message, function (list) {
            console.log(list);
            const mapper = (x) => {
                return x.code;
            };
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length === set.length;
            if (isUnique) {
                return true;
            }

            const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `hotelFacilityDetails[${idx}].code`,
                message: message
            });
        });
    });

    yup.addMethod(yup.array, 'checkDuplicateCode', function (message) {
        return this.test('checkDuplicateCode', message, async function (list) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateHotelFacilityCode(value));

                    if (duplicateHotelFacility != null && duplicateHotelFacility.errorMessages.length != 0) {
                        const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
                        return this.createError({
                            path: `hotelFacilityDetails[${idx}].code`,
                            message: message
                        });
                    } else {
                        return true;
                    }
                    return false; // or true as you see fit
                } catch (error) {}
            }
            return true;
        });
    });

    yup.addMethod(yup.string, 'checkDuplicateCode', function (message) {
        return this.test('checkDuplicateCode', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateHotelFacilityCode(value));

                    if (duplicateHotelFacility != null && duplicateHotelFacility.errorMessages.length != 0) {
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
        hotelFacilityType: yup.object().nullable().required('Required field'),
        hotelFacilityDetails: yup
            .array()
            .of(
                yup.object().shape({
                    code: yup.string().required('Required field'),
                    name: yup.string().required('Required field')
                })
            )

            .uniqueCode('Must be unique')
        // .checkDuplicateCode("Code can not be duplicate")
    });

    yup.addMethod(yup.array, 'uniqueTaxCode', function (message) {
        return this.test('uniqueTaxCode', message, function (list) {
            const mapper = (x) => {
                return x.tax?.taxCode;
            };
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length === set.length;
            if (isUnique) {
                return true;
            }

            const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `taxGroupDetails[${idx}].tax`,
                message: message
            });
        });
    });

    //get data from reducers
    const duplicateHotelFacility = useSelector((state) => state.hotelFacilityReducer.duplicateHotelFacility);
    const hotelFacilityToUpdate = useSelector((state) => state.hotelFacilityReducer.hotelFacilityToUpdate);
    const taxListData = useSelector((state) => state.taxReducer.taxes);

    const hotelFacilityTypeList = useSelector((state) => state.hotelFacilityReducer.hotelFacilityTypes);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('update');
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log(hotelFacilityId);
            dispatch(getHotelFacilityDataById(hotelFacilityId));
        }
    }, [mode]);

    useEffect(() => {
        dispatch(getAllFacilityTypes());
    }, []);

    useEffect(() => {
        if (hotelFacilityTypeList != null) {
            console.log(hotelFacilityTypeList);
            setHotelFacilityTypes(hotelFacilityTypeList.length == 0 ? [] : hotelFacilityTypeList.payload[0]);
        }
    }, [hotelFacilityTypeList]);

    useEffect(() => {
        console.log(hotelFacilityToUpdate);

        if ((mode === 'VIEW_UPDATE' && hotelFacilityToUpdate != null) || (mode === 'VIEW' && hotelFacilityToUpdate != null)) {
            const data = {
                hotelFacilityId: hotelFacilityToUpdate.hotelFacilityId,
                hotelFacilityType: hotelFacilityToUpdate.hotelFacilityType,
                status: hotelFacilityToUpdate.status,
                hotelFacilityDetails: [
                    {
                        code: hotelFacilityToUpdate.code,
                        name: hotelFacilityToUpdate.name,
                        status: hotelFacilityToUpdate.status
                    }
                ]
            };
            setLoadValues(data);
        }
    }, [hotelFacilityToUpdate]);

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveHotelFacilityData(data));
        } else if (mode === 'VIEW_UPDATE') {
            console.log('yes click');
            dispatch(updateHotelFacilityData(data));
        }
        handleClose();
    };

    const handleCancel = () => {
        setLoadValues(initialValues1);
    };
    return (
        <div>
            <Dialog maxWidth="220px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Hotel
                            Facility
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
                                                initialValues={loadValues || initialValues1}
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
                                                                        <Autocomplete
                                                                            value={values.hotelFacilityType}
                                                                            name="hotelFacilityType"
                                                                            onChange={(_, value) => {
                                                                                console.log(value);
                                                                                setFieldValue(`hotelFacilityType`, value);
                                                                            }}
                                                                            options={hotelFacilityTypes}
                                                                            disabled={mode == 'VIEW_UPDATE'}
                                                                            getOptionLabel={(option) => `${option.hotelFacilityType}`}
                                                                            isOptionEqualToValue={(option, value) => {
                                                                                console.log(option);
                                                                                console.log(value);
                                                                                return (
                                                                                    option.hotelFacilityTypeId === value.hotelFacilityTypeId
                                                                                );
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    // label="tax"
                                                                                    sx={{
                                                                                        width: { sm: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    placeholder="--Select Facility Type --"
                                                                                    variant="outlined"
                                                                                    name="hotelFacilityType"
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.hotelFacilityType &&
                                                                                            errors.hotelFacilityType
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.hotelFacilityType &&
                                                                                        errors.hotelFacilityType
                                                                                            ? errors.hotelFacilityType
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    {/* <Grid item>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="status"
                                                                                onChange={handleChange}
                                                                                disabled={mode == 'VIEW'}
                                                                                value={values.status}
                                                                                control={<Switch />}
                                                                                label="Status"
                                                                                checked={values.status}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid> */}
                                                                </Grid>
                                                            </div>

                                                            <FieldArray name="hotelFacilityDetails">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                    onClick={() => {
                                                                                        push({
                                                                                            code: '',
                                                                                            name: '',
                                                                                            status: true
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <AddBoxIcon />
                                                                                </IconButton>
                                                                            </Box>
                                                                        ) : (
                                                                            ''
                                                                        )}

                                                                        <TableContainer>
                                                                            <Table stickyHeader size="small">
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell>Code</TableCell>
                                                                                        <TableCell>Name</TableCell>
                                                                                        <TableCell>Status</TableCell>
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.hotelFacilityDetails.map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        // label="taxOrder"
                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        type="text"
                                                                                                        variant="outlined"
                                                                                                        name={`hotelFacilityDetails.${idx}.code`}
                                                                                                        disabled={
                                                                                                            mode == 'VIEW_UPDATE' ||
                                                                                                            mode == 'VIEW'
                                                                                                        }
                                                                                                        value={
                                                                                                            values.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.hotelFacilityDetails[idx]
                                                                                                                .code
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.hotelFacilityDetails &&
                                                                                                                touched
                                                                                                                    .hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched
                                                                                                                    .hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ].code &&
                                                                                                                errors.hotelFacilityDetails &&
                                                                                                                errors.hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ].code
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.hotelFacilityDetails &&
                                                                                                            touched.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ].code &&
                                                                                                            errors.hotelFacilityDetails &&
                                                                                                            errors.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.hotelFacilityDetails[idx]
                                                                                                                .code
                                                                                                                ? errors
                                                                                                                      .hotelFacilityDetails[
                                                                                                                      idx
                                                                                                                  ].code
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            mode == 'VIEW_UPDATE' ||
                                                                                                            mode == 'VIEW'
                                                                                                        }
                                                                                                        type="text"
                                                                                                        variant="outlined"
                                                                                                        name={`hotelFacilityDetails.${idx}.name`}
                                                                                                        value={
                                                                                                            values.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.hotelFacilityDetails[idx]
                                                                                                                .name
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.hotelFacilityDetails &&
                                                                                                                touched
                                                                                                                    .hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched
                                                                                                                    .hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ].name &&
                                                                                                                errors.hotelFacilityDetails &&
                                                                                                                errors.hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.hotelFacilityDetails[
                                                                                                                    idx
                                                                                                                ].name
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.hotelFacilityDetails &&
                                                                                                            touched.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ].name &&
                                                                                                            errors.hotelFacilityDetails &&
                                                                                                            errors.hotelFacilityDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.hotelFacilityDetails[idx]
                                                                                                                .name
                                                                                                                ? errors
                                                                                                                      .hotelFacilityDetails[
                                                                                                                      idx
                                                                                                                  ].name
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        <FormGroup>
                                                                                                            <FormControlLabel
                                                                                                                name={`hotelFacilityDetails.${idx}.status`}
                                                                                                                control={
                                                                                                                    <Switch color="success" />
                                                                                                                }
                                                                                                                label="Status"
                                                                                                                disabled={mode == 'VIEW'}
                                                                                                                onChange={handleChange}
                                                                                                                checked={
                                                                                                                    values
                                                                                                                        .hotelFacilityDetails[
                                                                                                                        idx
                                                                                                                    ].status
                                                                                                                }
                                                                                                                value={
                                                                                                                    values
                                                                                                                        .hotelFacilityDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    values
                                                                                                                        .hotelFacilityDetails[
                                                                                                                        idx
                                                                                                                    ].status
                                                                                                                }
                                                                                                            />
                                                                                                        </FormGroup>
                                                                                                    </FormGroup>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <IconButton
                                                                                                        aria-label="delete"
                                                                                                        onClick={() => {
                                                                                                            remove(idx);
                                                                                                        }}
                                                                                                    >
                                                                                                        <HighlightOffIcon />
                                                                                                    </IconButton>
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    </Paper>
                                                                )}
                                                            </FieldArray>
                                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                                {mode != 'VIEW' ? (
                                                                    <Button
                                                                        variant="outlined"
                                                                        type="button"
                                                                        style={{
                                                                            // backgroundColor: '#B22222',
                                                                            marginLeft: '10px'
                                                                        }}
                                                                        onClick={handleCancel}
                                                                    >
                                                                        CLEAR
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
                                                            <Box>
                                                                <Grid item>
                                                                    {mode === 'VIEW' ? (
                                                                        <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                    ) : null}
                                                                </Grid>
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

export default HotelFacility;
