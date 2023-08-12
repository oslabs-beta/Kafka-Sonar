import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import FormControl from '@mui/material/FormControl/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';

// custom hook
import useInput from '../hooks/useInput';
// TS types
import { User, AuthResult } from './../types/types';
// Docker client library
import { createDockerDesktopClient } from '@docker/extension-api-client';

export default function Signup(): JSX.Element {
  // following use custom hook
  const [username, usernameOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');

  // following uses useState
  const [role, setRole] = useState<string>('User');

  // // role select handler to update state
  // const roleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const i = e.target.value;
  //   setRole(['User', 'Admin'][i]);
  // };

  const navigate = useNavigate();

  // instantiate DD client object
  const ddClient = createDockerDesktopClient();

  const postNewUser = async (): Promise<void> => {
    // if username or password are empty strings
    if (!username || !password) {
      // alert user
      alert('Username and password are required.');
      // exit handler
      return;
    }

    // Validate username input - checks if the username consists of at least 3 characters
    // and only contains letters (both uppercase and lowercase), digits, and underscores
    if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
      // alert user
      alert('Provide a valid username.');
      // exit handler
      return;
    }

    const body: User = {
      username,
      password,
      role,
    };

    try {
      // POST new user
      // TS issue to resolve: AuthResult type not working
      const signupResult: any = await ddClient.extension.vm.service.post(
        '/api/auth/signup',
        body
      );

      // store returned user_id and token in localStorage
      const { id, token } = signupResult;
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);

      // redirect to SavedConnections page
      navigate('/saved');

      // toast success message
      ddClient.desktopUI.toast.success('SUCCESS! Welcome to Kafka Sonar.');
    } catch (err) {
      // displays error message for the case where the entered username already exists in DB
      if (err.message) {
        const messageValue = JSON.parse(err.message).message;
        alert(messageValue);
        return;
      }
      // for any other error, show the generic message
      alert('An error occurred during signup. Please try again.');
    }
  };

  return (
    <Paper
      elevation={2}
      style={{
        width: '60vh',
        padding: 20,
        margin: '7vh auto',
      }}
    >
      <img
        src="kafka-sonar-orange-logo.png"
        style={{
          width: 75,
          position: 'relative',
          left: '22vh',
          margin: '20px 0',
        }}
      />
      <Typography component="h1" variant="h5" align="center">
        Sign Up
      </Typography>
      <TextField
        variant="standard"
        name="username"
        type="username"
        id="username"
        value={username}
        onChange={usernameOnChange}
        label="Username"
        fullWidth
        required
        autoFocus
        style={{ margin: '15px auto' }}
      />
      <TextField
        variant="standard"
        name="password"
        type="password"
        id="password"
        value={password}
        onChange={passwordOnChange}
        label="Password"
        fullWidth
        required
        style={{ margin: '15px auto' }}
      />
      {/* <FormControl
        variant="standard"
        fullWidth
        required
        style={{ margin: '15px auto' }}
      >
        <InputLabel>User or Admin access?</InputLabel>
        <Select name="roles" onChange={roleOnChange}>
          {['User', 'Admin'].map((access, i) => {
            return <MenuItem value={i}>{access}</MenuItem>;
          })}
        </Select>
      </FormControl> */}
      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={postNewUser}
        fullWidth
        style={{ margin: '30px auto' }}
      >
        Get Started
      </Button>
      <Typography align="center" marginBottom={'40px'}>
        <Link to="/">Have an account? Log in</Link>
      </Typography>
      <Typography fontSize={11} align="center" style={{ margin: '10px auto' }}>
        <EnhancedEncryptionIcon />
        <br></br>
        <strong>Safeguarded & Self-contained!</strong>
      </Typography>
      <Typography fontSize={11} align="left" style={{ margin: '0 auto' }}>
        Your credentials and metrics are securely housed in a containerized DB
        right on your device. Total control. Zero external transmissions.&nbsp;
        <br></br>
        <Button
          variant="text"
          sx={{
            padding: 0,
            textTransform: 'inherit',
          }}
          onClick={() => {
            ddClient.host.openExternal(
              'https://github.com/oslabs-beta/Kafka-Sonar'
            );
          }}
        >
          See the Kafka Sonar docs for more details.
        </Button>
      </Typography>
    </Paper>
  );
}
