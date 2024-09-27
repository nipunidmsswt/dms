import { useEffect, forwardRef, useState, Fragment, useRef } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    FormControlLabel,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    FormGroup,
    Button,
    Typography,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    DialogContentText,
    Switch,
    Autocomplete,
    Divider,
    typographyClasses
} from '@mui/material';
import { gridSpacing } from 'store/constant';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import tableIcons from 'utils/MaterialTableIcons';
import { Formik, Form, FieldArray } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';

import Paper from '@mui/material/Paper';
import * as yup from 'yup';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { checkDuplicateSeasonCode, getSeasonDataById, saveSeasonData, updateSeasonData } from 'store/actions/masterActions/SeasonAction';
import { getHotelMainDataById } from 'store/actions/masterActions/HotelMasterAction';
import {
    getAllFacilityCounterData,
    getAllFacilityCounterDataHotelWise,
    saveFacilityCounterData,
    updateFacilityCounterData
} from 'store/actions/masterActions/FacilityCounterAction';
import MaterialTable from 'material-table';
import { updateFacilityCountSaga } from 'store/saga/mastersaga/FacilityCountSaga';
// import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

function FacilityCounter({ open, handleClose, mode, hotelCode, hotelName, hotel }) {
    const initialValues = {
        id: '',
        hotel: hotel,
        hotelCode: hotelCode,
        hotelName: hotelName,
        status: true,
        facilityCountDetails: [
            {
                facilityType: null,
                facilityCodeName: null,
                count: '',
                status: true,
                enableRow: false
            }
        ]
    };

    const columns = [
        {
            title: 'Hotel Code',
            field: 'hotelCode',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Hotel Name',
            field: 'hotelName',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Facility Type',
            field: 'facilityType',
            filterPlaceholder: 'filter',
            align: 'center'
        },

        {
            title: 'Count',
            field: 'count',
            filterPlaceholder: 'filter',
            align: 'center'
        },
        {
            title: 'Status',
            field: 'status',
            align: 'center',
            lookup: {
                true: 'Active',
                false: 'Inactive'
            },
            render: (rowData) => (
                <div
                    style={{
                        alignItems: 'center',
                        align: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {rowData.status === true ? (
                        <FormGroup>
                            <FormControlLabel control={<Switch color="success" size="small" />} checked={true} />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel control={<Switch color="error" size="small" />} checked={false} />
                        </FormGroup>
                    )}
                </div>
            )
        }
    ];

    const [loadValues, setLoadValues] = useState(null);
    const [openDialogBox, setOpenDialogBox] = useState(false);
    const hotelMainToUpdate = useSelector((state) => state.hotelMainReducer.hotelMainToUpdate);
    const ref = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [selectedFacilityType, setSelectedFacilityType] = useState(null);
    const [activeServiceOfferedListData, setActiveServiceOfferedListData] = useState([]);
    const facilityCountList = useSelector((state) => state.facilityCountReducer.facilityCountList);
    // facilityCountListHotelWise
    const facilityCountListHotelWise = useSelector((state) => state.facilityCountReducer.facilityCountListHotelWise);
    const arrayList = [];
    const [modeType, setModeType] = useState('INSERT');
    console.log(facilityCountListHotelWise);

    useEffect(() => {
        if (facilityCountListHotelWise?.payload?.length > 0) {
            facilityCountListHotelWise?.payload[0].forEach((element) => {
                element?.facilityCountDetails.forEach((element2) => {
                    const initialValues = {
                        id: element?.id,
                        hotel: element?.hotel,
                        hotelCode: element?.hotel?.hotelCode,
                        hotelName: element?.hotel?.longName,
                        // facilityType: element.status,
                        status: element?.status,
                        facilityType: element2.facilityCodeName?.hotelFacilityType?.hotelFacilityType,
                        count: element2?.count,
                        facilityCountDetails: element2 // facilityCountDetails: [
                        //     {
                        //         facilityType: values.facilityCountDetails.facilityType,
                        //         facilityCodeName: values.facilityCountDetails.acilityCodeName,
                        //         count: values.facilityCountDetails.count,
                        //         status: values.facilityCountDetails.status
                        //     }
                        // ]
                    };
                    arrayList.push(initialValues);
                });
            });

            setTableData(arrayList);
        } else {
            setTableData(initialValues);
        }
    }, [facilityCountListHotelWise]);

    useEffect(() => {
        const facilityCodeAndName = [];
        if (facilityTypes.length > 0) {
            if (modeType == 'INSERT') {
                if (selectedFacilityType == 'Service Offered') {
                    facilityCodeAndName.push(hotel?.serviceOffered);
                }
                if (selectedFacilityType == 'Children Facilities') {
                    facilityCodeAndName.push(hotel?.childrenFacilities);
                }

                if (selectedFacilityType == 'ReCreation') {
                    facilityCodeAndName.push(hotel?.reCreation);
                }

                if (selectedFacilityType == 'Facilities Offered') {
                    facilityCodeAndName.push(hotel?.facilitiesOffered);
                }
                setActiveServiceOfferedListData(facilityCodeAndName[0]);
            } else {
                setActiveServiceOfferedListData([]);
            }
        }
    }, [selectedFacilityType]);

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

    const [facilityTypes, setFaciltyTypes] = useState([]);
    const facilityType = [];

    useEffect(() => {
        if (modeType == 'INSERT') {
            if (hotel?.childrenFacilities?.length > 0) {
                facilityType.push(hotel?.childrenFacilities[0]?.hotelFacilityType);
            }

            if (hotel?.facilitiesOffered?.length > 0) {
                facilityType.push(hotel?.facilitiesOffered[0]?.hotelFacilityType);
            }

            if (hotel?.reCreation?.length > 0) {
                facilityType.push(hotel?.reCreation[0]?.hotelFacilityType);
            }

            if (hotel?.serviceOffered?.length > 0) {
                facilityType.push(hotel?.serviceOffered[0]?.hotelFacilityType);
            }

            setFaciltyTypes(facilityType);
        } else {
            setFaciltyTypes(facilityType);
        }
    }, [hotel]);

    const validationSchema = yup.object().shape({
        hotelCode: yup.string().required('Required field'),
        hotelName: yup.string().required('Required field'),

        facilityCountDetails: yup.array().of(
            yup.object().shape({
                facilityType: yup.object().typeError('Required field'),
                facilityCodeName: yup.object().typeError('Required field'),
                count: yup.number().positive('Must be greater than zero').required('Required field')
            })
        )
    });

    //get data from reducers

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllFacilityCounterDataHotelWise(hotel.id));
        // console.log('hotel Code:' + hotelCode);
        // console.log('hotel Name:' + hotelName);
    }, []);

    const handleSubmitForm = (values) => {
        if (modeType === 'INSERT') {
            const initialValues = {
                hotel: hotel,
                status: values.status,
                facilityCountDetails: values.facilityCountDetails
            };
            dispatch(saveFacilityCounterData(initialValues));
        } else if (modeType === 'VIEW_UPDATE') {
            const initialValues = {
                id: values.id,
                hotel: hotel,
                status: values.status,
                facilityCountDetails: values.facilityCountDetails
            };
            dispatch(updateFacilityCounterData(initialValues));
        }
        handleClose();
        // setDuplicateError(false);
        // props.resetForm()
    };

    const handleCancel = () => {
        setModeType('INSERT');
        setLoadValues(initialValues);
    };

    const handleClickOpen = (type, data) => {
        setModeType(type);
        console.log(data);
        if (type === 'VIEW_UPDATE') {
            const initialValues = {
                id: data?.id,
                hotel: data?.hotel,
                hotelCode: data?.hotelCode,
                hotelName: data?.hotelName,
                status: data?.status,
                facilityCountDetails: [data?.facilityCountDetails],
                enableRow: true
            };
            setLoadValues(initialValues);
        }
    };

    return (
        <div>
            <Dialog maxWidth="220px" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {modeType === 'INSERT' ? 'Add' : ''} {modeType === 'VIEW_UPDATE' ? 'Update' : ''}{' '}
                            {mode === 'VIEW' ? 'View' : ''}
                            Facility Count
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
                                                initialValues={loadValues || initialValues}
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
                                                                            label="Hotel Code"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="hotelCode"
                                                                            value={values.hotelCode}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.hotelCode && errors.hotelCode)}
                                                                            helperText={
                                                                                touched.hotelCode && errors.hotelCode
                                                                                    ? errors.hotelCode
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Hotel Name"
                                                                            sx={{
                                                                                width: { sm: 200, md: 300 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            disabled
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="hotelName"
                                                                            value={values.hotelName}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.hotelName && errors.hotelName)}
                                                                            helperText={
                                                                                touched.hotelName && errors.hotelName
                                                                                    ? errors.hotelName
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        display="flex"
                                                                        style={{
                                                                            alignItems: 'center'
                                                                            //   marginTop: "10px",
                                                                            //   marginBottom: "10px",
                                                                        }}
                                                                    >
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
                                                                    </Grid>
                                                                </Grid>
                                                            </div>

                                                            <FieldArray name="facilityCountDetails">
                                                                {({ insert, remove, push }) => (
                                                                    <Paper>
                                                                        {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    disabled={
                                                                                        modeType == 'VIEW_UPDATE' || modeType == 'VIEW'
                                                                                    }
                                                                                    onClick={() => {
                                                                                        // setFieldValue(
                                                                                        //   `taxGroupDetails.${ref.current.values.taxGroupDetails.length}.taxOrder`,
                                                                                        //   ref.current.values.taxGroupDetails.length+1
                                                                                        // );
                                                                                        push({
                                                                                            facilityType: null,
                                                                                            facilityCodeName: null,
                                                                                            count: '',
                                                                                            // onOriginal: '',
                                                                                            status: true,
                                                                                            enableRow:
                                                                                                mode === 'VIEW_UPDATE' || mode === 'INSERT'
                                                                                                    ? false
                                                                                                    : true
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
                                                                                        {/* <TableCell>Rate Period</TableCell> */}
                                                                                        {/* <TableCell>Special Offer Season</TableCell> */}
                                                                                        {/* <TableCell>Free</TableCell> */}
                                                                                        <TableCell>FacilityType</TableCell>
                                                                                        <TableCell>Code & Name</TableCell>
                                                                                        <TableCell>Count</TableCell>
                                                                                        <TableCell>Actions</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {values.facilityCountDetails.map((record, idx) => {
                                                                                        return (
                                                                                            <TableRow key={idx} hover>
                                                                                                <TableCell>
                                                                                                    <Autocomplete
                                                                                                        disabled={
                                                                                                            modeType == 'VIEW_UPDATE' ||
                                                                                                            modeType == 'VIEW'
                                                                                                        }
                                                                                                        value={
                                                                                                            values.facilityCountDetails[idx]
                                                                                                                ? values
                                                                                                                      .facilityCountDetails[
                                                                                                                      idx
                                                                                                                  ].facilityType
                                                                                                                : null
                                                                                                        }
                                                                                                        name={`facilityCountDetails.${idx}.facilityType`}
                                                                                                        onChange={(_, value) => {
                                                                                                            console.log(value);
                                                                                                            setFieldValue(
                                                                                                                `facilityCountDetails.${idx}.facilityType`,
                                                                                                                value
                                                                                                            );
                                                                                                            setSelectedFacilityType(
                                                                                                                value.hotelFacilityType
                                                                                                            );
                                                                                                        }}
                                                                                                        // disabled={
                                                                                                        //     values.facilityCountDetails[idx]
                                                                                                        //         .enableRow ||
                                                                                                        //     modeType == 'VIEW'
                                                                                                        // }
                                                                                                        // onChange={handleChange}
                                                                                                        options={facilityTypes}
                                                                                                        getOptionLabel={(option) =>
                                                                                                            `${option.hotelFacilityType}`
                                                                                                        }
                                                                                                        isOptionEqualToValue={(
                                                                                                            option,
                                                                                                            value
                                                                                                        ) =>
                                                                                                            option.hotelFacilityTypeId ===
                                                                                                            value.hotelFacilityTypeId
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
                                                                                                                placeholder="--Select a Facility Type --"
                                                                                                                variant="outlined"
                                                                                                                name={`facilityCountDetails.${idx}.facilityType`}
                                                                                                                onBlur={handleBlur}
                                                                                                                helperText={
                                                                                                                    touched.facilityCountDetails &&
                                                                                                                    touched
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ].facilityType &&
                                                                                                                    errors.facilityCountDetails &&
                                                                                                                    errors
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ].facilityType
                                                                                                                        ? errors
                                                                                                                              .facilityCountDetails[
                                                                                                                              idx
                                                                                                                          ].facilityType
                                                                                                                        : ''
                                                                                                                }
                                                                                                                error={Boolean(
                                                                                                                    touched.facilityCountDetails &&
                                                                                                                        touched
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ].facilityType &&
                                                                                                                        errors.facilityCountDetails &&
                                                                                                                        errors
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ].facilityType
                                                                                                                )}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    {' '}
                                                                                                    <Autocomplete
                                                                                                        disabled={
                                                                                                            modeType == 'VIEW_UPDATE' ||
                                                                                                            modeType == 'VIEW'
                                                                                                        }
                                                                                                        value={
                                                                                                            values.facilityCountDetails[idx]
                                                                                                                ? values
                                                                                                                      .facilityCountDetails[
                                                                                                                      idx
                                                                                                                  ].facilityCodeName
                                                                                                                : null
                                                                                                        }
                                                                                                        name={`facilityCountDetails.${idx}.facilityCodeName`}
                                                                                                        onChange={(_, value) => {
                                                                                                            console.log(value);
                                                                                                            setFieldValue(
                                                                                                                `facilityCountDetails.${idx}.facilityCodeName`,
                                                                                                                value
                                                                                                            );
                                                                                                            // setSelectedFacilityType(
                                                                                                            //     value.hotelFacilityType
                                                                                                            // );
                                                                                                        }}
                                                                                                        // onChange={handleChange}
                                                                                                        options={
                                                                                                            activeServiceOfferedListData
                                                                                                        }
                                                                                                        getOptionLabel={(option) =>
                                                                                                            `${option.code}-${option.name}`
                                                                                                        }
                                                                                                        isOptionEqualToValue={(
                                                                                                            option,
                                                                                                            value
                                                                                                        ) =>
                                                                                                            option.hotelFacilityId ===
                                                                                                            value.hotelFacilityId
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
                                                                                                                // placeholder="--Select a Tax Code --"
                                                                                                                variant="outlined"
                                                                                                                name={`facilityCountDetails.${idx}.facilityCodeName`}
                                                                                                                onBlur={handleBlur}
                                                                                                                helperText={
                                                                                                                    touched.facilityCountDetails &&
                                                                                                                    touched
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    touched
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ].facilityCodeName &&
                                                                                                                    errors.facilityCountDetails &&
                                                                                                                    errors
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ] &&
                                                                                                                    errors
                                                                                                                        .facilityCountDetails[
                                                                                                                        idx
                                                                                                                    ].facilityCodeName
                                                                                                                        ? errors
                                                                                                                              .facilityCountDetails[
                                                                                                                              idx
                                                                                                                          ].facilityCodeName
                                                                                                                        : ''
                                                                                                                }
                                                                                                                error={Boolean(
                                                                                                                    touched.facilityCountDetails &&
                                                                                                                        touched
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        touched
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ]
                                                                                                                            .facilityCodeName &&
                                                                                                                        errors.facilityCountDetails &&
                                                                                                                        errors
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ] &&
                                                                                                                        errors
                                                                                                                            .facilityCountDetails[
                                                                                                                            idx
                                                                                                                        ].facilityCodeName
                                                                                                                )}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </TableCell>

                                                                                                <TableCell>
                                                                                                    {' '}
                                                                                                    <TextField
                                                                                                        sx={{
                                                                                                            width: { sm: 200, md: 200 },
                                                                                                            '& .MuiInputBase-root': {
                                                                                                                height: 40
                                                                                                            }
                                                                                                        }}
                                                                                                        // label="Website"

                                                                                                        InputLabelProps={{
                                                                                                            shrink: true
                                                                                                        }}
                                                                                                        disabled={
                                                                                                            modeType == 'VIEW_UPDATE' ||
                                                                                                            modeType == 'VIEW'
                                                                                                        }
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        name={`facilityCountDetails.${idx}.count`}
                                                                                                        helperText={
                                                                                                            touched.facilityCountDetails &&
                                                                                                            touched.facilityCountDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.facilityCountDetails[
                                                                                                                idx
                                                                                                            ].count &&
                                                                                                            errors.facilityCountDetails &&
                                                                                                            errors.facilityCountDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.facilityCountDetails[idx]
                                                                                                                .count
                                                                                                                ? errors
                                                                                                                      .facilityCountDetails[
                                                                                                                      idx
                                                                                                                  ].count
                                                                                                                : ''
                                                                                                        }
                                                                                                        error={Boolean(
                                                                                                            touched.facilityCountDetails &&
                                                                                                                touched
                                                                                                                    .facilityCountDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                touched
                                                                                                                    .facilityCountDetails[
                                                                                                                    idx
                                                                                                                ].count &&
                                                                                                                errors.facilityCountDetails &&
                                                                                                                errors.facilityCountDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                errors.facilityCountDetails[
                                                                                                                    idx
                                                                                                                ].count
                                                                                                        )}
                                                                                                        value={
                                                                                                            values.facilityCountDetails[idx]
                                                                                                                ? values
                                                                                                                      .facilityCountDetails[
                                                                                                                      idx
                                                                                                                  ].count
                                                                                                                : null
                                                                                                        }
                                                                                                        // error={Boolean(touched.webSite && errors.webSite)}
                                                                                                        // helperText={
                                                                                                        //     touched.webSite && errors.webSite ? errors.webSite : ''
                                                                                                        // }
                                                                                                    ></TextField>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <FormGroup>
                                                                                                        <FormControlLabel
                                                                                                            name={`facilityCountDetails.${idx}.status`}
                                                                                                            control={
                                                                                                                <Switch color="success" />
                                                                                                            }
                                                                                                            disabled={mode == 'VIEW'}
                                                                                                            onChange={handleChange}
                                                                                                            checked={
                                                                                                                values.facilityCountDetails[
                                                                                                                    idx
                                                                                                                ].status
                                                                                                            }
                                                                                                            value={
                                                                                                                values.facilityCountDetails[
                                                                                                                    idx
                                                                                                                ] &&
                                                                                                                values.facilityCountDetails[
                                                                                                                    idx
                                                                                                                ].status
                                                                                                            }
                                                                                                        />
                                                                                                    </FormGroup>
                                                                                                </TableCell>
                                                                                                {modeType == 'INSERT' ? (
                                                                                                    <TableCell>
                                                                                                        <IconButton
                                                                                                            aria-label="delete"
                                                                                                            onClick={() => {
                                                                                                                remove(idx);
                                                                                                            }}
                                                                                                        >
                                                                                                            <HighlightOffIcon />
                                                                                                        </IconButton>
                                                                                                    </TableCell>
                                                                                                ) : (
                                                                                                    ''
                                                                                                )}
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
                                                                        type="button"
                                                                        style={{
                                                                            // backgroundColor: '#B22222',
                                                                            marginLeft: '10px'
                                                                        }}
                                                                        onClick={handleCancel}
                                                                    >
                                                                        Clear
                                                                    </Button>
                                                                ) : (
                                                                    ''
                                                                )}

                                                                {mode != 'VIEW' ? (
                                                                    <Button variant="contained" type="submit" className="btnSave">
                                                                        {modeType === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                                                    </Button>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </Box>
                                                            {/* <Box>
                                                                <Grid item>
                                                                    {mode === 'VIEW' ? (
                                                                        <CreatedUpdatedUserDetailsWithTableFormat formValues={values} />
                                                                    ) : null}
                                                                </Grid>
                                                            </Box> */}
                                                        </Form>
                                                    );
                                                }}
                                            </Formik>
                                        </>
                                    </Grid>
                                    {/* <Divider /> */}
                                    <br />
                                    <hr />
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12}>
                                            <Grid container spacing={gridSpacing}>
                                                <Grid item xs={12}>
                                                    <MaterialTable
                                                        // title={`Last Modified Date : ${lastModifiedTimeDate}`}
                                                        columns={columns}
                                                        data={tableData}
                                                        actions={[
                                                            // {
                                                            //     icon: tableIcons.Add,
                                                            //     tooltip: 'Add New',
                                                            //     isFreeAction: true,
                                                            //     onClick: () => handleClickOpen('INSERT', null)
                                                            // },
                                                            (rowData) => ({
                                                                icon: tableIcons.Edit,
                                                                tooltip: 'Edit',
                                                                onClick: () => handleClickOpen('VIEW_UPDATE', rowData)
                                                            })
                                                            // (rowData) => ({
                                                            //     icon: tableIcons.VisibilityIcon,
                                                            //     tooltip: 'Edit',
                                                            //     onClick: () => handleClickOpen('VIEW', rowData)
                                                            // })
                                                        ]}
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
                                                                height: 20,
                                                                maxHeight: 20,
                                                                padding: 2,
                                                                fontSize: '14px',
                                                                background: '-moz-linear-gradient(top, #0790E8, #3180e6)',
                                                                background: '-ms-linear-gradient(top, #0790E8, #3180e6)',
                                                                background: '-webkit-linear-gradient(top, #0790E8, #3180e6)',
                                                                // textAlign: 'center',
                                                                color: '#FFF'
                                                            },
                                                            rowStyle: {
                                                                whiteSpace: 'nowrap',
                                                                height: 20,
                                                                fontSize: '13px',
                                                                padding: 0
                                                            }
                                                        }}
                                                    />

                                                    {/* {open ? (
                                    <FacilityCounter open={open} handleClose={handleClose} taxGroupCode={taxGroupCode} mode={mode} />
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
                                </Grid>
                            </div>
                        </div>
                    </DialogContent>
                </>
            </Dialog>
        </div>
    );
}

export default FacilityCounter;
