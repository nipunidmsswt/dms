import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    FormControlLabel,
    Box,
    DialogActions,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    DialogContentText,
    Switch,
    Autocomplete
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
    saveBankDetailsData,
    updateBankDetailsData,
    checkedSavedBankandBranch,
    getBankDetailsDataById
} from '../../../../store/actions/masterActions/BankAction';
import { getAllCurrencyListData } from '../../../../store/actions/masterActions/ExpenseTypeAction';
import { Formik, Form } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import { getAllbankData, getBranchesByBankId } from 'store/actions/masterActions/BankAction';
import countryList from 'react-select-country-list';
import { getAllActiveMarketData } from 'store/actions/masterActions/operatorActions/MarketAction';

function BankDetail({ open, handleClose, mode, code }) {
    const initialValues = {
        bank: null,
        branch: null,
        swiftCode: '',
        bankAddress: '',
        currency: null,
        accountNumber: '',
        accountDesc: '',
        intermediaryBank: '',
        intermediaryBranch: '',
        country: '',
        market: [],
        remark: '',
        status: true
    };

    const [loadValues, setLoadValues] = useState(null);
    const [openDialogBox, setOpenDialogBox] = useState(false);
    const [bankList, setbankList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [currencyListOptions, setCurrencyListOptions] = useState([]);

    //get data from reducers

    const duplicateBankDetail = useSelector((state) => state.bankDetailReducer.duplicateBankDetail);
    const bankDetailToUpdate = useSelector((state) => state.bankDetailReducer.bankDetailToUpdate);
    const bankListData = useSelector((state) => state.bankReducer.bankList);
    const currencyListData = useSelector((state) => state.expenseTypesReducer.currencyList);
    const marketListData = useSelector((state) => state.marketReducer.marketActiveList);
    const branchesByBankId = useSelector((state) => state.branchReducer.branchesByBank);

    const options = useMemo(() => countryList().getData(), []);
    const [marketListOptions, setMarketListOptions] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (currencyListData != null) {
            setCurrencyListOptions(currencyListData);
        }
    }, [currencyListData]);

    useEffect(() => {
        if (branchesByBankId != null) {
            setBranchList(branchesByBankId);
        }
    }, [branchesByBankId]);
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
        if (bankListData.length != 0) {
            console.log(bankListData);
            if (bankListData.payload.length === 1) {
                console.log(bankListData.payload[0]);
                setbankList(bankListData.payload[0]);
            }
        }
    }, [bankListData]);

    useEffect(() => {
        dispatch(getAllActiveMarketData());
        dispatch(getAllCurrencyListData());
        dispatch(getAllbankData());
    }, []);

    useEffect(() => {
        console.log(marketListData);
        setMarketListOptions(marketListData);
    }, [marketListData]);

    yup.addMethod(yup.object, 'checkDuplicateBankandBranch', function (message) {
        return this.test('checkDuplicateBankandBranch', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    console.log(value);
                    if (value != null) {
                        console.log('sjhgchs');
                    }
                    let data = { bank: value.bankCode.bankId, branch: value.branchId };
                    await dispatch(checkedSavedBankandBranch(data));
                    console.log(duplicateBankDetail);
                    if (duplicateBankDetail != null && duplicateBankDetail.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                    return false;
                } catch (error) {}
            }
            return true;
        });
    });

    const validationSchema = yup.object().shape({
        bank: yup.object().nullable().required('Required field'),
        branch: yup
            .object()
            .nullable()
            .required('Required field')
            .checkDuplicateBankandBranch('Branch Code is duplicated for the selected bank'),
        accountNumber: yup.string().required('Required field')
    });

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getBankDetailsDataById(code));
        }
    }, [mode]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && bankDetailToUpdate != null) || (mode === 'VIEW' && bankDetailToUpdate != null)) {
            setLoadValues(bankDetailToUpdate);
        }
    }, [bankDetailToUpdate]);

    const loadBranches = (data) => {
        console.log(data.bankId);
        dispatch(getBranchesByBankId(data.bankId));
    };

    const handleSubmitForm = (data) => {
        if (mode === 'INSERT') {
            dispatch(saveBankDetailsData(data));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateBankDetailsData(data));
        }
        handleClose();
    };

    return (
        <div>
            <Dialog fullWidth maxWidth="md" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Bank
                            Detail
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
                        <Formik
                            maxWidth
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
                                        <Box sx={{ width: '100%' }}>
                                            <Grid container rowSpacing={2} style={{ marginTop: '2px' }}>
                                                <Grid item xs={3}>
                                                    <Autocomplete
                                                        value={values.bank}
                                                        name="bank"
                                                        onChange={(_, value) => {
                                                            loadBranches(value);
                                                            setFieldValue(`bank`, value);
                                                        }}
                                                        options={bankList}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        getOptionLabel={(option) => `${option.bankCode}-${option.bankName}`}
                                                        isOptionEqualToValue={(option, value) => {
                                                            return option.bankId === value.bankId;
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
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                label="bank"
                                                                variant="outlined"
                                                                name="branch"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.bank && errors.bank)}
                                                                helperText={touched.bank && errors.bank ? errors.bank : ''}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <Autocomplete
                                                        value={values.branch}
                                                        name="branch"
                                                        onChange={(_, value) => {
                                                            console.log(value);
                                                            setFieldValue(`branch`, value);
                                                        }}
                                                        options={branchList}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        getOptionLabel={(option) => `${option.branchCode}-${option.branchName}`}
                                                        isOptionEqualToValue={(option, value) => {
                                                            console.log(option);
                                                            console.log(value);
                                                            return option.branchId === value.branchId;
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
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                label="Branch"
                                                                variant="outlined"
                                                                name="branch"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.branch && errors.branch)}
                                                                helperText={touched.branch && errors.branch ? errors.branch : ''}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Swift Code"
                                                        name="swiftCode"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.swiftCode}
                                                        error={Boolean(touched.swiftCode && errors.swiftCode)}
                                                        helperText={touched.swiftCode && errors.swiftCode ? errors.swiftCode : ''}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Bank Address"
                                                        name="bankAddress"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.bankAddress}
                                                        error={Boolean(touched.bankAddress && errors.bankAddress)}
                                                        helperText={touched.bankAddress && errors.bankAddress ? errors.bankAddress : ''}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Autocomplete
                                                        value={values.currency}
                                                        name="currency"
                                                        onChange={(_, value) => {
                                                            console.log(value);
                                                            setFieldValue(`currency`, value);
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE'}
                                                        options={currencyListOptions}
                                                        getOptionLabel={(option) =>
                                                            `${option.currencyCode} - ${option.currencyDescription}`
                                                        }
                                                        isOptionEqualToValue={(option, value) =>
                                                            option.currencyListId === value.currencyListId
                                                        }
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
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                label="Currency"
                                                                variant="outlined"
                                                                name="currency"
                                                                onBlur={handleBlur}
                                                                error={Boolean(touched.currency && errors.currency)}
                                                                helperText={touched.currency && errors.currency ? errors.currency : ''}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Account Number"
                                                        name="accountNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.accountNumber}
                                                        error={Boolean(touched.accountNumber && errors.accountNumber)}
                                                        helperText={
                                                            touched.accountNumber && errors.accountNumber ? errors.accountNumber : ''
                                                        }
                                                    ></TextField>
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Account Description"
                                                        name="accountDesc"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.accountDesc}
                                                        error={Boolean(touched.accountDesc && errors.accountDesc)}
                                                        helperText={touched.accountDesc && errors.accountDesc ? errors.accountDesc : ''}
                                                    ></TextField>
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Intermediary Bank"
                                                        name="intermediaryBank"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.intermediaryBank}
                                                        error={Boolean(touched.intermediaryBank && errors.intermediaryBank)}
                                                        helperText={
                                                            touched.intermediaryBank && errors.intermediaryBank
                                                                ? errors.intermediaryBank
                                                                : ''
                                                        }
                                                    ></TextField>
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Intermediary Branch"
                                                        name="intermediaryBranch"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.intermediaryBranch}
                                                        error={Boolean(touched.intermediaryBranch && errors.intermediaryBranch)}
                                                        helperText={
                                                            touched.intermediaryBranch && errors.intermediaryBranch
                                                                ? errors.intermediaryBranch
                                                                : ''
                                                        }
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Autocomplete
                                                        value={values.country}
                                                        name="country"
                                                        onChange={(_, value) => {
                                                            console.log(values.label);
                                                            setFieldValue(`country`, value.label);
                                                        }}
                                                        options={options}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Country"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                sx={{
                                                                    width: { sm: 200 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 41
                                                                    }
                                                                }}
                                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                variant="outlined"
                                                                name="country"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        label="Remarks"
                                                        name="remarks"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.remarks}
                                                        error={Boolean(touched.remarks && errors.remarks)}
                                                        helperText={touched.remarks && errors.remarks ? errors.remarks : ''}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            name="status"
                                                            onChange={handleChange}
                                                            value={values.status}
                                                            control={<Switch color="success" />}
                                                            label="Status"
                                                            checked={values.status}
                                                            disabled={mode == 'VIEW'}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <Autocomplete
                                                        value={values.market}
                                                        multiple
                                                        fullWidth
                                                        name="market"
                                                        onChange={(_, value) => {
                                                            setFieldValue(`market`, value);
                                                        }}
                                                        options={marketListOptions}
                                                        getOptionLabel={(option) => `${option.code} - (${option.name})`}
                                                        isOptionEqualToValue={(option, value) => option.marketId === value.marketId}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Market"
                                                                sx={{
                                                                    width: { sm: 620, md: 620 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 40
                                                                    }
                                                                }}
                                                                variant="outlined"
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                name="market"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
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
                                                        Users are assigned to this company more than allocated license count
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
                                                    type="button"
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
                    </DialogContent>
                </>
            </Dialog>
        </div>
    );
}

export default BankDetail;
