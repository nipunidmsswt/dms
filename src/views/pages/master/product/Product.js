import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Slide,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';
import { useEffect, forwardRef, useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
    saveProductData,
    getProductDataById,
    updateProductData,
    checkDuplicateProductCodee
} from 'store/actions/masterActions/ProductDataAction';
import { CheckBox } from '@mui/icons-material';
import CreatedUpdatedUserDetails from '../userTimeDetails/CreatedUpdatedUserDetailsWithTableFormat';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Product({ open, mode, handleClose, rowProductCode }) {
    // const phoneRegExp=/^[2-9]{2}[0-9]{8}/
    // const passwordRegExp=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    const [duplicateError, setDuplicateError] = useState(false);

    const dispatch = useDispatch();

    const initialValues = {
        productCode: '',
        productName: '',
        status: true
    };

    const productToUpdate = useSelector((state) => state.productDataReducer.productToUpdate);

    const duplicateProduct = useSelector((state) => state.productDataReducer.duplicateProduct);

    const handleChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };
    // useEffect(() => {
    //   if (duplicateProduct != null) {
    //     if (duplicateProduct.length != 0) {
    //       let data = [];
    //       setDuplicateError(true);
    //     } else {
    //       let data = null;
    //       setDuplicateError(false);
    //     }
    //   }
    // }, [duplicateProduct]);

    const validationSchema = Yup.object().shape({
        // name: Yup.string().min(3, "It's too short").required("Required"),
        // email: Yup.string().email("Enter valid email").required("Required"),
        // // phoneNumber: Yup.number().typeError("Enter valid Phone number").required("Required"),
        // phoneNumber:Yup.string().matches(phoneRegExp,"Enter valid Phone number").required("Required"),
        // password: Yup.string().min(8, "Minimum characters should be 8")
        // .matc,hes(passwordRegExp,"Password must have one upper, lower case, number, special symbol").required('Required'),
        // confirmPassword:Yup.string().oneOf([Yup.ref('password')],"Password not matches").required('Required')

        productCode: Yup.string()
            .required('Required')
            .test('Unique', 'Product Code Already Exists', async (value) => {
                if (mode === 'INSERT') {
                    const res = await checkDuplicateProductCode(value);

                    if (duplicateProduct != null && duplicateProduct.errorMessages.length != 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }),
        productName: Yup.string().required('Required'),
        status: Yup.boolean()
    });

    const [formValues, setFormValues] = useState(initialValues);

    const handleSubmitForm = (values, props) => {
        if (mode === 'INSERT') {
            dispatch(saveProductData(values));
        } else if (mode === 'VIEW_UPDATE') {
            // setDuplicateError(false);
            dispatch(updateProductData(values));
        }
        handleClose();

        // props.resetForm()
    };

    useEffect(() => {
        if ((mode === 'VIEW_UPDATE' && productToUpdate != null) || (mode === 'VIEW' && productToUpdate != null)) {
            setFormValues(productToUpdate);
        }
    }, [productToUpdate]);

    const checkDuplicateProductCode = (values) => {
        if (values != '' && mode === 'INSERT') {
            dispatch(checkDuplicateProductCodee(values));
        }
    };

    useEffect(() => {
        if (mode === 'VIEW_UPDATE' || mode === 'VIEW') {
            dispatch(getProductDataById(rowProductCode));
            // setDuplicateError(false);
        }
    }, [mode]);

    const handleReset = (resetForm) => {
        resetForm();
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                disableBackdropClick
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" className="dialog-title">
                        <Box flexGrow={1}>
                            {(() => {
                                if (mode === 'INSERT') {
                                    return 'Add  Product';
                                    // <Text>Add</Text>
                                } else if (mode === 'VIEW') {
                                    return 'View  Product';
                                } else {
                                    return 'Edit  Product';
                                }

                                return null;
                            })()}

                            {/* {mode === "INSERT" ? "Add " : "Edit "} Tour Category */}
                        </Box>
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>

                <Formik
                    initialValues={{ ...formValues }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                >
                    {(props) => (
                        <Form noValidate>
                            <DialogContent>
                                <div>
                                    <Grid container direction="column" gap={'15px'} justifyContent="center" alignContent="center">
                                        <Grid item>
                                            <Typography variant="subtitle1" component="h2">
                                                Product Code
                                            </Typography>
                                        </Grid>

                                        <Grid item>
                                            <Field
                                                as={TextField}
                                                name="productCode"
                                                disabled={mode == 'VIEW_UPDATE' || mode == 'VIEW'}
                                                fullWidth
                                                sx={{
                                                    width: { sm: 200, md: 300 },
                                                    '& .MuiInputBase-root': {
                                                        height: 30
                                                    }
                                                }}
                                                error={props.errors.productCode && props.touched.productCode}
                                                // helperText={
                                                //   error && formValues.tourCategoryCode.length === 0
                                                //     ? "Required Field"
                                                //     : "" || duplicateError
                                                //     ? "Category Code Already Exists"
                                                //     : ""
                                                // }
                                                helperText={<ErrorMessage name="productCode" value="" />}
                                                required
                                                // onBlur={(e) => checkDuplicateProductCode(e)}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Typography variant="subtitle1" component="h2">
                                                Product Description
                                            </Typography>
                                        </Grid>

                                        <Grid item>
                                            <Field
                                                as={TextField}
                                                name="productName"
                                                sx={{
                                                    width: { sm: 200, md: 300 },
                                                    '& .MuiInputBase-root': {
                                                        height: 30
                                                    }
                                                }}
                                                disabled={mode != 'INSERT'}
                                                error={props.errors.productName && props.touched.productName}
                                                helperText={<ErrorMessage name="productName" value={formValues.productName} />}
                                                required
                                            />
                                        </Grid>

                                        {/* <Grid item> */}
                                        <Grid item xs={6}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    name="status"
                                                    control={<Switch color="success" />}
                                                    label="Status"
                                                    disabled={mode == 'VIEW'}
                                                    onChange={handleChange}
                                                    checked={formValues.status}
                                                    value={formValues.status}
                                                />
                                            </FormGroup>
                                        </Grid>
                                        {mode === 'VIEW' ? <CreatedUpdatedUserDetails formValues={formValues} mode={mode} /> : null}
                                    </Grid>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    style={{
                                        // backgroundColor: '#00AB55',
                                        display: mode == 'VIEW' ? 'none' : 'block'
                                    }}
                                    className="btnSave"
                                >
                                    {mode === 'INSERT' ? 'SAVE' : 'UPDATE'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    type="button"
                                    style={{
                                        // backgroundColor: '#B22222',
                                        display: mode == 'VIEW' ? 'none' : 'block'
                                    }}
                                    // onClick={clearForm}
                                    onClick={handleReset.bind(null, props.resetForm)}
                                >
                                    CANCEL
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
}

export default Product;
