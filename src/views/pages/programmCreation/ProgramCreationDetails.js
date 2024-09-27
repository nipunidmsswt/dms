import { Accordion, AccordionDetails, AccordionSummary, ButtonGroup, Grid, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState, useEffect } from 'react';
import { gridSpacing } from 'store/constant';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { makeStyles, Card, CardContent, Divider } from '@material-ui/core';
import { style } from '@mui/system';
import {
    getAllActiveTransportMainCategoryDataByType,
    getAllActiveVehicleCategoryDataByType,
    getAllActiveVehicleTypeDataByType
} from 'store/actions/masterActions/transportActions/MainTransportCategoriesActions';
import { getActiveLocations } from 'store/actions/masterActions/LocationAction';
import { getCalculatedDistanceAndDuration } from 'store/actions/masterActions/DistanceAction';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SuccessMsg from 'messages/SuccessMsg';
import ErrorMsg from 'messages/ErrorMsg';
import ProgramTransport from './ProgramTransport';
import ProgramActivity from './ProgramActivity';
import ProgramMisCellaneous from './ProgramMisCellaneous';
import ProgramSuppliment from './ProgramSuppliment';
import MaterialTable from 'material-table';
import ProgramAccommodation from './ProgramAccommodation';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const useStyles = makeStyles((theme) => ({
    content: {
        justifyContent: 'center'
    },
    formControl: {
        minWidth: 120,
        marginBottom: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(0),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
        padding: '-1px 0px',
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: '#000',
        height: '30px'
    },
    roundbutton: {
        borderRadius: '50%',
        margin: '2px 10px',
        width: '1px',
        height: '30px',
        minWidth: '0px',
        minHeight: '0px',
        fontSize: '10px',
        display: 'inline-flex'
    },
    card: {
        maxWidth: '100%',
        padding: '0px 5px',
        margin: '0 auto'
    },
    buttonArray: {
        maxWidth: '100%',
        padding: '0px 0px',
        margin: '50px 0',
        textAlign: 'left'
    },
    activeButton: {
        backgroundColor: 'purple'
    },
    popUpButton: {
        margin: '0px 0x',
        padding: '0px 0px',
        height: '40px',
        display: 'inline-flex',
        position: 'absolute',
        width: '152px',
        textTransform: 'capitalize',
        fontSize: '13px'
    },
    setButton: {
        margin: '0px 10px',
        height: '30px',
        display: 'inline-flex',
        position: 'absolute',
        textTransform: 'capitalize'
    },
    dayText: {
        color: 'black',
        fontWeight: 'bold',
        marginTop: '20px',
        display: 'inline-flex',
        position: 'absolute',
        left: '5%'
    },
    iconButton: {
        position: 'absolute',
        right: '2%',
        width: 23,
        height: 23,
        '&:hover': {
            color: theme.palette.common.black
        }
    }
}));

function ProgramCreationDetails(startDate) {
    const [numButtons, setNumButtons] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [buttonTexts, setButtonTexts] = useState([]);
    const [activebuttonColor, setActiveButtonColor] = useState('#1877f2');
    const [prebuttonColor, setPreButtonColor] = useState('white');
    const [setStatus, setSetStatus] = useState(false);
    const [openTransport, setOpenTransport] = useState(false);
    const [openAccomodation, setOpenAccomodation] = useState(false);
    const [openActivites, setOpenActivites] = useState(false);
    const [openSupplements, setOpenSupplements] = useState(false);
    const [openMiscellaneous, setOpenMiscellaneous] = useState(false);
    const [openToast, setHandleToast] = useState(false);
    const [openErrorToast, setOpenErrorToast] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [mode, setMode] = useState('INSERT');
    const [editData, setEditData] = useState({});
    const [dialogData, setDialogData] = useState([]);
    const classes = useStyles();
    const dispatch = useDispatch();
    const widthValues = ['50px', '120px', '350px', '150px'];
    const paddingValues = ['8px 20px', '8px 8px', '8px 8px', '8px 8px'];
    // const transportTypeId = 'T001';
    // const filteredIds = ['D1', 'D2', 'D3'];

    // useEffect(() => {
    //     dispatch(getAllActiveTransportMainCategoryDataByType('Transport Type'));
    //     dispatch(getAllActiveVehicleTypeDataByType('Vehicle Type'));
    //     dispatch(getAllActiveVehicleCategoryDataByType('Vehicle Category'));
    //     dispatch(getActiveLocations());
    //     dispatch(getCalculatedDistanceAndDuration(transportTypeId, filteredIds));
    // }, []);

    const columns = [
        {
            title: 't1',
            field: 'taxCode',
            filterPlaceholder: 'Tax Code',
            align: 'left'
        },
        {
            title: 't2',
            field: 'taxDescription',
            filterPlaceholder: 'Tax Description',
            align: 'left'
        }
    ];

    const TableStyles = styled('table')({
        color: 'black',
        borderCollapse: 'collapse',
        '& td': {
            borderBottom: '1px solid #ccc'
        },
        '& th': {
            padding: '8px',
            backgroundColor: '#ffffff',
            fontWeight: 'bold'
        },
        '& tbody tr:nth-child(even)': {
            backgroundColor: '#ffffff'
        },
        '& tbody tr:hover': {
            backgroundColor: '#ebebeb'
        }
    });

    const TableColumn = styled('td')(({ column }) => ({
        width: widthValues[column],
        padding: paddingValues[column],
        fontSize: column === 2 ? '13px' : 'inherit'
    }));

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            setNumButtons(0);
        }
    };

    const handleNumButtonsChange = (event) => {
        event.preventDefault();
        const newValue = parseInt(event.target.value);
        if (newValue >= 0 && newValue <= 60) {
            setNumButtons(newValue);
        }
        console.log(numButtons);
    };

    const handleButtonClick = (index) => {
        setActiveButton(index);
    };

    const handleSetButtonChange = (event) => {
        event.preventDefault();
        setSetStatus(true);
    };

    const validationSchema = Yup.object().shape({
        ...Array(numButtons)
            .fill()
            .reduce((acc, _, i) => {
                acc[`input-${i}`] = Yup.string().required('This field is required');
                return acc;
            }, {})
    });

    const validate = (values) => {
        const errors = {};
        if (values.number > 60) {
            errors.number = 'The maximum you can enter is 60';
        }
        return errors;
    };

    const handleClickOpen = (type, category, data, activeIndex) => {
        if (type === 'UPDATE') {
            setMode(type);
            setEditData(data);
            console.log(type, category, editData);
        } else if (type === 'INSERT') {
            setMode(type);
            setEditData(null);
        } else {
            setMode(type);
        }

        if (category === 'Transport') {
            const newOpenTransport = Array(numButtons).fill(false);
            newOpenTransport[activeIndex] = true;
            setOpenTransport(newOpenTransport);
        } else if (category === 'Accomodation') {
            const newOpenAccomodation = Array(numButtons).fill(false);
            newOpenAccomodation[activeIndex] = true;
            setOpenAccomodation(newOpenAccomodation);
        } else if (category === 'Activities') {
            const newOpenActivities = Array(numButtons).fill(false);
            newOpenActivities[activeIndex] = true;
            setOpenActivites(newOpenActivities);
        } else if (category === 'Supplements') {
            const newOpenSupplements = Array(numButtons).fill(false);
            newOpenSupplements[activeIndex] = true;
            setOpenSupplements(newOpenSupplements);
        } else {
            const newOpenMiscellaneous = Array(numButtons).fill(false);
            newOpenMiscellaneous[activeIndex] = true;
            setOpenMiscellaneous(newOpenMiscellaneous);
        }
    };

    const handleSaveData = (data, formIndex) => {
        const updatedDialogData = [...dialogData];

        if (updatedDialogData[formIndex]) {
            updatedDialogData[formIndex].push(data);
        } else {
            updatedDialogData[formIndex] = [data];
        }

        setDialogData(updatedDialogData);
        console.log(updatedDialogData);
    };

    const handleDeleteData = (activeButton, j) => {
        const updatedDialogData = [...dialogData];
        updatedDialogData[activeButton].splice(j, 1);
        setDialogData(updatedDialogData);
    };

    const handleMoveUp = (activeButton, j) => {
        if (j > 0) {
            const updatedDialogData = [...dialogData];
            const temp = updatedDialogData[activeButton][j];
            updatedDialogData[activeButton][j] = updatedDialogData[activeButton][j - 1];
            updatedDialogData[activeButton][j - 1] = temp;
            setDialogData(updatedDialogData);
        }
    };

    const handleMoveDown = (activeButton, j) => {
        if (j < dialogData[activeButton].length - 1) {
            const updatedDialogData = [...dialogData];
            const temp = updatedDialogData[activeButton][j];
            updatedDialogData[activeButton][j] = updatedDialogData[activeButton][j + 1];
            updatedDialogData[activeButton][j + 1] = temp;
            setDialogData(updatedDialogData);
        }
    };

    const handleClose = () => {
        setOpenTransport(false);
        setOpenAccomodation(false);
        setOpenActivites(false);
        setOpenActivites(false);
        setOpenMiscellaneous(false);
        setOpenSupplements(false);
    };

    const handleToast = () => {
        setHandleToast(false);
    };
    const handleErrorToast = () => {
        setOpenErrorToast(false);
    };

    const buttonArray = [];
    for (let i = 0; i < numButtons; i++) {
        if (setStatus === true) {
            buttonArray.push(
                <Button
                    className={classes.roundbutton}
                    key={i}
                    onClick={() => handleButtonClick(i)}
                    variant="contained"
                    style={{
                        backgroundColor: activeButton === i ? activebuttonColor : 'white',
                        color: activeButton === i ? 'white' : 'black'
                    }}
                >
                    {i + 1}
                </Button>
            );
        }
    }

    const formArray = [];
    for (let i = 0; i < numButtons; i++) {
        formArray.push(
            <Formik initialValues={{}} validationSchema={validationSchema}>
                {({ errors, touched }) => (
                    <form key={i} style={{ display: activeButton === i ? 'block' : 'none' }}>
                        <Grid>
                            <div>
                                <Typography variant="h4" className={classes.dayText}>
                                    Day {i + 1}
                                </Typography>
                                <Button
                                    className={`btnSave ${classes.popUpButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ left: '19%' }}
                                    onClick={() => handleClickOpen('INSERT', 'Transport', null, i)}
                                >
                                    Transport
                                    <AddCircleIcon
                                        className={classes.iconButton}
                                        onClick={() => handleClickOpen('INSERT', 'Transport', null, i)}
                                    />
                                </Button>
                                <Button
                                    className={`btnSave ${classes.popUpButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ left: '39%' }}
                                >
                                    Accomodation
                                    <AddCircleIcon
                                        className={classes.iconButton}
                                        onClick={() => handleClickOpen('INSERT', 'Accomodation', null, i)}
                                    />
                                </Button>
                                <Button
                                    className={`btnSave ${classes.popUpButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ left: '59%' }}
                                >
                                    Activites
                                    <AddCircleIcon
                                        className={classes.iconButton}
                                        onClick={() => handleClickOpen('INSERT', 'Activites', null, i)}
                                    />
                                </Button>
                                <Button
                                    className={`btnSave ${classes.popUpButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ left: '79%' }}
                                >
                                    Supplements
                                    <AddCircleIcon
                                        className={classes.iconButton}
                                        onClick={() => handleClickOpen('INSERT', 'Supplements', null, i)}
                                    />
                                </Button>
                                <Button
                                    className={`btnSave ${classes.popUpButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ left: '79%', marginTop: '60px' }}
                                >
                                    Miscellaneous
                                    <AddCircleIcon
                                        className={classes.iconButton}
                                        onClick={() => handleClickOpen('INSERT', 'Miscellaneous', null, i)}
                                    />
                                </Button>

                                {/* <label htmlFor={`input-${i}`}>Day {i + 1}</label>
                                 <Field
                                    id={`input-${i}`}
                                    name={`input-${i}`}
                                    value={buttonTexts[i]}
                                    //  onChange={(event) =>
                                    //    handleButtonTextChange(i, event)
                                    //  }
                                /> */}
                                {/* {errors[`input-${activeButton}`] && touched[`input-${activeButton}`] ? (
                                    <div>
                                        {errors[`input-${activeButton}`]}
                                        {setActiveButtonColor('red')}
                                        {setPreButtonColor('red')}
                                    </div>
                                ) : !errors[`input-${activeButton}`] && touched[`input-${activeButton}`] ? (
                                    <div>
                                        {setActiveButtonColor('green')}
                                        {setPreButtonColor('green')}
                                    </div>
                                ) : !errors[`input-${activeButton}`] && !touched[`input-${activeButton}`] ? (
                                    <div>
                                        {setActiveButtonColor('#1877f2')}
                                        {setPreButtonColor('#1877f2')}
                                    </div>
                                ) : null} */}
                            </div>
                            <br />
                            {openTransport[i] ? ( // Unique identifier (i) to determine if the ProgramTransport component should be rendered
                                <ProgramTransport
                                    open={true}
                                    handleClose={handleClose}
                                    mode={mode}
                                    onSave={handleSaveData}
                                    formIndex={i}
                                    editData={editData}
                                />
                            ) : null}
                            {openActivites[i] ? (
                                <ProgramActivity open={true} handleClose={handleClose} mode={mode} startDate={startDate} />
                            ) : null}
                            {openMiscellaneous[i] ? (
                                <ProgramMisCellaneous open={true} handleClose={handleClose} mode={mode} startDate={startDate} />
                            ) : null}

                            {openSupplements[i] ? (
                                <ProgramSuppliment open={true} handleClose={handleClose} mode={mode} startDate={startDate} />
                            ) : null}

                            {openAccomodation ? (
                                <ProgramAccommodation open={openAccomodation} handleClose={handleClose} mode={mode} startDate={startDate} />
                            ) : (
                                ''
                            )}
                            {openToast ? <SuccessMsg openToast={openToast} handleToast={handleToast} mode={mode} /> : null}
                            {openErrorToast ? <ErrorMsg openToast={openErrorToast} handleToast={setOpenErrorToast} mode={mode} /> : null}
                        </Grid>
                        {/* <Grid style={{ marginTop: '60px' }}>
                            <Typography variant="h5" className={classes.dayText}>
                                Order
                            </Typography>
                        </Grid> */}
                        <Grid style={{ marginTop: '60px' }}>
                            <TableStyles>
                                <tbody>
                                    <th>Order</th>
                                    {dialogData[activeButton] &&
                                        dialogData[activeButton].map((data, j) => (
                                            <tr key={j}>
                                                <TableColumn column={0}>{j + 1}</TableColumn>
                                                <TableColumn column={1}>{data.popUpType}</TableColumn>
                                                <TableColumn column={2}>{data.locations}</TableColumn>
                                                <TableColumn column={3}>
                                                    <KeyboardArrowUpRoundedIcon
                                                        onClick={() => handleMoveUp(activeButton, j)}
                                                        style={{ color: '#1877f2' }}
                                                    />
                                                    <KeyboardArrowDownRoundedIcon
                                                        onClick={() => handleMoveDown(activeButton, j)}
                                                        style={{ color: '#1877f2' }}
                                                    />
                                                    <EditIcon
                                                        onClick={() =>
                                                            handleClickOpen('UPDATE', data.popUpType, dialogData[activeButton][j], i)
                                                        }
                                                    />
                                                    <ReplyIcon style={{ transform: 'scaleX(-1)' }} />
                                                    <CancelRoundedIcon
                                                        onClick={() => handleDeleteData(activeButton, j)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </TableColumn>
                                            </tr>
                                        ))}
                                </tbody>
                                {/* <tbody>
                                    {mainArray[currentI] &&
                                        mainArray[currentI].map((data, j) => (
                                            <tr key={j}>
                                                <td>Dialog Box {currentI}</td>
                                                <td>{data.input1}</td>
                                                <td>{data.input2}</td>
                                                <td>
                                                    <DeleteIcon onClick={() => handleDeleteRow(currentI, j)} />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody> */}
                            </TableStyles>
                        </Grid>
                    </form>
                )}
            </Formik>
        );
    }

    return (
        <div>
            <MainCard>
                <Formik initialValues={{}} validate={validate}>
                    {({ errors, touched }) => (
                        <form>
                            <Grid xs={12} sm={10} item alignContent="left">
                                <br />
                                <label htmlFor="num-buttons">Number of Days:</label>
                                <Field
                                    type="number"
                                    id="num-buttons"
                                    value={numButtons}
                                    onChange={handleNumButtonsChange}
                                    onKeyDown={handleKeyDown}
                                    variant="outlined"
                                    style={{
                                        width: '10%',
                                        height: '30px',
                                        padding: '0px 2px',
                                        margin: '0px 2px'
                                    }}
                                    min={0}
                                    max={60}
                                    required
                                />

                                <Button
                                    className={`btnSave ${classes.setButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    onClick={handleSetButtonChange}
                                >
                                    Set
                                </Button>
                                <Button
                                    className={`btnSave ${classes.setButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ width: '19%', right: '2%' }}
                                    onClick={handleClickOpen}
                                >
                                    Guide
                                </Button>
                                <Button
                                    className={`btnSave ${classes.setButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ width: '19%', right: '22%', marginTop: '40px' }}
                                >
                                    Program Summary
                                </Button>
                                <Button
                                    className={`btnSave ${classes.setButton}`}
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    style={{ width: '19%', right: '2%', marginTop: '40px' }}
                                >
                                    Costing
                                </Button>
                            </Grid>
                            <div className={classes.buttonArray}>{buttonArray}</div>
                            <Divider style={{ color: 'black', height: '2px' }} />
                            <br />
                            <br />
                            <div>{formArray}</div>
                            <br />
                            <br />
                            <br />
                            <div>
                                <ul style={{ textAlign: 'left' }}>
                                    {buttonTexts.map((data, index) => (
                                        <li key={index}>
                                            {' '}
                                            Day {index + 1} Activites : {data}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <br />
                            <br />
                        </form>
                    )}
                </Formik>
            </MainCard>
        </div>
    );
}

export default ProgramCreationDetails;
