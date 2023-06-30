import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
  const [client, clientOnChange] = useInput('');
  const [host, hostOnChange] = useInput('');
  const [port, portOnChange] = useInput('');

  return (
    <Paper
      elevation={2}
      style={{
        width: '60vh',
        height: '80vh',
        padding: 20,
        margin: '80px auto',
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
        style={{ margin: '15px auto' }}
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
        style={{ margin: '15px auto' }}
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
        style={{ margin: '15px auto' }}
      />
      <Button
        variant="contained"
        color="primary"
        type="button"
        // onClick={verifyUser}
        fullWidth
        style={{ margin: '30px auto' }}
      >
        Quick Connect to Cluster
      </Button>
      <Typography
        align="center"
        fontFamily="inherit"
        style={{ margin: '15px auto' }}
      >
        <Link to="/signup">
          For the option to save your cluster connection info, please sign up
          for an account
        </Link>
      </Typography>
      <Typography
        align="center"
        fontFamily="inherit"
        style={{ margin: '15px auto' }}
      >
        <Link to="/">Have an account? Log in</Link>
      </Typography>
    </Paper>
  );
}
