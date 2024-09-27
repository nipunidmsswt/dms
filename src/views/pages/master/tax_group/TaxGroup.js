import { useEffect, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    Switch,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    DialogContentText,
    Button,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    DialogActions
} from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    saveTaxGroupData,
    getTaxGroupDataById,
    updateTaxGroupData,
    checkDuplicateTaxGroupCode
} from '../../../../store/actions/masterActions/TaxActions/TaxGroupAction';

import { Formik, Form, FieldArray } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';
import { getAllTaxData } from '../../../../store/actions/masterActions/TaxActions/TaxAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import { array } from 'prop-types';

function TaxGroup({ open, handleClose, mode, taxGroupCode }) {
    const initialValues = {
        taxGroupType: '',
        taxGroupCode: '',
        description: '',
        status: true,
        taxGroupDetails: [
            {
                tax: null,
                taxOrder: '',
                // onOriginal: '',
                status: true
            }
        ]
    };

    const [taxListOptions, setTaxListOptions] = useState([]);
    const [loadValues, setLoadValues] = useState(null);
    const [openDialogBox, setOpenDialogBox] = useState(false);

    yup.addMethod(yup.array, 'uniqueTaxOrder', function (message) {
        return this.test('uniqueTaxOrder', message, function (list) {
            const mapper = (x) => {
                return x.taxOrder;
            };
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length === set.length;
            if (isUnique) {
                return true;
            }

            const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `taxGroupDetails[${idx}].taxOrder`,
                message: message
            });
        });
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

    yup.addMethod(yup.string, 'checkDuplicateTaxGroup', function (message) {
        return this.test('checkDuplicateTaxGroup', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateTaxGroupCode(value));

                    if (duplicateTaxGroup != null && duplicateTaxGroup.errorMessages.length != 0) {
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
        taxGroupType: yup.string().required('Required field'),
        taxGroupCode: yup.string().required('Required field').checkDuplicateTaxGroup('Duplicate Code'),
        description: yup.string().required('Required field'),

        taxGroupDetails: yup
            .array()
            .of(
                yup.object().shape({
                    tax: yup.object().typeError('Required field'),
                    taxOrder: yup.number().positive('Must be greater than zero')
                    // onOriginal: yup.string().required('Required field')
                })
            )
            .uniqueTaxOrder('Must be unique')
            .uniqueTaxCode('Must be unique')
    });

    //get data from reducers
    const duplicateTax = useSelector((state) => state.taxReducer.duplicateTax);
    const taxGroupToUpdate = useSelector((state) => state.taxGroupReducer.taxGroupToUpdate);
    const taxListData = useSelector((state) => state.taxReducer.taxes);
    const duplicateTaxGroup = useSelector((state) => state.taxGroupReducer.duplicateTaxGroup);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('update');
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log(taxGroupCode);
            dispatch(getTaxGroupDataById(taxGroupCode));
        }
    }, [mode]);

    useEffect(() => {
        if (taxListData != null) {
            setTaxListOptions(taxListData);
        }
    }, [taxListData]);

    useEffect(() => {
        console.log(taxGroupToUpdate);

        if ((mode === 'VIEW_UPDATE' && taxGroupToUpdate != null) || (mode === 'VIEW' && taxGroupToUpdate != null)) {
            setLoadValues(taxGroupToUpdate);
        }
    }, [taxGroupToUpdate]);

    const checkValidArray = (arry) => {
        arry.sort();
        let n = arry.length;

        for (var i = 1; i < n; i++) {
            if (arry[i] != arry[i - 1] + 1) {
                return false;
            }
        }
        return true;
    };
    const handleSubmitForm = (data) => {
        console.log(data);
        let arry = [];
        data.taxGroupDetails.map((data) => {
            arry.push(+data.taxOrder);
        });
        const result = checkValidArray(arry);
        console.log(result);
        if (result === true) {
            setOpenDialogBox(false);
            if (mode === 'INSERT') {
                dispatch(saveTaxGroupData(data));
            } else if (mode === 'VIEW_UPDATE') {
                console.log('yes click');
                dispatch(updateTaxGroupData(data));
            }
            handleClose();
        } else {
            setOpenDialogBox(true);
        }
    };

    useEffect(() => {
        dispatch(getAllTaxData());
    }, []);

    const handleCancel = () => {
        setLoadValues(initialValues);
    };
    return (
        <div>
            <Dialog maxWidth="220px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Tax
                            Group
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
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="standard-select-currency"
                                                                            select
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            label="Tax Group Type"
                                                                            name="taxGroupType"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.taxGroupType}
                                                                            error={Boolean(touched.taxGroupType && errors.taxGroupType)}
                                                                            helperText={
                                                                                touched.taxGroupType && errors.taxGroupType
                                                                                    ? errors.taxGroupType
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            <MenuItem dense={true} value={'Sell'}>
                                                                                Sell
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'Buy'}>
                                                                                Buy
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            label="Tax Group Code"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="taxGroupCode"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.taxGroupCode}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.taxGroupCode && errors.taxGroupCode)}
                                                                            helperText={
                                                                                touched.taxGroupCode && errors.taxGroupCode
                                                                                    ? errors.taxGroupCode
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid>
                                                                        <TextField
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="description"
                                                                            name="description"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.description}
                                                                            error={Boolean(touched.description && errors.description)}
                                                                            helperText={
                                                                                touched.description && errors.description
                                                                                    ? errors.description
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>

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
                                                            </div>

                                                            <FieldArray name="taxGroupDetails">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                    onClick={() => {
                                                                                        // setFieldValue(
                                                                                        //   `taxGroupDetails.${ref.current.values.taxGroupDetails.length}.taxOrder`,
                                                                                        //   ref.current.values.taxGroupDetails.length+1
                                                                                        // );
                                                                                        push({
                                                                                            tax: null,
                                                                                            taxOrder: '',
                                                                                            // onOriginal: '',
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
                                                                                        <TableCell>Tax Order</TableCell>
                                                                                        <TableCell>Tax Code</TableCell>
                                                                                        <TableCell>Tax %</TableCell>
                                                                                        {/* <TableCell>Tax % on original</TableCell> */}
                                                                                        <TableCell>Status</TableCell>
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.taxGroupDetails.map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        // label="taxOrder"
                                                                                                        disabled={
                                                                                                            mode == 'VIEW_UPDATE' ||
                                                                                                            mode == 'VIEW'
                                                                                                        }
                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        type="number"
                                                                                                        variant="outlined"
                                                                                                        placeholder="0"
                                                                                                        name={`taxGroupDetails.${idx}.taxOrder`}
                                                                                                        value={
                                                                                                            values.taxGroupDetails[idx] &&
                                                                                                            values.taxGroupDetails[idx]
                                                                                                                .taxOrder
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.taxGroupDetails &&
                                                                                                                touched.taxGroupDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.taxGroupDetails[idx]
                                                                                                                    .taxOrder &&
                                                                                                                errors.taxGroupDetails &&
                                                                                                                errors.taxGroupDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.taxGroupDetails[idx]
                                                                                                                    .taxOrder
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.taxGroupDetails &&
                                                                                                            touched.taxGroupDetails[idx] &&
                                                                                                            touched.taxGroupDetails[idx]
                                                                                                                .taxOrder &&
                                                                                                            errors.taxGroupDetails &&
                                                                                                            errors.taxGroupDetails[idx] &&
                                                                                                            errors.taxGroupDetails[idx]
                                                                                                                .taxOrder
                                                                                                                ? errors.taxGroupDetails[
                                                                                                                      idx
                                                                                                                  ].taxOrder
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <Autocomplete
                                                                                                        disabled={
                                                                                                            mode == 'VIEW_UPDATE' ||
                                                                                                            mode == 'VIEW'
                                                                                                        }
                                                                                                        value={
                                                                                                            values.taxGroupDetails[idx]
                                                                                                                ? values.taxGroupDetails[
                                                                                                                      idx
                                                                                                                  ].tax
                                                                                                                : null
                                                                                                        }
                                                                                                        name={`taxGroupDetails.${idx}.tax`}
                                                                                                        onChange={(_, value) => {
                                                                                                            console.log(value);
                                                                                                            setFieldValue(
                                                                                                                `taxGroupDetails.${idx}.tax`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        options={taxListOptions}
                                                                                                        getOptionLabel={(option) =>
                                                                                                            `${option.taxCode} - (${option.taxDescription})`
                                                                                                        }
                                                                                                        isOptionEqualToValue={(
                                                                                                            option,
                                                                                                            value
                                                                                                        ) => option.taxId === value.taxId}
                                                                                                        renderInput={(params) => (
                                                                                                            <TextField
                                                                                                                {...params}
                                                                                                                // label="tax"

                                                                                                                sx={{
                                                                                                                    width: { sm: 200 },
                                                                                                                    '& .MuiInputBase-root':
                                                                                                                        {
                                                                                                                            height: 40
                                                                                                                        }
                                                                                                                }}
                                                                                                                placeholder="--Select a Tax Code --"
                                                                                                                variant="outlined"
                                                                                                                name={`taxGroupDetails.${idx}.tax`}
                                                                                                                onBlur={handleBlur}
                                                                                                                helperText={
                                                                                                                    touched.taxGroupDetails &&
                                                                                                                    touched.taxGroupDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched.taxGroupDetails[
                                                                                                                        idx
                                                                                                                    ].tax &&
                                                                                                                    errors.taxGroupDetails &&
                                                                                                                    errors.taxGroupDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors.taxGroupDetails[
                                                                                                                        idx
                                                                                                                    ].tax
                                                                                                                        ? errors
                                                                                                                              .taxGroupDetails[
                                                                                                                              idx
                                                                                                                          ].tax
                                                                                                                        : ''
                                                                                                                }
                                                                                                                error={Boolean(
                                                                                                                    touched.taxGroupDetails &&
                                                                                                                        touched
                                                                                                                            .taxGroupDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .taxGroupDetails[
                                                                                                                            idx
                                                                                                                        ].tax &&
                                                                                                                        errors.taxGroupDetails &&
                                                                                                                        errors
                                                                                                                            .taxGroupDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .taxGroupDetails[
                                                                                                                            idx
                                                                                                                        ].tax
                                                                                                                )}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    {values.taxGroupDetails[idx] &&
                                                                                                    values.taxGroupDetails[idx].tax
                                                                                                        ? values.taxGroupDetails[idx].tax
                                                                                                              .percentage
                                                                                                        : 0}
                                                                                                </TableCell>

                                                                                                {/* <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        // label="Additional Price"
                                                                                                        type="number"
                                                                                                        variant="outlined"
                                                                                                        placeholder="0"
                                                                                                        name={`taxGroupDetails.${idx}.onOriginal`}
                                                                                                        value={
                                                                                                            values.taxGroupDetails[idx] &&
                                                                                                            values.taxGroupDetails[idx]
                                                                                                                .onOriginal
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        error={Boolean(
                                                                                                            touched.taxGroupDetails &&
                                                                                                                touched.taxGroupDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched.taxGroupDetails[idx]
                                                                                                                    .onOriginal &&
                                                                                                                errors.taxGroupDetails &&
                                                                                                                errors.taxGroupDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.taxGroupDetails[idx]
                                                                                                                    .onOriginal
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.taxGroupDetails &&
                                                                                                            touched.taxGroupDetails[idx] &&
                                                                                                            touched.taxGroupDetails[idx]
                                                                                                                .onOriginal &&
                                                                                                            errors.taxGroupDetails &&
                                                                                                            errors.taxGroupDetails[idx] &&
                                                                                                            errors.taxGroupDetails[idx]
                                                                                                                .onOriginal
                                                                                                                ? errors.taxGroupDetails[
                                                                                                                      idx
                                                                                                                  ].onOriginal
                                                                                                                : ''
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell> */}
                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        <FormControlLabel
                                                                                                            name={`taxGroupDetails.${idx}.status`}
                                                                                                            control={
                                                                                                                <Switch color="success" />
                                                                                                            }
                                                                                                            label="Status"
                                                                                                            disabled={mode == 'VIEW'}
                                                                                                            onChange={handleChange}
                                                                                                            checked={
                                                                                                                values.taxGroupDetails[idx]
                                                                                                                    .status
                                                                                                            }
                                                                                                            value={
                                                                                                                values.taxGroupDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                values.taxGroupDetails[idx]
                                                                                                                    .status
                                                                                                            }
                                                                                                        />
                                                                                                    </FormGroup>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <IconButton
                                                                                                        disabled={
                                                                                                            mode == 'VIEW_UPDATE' ||
                                                                                                            mode == 'VIEW'
                                                                                                        }
                                                                                                        disa
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
                                                            {openDialogBox ? (
                                                                <Dialog
                                                                    open={open}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="alert-dialog-title"
                                                                    aria-describedby="alert-dialog-description"
                                                                >
                                                                    <DialogTitle id="alert-dialog-title" style={{ color: 'red' }}>
                                                                        {'Error Msg'}
                                                                    </DialogTitle>
                                                                    <DialogContent>
                                                                        <DialogContentText id="alert-dialog-description">
                                                                            Tax order should be consecutive
                                                                        </DialogContentText>
                                                                    </DialogContent>
                                                                    <DialogActions>
                                                                        {/* <Button onClick={handleClose}>Disagree</Button> */}
                                                                        <Button
                                                                            className="btnSave"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenDialogBox(false);
                                                                            }}
                                                                        >
                                                                            OK
                                                                        </Button>
                                                                    </DialogActions>
                                                                </Dialog>
                                                            ) : (
                                                                ''
                                                            )}
                                                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                                                {mode != 'VIEW' ? (
                                                                    <Button
                                                                        variant="outlined"
                                                                        type="reset"
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

export default TaxGroup;
