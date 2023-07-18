import { useState } from 'react';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import './../../public/kafka-sonar-orange-logo.svg';

// custom hook to handle state changes to input boxes as a user types
const useInput = (initValue: string) => {
  const [value, setValue] = useState(initValue);
  const onChange = (e: KeyboardEvent): void => {
    setValue(e.target.value);
  };
  return [value, onChange];
};

export default function Connect(): JSX.Element {
  // custom hook
  const [client, clientOnChange] = useInput('');
  const [host, hostOnChange] = useInput('');
  const [port, portOnChange] = useInput('');
  // useState
  const [auth, setAuth] = useState<string>('PLAIN');
  // custom hook
  const [username, usernameOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');

  // auth select handler to update state
  const authOnChange = (e: MouseEvent) => {
    const i = e.target.value;
    setAuth(['PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'][i]);
  };

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
        OPTIONAL - If you need to authenticate to your cluster, only 3 SASL
        authentication mechanisms are currently supported.
        <br></br>
        SSL will be enabled so your credentials are transmitted encrypted.
      </Typography>
      <FormControl
        variant="standard"
        fullWidth
        style={{ margin: '0 auto 5px' }}
      >
        <InputLabel>Authentication mechanism</InputLabel>
        <Select name="mechanisms" onChange={authOnChange}>
          {['PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'].map((mechanism, i) => {
            return (
              <MenuItem key={i} value={i}>
                {mechanism}
              </MenuItem>
            );
          })}
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
        type="text"
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
