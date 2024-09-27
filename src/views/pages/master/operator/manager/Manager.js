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
    checkDuplicateManagersCode,
    getManagerDetailsByCode,
    saveManagerData,
    updateManagerData
} from 'store/actions/masterActions/operatorActions/ManagerAction';
import { getAllClusterData } from 'store/actions/masterActions/CodeAndNameAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

const Manager = ({ open, handleClose, mode, managerCode }) => {
    const initialValues1 = {
        code: '',
        initials: '',
        surName: '',
        shortName: '',
        address: '',
        codeAndNameDetail: null,
        status: true,
        managerAdditionalDetails: [
            {
                homeTelNumber: '',
                officeTelNumber: '',
                fax1: '',
                fax2: ''
            }
        ]
    };

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveManagerData(data));
        } else if (mode === 'VIEW_UPDATE') {
            // console.log("yes click");
            dispatch(updateManagerData(data));
        }
        handleClose();
    };

    const clusterListData = useSelector((state) => state.codeAndNameReducer.cluterTypesDetails);
    const [loadValues, setLoadValues] = useState(null);
    const ref = useRef(null);
    const [clusterListOptions, setClusterListOptions] = useState([]);
    const dispatch = useDispatch();
    const managerToUpdate = useSelector((state) => state.managerReducer.managerToUpdate);

    useEffect(() => {
        console.log('data:' + clusterListData);
        if (clusterListData != null) {
            console.log('data 678:' + clusterListData.codeAndNameDetail);
            setClusterListOptions(clusterListData);
        }
    }, [clusterListData]);

    const duplicateCode = useSelector((state) => state.managerReducer.duplicateCode);

    useEffect(() => {
        dispatch(getAllClusterData());
    }, []);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && managerToUpdate != null) || (mode === 'VIEW' && managerToUpdate != null)) {
            setLoadValues(managerToUpdate);
        }
    }, [managerToUpdate]);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log('ccode get by id called:' + managerCode);
            dispatch(getManagerDetailsByCode(managerCode));
        }
    }, [mode]);

    yup.addMethod(yup.string, 'checkDuplicateManagerCode', function (message) {
        return this.test('checkDuplicateManagerCode', 'Duplicate Manager Code', async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    dispatch(checkDuplicateManagersCode(value));

                    if (duplicateCode != null && duplicateCode.errorMessages.length != 0) {
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

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = yup.object().shape({
        code: yup.string().required('Required field').checkDuplicateManagerCode('ggg'),
        shortName: yup.string().required('Required field'),
        managerAdditionalDetails: yup.array().of(
            yup.object().shape({
                homeTelNumber: yup.string().matches(phoneRegExp, ' Not valid').min(10, 'Must be  10 digits').max(10, 'Must be  10 digits'),
                officeTelNumber: yup
                    .string()
                    .matches(phoneRegExp, 'Not valid')
                    .min(10, 'Must be exactly 10 digits')
                    .max(10, 'Must be 10 digits'),
                fax1: yup.string(),
                fax2: yup.string()
            })
        )
    });

    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
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
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Manager
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
                                                validationSchema={validationSchema}
                                            >
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Manager Code"
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
                                                                            label="Initials"
                                                                            name="initials"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.initials}
                                                                            error={Boolean(touched.initials && errors.initials)}
                                                                            helperText={
                                                                                touched.initials && errors.initials ? errors.initials : ''
                                                                            }
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
                                                                            label="Sur Name"
                                                                            name="surName"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            disabled={mode == 'VIEW'}
                                                                            value={values.surName}
                                                                            error={Boolean(touched.surName && errors.surName)}
                                                                            helperText={
                                                                                touched.surName && errors.surName ? errors.surName : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <br />

                                                                <Grid gap="10px" display="flex">
                                                                    <Grid>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Short Name"
                                                                            name="shortName"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.shortName}
                                                                            error={Boolean(touched.shortName && errors.shortName)}
                                                                            helperText={
                                                                                touched.shortName && errors.shortName
                                                                                    ? errors.shortName
                                                                                    : ''
                                                                            }
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
                                                                            label="Address"
                                                                            name="address"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.address}
                                                                            error={Boolean(touched.address && errors.address)}
                                                                            helperText={
                                                                                touched.address && errors.address ? errors.address : ''
                                                                            }
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.codeAndNameDetail}
                                                                            name="codeAndNameDetail"
                                                                            onChange={(_, value) => {
                                                                                console.log(values.codeAndNameDetail);
                                                                                setFieldValue(`codeAndNameDetail`, value);
                                                                            }}
                                                                            options={clusterListOptions.codeAndNameDetails}
                                                                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
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
                                                                                    placeholder="--Select a Cluster Type --"
                                                                                    variant="outlined"
                                                                                    name="codeAndNameDetail"
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <br />
                                                                {/* <Grid gap="10px" display="flex">
                                  <Grid item> */}
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
                                                            </div>

                                                            <FieldArray name="managerAdditionalDetails">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        <Box
                                                                            sx={{ fontWeight: 500, fontSize: 'h6.fontSize' }}
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            justifyContent="center"
                                                                        >
                                                                            Additional Manager Details
                                                                        </Box>

                                                                        {/* </DialogTitle> */}
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    onClick={() => {
                                                                                        push({
                                                                                            homeTelNumber: '',
                                                                                            officeTelNumber: '',
                                                                                            fax1: '',
                                                                                            fax2: '',
                                                                                            status: true
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    {/* {mode === "INSERT" ? ( */}
                                                                                    <AddBoxIcon />
                                                                                    {/* ) : null} */}
                                                                                </IconButton>
                                                                            </Box>
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                        <TableContainer>
                                                                            <Table stickyHeader size="small">
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell>Sequence</TableCell>
                                                                                        <TableCell>Home Number</TableCell>
                                                                                        <TableCell>Office Number</TableCell>
                                                                                        <TableCell>Fax 1</TableCell>
                                                                                        <TableCell>Fax 2</TableCell>
                                                                                        {/* <TableCell>
                                              Fax
                                            </TableCell> */}
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.managerAdditionalDetails.map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                <TableCell>{idx + 1}</TableCell>
                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 150 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 35
                                                                                                            }
                                                                                                        }}
                                                                                                        variant="outlined"
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                        name={`managerAdditionalDetails.${idx}.homeTelNumber`}
                                                                                                        value={
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].homeTelNumber
                                                                                                        }
                                                                                                        error={Boolean(
                                                                                                            touched.managerAdditionalDetails &&
                                                                                                                touched
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ].homeTelNumber &&
                                                                                                                errors.managerAdditionalDetails &&
                                                                                                                errors
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ].homeTelNumber
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.managerAdditionalDetails &&
                                                                                                            touched
                                                                                                                .managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched
                                                                                                                .managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].homeTelNumber &&
                                                                                                            errors.managerAdditionalDetails &&
                                                                                                            errors.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].homeTelNumber
                                                                                                                ? errors
                                                                                                                      .managerAdditionalDetails[
                                                                                                                      idx
                                                                                                                  ].homeTelNumber
                                                                                                                : ''
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 150 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 35
                                                                                                            }
                                                                                                        }}
                                                                                                        variant="outlined"
                                                                                                        name={`managerAdditionalDetails.${idx}.officeTelNumber`}
                                                                                                        value={
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].officeTelNumber
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.managerAdditionalDetails &&
                                                                                                                touched
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ].officeTelNumber &&
                                                                                                                errors.managerAdditionalDetails &&
                                                                                                                errors
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors
                                                                                                                    .managerAdditionalDetails[
                                                                                                                    idx
                                                                                                                ].officeTelNumber
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.managerAdditionalDetails &&
                                                                                                            touched
                                                                                                                .managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched
                                                                                                                .managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].officeTelNumber &&
                                                                                                            errors.managerAdditionalDetails &&
                                                                                                            errors.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].officeTelNumber
                                                                                                                ? errors
                                                                                                                      .managerAdditionalDetails[
                                                                                                                      idx
                                                                                                                  ].officeTelNumber
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 150 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 35
                                                                                                            }
                                                                                                        }}
                                                                                                        variant="outlined"
                                                                                                        name={`managerAdditionalDetails.${idx}.fax1`}
                                                                                                        value={
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].fax1
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 150 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 35
                                                                                                            }
                                                                                                        }}
                                                                                                        variant="outlined"
                                                                                                        name={`managerAdditionalDetails.${idx}.fax2`}
                                                                                                        value={
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.managerAdditionalDetails[
                                                                                                                idx
                                                                                                            ].fax2
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <IconButton
                                                                                                        aria-label="delete"
                                                                                                        onClick={() => {
                                                                                                            remove(idx);
                                                                                                        }}
                                                                                                        disabled={mode == 'VIEW'}
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
                                                            <br />
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
                                                                        type="button"
                                                                        style={{
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

export default Manager;
