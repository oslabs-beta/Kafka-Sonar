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
  const [email, emailOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');

  const navigate = useNavigate();

  // a user's id and session token are only removed from localStorage on Log Out from the app's left side nav bar
  // if the user switches extensions, Kafka Sonar's localStorage persists their id and token, but the user lands on Login when they return to the extension
  // this useEffect checks if id and token are present; if so, it navigates to SavedConnections
  useEffect(() => {
    if (localStorage.getItem('id') && localStorage.getItem('token')) {
      navigate('/saved');
    }
  }, []); // runs once on component mount

  // Needed checks:
  // 1) Finish writing functionality checking 3 cases when BE route for login is written.
  // CASE 1: user doesn't exist in DB, redirect to Signup page
  // CASE 2: user exists in DB AND password not a match, stay on Login
  // CASE 3: user exists AND password matches, redirect to SavedConnections page

  //     .then((data) => {
  //       console.log('login data', data); // res.locals object
  //       // CASE 1: user doesn't exist in DB, redirect to CreateProfile
  //       if (!data.user) {
  //         alert(
  //           'No user exists for the email you entered. Please create a user profile.'
  //         );
  //         navigate('/create-profile');
  //       }

  //       // CASE 2: user exists in DB AND password not a match, stay on Login
  //       else if (data.user && !data.passwordIsMatch) {
  //         alert(
  //           'The password is incorrect for the email you entered. Please try again.'
  //         );
  //       }

  //       // CASE 3: user exists AND password matches, redirect to ApptSummary
  //       else if (data.user && data.passwordIsMatch) {
  //         navigate('/appt-summary');
  //       }
  //     });
  // };

  const verifyUser = async (): Promise<void> => {
    // if email or password are empty strings
    if (!email || !password) {
      // alert user and exit handler
      alert('Email and password are required.');
      return;
    }

    // Validate email input (reference: https://bobbyhadz.com/blog/react-check-if-email-is-valid)
    if (!/\S+@\S+\.\S+/.test(email)) {
      // alert user and exit handler
      alert('Provide a valid email.');
      return;
    }

    // instantiate DD client object
    const ddClient = createDockerDesktopClient();

    const body: User = {
      email,
      password,
    };

    // POST user
    // TS issue to resolve: AuthResult type not working
    const loginResult: any = await ddClient.extension.vm.service.post(
      '/api/auth/login',
      body
    );

    if (!loginResult.id) {
      alert(loginResult.message);
      return;
    } else {
      const { id, token } = loginResult;
      // store returned user_id and token in localStorage
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
    }
    // redirect to SavedConnections page
    navigate('/saved');
    // toast success message
    ddClient.desktopUI.toast.success('Login successful');
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
        name="email"
        type="email"
        id="email"
        value={email}
        onChange={emailOnChange}
        label="Email"
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
      <Typography align="center">
        <a href="/login/google">Google OAuth</a>
      </Typography>
    </Paper>
  );
}
