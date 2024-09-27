import { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from 'react-redux';
import { gridSpacing } from 'store/constant';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
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
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Box } from '@mui/system';
import { getAllActiveMarketData } from 'store/actions/masterActions/operatorActions/MarketAction';
import { makeStyles } from '@material-ui/core/styles';
import MainTransportCategories from './MainTransportCategories';
import DistancesDetails from './DistancesDetails';
import PaxVehicleRate from './PaxVehicleRate';
import { getAllActiveTransportMainCategoryDataByType } from 'store/actions/masterActions/transportActions/MainTransportCategoriesActions';
import BaggageTransportRate from './BaggageTransportRate';

const useStyles = makeStyles({
    content: {
        justifyContent: 'center'
    }
});

function TransportMainScreen() {
    const classes = useStyles();

    const headerInitialValues = {
        transportType: null,
        description: ''
    };

    const [open, setOpen] = useState(false);
    const [openAgent, setAgentOpen] = useState(false);
    const [ccode, setCode] = useState('');
    const [operatorCode, setOperatorCode] = useState('');
    const [marketCode, setMarketCode] = useState('');
    const [selectedTransportType, setSelectedTransportType] = useState('');
    const [mode, setMode] = useState('INSERT');
    const [activeTransportTypeCategoryDetails, setActiveTransportTypeCategoryDetails] = useState('');
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);

    const dispatch = useDispatch();
    const error = useSelector((state) => state.bagggeTransportRateReducer.errorMsg);
    const error2 = useSelector((state) => state.paxVehicleRateReducer.errorMsg);
    const lastModifiedDate = useSelector((state) => state.codeAndNameReducer.lastModifiedDateTime);
    const dataToTableView = useSelector((state) => state.codeAndNameReducer.dataToTableView);
    const agentData = useSelector((state) => state.agentReducer.agent);
    const mainTransportDetail = useSelector((state) => state.mainTransportCategoryReducer.mainTransportDetail);
    const distance = useSelector((state) => state.distanceReducer.distance);
    const activeCategoryDetails = useSelector((state) => state.mainTransportCategoryReducer.activeCategoryDetails);
    const paxVehicleRate = useSelector((state) => state.paxVehicleRateReducer.paxVehicleRate);
    const updatedPaxVehicleRate = useSelector((state) => state.paxVehicleRateReducer.updatedPaxVehicleRate);
    const bagggeTransportRate = useSelector((state) => state.bagggeTransportRateReducer.bagggeTransportRate);
    const updatedBagggeTransportRate = useSelector((state) => state.bagggeTransportRateReducer.updatedBagggeTransportRate);

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
        if (mainTransportDetail != null) {
            setHandleToast(true);
            dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));

            // dispatch(getAllCodeAndNameDetails());
            // dispatch(getLatestModifiedDetails());
        } else {
        }
    }, [mainTransportDetail]);

    useEffect(() => {
        if (distance != null) {
            setHandleToast(true);
            dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
            window.location.reload(false);
        } else {
        }
    }, [distance]);

    useEffect(() => {
        if (paxVehicleRate != null) {
            // async function makeRequest() {
            //     setHandleToast(true);
            //     dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
            //     // await delay(10);
            //     // console.log('after');
            //     window.location.reload(false);
            // }

            // makeRequest();
            setHandleToast(true);
            dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
            window.location.reload(false);
        } else {
        }
    }, [paxVehicleRate]);

    useEffect(() => {
        if (bagggeTransportRate != null) {
            setHandleToast(true);
            dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
            window.location.reload(false);
        } else {
        }
    }, [bagggeTransportRate]);

    useEffect(() => {
        if (updatedBagggeTransportRate != null) {
            setHandleToast(true);
            dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
            window.location.reload(false);
        } else {
        }
    }, [updatedBagggeTransportRate]);

    useEffect(() => {
        if (updatedPaxVehicleRate != null) {
            setHandleToast(true);
            dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
            window.location.reload(false);
        } else {
        }
    }, [updatedPaxVehicleRate]);
    useEffect(() => {}, [selectedTransportType]);

    useEffect(() => {
        dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
    }, []);

    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
        }
    }, [error]);

    useEffect(() => {
        if (error2 != null) {
            setOpenErrorToast(true);
        }
    }, [error2]);

    useEffect(() => {
        if (activeCategoryDetails != null) {
            console.log(activeCategoryDetails);
            setActiveTransportTypeCategoryDetails(activeCategoryDetails);
        }
        // dispatch(getAllClusterData());
        // dispatch(getAllActiveMarketData());
        // dispatch(getAllActiveOperatorData());
        // dispatch(getAllMarketAndOperatorForCluster());
    }, [activeCategoryDetails]);

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

    const handleClose = () => {
        setOpen(false);
        setAgentOpen(false);
        // dispatch(getAllClusterData());
        // dispatch(getAllActiveMarketData());
        // dispatch(getAllActiveOperatorData());
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
            <MainCard title="Transport Details Management">
                <div style={{ textAlign: 'right' }}>
                    {' '}
                    {/* Last Modified Date : {lastModifiedTimeDate} */}
                    <Button variant="contained" type="button" className="btnSave" onClick={handleClickOpen}>
                        Add New Category
                    </Button>
                </div>
                <br />
                <br />

                <Grid container spacing={gridSpacing} className="row">
                    <Grid item>
                        <Formik
                            enableReinitialize={true}
                            initialValues={headerInitialValues || loadValues}
                            onSubmit={(values, { resetForm }) => {
                                // handleSubmit(values);
                                resetForm('');
                            }}
                            // validationSchema={validationSchema1}
                        >
                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                return (
                                    <Form>
                                        <div style={{ marginTop: '6px', margin: '10px' }}>
                                            <Grid container spacing={gridSpacing}>
                                                <Grid item>
                                                    <Autocomplete
                                                        value={values.transportType}
                                                        name="transportType"
                                                        disabled={mode == 'VIEW'}
                                                        disableClearable={true}
                                                        onChange={(_, value) => {
                                                            setFieldValue(`transportType`, value);
                                                            setSelectedTransportType(value);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        options={activeTransportTypeCategoryDetails}
                                                        getOptionLabel={(option) => `${option.typeCode} - ${option.description}`}
                                                        // isOptionEqualToValue={(option, value) => option.marketId === value.marketId}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Transport Type Code"
                                                                sx={{
                                                                    width: { xs: 200 },
                                                                    '& .MuiInputBase-root': {
                                                                        height: 41
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    shrink: true
                                                                }}
                                                                // error={Boolean(touched.fromLocation && errors.fromLocation)}
                                                                // helperText={
                                                                //     touched.fromLocation && errors.fromLocation ? errors.fromLocation : ''
                                                                // }
                                                                variant="outlined"
                                                                name="transportType"
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item>
                                                    <TextField
                                                        label="Description"
                                                        sx={{
                                                            width: { xs: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled
                                                        type="text"
                                                        variant="outlined"
                                                        name="description"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        value={
                                                            values.transportType && values.transportType
                                                                ? values.transportType.description
                                                                : ''
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        // error={Boolean(touched.fromDescription && errors.fromDescription)}
                                                        // helperText={
                                                        //     touched.fromDescription && errors.fromDescription ? errors.fromDescription : ''
                                                        // }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Accordion square>
                                    <AccordionSummary
                                        style={{ background: 'linear-gradient(to right bottom, #516a9f, #1877f2)' }}
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
                                            Distances Details
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <DistancesDetails mode={mode} selectedType={selectedTransportType}>
                                            {selectedTransportType}
                                        </DistancesDetails>
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
                                            Pax Vehicle Rate (Per Day)
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <PaxVehicleRate mode={mode} selectedType={selectedTransportType} setMode={setMode}></PaxVehicleRate>
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
                                            Baggage Transport Rates
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <BaggageTransportRate mode={mode} selectedType={selectedTransportType} setMode={setMode} />
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
                                {open ? <MainTransportCategories open={open} handleClose={handleClose} ccode={ccode} mode={mode} /> : ''}
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

export default TransportMainScreen;
