import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from 'store/actions/authenticationActions/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import Link from '@mui/material/Link';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function ForgotPassword() {
    const initialValues = {
        username: ''
    };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const forgotPasswordData = useSelector((state) => state.userReducer.forgotPasswordData);
    const error = useSelector((state) => state.userReducer.errorMsg);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [openToast, setHandleToast] = useState(false);
    const [errMsg, setErrorMsg] = useState('');

    const validationSchema = yup.object().shape({
        username: yup.string().required('Requied field')
    });

    useEffect(() => {
        console.log(forgotPasswordData);
        if (forgotPasswordData !== null) {
            // navigate('/dashboard/default');
        }
    }, [forgotPasswordData]);

    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
            setErrorMsg(error);
        }
    }, [error]);

    const handleToast = () => {
        setHandleToast(false);
    };

    const handleSubmitForm = (data) => {
        console.log(data);
        // navigate('/dashboard/default');
        dispatch(forgotPassword(data));
        // navigate('/dashboard/default');
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1634804306598-f2efe3ead034?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            handleSubmitForm(values);
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ values, handleChange, errors, handleBlur, touched }) => {
                            return (
                                <Form>
                                    <Box
                                        sx={{
                                            my: 8,
                                            mx: 4,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                            <LockOutlinedIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5">
                                            Forgot Your Password ?
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <TextField
                                                id="outlined-required"
                                                label="User Name"
                                                name="username"
                                                fullWidth
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                value={values.username}
                                                error={Boolean(touched.username && errors.username)}
                                                helperText={touched.username && errors.username ? errors.username : ''}
                                            />

                                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                                SEND VERIFICATION CODE
                                            </Button>

                                            <Button type="button" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                                BACK TO SIGNIN
                                            </Button>

                                            <Copyright sx={{ mt: 5 }} />
                                        </Box>
                                        {/* {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={'LOGIN'} /> : null} */}
                                        {openErrorToast ? (
                                            <ErrorMsg
                                                openToast={openErrorToast}
                                                handleToast={setOpenErrorToast}
                                                mode={'FORGOT'}
                                                messages={errMsg}
                                            />
                                        ) : null}
                                    </Box>
                                </Form>
                            );
                        }}
                    </Formik>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
