import { useEffect, forwardRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import 'assets/scss/style.scss';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
    Autocomplete,
    Stack,
    Dialog,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Switch,
    Button
} from '@mui/material';
import { getActiveTaxGroupandTaxList } from 'store/actions/masterActions/TaxActions/TaxGroupAction';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import { getActivitySupMisByLcationandType } from 'store/actions/masterActions/Activity_SupplimentAction';
import * as yup from 'yup';

function ProgramSuppliment({ open, handleClose, mode, id, startDate }) {
    const initialValues = {
        location: null,
        supplement: null,
        maxPax: '',
        description: '',
        chargeable: true,
        remarks: '',
        totalBuyRate: '',
        taxGroup: null,
        markup: '',
        sellRate: '',
        totalSellRateWithTax: ''
    };
    const dispatch = useDispatch();

    const [supplimentCodeList, setSupplimentCodeList] = useState([]);
    const [activeTaxGroupandTaxesList, setActiveTaxGroupandTaxesListData] = useState([]);
    const [activeLocationList, setActiveLocationList] = useState([]);
    //data from reducers
    const activeTaxGroupandTaxesListData = useSelector((state) => state.taxGroupReducer.activeTaxGroupandTaxes);
    const activeLocations = useSelector((state) => state.locationReducer.activeLocations);
    const suplimentListByLocationandType = useSelector((state) => state.activity_supplimentReducer.actSupMisListByLocationandType);

    const validationSchema = yup.object().shape({
        location: yup.object().nullable().required('Required field'),
        supplement: yup.object().nullable().required('Required field'),
        taxGroup: yup.object().nullable().required('Required field')
    });
    const handleSubmit = async (values) => {
        console.log(values);
    };

    useEffect(() => {
        dispatch(getActiveLocations());

        dispatch(getActiveTaxGroupandTaxList('Sell'));
    }, []);

    useEffect(() => {
        if (activeLocations.length != 0) {
            setActiveLocationList(activeLocations);
        }
    }, [activeLocations]);

    useEffect(() => {
        console.log(activeTaxGroupandTaxesListData);
        if (activeTaxGroupandTaxesListData.length != 0) {
            setActiveTaxGroupandTaxesListData(activeTaxGroupandTaxesListData);
        }
    }, [activeTaxGroupandTaxesListData]);

    useEffect(() => {
        console.log('HEYYYYYYYYYYYYYYYY');
        if (suplimentListByLocationandType.length != 0) {
            setSupplimentCodeList(suplimentListByLocationandType);
        } else {
            setSupplimentCodeList([]);
        }
    }, [suplimentListByLocationandType]);

    const getSuplimentByLocationAndType = (locationId) => {
        console.log('im called');

        let data = {
            locationId: locationId.location_id,
            type: 'Supplement',
            typeOfActivity: null,
            fromDate: startDate
        };
        console.log(data);
        dispatch(getActivitySupMisByLcationandType(data));
    };

    const filledSupplimentDetails = (data, setFieldValue) => {
        setFieldValue('description', data.activityDescription);
        setFieldValue('maxPax', data.maxPax);
        setFieldValue('advance', data.advanceType);
        setFieldValue('totalBuyRate', data.activityWithTaxes[0].length === 0 ? 0 : data.activityWithTaxes[0].rateWithTax);
    };

    const calculateSellRateTax = (value, tax, setFieldValue) => {
        console.log(value);
        console.log(tax);
        if (tax != null) {
            if (tax.type === 'Group') {
                let amountWithTax = value;
                for (let i in tax.taxOrder) {
                    amountWithTax = (+amountWithTax * tax.taxOrder[i]) / 100 + +amountWithTax;
                }

                setFieldValue(`totalSellRateWithTax`, +amountWithTax.toFixed(4));
            } else if (tax.type === 'IND') {
                let amountWithTax = 0;
                amountWithTax = (+value * tax.tax) / 100 + +value;

                setFieldValue(`totalSellRateWithTax`, +amountWithTax.toFixed(4));
            }
        }
    };
    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'BANK' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}
                            Suppliment
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
                            initialValues={initialValues}
                            onSubmit={(values, { resetForm }) => {
                                handleSubmit(values);
                                resetForm('');
                            }}
                            validationSchema={validationSchema}
                        >
                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                return (
                                    <Form>
                                        <Stack spacing={2} direction="row" sx={{ marginBottom: 4, marginTop: 2 }}>
                                            <Autocomplete
                                                value={values.location}
                                                name="location"
                                                onChange={(_, value) => {
                                                    setFieldValue(`location`, value);
                                                    if (value != null) {
                                                        getSuplimentByLocationAndType(value);
                                                    }
                                                }}
                                                fullWidth
                                                options={activeLocationList}
                                                getOptionLabel={(option) => `${option.code}`}
                                                isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Location"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        // disabled={mode == 'VIEW'}
                                                        variant="outlined"
                                                        name="tourType"
                                                        onBlur={handleBlur}
                                                        error={Boolean(touched.location && errors.location)}
                                                        helperText={touched.location && errors.location ? errors.location : ''}
                                                    />
                                                )}
                                            />

                                            <Autocomplete
                                                value={values.activity}
                                                name="supplement"
                                                onChange={(_, value) => {
                                                    console.log(value);
                                                    setFieldValue(`supplement`, value);
                                                    filledSupplimentDetails(value, setFieldValue);
                                                }}
                                                fullWidth
                                                options={supplimentCodeList}
                                                getOptionLabel={(option) => `${option.code}`}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Supplement"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        // disabled={mode == 'VIEW'}
                                                        variant="outlined"
                                                        name="supplement"
                                                        onBlur={handleBlur}
                                                        error={Boolean(touched.supplement && errors.supplement)}
                                                        helperText={touched.supplement && errors.supplement ? errors.supplement : ''}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                                            <TextField
                                                type="text"
                                                variant="outlined"
                                                sx={{
                                                    width: { xs: 1700 },
                                                    '& .MuiInputBase-root': {
                                                        height: 40
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                label="Description"
                                                fullWidth
                                                disabled
                                                name="description"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.description && errors.description)}
                                                helperText={touched.description && errors.description ? errors.description : ''}
                                            />
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: 40
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                disabled
                                                name="maxPax"
                                                label="Max Pax"
                                                fullWidth
                                                value={values.maxPax}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.maxPax && errors.maxPax)}
                                                helperText={touched.maxPax && errors.maxPax ? errors.maxPax : ''}
                                            />
                                        </Stack>
                                        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    name="chargeable"
                                                    onChange={handleChange}
                                                    value={values.chargeable}
                                                    control={<Switch color="success" />}
                                                    label="Advance"
                                                    checked={values.chargeable}
                                                    disabled={mode == 'VIEW'}
                                                />
                                            </FormGroup>
                                            <TextField
                                                type="text"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: 40
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                name="remarks"
                                                label="Remark"
                                                fullWidth
                                                value={values.remarks}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.remarks && errors.remarks)}
                                                helperText={touched.remarks && errors.remarks ? errors.remarks : ''}
                                            />
                                        </Stack>
                                        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: 40
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                name="totalBuyRate"
                                                label="Total Buy rate"
                                                fullWidth
                                                disabled
                                                value={values.totalBuyRate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.totalBuyRate && errors.totalBuyRate)}
                                                helperText={touched.totalBuyRate && errors.totalBuyRate ? errors.totalBuyRate : ''}
                                            />

                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: 40
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                name="markup"
                                                label="Markup"
                                                fullWidth
                                                value={values.markup}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setFieldValue('sellRate', +values.totalBuyRate + +e.target.value);
                                                }}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.markup && errors.markup)}
                                                helperText={touched.markup && errors.markup ? errors.markup : ''}
                                            />
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: 40
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                name="sellRate"
                                                label="Sell Rate"
                                                fullWidth
                                                disabled
                                                value={values.sellRate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.sellRate && errors.sellRate)}
                                                helperText={touched.sellRate && errors.sellRate ? errors.sellRate : ''}
                                            />
                                        </Stack>
                                        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                                            <Autocomplete
                                                value={values.taxGroup}
                                                name="taxGroup"
                                                disabled={mode == 'VIEW'}
                                                onChange={(_, value) => {
                                                    setFieldValue(`taxGroup`, value);
                                                    calculateSellRateTax(values.sellRate, value, setFieldValue);
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                options={activeTaxGroupandTaxesList}
                                                getOptionLabel={(option) => `${option.type}-${option.code}`}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Tax Code"
                                                        sx={{
                                                            width: { xs: 250 },
                                                            '& .MuiInputBase-root': {
                                                                height: 41
                                                            }
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        error={Boolean(touched.taxGroup && errors.taxGroup)}
                                                        helperText={touched.taxGroup && errors.taxGroup ? errors.taxGroup : ''}
                                                        variant="outlined"
                                                        name="taxGroup"
                                                        onBlur={handleBlur}
                                                    />
                                                )}
                                            />
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: 40
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                name="totalSellRateWithTax"
                                                label="Total Sell Rate with Tax"
                                                fullWidth
                                                disabled
                                                value={values.totalSellRateWithTax}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(touched.totalSellRateWithTax && errors.totalSellRateWithTax)}
                                                helperText={
                                                    touched.totalSellRateWithTax && errors.totalSellRateWithTax
                                                        ? errors.totalSellRateWithTax
                                                        : ''
                                                }
                                            />
                                        </Stack>
                                        <Box display="flex" flexDirection="row-reverse" style={{ marginTop: '20px' }}>
                                            {mode != 'VIEW' ? (
                                                <Button
                                                    variant="outlined"
                                                    type="button"
                                                    // onClick={handleClose}
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

export default ProgramSuppliment;
