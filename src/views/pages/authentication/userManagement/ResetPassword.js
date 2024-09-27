import { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Formik, Form } from 'formik';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from 'store/actions/authenticationActions/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';

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

export default function ResetPassword() {
    const initialValues = {
        username: '',
        temPassword: '',
        newPassword: '',
        reEnteredNewPassword: ''
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formikRef = useRef();

    const resetPasswordData = useSelector((state) => state.userReducer.resetPasswordData);
    const error = useSelector((state) => state.userReducer.errorMsg);
    const [showPassword, setShowPassword] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [openToast, setHandleToast] = useState(false);
    const [errMsg, setErrorMsg] = useState('');

    const validationSchema = yup.object().shape({
        username: yup.string().required('Requied field'),
        temPassword: yup.string().required('Requied field'),
        newPassword: yup
            .string()
            .required('Requied field')
            .min(8, 'Must be 8 characters or more')
            .matches(/[a-z]+/, 'One lowercase character')
            .matches(/[A-Z]+/, 'One uppercase character')
            .matches(/[@$!%*#?&]+/, 'One special character')
            .matches(/\d+/, 'One number')
            .test('isValidPass1', 'can not include userName', (value, context) => {
                console.log(typeof value);
                console.log(formikRef.current.values.username);
                if (value !== '' && formikRef.current.values.username !== '') {
                    console.log(value.includes(formikRef.current.values.username));
                    return !value.includes(formikRef.current.values.username);
                }

                return true;
            }),

        reEnteredNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        console.log(resetPasswordData);
        if (resetPasswordData !== null) {
            navigate('/dashboard/default');
        }
    }, [resetPasswordData]);

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
        dispatch(resetPassword(data));
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
                            'url(https://images.unsplash.com/photo-1642025967715-0410af8d7077?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            console.log('hi');
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
                                            Reset Your Password ?
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <TextField
                                                margin="normal"
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

                                            <TextField
                                                label="Temporary Code"
                                                name="temPassword"
                                                margin="normal"
                                                fullWidth
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                value={values.temPassword}
                                                error={Boolean(touched.temPassword && errors.temPassword)}
                                                helperText={touched.temPassword && errors.temPassword ? errors.temPassword : ''}
                                            />

                                            <TextField
                                                label="New Password"
                                                name="newPassword"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                type={showPassword ? 'text' : 'password'}
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.newPassword}
                                                error={Boolean(touched.newPassword && errors.newPassword)}
                                                helperText={touched.newPassword && errors.newPassword ? errors.newPassword : ''}
                                            />
                                            <TextField
                                                label="Re-Enter New Password"
                                                name="reEnteredNewPassword"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                type={showPassword ? 'text' : 'password'}
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.reEnteredNewPassword}
                                                error={Boolean(touched.reEnteredNewPassword && errors.reEnteredNewPassword)}
                                                helperText={
                                                    touched.reEnteredNewPassword && errors.reEnteredNewPassword
                                                        ? errors.reEnteredNewPassword
                                                        : ''
                                                }
                                            />

                                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                                RESET PASSWORD
                                            </Button>
                                            <Copyright sx={{ mt: 5 }} />
                                        </Box>
                                        {/* {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={'LOGIN'} /> : null} */}
                                        {openErrorToast ? (
                                            <ErrorMsg
                                                openToast={openErrorToast}
                                                handleToast={setOpenErrorToast}
                                                mode={'RESET'}
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
