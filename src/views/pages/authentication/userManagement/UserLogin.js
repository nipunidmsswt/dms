// import { useState } from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Visibility from '@mui/icons-material/Visibility';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { Formik, Form } from 'formik';
// import InputAdornment from '@mui/material/InputAdornment';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import IconButton from '@mui/material/IconButton';
// import * as yup from 'yup';
// import { useNavigate } from 'react-router-dom';
// import { userLogin } from 'store/actions/authenticationActions/UserAction';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
// import SuccessMsg from 'messages/SuccessMsg';
// import ErrorMsg from 'messages/ErrorMsg';
// import './slider/Slider.scss';
// import { sliderData } from './slider/slider-data';

// function Copyright(props) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright © '}
//             <Link color="inherit" href="https://mui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

// const theme = createTheme();

// export default function Login() {
//     const initialValues = {
//         username: '',
//         password: ''
//     };
//     const delay = 5;
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const loggedUserData = useSelector((state) => state.userReducer.loggedUserData);
//     const error = useSelector((state) => state.userReducer.errorMsg);
//     const [showPassword, setShowPassword] = useState(false);
//     const [openErrorToast, setOpenErrorToast] = useState(false);
//     const [errMsg, setErrorMsg] = useState('');
//     const [openToast, setHandleToast] = useState(false);
//     const [imgeUrl, setUrls] = [];
//     const [show, setShow] = useState(false);
//     const validationSchema = yup.object().shape({
//         username: yup.string().required('Requied field'),
//         password: yup.string().required('Requied field')
//     });

//     const handleClickShowPassword = () => setShowPassword((show) => !show);

//     const handleMouseDownPassword = (event) => {
//         event.preventDefault();
//     };

//     useEffect(() => {
//         console.log(loggedUserData);

//         if (loggedUserData !== null) {
//             localStorage.setItem('userData', JSON.stringify(loggedUserData.user));
//             localStorage.setItem('token', JSON.stringify(loggedUserData.token));
//             navigate('/dashboard/default');
//         }
//     }, [loggedUserData]);

//     useEffect(() => {
//         console.log(error);
//         if (error != null) {
//             console.log('failed Toast');
//             setOpenErrorToast(true);
//             setErrorMsg(error);
//         }
//     }, [error]);

//     const handleToast = () => {
//         setHandleToast(false);
//     };

//     const handleSubmitForm = (data) => {
//         console.log(data);
//         // navigate('/dashboard/default');
//         dispatch(userLogin(data));
//         // navigate('/dashboard/default');
//     };

//     const MINUTE_MS = 10000;

//     const [currentSlide, setCurrentSlide] = useState(0);
//     const slideLength = sliderData.length;

//     const autoScroll = true;
//     let slideInterval;
//     let intervalTime = 5000;

//     const nextSlide = () => {
//         setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
//         console.log('next');
//     };

//     const prevSlide = () => {
//         setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
//         console.log('prev');
//     };

//     function auto() {
//         slideInterval = setInterval(nextSlide, intervalTime);
//     }

//     useEffect(() => {
//         setCurrentSlide(0);
//     }, []);

//     useEffect(() => {
//         if (autoScroll) {
//             auto();
//         }
//         return () => clearInterval(slideInterval);
//     }, [currentSlide]);

//     // useEffect(() => {
//     //     const urlsss = ["https://images.unsplash.com/photo-1674428431800-399f847e5322?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"],

//     //     const interval = setInterval(() => {
//     //         console.log('Logs every minute');
//     //         setUrls;
//     //     }, MINUTE_MS);

//     //     return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
//     // }, []);

//     return (
//         <ThemeProvider theme={theme}>
//             <Grid container sx={{ height: '100vh' }}>
//                 <CssBaseline />
//                 <Grid item sm={4} md={7} xs={false}>
//                     {' '}
//                     {sliderData.map((slide, index) => {
//                         return (
//                             <div className={index === currentSlide ? 'slide current' : 'slide'} key={index}>
//                                 {index === currentSlide && (
//                                     <div>
//                                         <img
//                                             height="auto"
//                                             src={slide.image}
//                                             alt="slide"
//                                             // sx={{ backgroundSize: 'cover', backgroundPosition: 'center', height: '150vh' }}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </Grid>

//                 <Grid
//                     item
//                     xs={12}
//                     sm={8}
//                     md={5}
//                     component={Paper}
//                     elevation={6}
//                     square
//                     sx={{
//                         my: 8,
//                         mx: 4,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         backgroundColor: 'white'
//                     }}
//                 >
//                     <Formik
//                         initialValues={initialValues}
//                         onSubmit={(values) => {
//                             console.log('hi');
//                             handleSubmitForm(values);
//                         }}
//                         validationSchema={validationSchema}
//                     >
//                         {({ values, handleChange, errors, handleBlur, touched }) => {
//                             return (
//                                 <Form>
//                                     <Box
//                                         sx={{
//                                             my: 8,
//                                             mx: 4,
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             alignItems: 'center'
//                                         }}
//                                     >
//                                         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//                                             <LockOutlinedIcon />
//                                         </Avatar>
//                                         <Typography component="h1" variant="h5">
//                                             Sign in
//                                         </Typography>
//                                         <Box sx={{ mt: 1 }}>
//                                             <TextField
//                                                 id="outlined-required"
//                                                 label="User Name"
//                                                 name="username"
//                                                 fullWidth
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 InputLabelProps={{
//                                                     shrink: true
//                                                 }}
//                                                 value={values.username}
//                                                 error={Boolean(touched.username && errors.username)}
//                                                 helperText={touched.username && errors.username ? errors.username : ''}
//                                             />

//                                             <TextField
//                                                 label="Password"
//                                                 id="outlined-start-adornment"
//                                                 name="password"
//                                                 fullWidth
//                                                 InputLabelProps={{
//                                                     shrink: true
//                                                 }}
//                                                 type={showPassword ? 'text' : 'password'}
//                                                 margin="normal"
//                                                 InputProps={{
//                                                     endAdornment: (
//                                                         <InputAdornment position="end">
//                                                             <IconButton
//                                                                 aria-label="toggle password visibility"
//                                                                 onClick={handleClickShowPassword}
//                                                                 onMouseDown={handleMouseDownPassword}
//                                                                 edge="end"
//                                                             >
//                                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                                             </IconButton>
//                                                         </InputAdornment>
//                                                     )
//                                                 }}
//                                                 onChange={handleChange}
//                                                 onBlur={handleBlur}
//                                                 value={values.password}
//                                                 error={Boolean(touched.password && errors.password)}
//                                                 helperText={touched.password && errors.password ? errors.password : ''}
//                                             />

//                                             <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//                                                 Sign In
//                                             </Button>

//                                             <Grid container>
//                                                 <Grid item xs>
//                                                     <Link href="/itos/pages/forgotpassword" variant="body2">
//                                                         Forgot password?
//                                                     </Link>
//                                                 </Grid>
//                                             </Grid>
//                                             <Copyright sx={{ mt: 5 }} />
//                                         </Box>
//                                         {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={'LOGIN'} /> : null}
//                                         {openErrorToast ? (
//                                             <ErrorMsg
//                                                 openToast={openErrorToast}
//                                                 handleToast={setOpenErrorToast}
//                                                 mode={'LOGIN'}
//                                                 messages={errMsg}
//                                             />
//                                         ) : null}
//                                     </Box>
//                                 </Form>
//                             );
//                         }}
//                     </Formik>
//                 </Grid>
//             </Grid>
//         </ThemeProvider>
//     );
// }
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { sliderData } from './slider/slider-data';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import BackgroundPattern1 from 'ui-component/cards/BackgroundPattern1';
import AuthSlider from 'ui-component/cards/AuthSlider';

// assets
import AuthBlueCard from 'assets/images/auth/auth-blue-card.svg';
import AuthPurpleCard from 'assets/images/auth/auth-purple-card.svg';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';

// styles
const PurpleWrapper = styled('span')({
    '&:after': {
        content: '""',
        position: 'absolute',
        top: '32%',
        left: '40%',
        width: 313,
        backgroundSize: 380,
        height: 280,
        backgroundImage: `url(${AuthPurpleCard})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        animation: '15s wings ease-in-out infinite'
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        top: '23%',
        left: '37%',
        width: 243,
        height: 210,
        backgroundSize: 380,
        backgroundImage: `url(${AuthBlueCard})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        animation: '15s wings ease-in-out infinite',
        animationDelay: '1s'
    }
});

// carousel items
const items = [
    {
        title: 'Components Based Design System',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Components Based Design System',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Components Based Design System',
        description: 'Powerful and easy to use multipurpose theme'
    }
];

// ================================|| AUTH1 - LOGIN ||================================ //

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const loggedUserData = useSelector((state) => state.userReducer.loggedUserData);
    const error = useSelector((state) => state.userReducer.errorMsg);
    const [showPassword, setShowPassword] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [errMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const [openToast, setHandleToast] = useState(false);

    const handleToast = () => {
        setHandleToast(false);
    };
    useEffect(() => {
        if (error != null) {
            setOpenErrorToast(true);
            setErrorMsg(error);
        }
    }, [error]);

    useEffect(() => {
        // if (loggedUserData !== null && localStorage.getItem('status') !== 'logOut') {
        if (loggedUserData !== null) {
            localStorage.setItem('userData', JSON.stringify(loggedUserData.user));
            localStorage.setItem('token', JSON.stringify(loggedUserData.token));
            localStorage.setItem('status', 'logIn');

            navigate('/dashboard/default');
        }
    }, [loggedUserData]);

    useEffect(() => {
        console.log(error);
        if (error != null) {
            console.log('failed Toast');
            setOpenErrorToast(true);
            setErrorMsg(error);
        }
    }, [error]);

    return (
        <AuthWrapper1>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
                    <AuthCardWrapper>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    direction={matchDownSM ? 'column-reverse' : 'row'}
                                    alignItems={matchDownSM ? 'center' : 'inherit'}
                                    justifyContent={matchDownSM ? 'center' : 'space-between'}
                                >
                                    <Grid item>
                                        <Stack
                                            justifyContent={matchDownSM ? 'center' : 'flex-start'}
                                            textAlign={matchDownSM ? 'center' : 'inherit'}
                                        >
                                            <Typography color={theme.palette.primary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                                                Hi, Welcome Back
                                            </Typography>
                                            <Typography color="textPrimary" gutterBottom variant="h4">
                                                Login in to your account
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item sx={{ mb: { xs: 3, sm: 0 } }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <AuthLogin loginProp={1} />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Grid item container direction="column" alignItems="flex-end" xs={12}>
                                    <Typography
                                        component={Link}
                                        to="/pages/register/register1"
                                        variant="subtitle1"
                                        sx={{ textDecoration: 'none' }}
                                    >
                                        Don&apos;t have an account?
                                    </Typography>
                                </Grid>
                            </Grid> */}
                        </Grid>
                    </AuthCardWrapper>
                </Grid>
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern1>
                        <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
                            <Grid item xs={12}>
                                <span />
                                <PurpleWrapper />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                                    <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                                        <AuthSlider items={items} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </BackgroundPattern1>
                </Grid>
                {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={'LOGIN'} /> : null}
                //{' '}
                {openErrorToast ? (
                    <ErrorMsg openToast={openErrorToast} handleToast={setOpenErrorToast} mode={'LOGIN'} messages={errMsg} />
                ) : null}
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
