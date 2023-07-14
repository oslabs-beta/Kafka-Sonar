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

export default function Login(): JSX.Element {
  const [email, emailOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');
  // const navigate = useNavigate(); // this hook allows us to redirect w/o page reload

  // const verifyUser = () => {
  //   const body = {
  //     email,
  //     password,
  //   };

  //   // use fetch API to check user has a profile in DB
  //   fetch('/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'Application/JSON',
  //     },
  //     body: JSON.stringify(body),
  //   })
  //     .then((res) => res.json())
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

  return (
    <Paper
      elevation={2}
      style={{
        width: '60vh',
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
        Login
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
        // onClick={verifyUser}
        fullWidth
        style={{ margin: '30px auto' }}
      >
        Log In
      </Button>
      <Typography
        align="center"
        fontFamily="inherit"
        style={{ margin: '15px auto' }}
      >
        <Link to="/signup">
          For the option to save your cluster connection info and cluster run
          logs, please sign up for an account
        </Link>
      </Typography>
      <Typography
        align="center"
        fontFamily="inherit"
        style={{ margin: '15px auto' }}
      >
        <Link to="/connect">
          Quickly connect to your cluster (no account needed)
        </Link>
      </Typography>
    </Paper>
  );
}
