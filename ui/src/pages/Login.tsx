import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';

// custom hook
import useInput from '../hooks/useInput';
// TS types
import { User, AuthResult } from './../types/types';
// Docker client library
import { createDockerDesktopClient } from '@docker/extension-api-client';

export default function Login(): JSX.Element {
  // following use custom hook
  const [username, usernameOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');

  const navigate = useNavigate();

  // a user's id and session token are only removed from localStorage on Log Out from the app's left side nav bar
  // if the user leaves the extension, Kafka Sonar's localStorage persists their id and token, but the user lands on Login when they return to the extension
  // this useEffect checks if id and token are present; if so, it navigates to SavedConnections
  useEffect(() => {
    if (localStorage.getItem('id') && localStorage.getItem('token')) {
      navigate('/saved');
    }
  }, []); // runs on component mount

  // instantiate DD client object
  const ddClient = createDockerDesktopClient();

  const verifyUser = async (): Promise<void> => {
    // if username or password are empty strings
    if (!username || !password) {
      // alert user and exit handler
      alert(' and password are required.');
      return;
    }

    // Validate username input - checks if the username consists of at least 3 characters
    // and only contains letters (both uppercase and lowercase), digits, and underscores
    if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
      // alert user and exit handler
      alert('Provide a valid username.');
      return;
    }

    const body: User = {
      username,
      password,
    };

    try {
      // POST user
      // TS issue to resolve: AuthResult type not working
      const loginResult: any = await ddClient.extension.vm.service.post(
        '/api/auth/login',
        body
      );

      // store returned user_id and token in localStorage
      const { id, token } = loginResult;
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);

      // redirect to SavedConnections page
      navigate('/saved');

      // toast success message
      ddClient.desktopUI.toast.success('SUCCESS! Welcome back.');
    } catch (err) {
      // displays error message for the case where the entered username or pw is invalid
      if (err.message) {
        const messageValue = JSON.parse(err.message).message;
        const errorValue = JSON.parse(err.message).error;
        alert(messageValue + ": " + errorValue);
        return;
      }
      // for any other error, show the generic message
      alert('An error occurred during login. Please try again.');
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
        Welcome Back
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
      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={verifyUser}
        fullWidth
        style={{ margin: '30px auto' }}
      >
        Log In
      </Button>
      <Typography align="center" marginBottom={'40px'}>
        <Link to="/signup">No account yet? Sign up</Link>
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
