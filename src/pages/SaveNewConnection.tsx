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

// TS types
import { BrokerInfo, ConnectProps, ConfigureProps } from './../types/types';

// Add New Connection flow is 2 steps:
// 1) Get KafkaJS cluster connection info
// 2) Get JMX info (to connect Prometheus to cluster) and Docker network (to connect our spun up, containerized network to user's)

const steps = ['Enter cluster credentials', 'Enter configuration details'];

// custom hook to handle state changes to input boxes as a user types
const useInput = (initValue: string) => {
  const [value, setValue] = useState(initValue);
  const onChange = (e: KeyboardEvent): void => {
    setValue(e.target.value);
  };
  return [value, onChange];
};

export default function SaveNewConnectionStepper(): JSX.Element {
  // CONNECT STATE AND HANDLERS (lifted from Connect component)

  // custom hook
  const [client, clientOnChange] = useInput('');
  const [host, hostOnChange] = useInput('');
  const [port, portOnChange] = useInput('');
  // useState
  const [auth, setAuth] = useState<string>('');
  // custom hook
  const [username, usernameOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');

  // auth select handler to update state
  const authOnChange: ConnectProps['authOnChange'] = (e) => {
    const i = e.target.value;
    setAuth(['N/A', 'PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'][i]);
  };

  // CONFIGURE STATE AND HANDLERS (lifted from Configure component)

  // custom hook
  const [network, networkOnChange] = useInput('');
  // useState
  const [brokerInfo, setBrokerInfo] = useState<BrokerInfo[]>([
    {
      broker: 1,
      host: '',
      port: '',
    },
  ]);

  // update host or port on a broker paper as the user types into either field
  const updateHostOrPort: ConfigureProps['updateHostOrPort'] = (e, index) => {
    // use Textfield's / target's name to distinguish whether the user is typing into host or port field in a Broker component
    const newBrokerInfo = [...brokerInfo];
    newBrokerInfo[index][e.target.name] = e.target.value;
    setBrokerInfo(newBrokerInfo);
  };

  // add new broker paper
  const addBroker = () => {
    setBrokerInfo([
      ...brokerInfo,
      {
        // get brokerInfo array's last obj's broker value and increment by 1
        broker: brokerInfo[brokerInfo.length - 1].broker + 1,
        host: '',
        port: '',
      },
    ]);
  };

  // remove last broker paper
  const removeBroker = () => {
    setBrokerInfo(brokerInfo.slice(0, brokerInfo.length - 1));
  };

  // SAVENEWCONNECTIONSTEPPER STATE AND HANDLERS

  const [activeStep, setActiveStep] = useState<number>(0);
  const navigate = useNavigate();

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    // if client, host, port, or auth are empty strings
    if (!client || !host || !port || !auth) {
      // alert user and exit handler
      alert(
        'Please provide at least Client ID, Hostname, Port, and Authentication mechanism.'
      );
      return;
    }
    // if auth is 'PLAIN', 'SCRAM-SHA-256', or 'SCRAM-SHA-512' and username/pw are empty
    else if (auth !== 'N/A' && (!username || !password)) {
      // alert user and exit handler
      alert(
        'In order to authenticate to your cluster, please provide the username and password.'
      );
    }
    // otherwise, go to next step
    else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleFinish = () => {
    // check all Configure fields (client id, host, port) are NOT empty strings
    // if any are empty, alert user and exit handler
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
      {activeStep === 0 ? (
        <Connect
          client={client}
          clientOnChange={clientOnChange}
          host={host}
          hostOnChange={hostOnChange}
          port={port}
          portOnChange={portOnChange}
          auth={auth}
          authOnChange={authOnChange}
          username={username}
          usernameOnChange={usernameOnChange}
          password={password}
          passwordOnChange={passwordOnChange}
        />
      ) : (
        <Configure
          network={network}
          networkOnChange={networkOnChange}
          brokerInfo={brokerInfo}
          updateHostOrPort={updateHostOrPort}
          addBroker={addBroker}
          removeBroker={removeBroker}
        />
      )}
    </Fragment>
  );
}
