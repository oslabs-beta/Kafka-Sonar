import { useState } from 'react';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import './../../public/kafka-sonar-orange-logo.svg';

// TS types
import BrokerInfo from './types/types';

// custom hook to handle state changes to input boxes as a user types
const useInput = (initValue: string) => {
  const [value, setValue] = useState(initValue);
  const onChange = (e: KeyboardEvent): void => {
    setValue(e.target.value);
  };
  return [value, onChange];
};

export default function Configure(): JSX.Element {
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
  const updateHostOrPort = (e: KeyboardEvent, index: number): void => {
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

  return (
    <Paper
      elevation={2}
      style={{
        padding: 20,
        margin: '0 auto',
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        fontFamily="inherit"
        align="center"
      >
        Enter configuration details
      </Typography>
      <Typography
        fontFamily="inherit"
        fontSize={11}
        align="left"
        style={{ margin: '10px auto 0' }}
      >
        Enter your cluster's Docker network (for example, 'kafka').
      </Typography>
      <TextField
        variant="standard"
        name="text"
        type="text"
        id="text"
        value={network}
        onChange={networkOnChange}
        label="Docker network name"
        fullWidth
        required
        style={{ margin: '5px auto' }}
      />
      <Typography
        fontFamily="inherit"
        fontSize={11}
        align="left"
        style={{ margin: '10px auto 0' }}
      >
        Provide the hostnames and ports for all of the brokers in your cluster.
      </Typography>
      <Grid container gap={1}>
        {brokerInfo.map((brokerObj: BrokerInfo, i: number) => (
          <Grid item key={i + 1} xs={2.3} sm={2.3} md={2.3}>
            <Paper
              elevation={2}
              style={{
                padding: 10,
                margin: '10px auto',
              }}
            >
              <Typography
                fontFamily="inherit"
                fontSize={11}
                align="left"
                style={{ margin: '10px auto 0' }}
              >
                Broker {i + 1}
              </Typography>
              <TextField
                variant="standard"
                name="host"
                type="text"
                id="text"
                // value={brokerInfo[i]['host']}
                onChange={(e: KeyboardEvent) => updateHostOrPort(e, i)}
                label="Hostname"
                fullWidth
                required
                style={{ margin: '5px auto' }}
              />
              <TextField
                variant="standard"
                name="port"
                type="text"
                id="text"
                // value={brokerInfo[i + 1]['port']}
                onChange={(e: KeyboardEvent) => updateHostOrPort(e, i)}
                label="Port"
                fullWidth
                required
                style={{ margin: '5px auto' }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={addBroker}
        style={{ margin: '20px auto' }}
      >
        Add Another
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={removeBroker}
        style={{ margin: '20px auto 20px 20px' }}
      >
        Remove Last
      </Button>
    </Paper>
  );
}
