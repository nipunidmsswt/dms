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
import { getCodeAndNameDataByType } from 'store/actions/masterActions/CodeAndNameAction';
import CreatedUpdatedUserDetailsWithTableFormat from '../../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';
import AlertItemDelete from 'messages/AlertItemDelete';
import AlertItemExist from 'messages/AlertItemExist';
import {
    getTransportMainCategoryDataByType,
    saveMainTransportDetailsData
} from 'store/actions/masterActions/transportActions/MainTransportCategoriesActions';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function MainTransportCategories({ open, handleClose, mode, ccode }) {
    const headerInitialValues = {
        category: '',
        code: '',
        description: '',
        status: true
    };
    const pages = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [initialValues, setInitial] = useState(headerInitialValues);
    const [openModal, setOpenModal] = useState(false);
    const [existOpenModal, setExistOpenModal] = useState(false);
    const [loadValues, setLoadValues] = useState({
        // category: '',
        // code: '',
        // description: '',
        // status: true,
        mainCategoryDetails: [{ categoryType: '', typeCode: '', description: '', status: true, enableRow: false }]
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
                path: `mainCategoryDetails[${idx}].code`,
                message: message
            });
        });
    });

    const validationSchema = yup.object().shape({
        mainCategoryDetails: yup.array().of(
            yup.object().shape({
                categoryType: yup.string().required('Required field'),
                typeCode: yup.string().required('Required field'),
                description: yup.string().required('Required field')
            })
        )
        // .uniqueCodeAndNameCode("Must be unique"),
        // .uniqueCode('Code Already Exist')
    });

    const validationSchema1 = yup.object().shape({
        category: yup.string().required('Required field'),
        code: yup.string().required('Required field'),
        description: yup.string().required('Required field')
    });

    //get data from reducers
    const detailsType = useSelector((state) => state.mainTransportCategoryReducer.detailsType);
    const dispatch = useDispatch();

    const [categoryType, setCategoryType] = useState(null);

    const handleModalClose = (status) => {
        setOpenModal(false);
        if (status) {
            dispatch(getTransportMainCategoryDataByType(categoryType));
        }
    };
    const handleExistModalClose = (status) => {
        if (status) {
            setExistOpenModal(false);
        }
    };

    // useEffect(() => {
    //     if (categoryType !== null) {
    //         if (loadValues?.mainCategoryDetails.length != 0) {
    //             loadValues.mainCategoryDetails?.map((s) =>
    //                 s.categoryType === ''
    //                     ? dispatch(getTransportMainCategoryDataByType(categoryType))
    //                     : detailsType.mainCategoryDetails.length != loadValues.mainCategoryDetails.length
    //                     ? setOpenModal(true)
    //                     : dispatch(getTransportMainCategoryDataByType(categoryType))
    //             );
    //         } else {
    //             dispatch(getTransportMainCategoryDataByType(categoryType));
    //         }
    //     }
    // }, [categoryType]);

    useEffect(() => {
        if (categoryType !== null) {
            if (detailsType !== null && detailsType.length != 0) {
                console.log(detailsType);

                const values = {
                    mainCategoryDetails: detailsType
                };
                setLoadValues(values);
            } else {
                const values = {
                    mainCategoryDetails: [{ categoryType: '', typeCode: '', description: '', status: true, enableRow: false }]
                };
                setLoadValues(values);
            }
        }
    }, [detailsType]);

    useEffect(() => {
        if (categoryType !== null && loadValues.mainCategoryDetails != null) {
            loadValues?.mainCategoryDetails?.map((s) =>
                s.categoryType === ''
                    ? dispatch(getTransportMainCategoryDataByType(categoryType))
                    : detailsType?.length != loadValues?.mainCategoryDetails?.length && s.categoryType != categoryType
                    ? setOpenModal(true)
                    : dispatch(getTransportMainCategoryDataByType(categoryType))
            );
        }
    }, [categoryType]);

    // useEffect(() => {
    //     if (categoryType !== null) {
    //         if (detailsType !== null && detailsType.length != 0) {
    //             setLoadValues(detailsType);
    //         }
    //     }
    // }, [detailsType]);

    const handleSubmitForm = async (data) => {
        console.log(data);
        if (mode === 'INSERT') {
            const mainCategoryArray = data.mainCategoryDetails;
            console.log(mainCategoryArray);
            dispatch(saveMainTransportDetailsData(mainCategoryArray));
        } else if (mode === 'VIEW_UPDATE') {
            // dispatch(updateCodeAndNameData(data));
        }
        handleClose();
    };

    const loadCategory = (event) => {
        const selectedType = event.currentTarget.dataset.value;
        if (loadValues.length != 0) {
        }
        setCategoryType(selectedType);
    };

    const handleSubmit = async (values) => {
        console.log(values);
        const initialValuesNew = {
            // category: values.category,
            // code: values.category,
            // description: '',
            // status: true,
            mainCategoryDetails: [
                {
                    categoryType: values.category,
                    typeCode: values.code,
                    description: values.description,
                    status: values.status,
                    categoryId: ''
                }
            ]
        };
        if (loadValues.mainCategoryDetails.length != 0) {
            loadValues.mainCategoryDetails?.map((s) =>
                s.typeCode == '' && s.categoryType == ''
                    ? initialValuesNew
                    : s.typeCode === values.code && s.categoryType == values.category
                    ? setExistOpenModal(true)
                    : initialValuesNew.mainCategoryDetails.push(s)
            );

            setLoadValues(initialValuesNew);
        } else {
            setLoadValues(initialValuesNew);
        }
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
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" className="dialog-title">
                        <Box flexGrow={1}>
                            {mode === 'INSERT' ? 'Add' : ''} {mode === 'VIEW_UPDATE' ? 'Update ' : ''} {mode === 'VIEW' ? 'View ' : ''}Main
                            Categories
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
                                                initialValues={headerInitialValues}
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
                                                                            name="category"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            onChange={handleChange}
                                                                            SelectProps={{
                                                                                renderValue: (value) => value
                                                                            }}
                                                                            onBlur={handleBlur}
                                                                            value={values.category}
                                                                            error={Boolean(touched.category && errors.category)}
                                                                            helperText={
                                                                                touched.category && errors.category ? errors.category : ''
                                                                            }
                                                                        >
                                                                            <MenuItem
                                                                                key="1"
                                                                                dense={true}
                                                                                value={'Transport Type'}
                                                                                onClick={loadCategory}
                                                                                // onClick={() => loadmainCategoryDetails(this.value)}
                                                                            >
                                                                                Transport Type
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                key="2"
                                                                                dense={true}
                                                                                selected={true}
                                                                                value={'Vehicle Category'}
                                                                                onClick={loadCategory}
                                                                            >
                                                                                Vehicle Category
                                                                            </MenuItem>

                                                                            <MenuItem
                                                                                key="3"
                                                                                dense={true}
                                                                                value={'Vehicle Type'}
                                                                                onClick={loadCategory}
                                                                            >
                                                                                Vehicle Type
                                                                            </MenuItem>
                                                                        </TextField>
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <TextField
                                                                            label="Type Code"
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
                                                                            name="description"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            value={values.description}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.description && errors.description)}
                                                                            helperText={
                                                                                touched.description && errors.description
                                                                                    ? errors.description
                                                                                    : ''
                                                                            }
                                                                        />
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
                                                                                // disabled={mode == 'VIEW'}
                                                                            />
                                                                        </FormGroup>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <IconButton
                                                                            ara-label="delete"
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
                                            initialValues={loadValues}
                                            // initialValues={loadValues}
                                            onSubmit={(values, resetForm) => {
                                                handleSubmitForm(values);
                                                // resetForm('');
                                            }}
                                            validationSchema={validationSchema}
                                        >
                                            {({ values, handleChange, setFieldValue, errors, handleBlur, touched, resetForm }) => {
                                                return (
                                                    <Form>
                                                        <FieldArray name="mainCategoryDetails">
                                                            {({ insert, remove, push }) => (
                                                                <Paper>
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
                                                                                    ? values.mainCategoryDetails.slice(
                                                                                          page * rowsPerPage,
                                                                                          page * rowsPerPage + rowsPerPage
                                                                                      )
                                                                                    : values.mainCategoryDetails
                                                                                ).map((record, idx) => {
                                                                                    // {values.mainCategoryDetails.map((record, idx) => {
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
                                                                                                    variant="outlined"
                                                                                                    name={`mainCategoryDetails.${idx}.categoryType`}
                                                                                                    value={
                                                                                                        values.mainCategoryDetails[idx] &&
                                                                                                        values.mainCategoryDetails[idx]
                                                                                                            .categoryType
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.mainCategoryDetails &&
                                                                                                            touched.mainCategoryDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.mainCategoryDetails[idx]
                                                                                                                .categoryType &&
                                                                                                            errors.mainCategoryDetails &&
                                                                                                            errors.mainCategoryDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.mainCategoryDetails[idx]
                                                                                                                .categoryType
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.mainCategoryDetails &&
                                                                                                        touched.mainCategoryDetails[idx] &&
                                                                                                        touched.mainCategoryDetails[idx]
                                                                                                            .categoryType &&
                                                                                                        errors.mainCategoryDetails &&
                                                                                                        errors.mainCategoryDetails[idx] &&
                                                                                                        errors.mainCategoryDetails[idx]
                                                                                                            .categoryType
                                                                                                            ? errors.mainCategoryDetails[
                                                                                                                  idx
                                                                                                              ].categoryType
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

                                                                                                    name={`mainCategoryDetails.${idx}.typeCode`}
                                                                                                    value={
                                                                                                        values.mainCategoryDetails[idx] &&
                                                                                                        values.mainCategoryDetails[idx]
                                                                                                            .typeCode
                                                                                                    }
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.mainCategoryDetails &&
                                                                                                            touched.mainCategoryDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.mainCategoryDetails[idx]
                                                                                                                .typeCode &&
                                                                                                            errors.mainCategoryDetails &&
                                                                                                            errors.mainCategoryDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.mainCategoryDetails[idx]
                                                                                                                .typeCode
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.mainCategoryDetails &&
                                                                                                        touched.mainCategoryDetails[idx] &&
                                                                                                        touched.mainCategoryDetails[idx]
                                                                                                            .typeCode &&
                                                                                                        errors.mainCategoryDetails &&
                                                                                                        errors.mainCategoryDetails[idx] &&
                                                                                                        errors.mainCategoryDetails[idx]
                                                                                                            .typeCode
                                                                                                            ? errors.mainCategoryDetails[
                                                                                                                  idx
                                                                                                              ].typeCode
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
                                                                                                    name={`mainCategoryDetails.${idx}.description`}
                                                                                                    value={
                                                                                                        values.mainCategoryDetails[idx] &&
                                                                                                        values.mainCategoryDetails[idx]
                                                                                                            .description
                                                                                                    }
                                                                                                    disabled
                                                                                                    onChange={handleChange}
                                                                                                    onBlur={handleBlur}
                                                                                                    error={Boolean(
                                                                                                        touched.mainCategoryDetails &&
                                                                                                            touched.mainCategoryDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            touched.mainCategoryDetails[idx]
                                                                                                                .description &&
                                                                                                            errors.mainCategoryDetails &&
                                                                                                            errors.mainCategoryDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            errors.mainCategoryDetails[idx]
                                                                                                                .description
                                                                                                    )}
                                                                                                    helperText={
                                                                                                        touched.mainCategoryDetails &&
                                                                                                        touched.mainCategoryDetails[idx] &&
                                                                                                        touched.mainCategoryDetails[idx]
                                                                                                            .description &&
                                                                                                        errors.mainCategoryDetails &&
                                                                                                        errors.mainCategoryDetails[idx] &&
                                                                                                        errors.mainCategoryDetails[idx]
                                                                                                            .description
                                                                                                            ? errors.mainCategoryDetails[
                                                                                                                  idx
                                                                                                              ].description
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <FormGroup>
                                                                                                    <FormControlLabel
                                                                                                        name={`mainCategoryDetails.${idx}.status`}
                                                                                                        onChange={handleChange}
                                                                                                        value={
                                                                                                            values.mainCategoryDetails[
                                                                                                                idx
                                                                                                            ] &&
                                                                                                            values.mainCategoryDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        control={<Switch color="success" />}
                                                                                                        // label="Status"
                                                                                                        checked={
                                                                                                            values.mainCategoryDetails[idx]
                                                                                                                .status
                                                                                                        }
                                                                                                        disabled={mode == 'VIEW'}
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </TableCell>

                                                                                            <TableCell>
                                                                                                {(values.mainCategoryDetails[idx] &&
                                                                                                    values.mainCategoryDetails[idx]
                                                                                                        .categoryId) === '' ? (
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
                                                                                        count={values.mainCategoryDetails.length}
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
                                                                        title="dev"
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

export default MainTransportCategories;
