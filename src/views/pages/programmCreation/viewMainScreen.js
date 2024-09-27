import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { makeStyles } from '@material-ui/core/styles';
import ProgramHeader from './ProgramHeader';
import ProgramCreationDetails from './ProgramCreationDetails';

const useStyles = makeStyles({
    content: {
        justifyContent: 'center'
    }
});

const ViewMainScreen = () => {
    const classes = useStyles();
    const [startDate, setStartDate] = useState([]);

    const programStartDate = (date) => {
        setStartDate(date);
    };

    return (
        <div>
            <MainCard title="Programm Creation">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Accordion square>
                                    <AccordionSummary
                                        style={{ background: 'linear-gradient(to right bottom, #516a9f, #1877f2)' }}
                                        // sx={{
                                        //     backgroundColor: '#1877f2'
                                        // }}
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
                                            Programm Header Creation
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ProgramHeader programStartDate={programStartDate}></ProgramHeader>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion square>
                                    <AccordionSummary
                                        style={{ background: 'linear-gradient(to right bottom, #516a9f, #1877f2)' }}
                                        // sx={{
                                        //     backgroundColor: '#1877f2'
                                        // }}
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
                                            Programm Details
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ProgramCreationDetails startDate={startDate}></ProgramCreationDetails>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
};

export default ViewMainScreen;
