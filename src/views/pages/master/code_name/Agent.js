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
    Switch,
    TablePagination,
    TableFooter
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
import countryList from 'react-select-country-list';
import { useMemo } from 'react';
import { getAgentDetailsByMarketCodeAndOperatorCode, saveAgentData, updateAgentData } from 'store/actions/masterActions/AgentAction';

const Agent = ({ open, handleClose, operatorCode, marketCode }) => {
    const initialValues1 = {
        marketCode: marketCode,
        operator: operatorCode,
        agentName: '',
        country: '',
        postalCode: '',
        address: '',
        fax: '',
        phone: '',
        remarks: '',
        status: true,
        agentDetails: [
            {
                agentId: '',
                designationType: '',
                name: '',
                email: '',
                status: true
            }
        ]
    };

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = yup.object().shape({
        marketCode: yup.string().required('Required field'),
        operator: yup.string().required('Required field'),
        agentName: yup.string().required('Required field'),
        address: yup.string().required('Required field'),
        // postalCode: yup.string().required('Required field'),
        phone: yup
            .string()
            .matches(phoneRegExp, ' Not valid')
            .min(10, 'Must be  10 digits')
            .max(10, 'Must be  10 digits')
            .required('Required field'),
        status: yup.boolean(),
        agentDetails: yup.array().of(
            yup.object().shape({
                name: yup.string(),
                email: yup.string().email()
            })
        )
    });

    const handleSubmitForm = (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            dispatch(saveAgentData(data));
        } else {
            dispatch(updateAgentData(data));
        }
        handleClose();
    };
    const options = useMemo(() => countryList().getData(), []);
    const clusterListData = useSelector((state) => state.codeAndNameReducer.cluterTypesDetails);
    const [loadValues, setLoadValues] = useState(null);
    const [mode, setMode] = useState('INSERT');
    const ref = useRef(null);
    const [clusterListOptions, setClusterListOptions] = useState([]);
    const dispatch = useDispatch();
    const managerToUpdate = useSelector((state) => state.managerReducer.managerToUpdate);

    // peginator
    const pages = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    // const TablePagination = () => <TablePagination component="div" page={page} rowsPerPageOptions={pages} rowsPerPage={rowsPerPage} />;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        console.log('data:' + clusterListData);
        if (clusterListData != null) {
            console.log('data 678:' + clusterListData.codeAndNameDetail);
            setClusterListOptions(clusterListData);
        }
    }, [clusterListData]);

    const duplicateCode = useSelector((state) => state.managerReducer.duplicateCode);
    const agentToUpdate = useSelector((state) => state.agentReducer.agentToUpdate);
    useEffect(() => {
        dispatch(getAllClusterData());
    }, []);

    useEffect(() => {
        dispatch(getAgentDetailsByMarketCodeAndOperatorCode(operatorCode, marketCode));
    }, [operatorCode]);

    useEffect(() => {
        if (agentToUpdate?.errorMessages[0] != 'Not found agent.') {
            const dataArray = [];

            const initialValuesUp = {
                agentId: agentToUpdate?.payload[0].agentId,
                marketCode: marketCode,
                operator: operatorCode,
                agentName: agentToUpdate?.payload[0].agentName,
                country: agentToUpdate?.payload[0].country,
                postalCode: agentToUpdate?.payload[0].postalCode,
                address: agentToUpdate?.payload[0].address,
                fax: agentToUpdate?.payload[0].fax,
                phone: agentToUpdate?.payload[0].phone,
                remarks: agentToUpdate?.payload[0].remarks,
                status: agentToUpdate?.payload[0].status,
                agentDetails: []
            };
            agentToUpdate?.payload[0].agentDetails.map((item) => {
                const details = {
                    id: item.id,
                    designationType: item.designationType,
                    name: item.name,
                    email: item.email,
                    status: item.status
                };
                initialValuesUp.agentDetails.push(details);
                setLoadValues(initialValuesUp);
            });

            setMode('VIEW_UPDATE');
        } else {
            setLoadValues(initialValues1);
            setMode('INSERT');
        }
    }, [agentToUpdate]);

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
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Agent
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
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Market Code"
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="marketCode"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.marketCode}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.marketCode && errors.marketCode)}
                                                                            helperText={
                                                                                touched.marketCode && errors.marketCode
                                                                                    ? errors.marketCode
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Operator Code"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="operator"
                                                                            disabled
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.operator}
                                                                            error={Boolean(touched.operator && errors.operator)}
                                                                            helperText={
                                                                                touched.operator && errors.operator ? errors.operator : ''
                                                                            }
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            label="Agent Name"
                                                                            name="agentName"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            value={values.agentName}
                                                                            error={Boolean(touched.agentName && errors.agentName)}
                                                                            helperText={
                                                                                touched.agentName && errors.agentName
                                                                                    ? errors.agentName
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            value={values.country}
                                                                            name="country"
                                                                            onChange={(_, value) => {
                                                                                console.log(values.label);
                                                                                setFieldValue(`country`, value.label);
                                                                            }}
                                                                            options={options}
                                                                            // getOptionLabel={(option) => `${option} `}
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
                                                                                    // value={values.country}
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <br />

                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Address"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            name="address"
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
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Postal Code"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            name="postalCode"
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.postalCode}
                                                                            error={Boolean(touched.postalCode && errors.postalCode)}
                                                                            helperText={
                                                                                touched.postalCode && errors.postalCode
                                                                                    ? errors.postalCode
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Fax"
                                                                            name="fax"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.fax}
                                                                            error={Boolean(touched.fax && errors.fax)}
                                                                            helperText={touched.fax && errors.fax ? errors.fax : ''}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Phone"
                                                                            name="phone"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.phone}
                                                                            error={Boolean(touched.phone && errors.phone)}
                                                                            helperText={touched.phone && errors.phone ? errors.phone : ''}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <br />
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 500 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            id="outlined-required"
                                                                            label="Remarks"
                                                                            name="remarks"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.remarks}
                                                                            error={Boolean(touched.remarks && errors.remarks)}
                                                                            helperText={
                                                                                touched.remarks && errors.remarks ? errors.remarks : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="status"
                                                                                disabled={mode == 'VIEW'}
                                                                                onChange={handleChange}
                                                                                value={values.status}
                                                                                control={<Switch color="success" />}
                                                                                label="Status"
                                                                                checked={values.status}

                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>

                                                            <FieldArray name="agentDetails">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        <Box
                                                                            sx={{ fontWeight: 500, fontSize: 'h6.fontSize' }}
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            justifyContent="center"
                                                                        >
                                                                            Agent Details
                                                                        </Box>

                                                                        {/* </DialogTitle> */}
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    onClick={() => {
                                                                                        push({
                                                                                            designationType: '',
                                                                                            id: '',
                                                                                            name: '',
                                                                                            email: '',
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
                                                                                        {/* <TableCell>{idx + 1}</TableCell> */}
                                                                                        {/* <TableCell>Sequence</TableCell> */}
                                                                                        <TableCell>Designation</TableCell>
                                                                                        <TableCell>Name</TableCell>
                                                                                        <TableCell>Email</TableCell>
                                                                                        <TableCell>Status</TableCell>
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {(rowsPerPage > 0
                                                                                        ? values.agentDetails.slice(
                                                                                              page * rowsPerPage,
                                                                                              page * rowsPerPage + rowsPerPage
                                                                                          )
                                                                                        : values.agentDetails
                                                                                    ).map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                {/*  */}
                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { xs: 100, sm: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        // disabled={
                                                                                                        //     mode == 'VIEW_UPDATE' ||
                                                                                                        //     mode == 'VIEW'
                                                                                                        // }
                                                                                                        select
                                                                                                        InputLabelProps={{
                                                                                                            shrink: true
                                                                                                        }}
                                                                                                        // label="Designation Type"
                                                                                                        name={`agentDetails.${idx}.designationType`}
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        value={
                                                                                                            values.agentDetails[idx] &&
                                                                                                            values.agentDetails[idx]
                                                                                                                .designationType
                                                                                                        }
                                                                                                        error={Boolean(
                                                                                                            touched.agentDetails &&
                                                                                                                touched.agentDetails[idx] &&
                                                                                                                touched.agentDetails[idx]
                                                                                                                    .designationType &&
                                                                                                                errors.agentDetails &&
                                                                                                                errors.agentDetails[idx] &&
                                                                                                                errors.agentDetails[idx]
                                                                                                                    .designationType
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.agentDetails &&
                                                                                                            touched.agentDetails[idx] &&
                                                                                                            touched.agentDetails[idx]
                                                                                                                .designationType &&
                                                                                                            errors.agentDetails &&
                                                                                                            errors.agentDetails[idx] &&
                                                                                                            errors.agentDetails[idx]
                                                                                                                .designationType
                                                                                                                ? errors.agentDetails[idx]
                                                                                                                      .designationType
                                                                                                                : ''
                                                                                                        }
                                                                                                    >
                                                                                                        <MenuItem
                                                                                                            dense={true}
                                                                                                            value={'ResidentAgent'}
                                                                                                        >
                                                                                                            Resident Agent
                                                                                                        </MenuItem>
                                                                                                        <MenuItem
                                                                                                            dense={true}
                                                                                                            value={'ContactPerson'}
                                                                                                        >
                                                                                                            Contact Person
                                                                                                        </MenuItem>
                                                                                                    </TextField>{' '}
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
                                                                                                        name={`agentDetails.${idx}.name`}
                                                                                                        value={
                                                                                                            values.agentDetails[idx] &&
                                                                                                            values.agentDetails[idx].name
                                                                                                        }
                                                                                                        error={Boolean(
                                                                                                            touched.agentDetails &&
                                                                                                                touched.agentDetails[idx] &&
                                                                                                                touched.agentDetails[idx]
                                                                                                                    .designationType &&
                                                                                                                errors.agentDetails &&
                                                                                                                errors.agentDetails[idx] &&
                                                                                                                errors.agentDetails[idx]
                                                                                                                    .designationType
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.agentDetails &&
                                                                                                            touched.agentDetails[idx] &&
                                                                                                            touched.agentDetails[idx]
                                                                                                                .designationType &&
                                                                                                            errors.agentDetails &&
                                                                                                            errors.agentDetails[idx] &&
                                                                                                            errors.agentDetails[idx]
                                                                                                                .designationType
                                                                                                                ? errors.agentDetails[idx]
                                                                                                                      .designationType
                                                                                                                : ''
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
                                                                                                        value={
                                                                                                            values.agentDetails[idx] &&
                                                                                                            values.agentDetails[idx].email
                                                                                                        }
                                                                                                        error={Boolean(
                                                                                                            touched.agentDetails &&
                                                                                                                touched.agentDetails[idx] &&
                                                                                                                touched.agentDetails[idx]
                                                                                                                    .email &&
                                                                                                                errors.agentDetails &&
                                                                                                                errors.agentDetails[idx] &&
                                                                                                                errors.agentDetails[idx]
                                                                                                                    .email
                                                                                                        )}
                                                                                                        helperText={
                                                                                                            touched.agentDetails &&
                                                                                                            touched.agentDetails[idx] &&
                                                                                                            touched.agentDetails[idx]
                                                                                                                .email &&
                                                                                                            errors.agentDetails &&
                                                                                                            errors.agentDetails[idx] &&
                                                                                                            errors.agentDetails[idx].email
                                                                                                                ? errors.agentDetails[idx]
                                                                                                                      .email
                                                                                                                : ''
                                                                                                        }
                                                                                                        name={`agentDetails.${idx}.email`}
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        <FormControlLabel
                                                                                                            name={`agentDetails.${idx}.status`}
                                                                                                            onChange={handleChange}
                                                                                                            value={
                                                                                                                values.agentDetails[idx] &&
                                                                                                                values.agentDetails[idx]
                                                                                                                    .status
                                                                                                            }
                                                                                                            control={
                                                                                                                <Switch color="success" />
                                                                                                            }
                                                                                                            // label="Status"
                                                                                                            checked={
                                                                                                                values.agentDetails[idx]
                                                                                                                    .status
                                                                                                            }

                                                                                                            // disabled={mode == 'VIEW'}
                                                                                                        />
                                                                                                    </FormGroup>
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    {(values.agentDetails[idx] &&
                                                                                                        values.agentDetails[idx].id) ===
                                                                                                    '' ? (
                                                                                                        <IconButton
                                                                                                            aria-label="delete"
                                                                                                            onClick={() => {
                                                                                                                remove(idx);
                                                                                                            }}
                                                                                                        >
                                                                                                            <HighlightOffIcon />
                                                                                                        </IconButton>
                                                                                                    ) : null}
                                                                                                    {/* <IconButton
                                                                                                        aria-label="delete"
                                                                                                        onClick={() => {
                                                                                                            remove(idx);
                                                                                                        }}
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    >
                                                                                                        <HighlightOffIcon />
                                                                                                    </IconButton> */}
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                                <TableFooter>
                                                                                    <TableRow>
                                                                                        <TablePagination
                                                                                            rowsPerPageOptions={[
                                                                                                5, 10, 25
                                                                                                // { label: 'All', value: -1 }
                                                                                            ]}
                                                                                            count={values.agentDetails.length}
                                                                                            rowsPerPage={rowsPerPage}
                                                                                            page={page}
                                                                                            SelectProps={{
                                                                                                inputProps: {
                                                                                                    'aria-label': 'rows per page'
                                                                                                },
                                                                                                native: true
                                                                                            }}
                                                                                            onPageChange={handleChangePage}
                                                                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                                                                            //   ActionsComponent={TablePaginationActions}
                                                                                        />
                                                                                    </TableRow>
                                                                                </TableFooter>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    </Paper>
                                                                )}
                                                            </FieldArray>

                                                            <br />
                                                            <Box>
                                                                {/* <Grid item>
                                                                    {mode === 'VIEW' ? (
                                                                        // <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                    ) : null}
                                                                </Grid> */}
                                                            </Box>
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

export default Agent;
