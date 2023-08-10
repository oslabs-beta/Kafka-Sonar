import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import '../assets/kafka-sonar-orange-logo.svg';
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

    // instantiate DD client object
    const ddClient = createDockerDesktopClient();

    const body: User = {
      username,
      password,
    };

    // POST user
    // TS issue to resolve: AuthResult type not working
    const loginResult: any = await ddClient.extension.vm.service.post(
      '/api/auth/login',
      body
    );

    // KNOWN BUG: Error handling not working
    // console.log('loginResult', loginResult);
    // if (loginResult.statusCode === 400) {
    //   // alert user
    //   alert(`ERROR: Invalid username or password.`);
    //   // exit handler
    //   return;
    // }

    // store returned user_id and token in localStorage
    const { id, token } = loginResult;
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    // redirect to SavedConnections page
    navigate('/saved');
    // toast success message
    ddClient.desktopUI.toast.success('SUCCESS! Welcome back.');
  };

  return (
    <Paper
      elevation={2}
      style={{
        width: '60vh',
        padding: 20,
        margin: '15vh auto',
      }}
    >
      <img
        src="kafka-sonar-orange-logo.svg"
        style={{
          width: 40,
          position: 'relative',
          left: '25vh',
          margin: '20px auto',
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
      <Typography align="center">
        <Link to="/signup">No account yet? Sign up</Link>
      </Typography>
      {/* <Typography align="center">
        <a href="/login/google">Google OAuth</a>
      </Typography> */}
    </Paper>
  );
}
