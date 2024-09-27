import { useEffect, forwardRef, useState, Fragment } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    Slide,
    Box,
    DialogContent,
    TextField,
    DialogTitle,
    Checkbox,
    Button,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    FormGroup,
    FormControlLabel,
    Switch,
    Snackbar,
    Alert,
    DialogActions,
    TablePagination,
    TableFooter
} from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Formik, Form, FieldArray } from 'formik';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import * as yup from 'yup';
import { getCodeAndNameDataByType, saveCodeAndNameData, updateCodeAndNameData } from 'store/actions/masterActions/CodeAndNameAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import { openSnackbar } from 'messages/snackbar';
import AlertItemDelete from 'messages/AlertItemDelete';
import { useRef } from 'react';
import AlertItemExist from 'messages/AlertItemExist';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CodeAndName({ open, handleClose, mode, ccode }) {
    const initialValues1 = {
        codeType: '',
        code: '',
        name: '',
        newStatus: true
        // codeAndNameDetails: [
        //     {
        //         code: '',
        //         name: '',
        //         status: true
        //     }
        // ]
    };
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
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const [initialValues, setInitial] = useState(initialValues1);
    const [openModal, setOpenModal] = useState(false);
    const [existOpenModal, setExistOpenModal] = useState(false);
    const [loadValues, setLoadValues] = useState({
        codeType: '',
        code: '',
        name: '',
        newStatus: true,
        codeAndNameDetails: [{ category: '', code: '', name: '', status: true, codeAndNameId: '' }]
    });
    yup.addMethod(yup.array, 'uniqueCode', function (message) {
        return this.test('uniqueCode', message, function (list) {
            const mapper = (x) => {
                return x.code;
            };
            const set = [...new Set(list.map(mapper))];
            const isUnique = list.length === set.length;
            if (isUnique) {
                return true;
            }

            const idx = list.findIndex((l, i) => mapper(l) !== set[i]);
            return this.createError({
                path: `codeAndNameDetails[${idx}].code`,
                message: message
            });
        });
    });

    const validationSchema = yup.object().shape({
        codeAndNameDetails: yup.array().of(
            yup.object().shape({
                code: yup.string().required('Required field'),
                // .checkDuplicateCode("Code Already Exist"),
                name: yup.string().required('Required field'),
                status: yup.boolean()
            })
        )
        // .uniqueCodeAndNameCode("Must be unique"),
        // .uniqueCode('Code Already Exist')
    });

    const validationSchema1 = yup.object().shape({
        codeType: yup.string().required('Required field'),
        code: yup.string().required('Required field'),
        name: yup.string().required('Required field')
    });

    //get data from reducers
    const duplicateCodeType = useSelector((state) => state.codeAndNameReducer.duplicateCodeType);
    const codeToUpdate = useSelector((state) => state.codeAndNameReducer.codeToUpdate);
    const duplicateCode = useSelector((state) => state.codeAndNameReducer.duplicateCode);
    const detailsType = useSelector((state) => state.codeAndNameReducer.detailsType);
    const dispatch = useDispatch();

    const [clusterTypeData, setClsuterTypeData] = useState(null);
    const [categoryType, setCategoryType] = useState(null);

    const handleModalClose = (status) => {
        setOpenModal(false);

        if (status) {
            dispatch(getCodeAndNameDataByType(categoryType));
        }
    };
    const handleExistModalClose = (status) => {
        if (status) {
            setExistOpenModal(false);
        }
    };

    useEffect(() => {
        if (categoryType !== null) {
            loadValues.codeAndNameDetails?.map((s) =>
                s.category === ''
                    ? dispatch(getCodeAndNameDataByType(categoryType))
                    : detailsType.codeAndNameDetails.length != loadValues.codeAndNameDetails.length
                    ? setOpenModal(true)
                    : dispatch(getCodeAndNameDataByType(categoryType))
            );
        }
    }, [categoryType]);

    useEffect(() => {
        if (categoryType !== null) {
            if (detailsType !== null && detailsType.length != 0) {
                setLoadValues(detailsType);
            }
        }
    }, [detailsType]);

    const handleSubmitForm = async (data) => {
        if (mode === 'INSERT') {
            dispatch(saveCodeAndNameData(data));
        } else if (mode === 'VIEW_UPDATE') {
            dispatch(updateCodeAndNameData(data));
        }
        handleClose();
    };

    const loadCodeAndNameDetails = (event) => {
        const selectedType = event.currentTarget.dataset.value;
        if (loadValues.length != 0) {
        }
        setCategoryType(selectedType);
    };

    const handleSubmit = async (values) => {
        const initialValuesNew = {
            codeType: values.codeType,
            codeAndNameDetails: [
                {
                    category: values.codeType,
                    code: values.code,
                    name: values.name,
                    status: values.newStatus,
                    codeAndNameId: ''
                }
            ]
        };

        loadValues.codeAndNameDetails?.map((s) =>
            s.code === values.code && s.category == values.codeType ? setExistOpenModal(true) : initialValuesNew.codeAndNameDetails.push(s)
        );

        setLoadValues(initialValuesNew);
    };

    return (
        <div>
            <Dialog
                PaperProps={{
                    style: { borderRadius: 15 }
                }}
                maxWidth="220px"
                open={open}
                TransitionComponent={Transition}
                keepMounted
                disableBackdropClick
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update ' : ''} {mode === 'VIEW' ? 'View ' : ''}Code
                            & Name
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
                                                initialValues={initialValues1 || loadValues}
                                                // onSubmit={handleSubmit}
                                                onSubmit={(values, { resetForm }) => {
                                                    handleSubmit(values);
                                                    resetForm('');
                                                }}
                                                validationSchema={validationSchema1}
                                            >
                                                {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                    return (
                                                        <Form>
                                                            <div style={{ marginTop: '6px', margin: '10px' }}>
                                                                <Grid gap="10px" display="flex">
                                                                    <Grid item>
                                                                        {' '}
                                                                        <TextField
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            id="standard-select-currency"
                                                                            select
                                                                            label="Category"
                                                                            name="codeType"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            onChange={handleChange}
                                                                            SelectProps={{
                                                                                renderValue: (value) => value
                                                                            }}
                                                                            // onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.codeType}
                                                                            error={Boolean(touched.codeType && errors.codeType)}
                                                                            helperText={
                                                                                touched.codeType && errors.codeType ? errors.codeType : ''
                                                                            }
                                                                        >
                                                                            <MenuItem
                                                                                key="1"
                                                                                dense={true}
                                                                                value={'Cluster'}
                                                                                onClick={loadCodeAndNameDetails}
                                                                                // onClick={() => loadCodeAndNameDetails(this.value)}
                                                                            >
                                                                                Cluster
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                key="2"
                                                                                dense={true}
                                                                                selected={true}
                                                                                value={'Market'}
                                                                                onClick={loadCodeAndNameDetails}
                                                                            >
                                                                                Market
                                                                            </MenuItem>

                                                                            <MenuItem
                                                                                key="3"
                                                                                dense={true}
                                                                                value={'Operator'}
                                                                                onClick={loadCodeAndNameDetails}
                                                                            >
                                                                                Operator
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Code"
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="code"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.code}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.code && errors.code)}
                                                                            helperText={touched.code && errors.code ? errors.code : ''}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Description"
                                                                            sx={{
                                                                                width: { sm: 200, md: 200 },
                                                                                '& .MuiInputBase-root': {
                                                                                    height: 40
                                                                                }
                                                                            }}
                                                                            disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                                            type="text"
                                                                            variant="outlined"
                                                                            name="name"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.name}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.name && errors.name)}
                                                                            helperText={touched.name && errors.name ? errors.name : ''}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item xs={3}>
                                                                        <FormGroup>
                                                                            <FormControlLabel
                                                                                name="newStatus"
                                                                                onChange={handleChange}
                                                                                value={values.newStatus}
                                                                                control={<Switch color="success" />}
                                                                                label="Status"
                                                                                checked={values.newStatus}
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <IconButton
                                                                            aria-label="delete"
                                                                            type="submit"

                                                                            // onClick={() => {
                                                                            //     addDataToTable(values);
                                                                            //     // resetForm();
                                                                            // }}
                                                                        >
                                                                            {mode === 'INSERT' ? <AddBoxIcon /> : null}
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>

                                                            <br />
                                                        </Form>
                                                    );
                                                }}
                                            </Formik>
                                        </>

                                        <Formik
                                            enableReinitialize={true}
                                            initialValues={loadValues || initialValues}
                                            // onSubmit={(values) => {
                                            //     alert(values);
                                            //     handleSubmitForm(values);
                                            // }}
                                            onSubmit={(values, resetForm) => {
                                                handleSubmitForm(values);
                                                resetForm('');
                                            }}
                                            // onSubmit={handleSubmitForm}
                                            validationSchema={validationSchema}
                                        >
                                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                return (
                                                    <Form>
                                                        <FieldArray name="codeAndNameDetails">
                                                            {({ insert, remove, push }) => (
                                                                <Paper>
                                                                    {/* {mode != 'VIEW' ? (
                                                                            <Box display="flex" flexDirection="row-reverse">
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    onClick={() => {
                                                                                        push({
                                                                                            code: '',
                                                                                            name: '',
                                                                                            status: true
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    {mode === 'INSERT' ? <AddBoxIcon /> : null}
                                                                                </IconButton>
                                                                            </Box>
                                                                        ) : (
                                                                            ''
                                                                        )} */}

                                                                    <TableContainer>
                                                                        <Table stickyHeader size="small">
                                                                            <TableHead alignItems="center">
                                                                                <TableRow>
                                                                                    {/* <TableCell>Sequence</TableCell> */}
                                                                                    <TableCell>Category</TableCell>
                                                                                    <TableCell>Code </TableCell>
                                                                                    <TableCell>Description</TableCell>
                                                                                    <TableCell>Status</TableCell>
                                                                                    <TableCell>Actions</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            {/* {tableBodyData ? ( */}
                                                                            <TableBody>
                                                                                {(rowsPerPage > 0
                                                                                    ? values.codeAndNameDetails.slice(
                                                                                          page * rowsPerPage,
                                                                                          page * rowsPerPage + rowsPerPage
                                                                                      )
                                                                                    : values.codeAndNameDetails
                                                                                ).map((record, idx) => {
                                                                                    // {values.codeAndNameDetails.map((record, idx) => {
                                                                                    return (
                                                                                        <TableRow key={idx} hover>
                                                                                            {/* <TableCell>{idx + 1}</TableCell> */}

                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { sm: 200 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    disabled
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    name={`codeAndNameDetails.${idx}.category`}
                                                                                                    value={
                                                                                                        values.codeAndNameDetails[idx] &&
                                                                                                        values.codeAndNameDetails[idx]
                                                                                                            .category
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.codeAndNameDetails &&
                                                                                                            touched.codeAndNameDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.codeAndNameDetails[idx]
                                                                                                                .category &&
                                                                                                            errors.codeAndNameDetails &&
                                                                                                            errors.codeAndNameDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.codeAndNameDetails[idx]
                                                                                                                .category
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.codeAndNameDetails &&
                                                                                                        touched.codeAndNameDetails[idx] &&
                                                                                                        touched.codeAndNameDetails[idx]
                                                                                                            .category &&
                                                                                                        errors.codeAndNameDetails &&
                                                                                                        errors.codeAndNameDetails[idx] &&
                                                                                                        errors.codeAndNameDetails[idx]
                                                                                                            .category
                                                                                                            ? errors.codeAndNameDetails[idx]
                                                                                                                  .category
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { sm: 200 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    disabled
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="code"
                                                                                                    // validate={checkDuplicateCodeForCodeAndName}

                                                                                                    name={`codeAndNameDetails.${idx}.code`}
                                                                                                    value={
                                                                                                        values.codeAndNameDetails[idx] &&
                                                                                                        values.codeAndNameDetails[idx].code
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.codeAndNameDetails &&
                                                                                                            touched.codeAndNameDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.codeAndNameDetails[idx]
                                                                                                                .code &&
                                                                                                            errors.codeAndNameDetails &&
                                                                                                            errors.codeAndNameDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.codeAndNameDetails[idx]
                                                                                                                .code
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.codeAndNameDetails &&
                                                                                                        touched.codeAndNameDetails[idx] &&
                                                                                                        touched.codeAndNameDetails[idx]
                                                                                                            .code &&
                                                                                                        errors.codeAndNameDetails &&
                                                                                                        errors.codeAndNameDetails[idx] &&
                                                                                                        errors.codeAndNameDetails[idx].code
                                                                                                            ? errors.codeAndNameDetails[idx]
                                                                                                                  .code
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                <TextField
                                                                                                    sx={{
                                                                                                        width: { sm: 200 },
                                                                                                        '& .MuiInputBase-root': {
                                                                                                            height: 40
                                                                                                        }
                                                                                                    }}
                                                                                                    //   type="number"
                                                                                                    variant="outlined"
                                                                                                    // placeholder="name"
                                                                                                    name={`codeAndNameDetails.${idx}.name`}
                                                                                                    value={
                                                                                                        values.codeAndNameDetails[idx] &&
                                                                                                        values.codeAndNameDetails[idx].name
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.codeAndNameDetails &&
                                                                                                            touched.codeAndNameDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.codeAndNameDetails[idx]
                                                                                                                .name &&
                                                                                                            errors.codeAndNameDetails &&
                                                                                                            errors.codeAndNameDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.codeAndNameDetails[idx]
                                                                                                                .name
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.codeAndNameDetails &&
                                                                                                        touched.codeAndNameDetails[idx] &&
                                                                                                        touched.codeAndNameDetails[idx]
                                                                                                            .name &&
                                                                                                        errors.codeAndNameDetails &&
                                                                                                        errors.codeAndNameDetails[idx] &&
                                                                                                        errors.codeAndNameDetails[idx].name
                                                                                                            ? errors.codeAndNameDetails[idx]
                                                                                                                  .name
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <FormGroup>
                                                                                                    <FormControlLabel
                                                                                                        name={`codeAndNameDetails.${idx}.status`}
                                                                                                        onChange={handleChange}
                                                                                                        value={
                                                                                                            values.codeAndNameDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.codeAndNameDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        control={<Switch color="success" />}
                                                                                                        // label="Status"
                                                                                                        checked={
                                                                                                            values.codeAndNameDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        disabled
                                                                                                        // disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                {(values.codeAndNameDetails[idx] &&
                                                                                                    values.codeAndNameDetails[idx]
                                                                                                        .codeAndNameId) === '' ? (
                                                                                                    <IconButton
                                                                                                        aria-label="delete"
                                                                                                        onClick={() => {
                                                                                                            remove(idx);
                                                                                                        }}
                                                                                                    >
                                                                                                        <HighlightOffIcon />
                                                                                                    </IconButton>
                                                                                                ) : null}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    );
                                                                                })}
                                                                                {/* {emptyRows > 0 && (
                                                                                    <TableRow style={{ height: 53 * emptyRows }}>
                                                                                        <TableCell colSpan={6} />
                                                                                    </TableRow>
                                                                                )} */}
                                                                            </TableBody>
                                                                            <TableFooter>
                                                                                <TableRow>
                                                                                    <TablePagination
                                                                                        rowsPerPageOptions={[
                                                                                            5, 10, 25
                                                                                            // { label: 'All', value: -1 }
                                                                                        ]}
                                                                                        count={values.codeAndNameDetails.length}
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
                                                                            {/* ) : null} */}
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
                                                        <Box>
                                                            <Grid item>
                                                                {openModal ? (
                                                                    <AlertItemDelete
                                                                        title="dev"
                                                                        open={openModal}
                                                                        handleClose={handleModalClose}
                                                                    />
                                                                ) : null}
                                                            </Grid>

                                                            <Grid item>
                                                                {existOpenModal ? (
                                                                    <AlertItemExist
                                                                        title="Already Exist"
                                                                        open={existOpenModal}
                                                                        handleClose={handleExistModalClose}
                                                                    />
                                                                ) : null}
                                                            </Grid>
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

export default CodeAndName;
