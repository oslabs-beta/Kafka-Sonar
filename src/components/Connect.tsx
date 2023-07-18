import { useState } from 'react';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// TS types
import { ConnectProps } from '../types/types';

export default function Connect({
  client,
  clientOnChange,
  host,
  hostOnChange,
  port,
  portOnChange,
  auth,
  authOnChange,
  username,
  usernameOnChange,
  password,
  passwordOnChange,
}: ConnectProps): JSX.Element {
  return (
    <Paper
      elevation={2}
      style={{
        width: '60vh',
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
        Enter cluster credentials
      </Typography>
      <TextField
        variant="standard"
        name="text"
        type="text"
        id="text"
        value={client}
        onChange={clientOnChange}
        label="Client ID"
        fullWidth
        required
        style={{ margin: '5px auto' }}
      />
      <TextField
        variant="standard"
        name="text"
        type="text"
        id="text"
        value={host}
        onChange={hostOnChange}
        label="Hostname"
        fullWidth
        required
        style={{ margin: '5px auto' }}
      />
      <TextField
        variant="standard"
        name="text"
        type="text"
        id="text"
        value={port}
        onChange={portOnChange}
        label="Port"
        fullWidth
        required
        style={{ margin: '5px auto' }}
      />
      <Typography
        fontFamily="inherit"
        fontSize={11}
        align="left"
        style={{ margin: '10px auto' }}
      >
        If you need to authenticate to your cluster, only 3 SASL authentication
        mechanisms are currently supported. SSL will be enabled so credentials
        are transmitted encrypted.
        <br></br>
        If you don't need to authenticate, select 'N/A' for Auth mechanism.
      </Typography>
      <FormControl
        variant="standard"
        fullWidth
        required
        style={{ margin: '0 auto 5px' }}
      >
        <InputLabel>Authentication mechanism</InputLabel>
        <Select name="mechanisms" onChange={authOnChange}>
          {['N/A', 'PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'].map(
            (mechanism, i) => {
              return (
                <MenuItem key={i} value={i}>
                  {mechanism}
                </MenuItem>
              );
            }
          )}
        </Select>
      </FormControl>
      <TextField
        variant="standard"
        name="text"
        type="text"
        id="text"
        value={username}
        onChange={usernameOnChange}
        label="Username"
        fullWidth
        style={{ margin: '0 auto 5px' }}
      />
      <TextField
        variant="standard"
        name="text"
        type="password"
        id="text"
        value={password}
        onChange={passwordOnChange}
        label="Password"
        fullWidth
        style={{ margin: '5px auto' }}
      />
    </Paper>
  );
}
