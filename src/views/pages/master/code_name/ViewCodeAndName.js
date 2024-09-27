import { useEffect, useState } from 'react';
import MaterialTable from 'material-table';

import { useSelector, useDispatch } from 'react-redux';
import tableIcons from 'utils/MaterialTableIcons';
import { gridSpacing } from 'store/constant';
import CodeAndName from './CodeAndName';
import { Autocomplete, Button, Grid, MenuItem, TextField } from '@mui/material';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import {
    getAllActiveOperatorData,
    getAllClusterData,
    getAllMarketAndOperatorForCluster,
    getExisitngMarketCodesForCluster,
    getExisitngOperatorCodesForMarket,
    saveClusterAndMarketMappingData,
    saveOperatorAndMarketMappingData
} from 'store/actions/masterActions/CodeAndNameAction';
import MainCard from 'ui-component/cards/MainCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import { useRef } from 'react';
import * as yup from 'yup';
import { Box } from '@mui/system';
import { getAllActiveMarketData } from 'store/actions/masterActions/operatorActions/MarketAction';
import { makeStyles } from '@material-ui/core/styles';
import Agent from './Agent';
const useStyles = makeStyles({
    content: {
        justifyContent: 'center'
    }
});

function ViewCodeAndName() {
    const classes = useStyles();
    const ref = useRef(null);
    const initialMarketOperator = {
        market: null,
        operatorList: []
    };

    const initialValuesClusterMarketMapping = {
        cluster: null,
        marketList: []
    };

    const validationSchema = yup.object().shape({
        cluster: yup.object().typeError('Required field'),
        marketList: yup
            .array()
            .of(
                yup.object().shape({
                    value: yup.string(),
                    code: yup.string(),
                    name: yup.string()
                })
            )
            .min(1, 'Required Field')
    });

    const validationSchemaMarketOperator = yup.object().shape({
        market: yup.object().typeError('Required field'),
        operatorList: yup
            .array()
            .of(
                yup.object().shape({
                    value: yup.string(),
                    code: yup.string(),
                    name: yup.string()
                })
            )
            .min(1, 'Required Field')
    });

    const [open, setOpen] = useState(false);
    const [openAgent, setAgentOpen] = useState(false);
    const [ccode, setCode] = useState('');
    const [operatorCode, setOperatorCode] = useState('');
    const [marketCode, setMarketCode] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [clusterListOptions, setClusterListOptions] = useState([]);
    const [marketListOptions, setMarketListOptions] = useState([]);
    const [operatorListOptions, setOperatorListOptions] = useState([]);

    const dispatch = useDispatch();
    const error = useSelector((state) => state.codeAndNameReducer.errorMsg);

    const codeAndNameData = useSelector((state) => state.codeAndNameReducer.codeAndName);
    const clusterMarketMappingData = useSelector((state) => state.codeAndNameReducer.clusterMarketMappingData);
    const clusterListData = useSelector((state) => state.codeAndNameReducer.cluterTypesDetails);
    const marketListData = useSelector((state) => state.marketReducer.marketActiveList);
    const lastModifiedDate = useSelector((state) => state.codeAndNameReducer.lastModifiedDateTime);
    const operatorListData = useSelector((state) => state.codeAndNameReducer.operatorTypesDetails);
    const marketMappingWithCluster = useSelector((state) => state.codeAndNameReducer.marketMappingWithCluster);
    const operatorMappingWithMarket = useSelector((state) => state.codeAndNameReducer.operatorMappingWithMarket);
    const marketOperatorMappingData = useSelector((state) => state.codeAndNameReducer.marketOperatorMappingData);

    const dataToTableView = useSelector((state) => state.codeAndNameReducer.dataToTableView);
    const agentData = useSelector((state) => state.agentReducer.agent);
    console.log(agentData);
    const handleClickOpenAgentForm = (code, marketCode) => {
        console.log('market Code:' + marketCode);
        setOperatorCode(code);
        setMode('INSERT');
        setAgentOpen(true);
        setMarketCode(marketCode);
        // setType('');
    };

    const columns = [
        {
            title: 'Market',
            field: 'marketList',
            filterPlaceholder: 'filter',
            align: 'left'
        },
        {
            title: 'Operator',
            field: 'operatorList',
            filterPlaceholder: 'filter',
            align: 'left',

            render: (rowData) => (
                console.log(rowData.operatorList),
                (
                    <div
                        style={{
                            alignItems: 'center',
                            align: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            {rowData.operatorList?.split(',').map((type) => (
                                <Button
                                    variant="outlined"
                                    type="button"
                                    style={{
                                        // backgroundColor: '#B22222',
                                        marginLeft: '10px'
                                    }}
                                    onClick={(e) => handleClickOpenAgentForm(type, rowData.marketList)}
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>
                )
            )
        }
    ];

    useEffect(() => {
        setTableData(dataToTableView);
    }, [dataToTableView]);

    useEffect(() => {
        // if (marketMappingWithCluster?.payload?.length > 0) {

        setMarketListOptions(marketMappingWithCluster);
    }, [marketMappingWithCluster]);

    useEffect(() => {
        if (operatorMappingWithMarket?.length > 0) {
            setOperatorListOptions(operatorMappingWithMarket);
        }
    }, [operatorMappingWithMarket]);

    useEffect(() => {
        if (codeAndNameData != null) {
            setHandleToast(true);

            // dispatch(getAllCodeAndNameDetails());
            // dispatch(getLatestModifiedDetails());
        } else {
        }
    }, [codeAndNameData]);

    useEffect(() => {
        if (agentData != null) {
            setHandleToast(true);
        } else {
        }
    }, [agentData]);

    useEffect(() => {
        if (clusterMarketMappingData != null) {
            setHandleToast(true);

            // dispatch(getAllCodeAndNameDetails());
            // dispatch(getLatestModifiedDetails());
        }
    }, [clusterMarketMappingData]);

    useEffect(() => {
        if (marketOperatorMappingData != null) {
            setHandleToast(true);

            // dispatch(getAllCodeAndNameDetails());
            // dispatch(getLatestModifiedDetails());
        } else {
        }
    }, [marketOperatorMappingData]);

    useEffect(() => {
        if (clusterListData != null) {
            setClusterListOptions(clusterListData);
        }
    }, [clusterListData]);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        setMarketListOptions(marketListData);
    }, [marketListData]);

    useEffect(() => {
        dispatch(getAllClusterData());
        dispatch(getAllActiveMarketData());
        dispatch(getAllActiveOperatorData());
        // dispatch(getAllMarketAndOperatorForCluster());
    }, []);

    useEffect(() => {
        if (operatorListData != null) {
            setOperatorListOptions(operatorListData);
        }
    }, [operatorListData]);

    const [lastModifiedTimeDate, setLastModifiedTimeDate] = useState(null);
    useEffect(() => {
        setLastModifiedTimeDate(
            lastModifiedDate === null
                ? ''
                : new Date(lastModifiedDate).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                  })
        );
    }, [lastModifiedDate]);

    const handleClickOpen = () => {
        const type = 'INSERT';
        setCode('');
        setMode(type);
        setOpen(true);
    };

    const handleSubmitForm = async (data) => {
        if (mode === 'INSERT') {
            dispatch(saveClusterAndMarketMappingData(data));
        }

        handleClose();
    };

    const handleMarketOperatorSubmitForm = async (data) => {
        dispatch(saveOperatorAndMarketMappingData(data));

        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
        setAgentOpen(false);
        dispatch(getAllClusterData());
        dispatch(getAllActiveMarketData());
        dispatch(getAllActiveOperatorData());
    };

    const loadExisitngMarketCodesForCluster = (value) => {
        dispatch(getExisitngMarketCodesForCluster(value.clusterId));
    };

    const loadExisitngOperatorCodesForMarket = (value) => {
        dispatch(getExisitngOperatorCodesForMarket(value.marketId));
    };

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };

    const loadTableData = (value) => {
        dispatch(getAllMarketAndOperatorForCluster(value.clusterId));
    };
    return (
        <div>
            <MainCard title="Code And Name">
                <div style={{ textAlign: 'right' }}>
                    {' '}
                    {/* Last Modified Date : {lastModifiedTimeDate} */}
                    <Button variant="contained" type="button" className="btnSave" onClick={handleClickOpen}>
                        Add new
                    </Button>
                </div>
                <br />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Accordion square>
                                    <AccordionSummary
                                        style={{ background: 'linear-gradient(to right bottom, #516a9f, #1877f2)' }}
                                        // sx={{
                                        //     backgroundColor: '#1877f2'
                                        // }}
                                        classes={{ content: classes.content }}
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography
                                            sx={{
                                                color: 'white'
                                            }}
                                        >
                                            Map Cluster,Market And Operator
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Formik
                                                        // innerRef={ref}
                                                        enableReinitialize={true}
                                                        initialValues={{ ...initialValuesClusterMarketMapping }}
                                                        onSubmit={(values, { resetForm }) => {
                                                            handleSubmitForm(values);
                                                            resetForm({ values: '' });
                                                        }}
                                                        // onReset={handleReset}
                                                        validationSchema={validationSchema}
                                                    >
                                                        {({
                                                            values,
                                                            handleChange,
                                                            setFieldValue,
                                                            errors,
                                                            handleBlur,
                                                            touched,
                                                            resetForm
                                                        }) => {
                                                            return (
                                                                <Form>
                                                                    <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                        <Grid gap="10px" display="flex">
                                                                            <Grid item>
                                                                                <Autocomplete
                                                                                    value={values.cluster}
                                                                                    name="cluster"
                                                                                    disabled={mode == 'VIEW'}
                                                                                    onChange={(_, value) => {
                                                                                        setFieldValue(`cluster`, value);
                                                                                        loadExisitngMarketCodesForCluster(value);
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    options={clusterListOptions}
                                                                                    getOptionLabel={(option) =>
                                                                                        `${option.code} - ${option.name}`
                                                                                    }
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            label="Cluster"
                                                                                            sx={{
                                                                                                width: { sm: 300 },
                                                                                                '& .MuiInputBase-root': {
                                                                                                    height: 41
                                                                                                }
                                                                                            }}
                                                                                            InputLabelProps={{
                                                                                                shrink: true
                                                                                            }}
                                                                                            error={Boolean(
                                                                                                touched.cluster && errors.cluster
                                                                                            )}
                                                                                            helperText={
                                                                                                touched.cluster && errors.cluster
                                                                                                    ? errors.cluster
                                                                                                    : ''
                                                                                            }
                                                                                            // placeholder="--Select a Manager Code --"
                                                                                            variant="outlined"
                                                                                            name="cluster"
                                                                                            onBlur={handleBlur}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                        <br />

                                                                        <Grid gap="10px" display="flex">
                                                                            <Grid>
                                                                                <Autocomplete
                                                                                    value={values.marketList}
                                                                                    name="marketList"
                                                                                    multiple={true}
                                                                                    disabled={mode == 'VIEW'}
                                                                                    onChange={(_, value) => {
                                                                                        setFieldValue(`marketList`, value);
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    options={marketListOptions}
                                                                                    getOptionLabel={(option) =>
                                                                                        `${option.code} - ${option.name}`
                                                                                    }
                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                        option.marketId === value.marketId
                                                                                    }
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            label="Markets"
                                                                                            sx={{
                                                                                                width: { sm: 300 },
                                                                                                '& .MuiInputBase-root': {
                                                                                                    height: 41
                                                                                                }
                                                                                            }}
                                                                                            InputLabelProps={{
                                                                                                shrink: true
                                                                                            }}
                                                                                            error={Boolean(
                                                                                                touched.marketList && errors.marketList
                                                                                            )}
                                                                                            helperText={
                                                                                                touched.marketList && errors.marketList
                                                                                                    ? errors.marketList
                                                                                                    : ''
                                                                                            }
                                                                                            // placeholder="--Select a Manager Code --"
                                                                                            variant="outlined"
                                                                                            name="marketList"
                                                                                            onBlur={handleBlur}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </div>
                                                                    <Box
                                                                        display="flex"
                                                                        flexDirection="row-reverse"
                                                                        style={{ marginTop: '20px' }}
                                                                    >
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
                                                                                Reset
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
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Formik
                                                        innerRef={ref}
                                                        enableReinitialize={true}
                                                        initialValues={{ ...initialMarketOperator }}
                                                        onSubmit={(values, { resetForm }) => {
                                                            handleMarketOperatorSubmitForm(values);
                                                            resetForm({ values: '' });
                                                        }}
                                                        // onReset={handleReset}
                                                        validationSchema={validationSchemaMarketOperator}
                                                    >
                                                        {({
                                                            values,
                                                            handleChange,
                                                            setFieldValue,
                                                            errors,
                                                            handleBlur,
                                                            touched,
                                                            resetForm
                                                        }) => {
                                                            return (
                                                                <Form>
                                                                    <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                        <Grid gap="10px" display="flex">
                                                                            <Grid item>
                                                                                <Autocomplete
                                                                                    value={values.market}
                                                                                    name="market"
                                                                                    disabled={mode == 'VIEW'}
                                                                                    onChange={(_, value) => {
                                                                                        setFieldValue(`market`, value);
                                                                                        loadExisitngOperatorCodesForMarket(value);
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    options={marketListOptions}
                                                                                    getOptionLabel={(option) =>
                                                                                        `${option.code} - ${option.name}`
                                                                                    }
                                                                                    isOptionEqualToValue={(option, value) =>
                                                                                        option.marketId === value.marketId
                                                                                    }
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            label="Market"
                                                                                            sx={{
                                                                                                width: { sm: 300 },
                                                                                                '& .MuiInputBase-root': {
                                                                                                    height: 41
                                                                                                }
                                                                                            }}
                                                                                            InputLabelProps={{
                                                                                                shrink: true
                                                                                            }}
                                                                                            error={Boolean(touched.market && errors.market)}
                                                                                            helperText={
                                                                                                touched.market && errors.market
                                                                                                    ? errors.market
                                                                                                    : ''
                                                                                            }
                                                                                            // placeholder="--Select a Manager Code --"
                                                                                            variant="outlined"
                                                                                            name="market"
                                                                                            onBlur={handleBlur}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                        <br />

                                                                        <Grid gap="10px" display="flex">
                                                                            <Grid>
                                                                                <Autocomplete
                                                                                    value={values.operatorList}
                                                                                    name="operatorList"
                                                                                    multiple={true}
                                                                                    disabled={mode == 'VIEW'}
                                                                                    onChange={(_, value) => {
                                                                                        setFieldValue(`operatorList`, value);
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    options={operatorListOptions}
                                                                                    getOptionLabel={(option) =>
                                                                                        `${option.code} - ${option.name}`
                                                                                    }
                                                                                    renderInput={(params) => (
                                                                                        <TextField
                                                                                            {...params}
                                                                                            label="Operator"
                                                                                            sx={{
                                                                                                width: { sm: 300 },
                                                                                                '& .MuiInputBase-root': {
                                                                                                    height: 41
                                                                                                }
                                                                                            }}
                                                                                            InputLabelProps={{
                                                                                                shrink: true
                                                                                            }}
                                                                                            error={Boolean(
                                                                                                touched.operatorList && errors.operatorList
                                                                                            )}
                                                                                            helperText={
                                                                                                touched.operatorList && errors.operatorList
                                                                                                    ? errors.operatorList
                                                                                                    : ''
                                                                                            }
                                                                                            variant="outlined"
                                                                                            name="operatorList"
                                                                                            onBlur={handleBlur}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </div>

                                                                    {/* <br /> */}
                                                                    {/* <Box>
                                                                        <Grid item>
                                                                            {mode === 'VIEW' ? (
                                                                                <CreatedUpdatedUserDetailsWithTableFormat
                                                                                    formValues={values}
                                                                                />
                                                                            ) : null}
                                                                        </Grid>
                                                                    </Box> */}

                                                                    <Box
                                                                        display="flex"
                                                                        flexDirection="row-reverse"
                                                                        style={{ marginTop: '20px' }}
                                                                    >
                                                                        {/* {mode != 'VIEW' ? ( */}
                                                                        <Button
                                                                            variant="outlined"
                                                                            type="button"
                                                                            style={{
                                                                                // backgroundColor: '#B22222',
                                                                                marginLeft: '10px'
                                                                            }}
                                                                            onClick={(e) => resetForm()}
                                                                        >
                                                                            Reset
                                                                        </Button>
                                                                        {/* ) : (
                                                                            ''
                                                                        )} */}

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
                                                    {/* <Item>xs=4</Item> */}
                                                </Grid>
                                                {/* <Grid item xs={4}>
                                                    <Item>xs=4</Item>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Item>xs=8</Item>
                                                </Grid> */}
                                            </Grid>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion square>
                                    <AccordionSummary
                                        style={{ background: 'linear-gradient(to right bottom, #516a9f, #1877f2)' }}
                                        classes={{ content: classes.content }}
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                        <Typography
                                            sx={{
                                                color: 'white'
                                            }}
                                        >
                                            Cluster, Market And Operator List
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid>
                                            <Formik
                                                enableReinitialize={true}
                                                initialValues={initialValuesClusterMarketMapping}
                                                // // onSubmit={handleSubmit}
                                                // onSubmit={(values, resetForm) => {
                                                //     handleSubmit(values);
                                                //     resetForm('');
                                                // }}
                                                // validationSchema={validationSchema1}
                                            >
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        <Autocomplete
                                                                            // value={values.cluster}
                                                                            name="cluster"
                                                                            disabled={mode == 'VIEW'}
                                                                            onChange={(_, value) => {
                                                                                console.log(value);
                                                                                loadTableData(value);
                                                                                // setFieldValue(`cluster`, value);
                                                                                // loadExisitngMarketCodesForCluster(value);
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            options={clusterListOptions}
                                                                            getOptionLabel={(option) => `${option.code} - ${option.name}`}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Cluster"
                                                                                    sx={{
                                                                                        width: { sm: 300 },
                                                                                        '& .MuiInputBase-root': {
                                                                                            height: 41
                                                                                        }
                                                                                    }}
                                                                                    InputLabelProps={{
                                                                                        shrink: true
                                                                                    }}
                                                                                    // placeholder="--Select a Manager Code --"
                                                                                    variant="outlined"
                                                                                    name="cluster"
                                                                                    onBlur={handleBlur}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </div>

                                                            <br />
                                                        </Form>
                                                    );
                                                }}
                                            </Formik>
                                        </Grid>

                                        <Grid container spacing={gridSpacing}>
                                            <Grid item xs={12}>
                                                <Grid container spacing={gridSpacing}>
                                                    <Grid item xs={12}>
                                                        <MaterialTable
                                                            columns={columns}
                                                            data={tableData}
                                                            options={{
                                                                padding: 'dense',
                                                                showTitle: true,
                                                                sorting: true,
                                                                search: true,
                                                                searchFieldAlignment: 'right',
                                                                searchAutoFocus: true,
                                                                searchFieldVariant: 'standard',
                                                                filtering: true,
                                                                paging: true,
                                                                pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
                                                                pageSize: 10,
                                                                paginationType: 'stepped',
                                                                showFirstLastPageButtons: false,
                                                                exportButton: true,
                                                                exportAllData: true,
                                                                exportFileName: 'TableData',
                                                                actionsColumnIndex: -1,
                                                                columnsButton: true,

                                                                headerStyle: {
                                                                    whiteSpace: 'nowrap',
                                                                    height: 30,
                                                                    maxHeight: 30,
                                                                    padding: 2,
                                                                    fontSize: '14px',
                                                                    backgroundColor: '#2196F3',
                                                                    background: '-ms-linear-gradient(top, #0790E8, #3180e6)',
                                                                    background: '-webkit-linear-gradient(top, #0790E8, #3180e6)',
                                                                    textAlign: 'center',
                                                                    color: '#FFF'
                                                                },
                                                                rowStyle: {
                                                                    whiteSpace: 'nowrap',
                                                                    height: 20,
                                                                    align: 'left',
                                                                    // maxHeight: 20,
                                                                    fontSize: '13px',
                                                                    padding: 0
                                                                }
                                                            }}
                                                        />
                                                        {/* 
                                {open ? (
                                    <DepartmentDesignation open={open} handleClose={handleClose} code={code} mode={mode} type={type} />
                                ) : (
                                    ''
                                )}
                                {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                                {openErrorToast ? (
                                    <ErrorMsg openToast={openErrorToast} handleToast={setOpenErrorToast} mode={mode} />
                                ) : null} */}
                                                    </Grid>
                                                </Grid>
                                                {/* </SubCard> */}
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                                {openAgent ? (
                                    <Agent
                                        open={openAgent}
                                        handleClose={handleClose}
                                        operatorCode={operatorCode}
                                        marketCode={marketCode}
                                        // mode={mode}
                                    />
                                ) : (
                                    ''
                                )}
                                {open ? <CodeAndName open={open} handleClose={handleClose} ccode={ccode} mode={mode} /> : ''}
                                {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                                {openErrorToast ? (
                                    <ErrorMsg openToast={openErrorToast} handleToast={setOpenErrorToast} mode={mode} />
                                ) : null}
                            </Grid>
                        </Grid>
                        {/* </SubCard> */}
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
}

export default ViewCodeAndName;
