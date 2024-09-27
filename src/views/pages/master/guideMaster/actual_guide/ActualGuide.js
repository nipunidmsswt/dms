import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    Box,
    DialogActions,
    DialogContent,
    TextField,
    DialogTitle,
    Button,
    DialogContentText,
    FormGroup,
    FormControlLabel,
    Switch,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Autocomplete
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, FieldArray } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CancelIcon from '@mui/icons-material/Cancel';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getAllGuideClassData } from 'store/actions/masterActions/GuideClassAction';
import {
    saveActualGuideData,
    updateActualGuideData,
    getActualGuideDetailsById,
    checkDuplicateActualGuideCode
} from 'store/actions/masterActions/ActualGuideAction';
var languages = require('language-list')();
function ActualGuide({ open, handleClose, mode, id }) {
    const initialValues = {
        code: '',
        initials: '',
        surName: '',
        shortName: '',
        nic: '',
        address: '',
        phone: '',
        fax: '',
        mobileNo: '',
        licenseNo: '',
        licenseExpireDate: '',
        remark: '',
        status: true,
        files: '',
        actualGuideSkills: [
            {
                guideClass: null,
                description: '',
                lang: null,
                language: '',
                name: '',
                status: true,
                enableRow: false
            }
        ]
    };

    const [loadValues, setLoadValues] = useState(null);
    const [openDialogBox, setOpenDialogBox] = useState(false);
    const [activeGuideListData, setActiveGuideList] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    //get data from reducers
    const duplicateCode = useSelector((state) => state.actualGuideReducer.duplicateCode);
    const activeGuideList = useSelector((state) => state.guideClassReducer.guideClassList);
    const actualGuideToUpdate = useSelector((state) => state.actualGuideReducer.actualGuideToUpdate);

    yup.addMethod(yup.string, 'checkDuplicatectualGuideCode', function (message) {
        return this.test('checkDuplicatectualGuideCode', message, async function validateValue(value) {
            if (mode === 'INSERT') {
                try {
                    console.log('sjhgchs');
                    await dispatch(checkDuplicateActualGuideCode(value));
                    console.log(duplicateCode);
                    if (duplicateCode != null && duplicateCode.errorMessages.length != 0) {
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
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = yup.object().shape({
        code: yup.string().required('Required field').checkDuplicatectualGuideCode('Duplicate Code'),
        initials: yup.string().required('Required field'),
        surName: yup.string().required('Required field'),
        nic: yup.string().required('Required field'),
        mobileNo: yup.string().required('Required field').matches(phoneRegExp, 'Phone number is not valid'),
        actualGuideSkills: yup.array().of(
            yup.object().shape({
                guideClass: yup.object().typeError('Required field')
            })
        )
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getActualGuideDetailsById(id));
        }
    }, [mode]);

    useEffect(() => {
        dispatch(getAllGuideClassData());
    }, []);

    useEffect(() => {
        if (activeGuideList != null) {
            setActiveGuideList(activeGuideList);
        }
    }, [activeGuideList]);

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && actualGuideToUpdate != null) || (mode === 'VIEW' && actualGuideToUpdate != null)) {
            actualGuideToUpdate.actualGuideSkills.map((data) => {
                data.enableRow = true;
            });

            actualGuideToUpdate.actualGuideSkills.map((data) => {
                console.log('actualGuideToUpdate 1');
                data.lang = { language: data.language };
            });

            let images = [];
            const contentType = 'image/png';
            if (actualGuideToUpdate.docPath !== '') {
                const byteCharacters = atob(actualGuideToUpdate.docPath);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob1 = new Blob([byteArray], { type: contentType });
                images.push(URL.createObjectURL(blob1));
                let fileData = new File([blob1], 'name');
                actualGuideToUpdate.files = [fileData];
            }
            setPreviewImages(images);
            setLoadValues(actualGuideToUpdate);
        }
    }, [actualGuideToUpdate]);

    const showImages = (event) => {
        let images = [];
        console.log(event);
        for (let i = 0; i < event.target.files.length; i++) {
            images.push(URL.createObjectURL(event.target.files[i]));
        }
        setPreviewImages(images);
    };

    function deleteHandler(image) {
        setPreviewImages(previewImages.filter((e) => e !== image));
        URL.revokeObjectURL(image);
    }

    const handleSubmitForm = (data) => {
        console.log(data);

        if (mode === 'INSERT') {
            dispatch(saveActualGuideData(data));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateActualGuideData(data));
        }
        handleClose();
    };

    return (
        <div>
            <Dialog fullWidth maxWidth="md" open={open} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update' : ''} {mode === 'VIEW' ? 'View' : ''}Actual
                            Guide
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
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Code"
                                                        name="code"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.code}
                                                        error={Boolean(touched.code && errors.code)}
                                                        helperText={touched.code && errors.code ? errors.code : ''}
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
                                                        // disabled={true}
                                                        label="Initials"
                                                        name="initials"
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.initials}
                                                        error={Boolean(touched.initials && errors.initials)}
                                                        helperText={touched.initials && errors.initials ? errors.initials : ''}
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
                                                        label="Surname"
                                                        name="surName"
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.surName}
                                                        error={Boolean(touched.surName && errors.surName)}
                                                        helperText={touched.surName && errors.surName ? errors.surName : ''}
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
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Short Name"
                                                        name="shortName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.shortName}
                                                        error={Boolean(touched.shortName && errors.shortName)}
                                                        helperText={touched.shortName && errors.shortName ? errors.shortName : ''}
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
                                                        label="NIC NO"
                                                        name="nic"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.nic}
                                                        error={Boolean(touched.nic && errors.nic)}
                                                        helperText={touched.nic && errors.nic ? errors.nic : ''}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 200, sm: 624 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        label="Address"
                                                        name="address"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.address}
                                                        error={Boolean(touched.address && errors.address)}
                                                        helperText={touched.address && errors.address ? errors.address : ''}
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
                                                        label="Fax"
                                                        name="fax"
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.fax}
                                                        error={Boolean(touched.fax && errors.fax)}
                                                        helperText={touched.fax && errors.fax ? errors.fax : ''}
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
                                                        label="Mobile Number"
                                                        name="mobileNo"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.mobileNo}
                                                        error={Boolean(touched.mobileNo && errors.mobileNo)}
                                                        helperText={touched.mobileNo && errors.mobileNo ? errors.mobileNo : ''}
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
                                                        label="License No"
                                                        name="licenseNo"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.licenseNo}
                                                        error={Boolean(touched.licenseNo && errors.licenseNo)}
                                                        helperText={touched.licenseNo && errors.licenseNo ? errors.licenseNo : ''}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        // adapterLocale={locale}
                                                    >
                                                        <DatePicker
                                                            disabled={mode == 'VIEW'}
                                                            onChange={(value) => {
                                                                setFieldValue(`licenseExpireDate`, value);
                                                            }}
                                                            inputFormat="DD/MM/YYYY"
                                                            value={values.licenseExpireDate}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        width: { xs: 100, sm: 200 },
                                                                        '& .MuiInputBase-root': {
                                                                            height: 40
                                                                        }
                                                                    }}
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    label="License Expire Date"
                                                                    variant="outlined"
                                                                    name="licenseExpireDate"
                                                                    onBlur={handleBlur}
                                                                    error={Boolean(touched.licenseExpireDate && errors.licenseExpireDate)}
                                                                    helperText={
                                                                        touched.licenseExpireDate && errors.licenseExpireDate
                                                                            ? errors.licenseExpireDate
                                                                            : ''
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <TextField
                                                        sx={{
                                                            width: { xs: 100, sm: 200 },
                                                            '& .MuiInputBase-root': {
                                                                height: 40
                                                            }
                                                        }}
                                                        label="Remarks"
                                                        name="remark"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                        disabled={mode == 'VIEW_UPDATE'}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.remark}
                                                        error={Boolean(touched.remark && errors.remark)}
                                                        helperText={touched.remark && errors.remark ? errors.remark : ''}
                                                    ></TextField>
                                                </Grid>
                                                <Grid item xs={3}>
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
                                                <Grid item xs={6}>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        name="files"
                                                        //  onChange={this.selectFiles}
                                                        onChange={(event) => {
                                                            // console.log("file", event.currentTarget.files);
                                                            showImages(event);
                                                            handleChange;
                                                            setFieldValue('files', event.currentTarget.files);
                                                        }}
                                                        error={Boolean(errors.files)}
                                                        helperText={errors.files ? errors.files : ''}
                                                    />
                                                    {errors.files}
                                                    {previewImages && (
                                                        <div>
                                                            {previewImages.map((img, i) => {
                                                                return (
                                                                    <div
                                                                        style={{
                                                                            display: 'inline-block',
                                                                            position: 'relative'
                                                                        }}
                                                                    >
                                                                        <img
                                                                            width="100"
                                                                            height="100"
                                                                            style={{
                                                                                marginRight: '10px',
                                                                                marginTop: '10px'
                                                                            }}
                                                                            className="preview"
                                                                            src={img}
                                                                            alt={'image-' + i}
                                                                            key={i + 'ke'}
                                                                        />
                                                                        <IconButton
                                                                            aria-label="add an alarm"
                                                                            onClick={() => deleteHandler(img)}
                                                                        >
                                                                            <HighlightOffIcon
                                                                                key={i}
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    top: -100,
                                                                                    right: 0,
                                                                                    width: '25px',
                                                                                    height: '25px'
                                                                                    // marginRight: "10px",
                                                                                }}
                                                                                // src="https://png.pngtree.com/png-vector/20190603/ourmid/pngtree-icon-close-button-png-image_1357822.jpg"
                                                                            />
                                                                        </IconButton>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </Grid>
                                            </Grid>
                                            <FieldArray name="actualGuideSkills">
                                                {({ insert, remove, push }) => (
                                                    <Paper>
                                                        {mode != 'VIEW' ? (
                                                            <Box display="flex" flexDirection="row-reverse">
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    disabled={mode == 'VIEW'}
                                                                    onClick={() => {
                                                                        let value = false;
                                                                        // if(mode === "VIEW_UPDATE"){
                                                                        //         value = false
                                                                        // }else if(mode === "INSERT" ){

                                                                        // }
                                                                        push({
                                                                            guideClass: null,
                                                                            description: '',
                                                                            lang: null,
                                                                            Name: '',
                                                                            status: true,
                                                                            language: '',
                                                                            enableRow:
                                                                                mode === 'VIEW_UPDATE' || mode === 'INSERT' ? false : true
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
                                                                        <TableCell>Guide Class</TableCell>
                                                                        <TableCell>Description</TableCell>
                                                                        <TableCell>Language</TableCell>
                                                                        <TableCell>Name</TableCell>
                                                                        <TableCell>Actions</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {values.actualGuideSkills.map((record, idx) => {
                                                                        return (
                                                                            <TableRow key={idx} hover>
                                                                                <TableCell>
                                                                                    <Autocomplete
                                                                                        disabled={
                                                                                            values.actualGuideSkills[idx].enableRow ||
                                                                                            mode == 'VIEW'
                                                                                        }
                                                                                        value={
                                                                                            values.actualGuideSkills[idx]
                                                                                                ? values.actualGuideSkills[idx].guideClass
                                                                                                : null
                                                                                        }
                                                                                        name={`actualGuideSkills.${idx}.tax`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `actualGuideSkills.${idx}.guideClass`,
                                                                                                value
                                                                                            );
                                                                                        }}
                                                                                        options={activeGuideListData}
                                                                                        getOptionLabel={(option) => `${option.guideCode}`}
                                                                                        isOptionEqualToValue={(option, value) =>
                                                                                            option.guideClassId === value.guideClassId
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
                                                                                                variant="outlined"
                                                                                                name={`actualGuideSkills.${idx}.guideClass`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.actualGuideSkills &&
                                                                                                    touched.actualGuideSkills[idx] &&
                                                                                                    touched.actualGuideSkills[idx]
                                                                                                        .guideClass &&
                                                                                                    errors.actualGuideSkills &&
                                                                                                    errors.actualGuideSkills[idx] &&
                                                                                                    errors.actualGuideSkills[idx].guideClass
                                                                                                        ? errors.actualGuideSkills[idx]
                                                                                                              .guideClass
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.actualGuideSkills &&
                                                                                                        touched.actualGuideSkills[idx] &&
                                                                                                        touched.actualGuideSkills[idx]
                                                                                                            .guideClass &&
                                                                                                        errors.actualGuideSkills &&
                                                                                                        errors.actualGuideSkills[idx] &&
                                                                                                        errors.actualGuideSkills[idx]
                                                                                                            .guideClass
                                                                                                )}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        // label="description"
                                                                                        disabled={
                                                                                            values.actualGuideSkills[idx].enableRow ||
                                                                                            mode == 'VIEW'
                                                                                        }
                                                                                        sx={{
                                                                                            width: { sm: 200 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        variant="outlined"
                                                                                        name={`actualGuideSkills.${idx}.description`}
                                                                                        value={
                                                                                            values.actualGuideSkills[idx] &&
                                                                                            values.actualGuideSkills[idx].description
                                                                                        }
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.actualGuideSkills &&
                                                                                                touched.actualGuideSkills[idx] &&
                                                                                                touched.actualGuideSkills[idx]
                                                                                                    .description &&
                                                                                                errors.actualGuideSkills &&
                                                                                                errors.actualGuideSkills[idx] &&
                                                                                                errors.actualGuideSkills[idx].description
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.actualGuideSkills &&
                                                                                            touched.actualGuideSkills[idx] &&
                                                                                            touched.actualGuideSkills[idx].description &&
                                                                                            errors.actualGuideSkills &&
                                                                                            errors.actualGuideSkills[idx] &&
                                                                                            errors.actualGuideSkills[idx].description
                                                                                                ? errors.actualGuideSkills[idx].description
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    <Autocomplete
                                                                                        disabled={
                                                                                            values.actualGuideSkills[idx].enableRow ||
                                                                                            mode == 'VIEW'
                                                                                        }
                                                                                        value={
                                                                                            values.actualGuideSkills[idx]
                                                                                                ? values.actualGuideSkills[idx].lang
                                                                                                : null
                                                                                        }
                                                                                        name={`actualGuideSkills.${idx}.lang`}
                                                                                        onChange={(_, value) => {
                                                                                            console.log(value);
                                                                                            setFieldValue(
                                                                                                `actualGuideSkills.${idx}.lang`,
                                                                                                value
                                                                                            );
                                                                                            setFieldValue(
                                                                                                `actualGuideSkills.${idx}.language`,
                                                                                                value.language
                                                                                            );
                                                                                        }}
                                                                                        options={languages.getData()}
                                                                                        getOptionLabel={(option) => `${option.language}`}
                                                                                        isOptionEqualToValue={(option, value) =>
                                                                                            option.language === value.language
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
                                                                                                variant="outlined"
                                                                                                name={`actualGuideSkills.${idx}.lang`}
                                                                                                onBlur={handleBlur}
                                                                                                helperText={
                                                                                                    touched.actualGuideSkills &&
                                                                                                    touched.actualGuideSkills[idx] &&
                                                                                                    touched.actualGuideSkills[idx].lang &&
                                                                                                    errors.actualGuideSkills &&
                                                                                                    errors.actualGuideSkills[idx] &&
                                                                                                    errors.actualGuideSkills[idx].lang
                                                                                                        ? errors.actualGuideSkills[idx].lang
                                                                                                        : ''
                                                                                                }
                                                                                                error={Boolean(
                                                                                                    touched.actualGuideSkills &&
                                                                                                        touched.actualGuideSkills[idx] &&
                                                                                                        touched.actualGuideSkills[idx]
                                                                                                            .lang &&
                                                                                                        errors.actualGuideSkills &&
                                                                                                        errors.actualGuideSkills[idx] &&
                                                                                                        errors.actualGuideSkills[idx].lang
                                                                                                )}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    <TextField
                                                                                        // label="description"
                                                                                        disabled={
                                                                                            values.actualGuideSkills[idx].enableRow ||
                                                                                            mode == 'VIEW'
                                                                                        }
                                                                                        sx={{
                                                                                            width: { sm: 200 },
                                                                                            '& .MuiInputBase-root': {
                                                                                                height: 40
                                                                                            }
                                                                                        }}
                                                                                        variant="outlined"
                                                                                        name={`actualGuideSkills.${idx}.name`}
                                                                                        value={
                                                                                            values.actualGuideSkills[idx] &&
                                                                                            values.actualGuideSkills[idx].name
                                                                                        }
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}
                                                                                        error={Boolean(
                                                                                            touched.actualGuideSkills &&
                                                                                                touched.actualGuideSkills[idx] &&
                                                                                                touched.actualGuideSkills[idx].name &&
                                                                                                errors.actualGuideSkills &&
                                                                                                errors.actualGuideSkills[idx] &&
                                                                                                errors.actualGuideSkills[idx].name
                                                                                        )}
                                                                                        helperText={
                                                                                            touched.actualGuideSkills &&
                                                                                            touched.actualGuideSkills[idx] &&
                                                                                            touched.actualGuideSkills[idx].name &&
                                                                                            errors.actualGuideSkills &&
                                                                                            errors.actualGuideSkills[idx] &&
                                                                                            errors.actualGuideSkills[idx].name
                                                                                                ? errors.actualGuideSkills[idx].name
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <FormGroup>
                                                                                        <FormControlLabel
                                                                                            name={`actualGuideSkills.${idx}.status`}
                                                                                            control={<Switch color="success" />}
                                                                                            label="Status"
                                                                                            disabled={mode == 'VIEW'}
                                                                                            onChange={handleChange}
                                                                                            checked={values.actualGuideSkills[idx].status}
                                                                                            value={
                                                                                                values.actualGuideSkills[idx] &&
                                                                                                values.actualGuideSkills[idx].status
                                                                                            }
                                                                                        />
                                                                                    </FormGroup>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <IconButton
                                                                                        disabled={
                                                                                            values.actualGuideSkills[idx].enableRow ||
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

export default ActualGuide;
