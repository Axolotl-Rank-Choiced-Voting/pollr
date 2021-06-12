import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

/*
Login page allows user to log in, or allows them to
navigate to the sign up page
*/

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // form validation; un and pw need to be > one char
  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form>
      <h1>Log In</h1>
      <Box mb={3}>
        <div>
          <TextField
            onSubmit={handleSubmit}
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            label="username"
            variant="outlined"
          />
        </div>
      </Box>
      <Box mb={3}>
        <div>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="password"
            variant="outlined"
          />
        </div>
      </Box>
      <a href="#">
        Sign Up
      </a>
      <Button
        component={Link}
        to="/landing"
        type="submit"
        disabled={!validateForm()}
        variant="contained"
      >
        Login
      </Button>
    </form>
  );
}