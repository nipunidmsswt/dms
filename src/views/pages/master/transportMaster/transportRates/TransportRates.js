import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    TableRow,
    Switch
} from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { checkDuplicateSeasonCode, getSeasonDataById, saveSeasonData, updateSeasonData } from 'store/actions/masterActions/SeasonAction';
import { getAllChargeMethods, getAllModeofTransports } from 'store/actions/masterActions/TransportRateAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

function TransportRates({ open, handleClose, mode, code }) {
    const initialValues = {
        mainSeason: '',
        status: true,
        seasonDetails: [
            {
                subSeason: '',
                specialOfferSeason: '',
                toDate: '',
                status: true,
                fromDate: ''
            }
        ]
    };

    const [taxListOptions, setTaxListOptions] = useState([]);
    const [loadValues, setLoadValues] = useState(null);
    const [chargeMethodArrayList, setChargeMethodArrayList] = useState([]);
    const [modeofTransportArrayList, setModeofTransportArrayList] = useState([]);

    //   yup.addMethod(yup.array, "uniqueTaxOrder", function (message) {
    //     return this.test("uniqueTaxOrder", message, function (list) {
    //       const mapper = (x) => {
    //         return x.taxOrder;
    //       };
    //       const set = [...new Set(list.map(mapper))];
    //       const isUnique = list.length === set.length;
    //       if (isUnique) {
    //         return true;
    //       }

    //       const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    //       return this.createError({
    //         path: `seasonDetails[${idx}].taxOrder`,
    //         message: message,
    //       });
    //     });
    //   });

    //   yup.addMethod(yup.array, "uniqueTaxCode", function (message) {
    //     return this.test("uniqueTaxCode", message, function (list) {
    //       const mapper = (x) => {
    //         return x.tax?.taxCode;
    //       };
    //       const set = [...new Set(list.map(mapper))];
    //       const isUnique = list.length === set.length;
    //       if (isUnique) {
    //         return true;
    //       }

    //       const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
    //       return this.createError({
    //         path: `seasonDetails[${idx}].tax`,
    //         message: message,
    //       });
    //     });
    //   });

    yup.addMethod(yup.string, 'checkDuplicateSeason', function (message) {
        return this.test('checkDuplicateSeason', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    await dispatch(checkDuplicateSeasonCode(value));
                    if (duplicateSeason != null && duplicateSeason.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                } catch (error) {}
            }
            return true;
        });
    });

    const validationSchema = yup.object().shape({
        mainSeason: yup.string().required('Required field'),
        //   .checkDuplicateSeason("Duplicate Code"),
        seasonDetails: yup.array().of(
            yup.object().shape({
                subSeason: yup.string().required('Required field'),
                toDate: yup.date().required('Required field'),
                fromDate: yup.date().required('Required field')
            })
        )
        //   .uniqueTaxOrder("Must be unique")
        //   .uniqueTaxCode("Must be unique"),
    });

    //get data from reducers

    const seasonToUpdate = useSelector((state) => state.seasonReducer.seasonToUpdate);
    const duplicateSeason = useSelector((state) => state.seasonReducer.duplicateSeason);
    const modeofTransportList = useSelector((state) => state.modeOfTransortReducer.modeofTransports);
    const changeMethodList = useSelector((state) => state.chargeMethodReducer.chargeofMethods);
    console.log(changeMethodList);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('update');
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            console.log(code);
            dispatch(getSeasonDataById(code));
        }
    }, [mode]);

    useEffect(() => {
        setModeofTransportArrayList(modeofTransportList);
        console.log(modeofTransportList);
    }, [modeofTransportList]);

    useEffect(() => {
        setChargeMethodArrayList(changeMethodList);
    }, [changeMethodList]);

    useEffect(() => {
        console.log(seasonToUpdate);

        if ((mode === 'VIEW_UPDATE' && seasonToUpdate != null) || (mode === 'VIEW' && seasonToUpdate != null)) {
            setLoadValues(seasonToUpdate);
        }
    }, [seasonToUpdate]);

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveSeasonData(data));
        } else if (mode === 'VIEW_UPDATE') {
            console.log('yes click');
            dispatch(updateSeasonData(data));
        }
        handleClose();
    };

    useEffect(() => {
        dispatch(getAllChargeMethods());
        dispatch(getAllModeofTransports());
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
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}{' '}
                            Transport Rates
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
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched }) => {
                                                    return (
                                                        <Form>
                                                            <Grid display="flex" style={{ marginBottom: '10px', marginTop: '10px' }}>
                                                                <Grid item>
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Mode of Transport"
                                                                        name="transportCode"
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
                                                                        {modeofTransportArrayList.length != 0
                                                                            ? modeofTransportArrayList.map((data, key) => {
                                                                                  return (
                                                                                      <MenuItem key={key} value={data}>
                                                                                          {data}
                                                                                      </MenuItem>
                                                                                  );
                                                                              })
                                                                            : null}
                                                                    </TextField>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid display="flex" style={{ marginBottom: '10px', marginTop: '10px' }}>
                                                                <Grid item>
                                                                    <Typography variant="h5">Type of Transport</Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid gap="10px" display="flex" style={{ marginBottom: '10px' }}>
                                                                <Grid item>
                                                                    {' '}
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Code"
                                                                        name="transportCode"
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
                                                                        label="Description"
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        name="description"
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
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        select
                                                                        label="Mode of Transport"
                                                                        name="transportCode"
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
                                                                        {chargeMethodArrayList.length != 0
                                                                            ? chargeMethodArrayList.map((data, key) => {
                                                                                  return (
                                                                                      <MenuItem key={key} value={data}>
                                                                                          {data}
                                                                                      </MenuItem>
                                                                                  );
                                                                              })
                                                                            : null}
                                                                    </TextField>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid gap="10px" display="flex">
                                                                <Grid item>
                                                                    {' '}
                                                                    <TextField
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        id="standard-select-currency"
                                                                        select
                                                                        label="Direction"
                                                                        name="direction"
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
                                                                        <MenuItem dense={true} value={'One Way'}>
                                                                            One Way
                                                                        </MenuItem>
                                                                        <MenuItem dense={true} value={'Return'}>
                                                                            Return
                                                                        </MenuItem>
                                                                    </TextField>
                                                                </Grid>
                                                                <Grid item>
                                                                    <TextField
                                                                        label="Max Pax"
                                                                        sx={{
                                                                            width: { sm: 200, md: 300 },
                                                                            '& .MuiInputBase-root': {
                                                                                height: 40
                                                                            }
                                                                        }}
                                                                        disabled={mode == 'VIEW_UPDATE'}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        name="maxPax"
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
                                                                    <FormGroup>
                                                                        <FormControlLabel
                                                                            name="status"
                                                                            // onChange={handleInputChange}
                                                                            value={values.status}
                                                                            control={<Switch color="success" />}
                                                                            label="Status"
                                                                            checked={values.status}
                                                                            disabled={mode == 'VIEW'}
                                                                        />
                                                                    </FormGroup>
                                                                </Grid>
                                                            </Grid>

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

export default TransportRates;
