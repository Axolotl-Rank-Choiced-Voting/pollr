import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';

/*
Login page allows user to log in, or redirects them to
the sign up page
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
      <div>
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="password"
          variant="outlined"
        />
      </div>
      <Link href="#" color="inherit">
        Sign Up
      </Link>
      <Button
        type="submit"
        disabled={!validateForm()}
        variant="contained"
      >
        Login
      </Button>
    </form>
  );
}