import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import '../assets/kafka-sonar-orange-logo.svg'

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
      <img
        src="kafka-sonar-orange-logo.svg"
        style={{
          width: 40,
          position: 'relative',
          left: '25vh',
          margin: '20px 0',
        }}
      />
      <Typography
        component="h1"
        variant="h5"
        fontFamily="inherit"
        align="center"
      >
        Start monitoring in mere seconds
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
        Only certain SASL authentication mechanisms are currently supported.
        <br></br>
        SSL will be enabled so your credentials are transmitted encrypted.
      </Typography>
      <FormControl
        variant="standard"
        fullWidth
        required
        style={{ margin: '0 auto 5px' }}
      >
        <InputLabel>Authentication mechanism</InputLabel>
        <Select name="mechanisms" onChange={authOnChange}>
          {['PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'].map((mechanism, i) => {
            return <MenuItem value={i}>{mechanism}</MenuItem>;
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
        required
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
        required
        style={{ margin: '5px auto' }}
      />
      <Button
        variant="contained"
        color="primary"
        type="button"
        // onClick={verifyUser}
        fullWidth
        style={{ margin: '20px auto 10px' }}
      >
        Quick Connect to Cluster
      </Button>
      <Typography
        align="center"
        fontFamily="inherit"
        style={{ margin: '10px auto' }}
      >
        <Link to="/signup">
          For the option to save your cluster connection info, please sign up
          for an account
        </Link>
      </Typography>
      <Typography
        align="center"
        fontFamily="inherit"
        style={{ margin: '10px auto' }}
      >
        <Link to="/">Have an account? Log in</Link>
      </Typography>
    </Paper>
  );
}
