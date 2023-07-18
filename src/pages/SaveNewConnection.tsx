import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Connect from '../components/Connect';
import Configure from '../components/Configure';

// Add New Connection flow is 2 steps:
// 1) Get KafkaJS cluster connection info
// 2) Get JXM info (to connect Prometheus to cluster) and Docker network (to connect our spun up, containerized network to user's)

const steps = ['Enter cluster credentials', 'Enter configuration details'];

export default function SaveNewConnectionStepper(): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);
  const navigate = useNavigate();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFinish = () => {
    navigate('/connect');
  };

  return (
    <Fragment>
      <Box sx={{ width: '50%', margin: 'auto' }}>
        <Typography component="h1" variant="h2" margin="0 auto 25px">
          Save New Connection
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            pt: 2,
            margin: '10px',
          }}
        >
          {activeStep !== 0 && (
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleFinish}>
              Finish
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Box>
      {activeStep === 0 ? <Connect /> : <Configure />}
    </Fragment>
  );
}
