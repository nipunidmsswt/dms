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
    TableRow,
    Switch
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
    checkDuplicateMarketGroupsCode,
    getMarketGroupDetailsByCode,
    saveMarketGroupData,
    updateMarketGroupData
} from 'store/actions/masterActions/operatorActions/MarketGroupAction';
import { getAllActiveMarketData } from 'store/actions/masterActions/operatorActions/MarketAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import { getAllActiveOperatorData } from 'store/actions/masterActions/CodeAndNameAction';

const MarketGroup = ({ open, handleClose, mode, marketGroupCode }) => {
    const initialValues1 = {
        groupType: '',
        code: '',
        description: '',
        status: true,
        marketGroupDetails: [
            {
                market: null,
                operator: null,
                description: '',
                status: true
                // officeTelNumber: "",
                // fax1: "",
                // fax2: "",
            }
        ]
    };

    const handleSubmitForm = (data) => {
        const dataArray = [];
        console.log(data.marketGroupDetails[0].market);
        if (mode === 'INSERT') {
            if (data.groupType === 'Operator Group') {
                console.log(data.marketGroupDetails);
                const initialValues = {
                    groupType: data.groupType,
                    code: data.code,
                    description: data.description,
                    status: data.status,
                    marketGroupDetails: []
                };

                data.marketGroupDetails.map((item) => {
                    const details = {
                        operator: item.market,
                        market: null,
                        status: item.status
                        // officeTelNumber: "",
                        // fax1: "",
                        // fax2: "",
                    };

                    // dataArray.push(details);
                    initialValues.marketGroupDetails.push(details);
                });
                console.log(initialValues);
                dispatch(saveMarketGroupData(initialValues));
            } else {
                dispatch(saveMarketGroupData(data));
            }

            // console.log(data);
            // console.log(dataArray);
        } else if (mode === 'VIEW_UPDATE') {
            if (data.groupType === 'Operator Group') {
                console.log(data.marketGroupDetails);
                const initialValues = {
                    groupType: data.groupType,
                    code: data.code,
                    description: data.description,
                    status: data.status,
                    marketGroupDetails: []
                };

                data.marketGroupDetails.map((item) => {
                    const details = {
                        operator: item.market,
                        market: null,
                        status: item.status
                        // officeTelNumber: "",
                        // fax1: "",
                        // fax2: "",
                    };

                    // dataArray.push(details);
                    initialValues.marketGroupDetails.push(details);
                });
                console.log(initialValues);
                dispatch(updateMarketGroupData(initialValues));
            } else {
                dispatch(updateMarketGroupData(data));
            }
            // console.log("yes click");
        }
        handleClose();
    };

    const [loadValues, setLoadValues] = useState(null);
    const ref = useRef(null);
    const [listOptions, setListOptions] = useState([]);
    const [operatorListOptions, setOperatorListOptions] = useState([]);
    const dispatch = useDispatch();
    const marketToUpdate = useSelector((state) => state.marketGroupReducer.marketToUpdate);

    const marketListData = useSelector((state) => state.marketReducer.marketActiveList);
    const operatorListData = useSelector((state) => state.codeAndNameReducer.operatorTypesDetails);

    // useEffect(() => {
    //     // console.log('group type:' + initialValues1.groupType);
    //     // if (initialValues1.groupType == 'Operator Group') {
    //     // }
    //     if (marketListData != null) {
    //         // console.log(marketListData);
    //         setMarketListOptions(marketListData);
    //     }
    // }, [marketListData]);

    useEffect(() => {
        if (marketListData != null) {
            setListOptions(marketListData);
        }
    }, [marketListData]);

    useEffect(() => {
        if (operatorListData != null) {
            setListOptions(operatorListData);
        }
    }, [operatorListData]);

    const duplicateCode = useSelector((state) => state.marketGroupReducer.duplicateCode);

    useEffect(() => {
        dispatch(getAllActiveMarketData());
        dispatch(getAllActiveOperatorData());
    }, []);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && marketToUpdate != null) || (mode === 'VIEW' && marketToUpdate != null)) {
            if (marketToUpdate.groupType == 'Operator Group') {
                const initialValues = {
                    groupType: marketToUpdate.groupType,
                    code: marketToUpdate.code,
                    description: marketToUpdate.description,
                    status: marketToUpdate.status,
                    marketGroupDetails: []
                };

                marketToUpdate.marketGroupDetails.map((item) => {
                    const details = {
                        operator: null,
                        market: item.operator,
                        status: item.status
                    };

                    // dataArray.push(details);
                    initialValues.marketGroupDetails.push(details);
                    setLoadValues(initialValues);
                });
            } else {
                setLoadValues(marketToUpdate);
            }
        }
    }, [marketToUpdate]);

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getMarketGroupDetailsByCode(marketGroupCode));
        }
    }, [mode]);

    yup.addMethod(yup.string, 'checkDuplicateMarketGroup', function (message) {
        return this.test('checkDuplicateMarketGroup', 'Duplicate Market Group Code', async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    dispatch(checkDuplicateMarketGroupsCode(value));

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

    yup.addMethod(yup.array, 'uniqueCode', function (message) {
        return this.test('uniqueCode', message, function (list) {
            const mapper = (x) => {
                return x.market?.code;
            };
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length === set.length;
            if (isUnique) {
                return true;
            }

            const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `marketGroupDetails[${idx}].market`,
                message: message
            });
        });
    });

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = yup.object().shape({
        groupType: yup.string().required('Required field'),
        code: yup.string().required('Required field').checkDuplicateMarketGroup('ggg'),
        description: yup.string().required('Required field'),
        marketGroupDetails: yup
            .array()
            .of(
                yup.object().shape({
                    market: yup.object().typeError('Required field'),
                    description: yup.string()
                })
            )
            .uniqueCode('Must be unique')
    });

    function handleClick(e) {
        console.log('Market Group:' + operatorListData);
        let selectedValue = e.target.dataset.value;
        selectedValue === 'Market Group' ? dispatch(getAllActiveMarketData()) : dispatch(getAllActiveOperatorData());
        // selectedValue === 'Market Group' ? setListOptions(marketListData) : setListOptions(operatorListData.codeAndNameDetails);
    }

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
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}
                            Operator / Market Group
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
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            id="standard-select-currency"
                                                                            select
                                                                            label="Group Type"
                                                                            name="groupType"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.groupType}
                                                                            // onClick={handleClick}
                                                                            onClick={(values) => {
                                                                                handleClick(values);
                                                                            }}
                                                                            error={Boolean(touched.groupType && errors.groupType)}
                                                                            helperText={
                                                                                touched.groupType && errors.groupType
                                                                                    ? errors.groupType
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            <MenuItem dense={true} value={'Operator Group'}>
                                                                                Operator Group
                                                                            </MenuItem>
                                                                            <MenuItem dense={true} value={'Market Group'}>
                                                                                Market Group
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Code"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="code"
                                                                            value={values.code}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.code && errors.code)}
                                                                            helperText={touched.code && errors.code ? errors.code : ''}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <br />
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Group Description"
                                                                            name="description"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
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

                                                                    <Grid item>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="status"
                                                                                onChange={handleChange}
                                                                                value={values.status}
                                                                                control={<Switch color="success" />}
                                                                                label="Status"
                                                                                checked={values.status}
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                        {/* <FormGroup>
                                                                            <FormControlLabel
                                                                                label="Status"
                                                                                labelPlacement="start"
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
                                                                        </FormGroup> */}
                                                                    </Grid>
                                                                </Grid>

                                                                <br />
                                                            </div>

                                                            <FieldArray name="marketGroupDetails">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        <Box
                                                                            sx={{
                                                                                fontWeight: 500,
                                                                                fontSize: 'h6.fontSize'
                                                                            }}
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            justifyContent="center"
                                                                        >
                                                                            Group Details
                                                                        </Box>

                                                                        {/* </DialogTitle> */}
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    onClick={() => {
                                                                                        push({
                                                                                            market: null,

                                                                                            description: '',
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
                                                                                        <TableCell>Operator/Market</TableCell>
                                                                                        <TableCell>Description</TableCell>
                                                                                        <TableCell>Status</TableCell>
                                                                                        {/* <TableCell>Fax 1</TableCell>
                                            <TableCell>Fax 2</TableCell> */}
                                                                                        {/* <TableCell>
                                              Fax
                                            </TableCell> */}
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.marketGroupDetails.map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                <TableCell>{idx + 1}</TableCell>
                                                                                                <TableCell>
                                                                                                    <Autocomplete
                                                                                                        value={
                                                                                                            values.marketGroupDetails[idx]
                                                                                                                ? values.marketGroupDetails[
                                                                                                                      idx
                                                                                                                  ].market
                                                                                                                : null
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                        name={`marketGroupDetails.${idx}.market`}
                                                                                                        onChange={(_, value) => {
                                                                                                            console.log(value);

                                                                                                            setFieldValue(
                                                                                                                `marketGroupDetails.${idx}.market`,
                                                                                                                value
                                                                                                            );
                                                                                                        }}
                                                                                                        options={listOptions}
                                                                                                        getOptionLabel={(option) =>
                                                                                                            `${option.code} - ${option.name}`
                                                                                                        }
                                                                                                        isOptionEqualToValue={(
                                                                                                            option,
                                                                                                            value
                                                                                                        ) =>
                                                                                                            option.marketId ===
                                                                                                            value.marketId
                                                                                                        }
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
                                                                                                                placeholder="--Select a Operator/Market --"
                                                                                                                variant="outlined"
                                                                                                                name={`marketGroupDetails.${idx}.market`}
                                                                                                                onBlur={handleBlur}
                                                                                                                helperText={
                                                                                                                    touched.marketGroupDetails &&
                                                                                                                    touched
                                                                                                                        .marketGroupDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .marketGroupDetails[
                                                                                                                        idx
                                                                                                                    ].market &&
                                                                                                                    errors.marketGroupDetails &&
                                                                                                                    errors
                                                                                                                        .marketGroupDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .marketGroupDetails[
                                                                                                                        idx
                                                                                                                    ].market
                                                                                                                        ? errors
                                                                                                                              .marketGroupDetails[
                                                                                                                              idx
                                                                                                                          ].market
                                                                                                                        : ''
                                                                                                                }
                                                                                                                error={Boolean(
                                                                                                                    touched.marketGroupDetails &&
                                                                                                                        touched
                                                                                                                            .marketGroupDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .marketGroupDetails[
                                                                                                                            idx
                                                                                                                        ].market &&
                                                                                                                        errors.marketGroupDetails &&
                                                                                                                        errors
                                                                                                                            .marketGroupDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .marketGroupDetails[
                                                                                                                            idx
                                                                                                                        ].market
                                                                                                                )}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 35
                                                                                                            }
                                                                                                        }}
                                                                                                        variant="outlined"
                                                                                                        // name={`marketGroupDetails.${idx}.description`}
                                                                                                        // value={
                                                                                                        //    &&
                                                                                                        //   values
                                                                                                        //     .marketGroupDetails[
                                                                                                        //     idx
                                                                                                        //   ].market.code
                                                                                                        // }

                                                                                                        value={
                                                                                                            values.marketGroupDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.marketGroupDetails[idx]
                                                                                                                .market
                                                                                                                ? values.marketGroupDetails[
                                                                                                                      idx
                                                                                                                  ].market.name
                                                                                                                : ''
                                                                                                        }
                                                                                                        disabled={
                                                                                                            mode == 'VIEW_UPDATE' ||
                                                                                                            mode == 'VIEW'
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        // error={Boolean(
                                                                                                        //   touched.marketGroupDetails &&
                                                                                                        //     touched
                                                                                                        //       .marketGroupDetails[
                                                                                                        //       idx
                                                                                                        //     ] &&
                                                                                                        //     touched
                                                                                                        //       .marketGroupDetails[
                                                                                                        //       idx
                                                                                                        //     ].description &&
                                                                                                        //     errors.marketGroupDetails&&
                                                                                                        //     errors
                                                                                                        //       .marketGroupDetails[
                                                                                                        //       idx
                                                                                                        //     ] &&
                                                                                                        //     errors
                                                                                                        //       .marketGroupDetails[
                                                                                                        //       idx
                                                                                                        //     ].description
                                                                                                        // )}
                                                                                                        // helperText={
                                                                                                        //   touched.marketGroupDetails &&
                                                                                                        //   touched
                                                                                                        //     .marketGroupDetails[
                                                                                                        //     idx
                                                                                                        //   ] &&
                                                                                                        //   touched
                                                                                                        //     .marketGroupDetails[
                                                                                                        //     idx
                                                                                                        //   ].description &&
                                                                                                        //   errors.marketGroupDetails &&
                                                                                                        //   errors
                                                                                                        //     .marketGroupDetails[
                                                                                                        //     idx
                                                                                                        //   ] &&
                                                                                                        //   errors
                                                                                                        //     .marketGroupDetails[
                                                                                                        //     idx
                                                                                                        //   ].description
                                                                                                        //     ? errors
                                                                                                        //         .marketGroupDetails[
                                                                                                        //         idx
                                                                                                        //       ].description
                                                                                                        //     : ""
                                                                                                        // }
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        <FormControlLabel
                                                                                                            name={`marketGroupDetails.${idx}.status`}
                                                                                                            onChange={handleChange}
                                                                                                            value={
                                                                                                                values.marketGroupDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                values.marketGroupDetails[
                                                                                                                    idx
                                                                                                                ].status
                                                                                                            }
                                                                                                            control={
                                                                                                                <Switch color="success" />
                                                                                                            }
                                                                                                            // label="Status"
                                                                                                            checked={
                                                                                                                values.marketGroupDetails[
                                                                                                                    idx
                                                                                                                ].status
                                                                                                            }

                                                                                                            // disabled={mode == 'VIEW'}
                                                                                                        />
                                                                                                    </FormGroup>
                                                                                                    {/* <Checkbox
                                                                                                        onChange={handleChange}
                                                                                                        name={`marketGroupDetails.${idx}.status`}
                                                                                                        checked={
                                                                                                            values.marketGroupDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.marketGroupDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    ></Checkbox> */}
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

export default MarketGroup;
