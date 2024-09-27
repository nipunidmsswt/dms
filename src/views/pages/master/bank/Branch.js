import { useEffect, useState } from 'react';

import {
    Dialog,
    Autocomplete,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    Grid,
    Switch,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import 'assets/scss/style.scss';
import { useDispatch, useSelector } from 'react-redux';

import { getAllbankData, saveBranchData, updateBranchData, getBranchDataById } from 'store/actions/masterActions/BankAction';

import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import * as yup from 'yup';
import { Formik, Form, FieldArray } from 'formik';
import { update } from 'lodash';

function Branch({ open, handleClose, mode, id }) {
    const initialValues = {
        bankCode: null,
        branchDetails: [
            {
                branchCode: '',
                branchName: '',
                branchDesc: '',
                status: true
            }
        ]
    };

    const [loadValues, setLoadValues] = useState(null);
    const [bankList, setbankList] = useState([]);

    const dispatch = useDispatch();

    const branchToUpdate = useSelector((state) => state.branchReducer.branchToUpdate);
    const duplicateTax = useSelector((state) => state.bankReducer.duplicateTax);
    const bankListData = useSelector((state) => state.bankReducer.bankList);

    yup.addMethod(yup.array, 'uniqueCode', function (message) {
        return this.test('uniqueCode', message, function (list) {
            console.log(list);
            const mapper = (x) => {
                return x.branchCode;
            };
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length === set.length;
            if (isUnique) {
                return true;
            }

            const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `branchDetails[${idx}].branchCode`,
                message: message
            });
        });
    });

    const validationSchema = yup.object().shape({
        bankCode: yup.object().nullable().required('Required field'),
        branchDetails: yup
            .array()
            .of(
                yup.object().shape({
                    branchCode: yup.string().required('Required field'),
                    branchName: yup.string().required('Required field')
                })
            )
            .uniqueCode('Must be unique')
    });

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveBranchData(data));
        } else if (mode === 'VIEW_UPDATE') {
            console.log('yes click');
            dispatch(updateBranchData(data));
        }

        handleClose();
    };

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getBranchDataById(id));
        }
    }, [mode]);

    useEffect(() => {
        console.log(' console.log(branchToUpdate); console.log(branchToUpdate); console.log(branchToUpdate);');
        console.log(branchToUpdate);
        if ((mode === 'VIEW_UPDATE' && branchToUpdate != null) || (mode === 'VIEW' && branchToUpdate != null)) {
            console.log(branchToUpdate);
            const data = {
                bankCode: branchToUpdate.bankCode,
                branchDetails: [
                    {
                        branchId: branchToUpdate.branchId,
                        branchCode: branchToUpdate.branchCode,
                        branchName: branchToUpdate.branchName,
                        branchDesc: branchToUpdate.branchDesc,
                        status: branchToUpdate.status
                    }
                ]
            };
            setLoadValues(data);
        }
    }, [branchToUpdate]);

    useEffect(() => {
        if (bankListData.length != 0) {
            console.log(bankListData);
            if (bankListData.payload.length === 1) {
                console.log(bankListData.payload[0]);
                setbankList(bankListData.payload[0]);
            }
        }
    }, [bankListData]);

    useEffect(() => {
        dispatch(getAllbankData());
    }, []);
    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
                open={open}
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Branch
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <div>
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
                                                    <Autocomplete
                                                        value={values.bankCode}
                                                        name="bankCode"
                                                        onChange={(_, value) => {
                                                            console.log(value);
                                                            setFieldValue(`bankCode`, value);
                                                        }}
                                                        options={bankList}
                                                        disabled={mode == 'VIEW_UPDATE'}
                                                        getOptionLabel={(option) => `${option.bankCode}-${option.bankName}`}
                                                        isOptionEqualToValue={(option, value) => {
                                                            console.log(option);
                                                            console.log(value);
                                                            return option.bankId === value.bankId;
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Bank"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                sx={{
                                                                    width: { sm: 200 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                variant="outlined"
                                                                name="bankCode"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.bankCode && errors.bankCode)}
                                                                helperText={touched.bankCode && errors.bankCode ? errors.bankCode : ''}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>

                                        <FieldArray name="branchDetails">
                                            {({ insert, remove, push }) => (
                                                <Paper>
                                                    {mode != 'VIEW' ? (
                                                        <Box display="flex" flexDirection="row-reverse">
                                                            <IconButton
                                                                aria-label="delete"
                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                onClick={() => {
                                                                    push({
                                                                        branchCode: '',
                                                                        branchName: '',
                                                                        branchDesc: '',
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
                                                                    <TableCell>Branch Code</TableCell>
                                                                    <TableCell>Branch Name</TableCell>
                                                                    <TableCell>Banch Description</TableCell>
                                                                    <TableCell>Status</TableCell>
                                                                    <TableCell>Actions</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {values.branchDetails.map((record, idx) => {
                                                                    return (
                                                                        <TableRow key={idx} hover>
                                                                            <TableCell>
                                                                                <TextField
                                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                    sx={{
                                                                                        width: { sm: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    type="text"
                                                                                    variant="outlined"
                                                                                    name={`branchDetails.${idx}.branchCode`}
                                                                                    value={
                                                                                        values.branchDetails[idx] &&
                                                                                        values.branchDetails[idx].branchCode
                                                                                    }
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.branchDetails &&
                                                                                            touched.branchDetails[idx] &&
                                                                                            touched.branchDetails[idx].branchCode &&
                                                                                            errors.branchDetails &&
                                                                                            errors.branchDetails[idx] &&
                                                                                            errors.branchDetails[idx].branchCode
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.branchDetails &&
                                                                                        touched.branchDetails[idx] &&
                                                                                        touched.branchDetails[idx].branchCode &&
                                                                                        errors.branchDetails &&
                                                                                        errors.branchDetails[idx] &&
                                                                                        errors.branchDetails[idx].branchCode
                                                                                            ? errors.branchDetails[idx].branchCode
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextField
                                                                                    // label="taxOrder"
                                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                    sx={{
                                                                                        width: { sm: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    type="text"
                                                                                    variant="outlined"
                                                                                    name={`branchDetails.${idx}.branchName`}
                                                                                    value={
                                                                                        values.branchDetails[idx] &&
                                                                                        values.branchDetails[idx].branchName
                                                                                    }
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.branchDetails &&
                                                                                            touched.branchDetails[idx] &&
                                                                                            touched.branchDetails[idx].branchName &&
                                                                                            errors.branchDetails &&
                                                                                            errors.branchDetails[idx] &&
                                                                                            errors.branchDetails[idx].branchName
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.branchDetails &&
                                                                                        touched.branchDetails[idx] &&
                                                                                        touched.branchDetails[idx].branchName &&
                                                                                        errors.branchDetails &&
                                                                                        errors.branchDetails[idx] &&
                                                                                        errors.branchDetails[idx].branchName
                                                                                            ? errors.branchDetails[idx].branchName
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextField
                                                                                    // label="taxOrder"
                                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                                    sx={{
                                                                                        width: { sm: 200 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 40
                                                                                        }
                                                                                    }}
                                                                                    type="text"
                                                                                    variant="outlined"
                                                                                    name={`branchDetails.${idx}.branchDesc`}
                                                                                    value={
                                                                                        values.branchDetails[idx] &&
                                                                                        values.branchDetails[idx].branchDesc
                                                                                    }
                                                                                    onChange={handleChange}
                                                                                    onBlur={handleBlur}
                                                                                    error={Boolean(
                                                                                        touched.branchDetails &&
                                                                                            touched.branchDetails[idx] &&
                                                                                            touched.branchDetails[idx].branchDesc &&
                                                                                            errors.branchDetails &&
                                                                                            errors.branchDetails[idx] &&
                                                                                            errors.branchDetails[idx].branchDesc
                                                                                    )}
                                                                                    helperText={
                                                                                        touched.branchDetails &&
                                                                                        touched.branchDetails[idx] &&
                                                                                        touched.branchDetails[idx].branchDesc &&
                                                                                        errors.branchDetails &&
                                                                                        errors.branchDetails[idx] &&
                                                                                        errors.branchDetails[idx].branchDesc
                                                                                            ? errors.branchDetails[idx].branchDesc
                                                                                            : ''
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <FormGroup>
                                                                                    <FormControlLabel
                                                                                        name={`branchDetails.${idx}.status`}
                                                                                        control={<Switch color="success" />}
                                                                                        label="Status"
                                                                                        disabled={mode == 'VIEW'}
                                                                                        onChange={handleChange}
                                                                                        checked={values.branchDetails[idx].status}
                                                                                        value={
                                                                                            values.branchDetails[idx] &&
                                                                                            values.branchDetails[idx].status
                                                                                        }
                                                                                    />
                                                                                </FormGroup>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <IconButton
                                                                                    disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
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
                                                {mode === 'VIEW' ? <CreatedUpdatedUserDetailsWithTableFormat formValues={values} /> : null}
                                            </Grid>
                                        </Box>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Branch;
