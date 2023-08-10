import * as React from 'react';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

// TS types
import { BrokerInfo, ConfigureProps } from '../types/types';

export default function Configure({
  network,
  networkOnChange,
  brokerInfo,
  updateHostOrPort,
  addBroker,
  removeBroker,
}: ConfigureProps): JSX.Element {
  return (
    <Paper
      elevation={2}
      style={{
        padding: 20,
        margin: '0 auto',
      }}
    >
      <Typography component="h1" variant="h6" align="center">
        Enter configuration details
      </Typography>
      <Typography fontSize={11} align="left" style={{ margin: '10px auto 0' }}>
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
      <Typography fontSize={11} align="left" style={{ margin: '10px auto 0' }}>
        Provide the hostnames and JMX ports for all of the brokers in your
        cluster.
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
                fontSize={11}
                align="left"
                style={{ margin: '10px auto 0' }}
              >
                Broker {brokerObj.broker}
              </Typography>
              <TextField
                variant="standard"
                name="host"
                type="text"
                id="text"
                value={brokerObj.host}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateHostOrPort(e, i)
                }
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
                value={brokerObj.port}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateHostOrPort(e, i)
                }
                label="Port"
                fullWidth
                required
                style={{ margin: '5px auto' }}
              />
              <Button
                variant="outlined"
                color="primary"
                type="button"
                onClick={() => removeBroker(i)}
                style={{ margin: '10px auto 0' }}
              >
                Remove Broker {brokerObj.broker}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="outlined"
        color="primary"
        type="button"
        onClick={addBroker}
        style={{ margin: '20px auto' }}
      >
        Add Another
      </Button>
    </Paper>
  );
}
