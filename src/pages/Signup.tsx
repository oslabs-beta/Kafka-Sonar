import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// imports for role select / dropdown
// import FormControl from '@mui/material/FormControl/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';

import './../../public/kafka-sonar-orange-logo.svg';

// custom hook to handle state changes to input boxes as a user types
const useInput = (initValue: string) => {
  const [value, setValue] = useState(initValue);
  const onChange = (e: KeyboardEvent): void => {
    setValue(e.target.value);
  };
  return [value, onChange];
};

export default function Signup(): JSX.Element {
  // custom hook
  const [email, emailOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');
  // useState
  // const [role, setRole] = useState<string>('User');

  // role select handler to update state
  // const roleOnChange = (e: MouseEvent) => {
  //   const i = e.target.value;
  //   setRole(['User', 'Admin'][i]);
  // };

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
      <Typography
        component="h1"
        variant="h5"
        fontFamily="inherit"
        align="center"
      >
        Sign Up
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
      {/* Stretch feature: Implement authorized routes */}
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
        // onClick={verifyUser}
        fullWidth
        style={{ margin: '30px auto' }}
      >
        Get Started
      </Button>
      <Typography align="center" fontFamily="inherit">
        <Link to="/">Have an account? Log in</Link>
      </Typography>
    </Paper>
  );
}
