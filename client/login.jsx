import React from "react";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { Link, Redirect } from "react-router-dom";
import Landing from "./landing.jsx";
import GuestLogIn from "./guestlogin.jsx";

/*
Login page allows user to log in, or allows them to
navigate to the sign up page
*/

export default function Login(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(null);

  // form validation; username and password need to be > one char
  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  const signUp = () => {
    // fetch request to the server on the 'signup' route, method is post
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("new user signed up: ", data);
        setRedirect(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const login = () => {
    // fetch request to the server on the 'login' route, method is post
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("new user logged in: ", data);
        setRedirect(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // check if redirect has data attached, if so, redirect to path provided in redirect.tabs
  if (redirect) {
    console.log(redirect.tabs)
    if (props.match.params.pollId) {
      return (
        <Redirect
          to={{
            pathname: `/vote`, // '/vote'
            state: { pollId: props.match.params.pollId, userId: username }, //'pollid, userid
          }}
        />
      );
    }
    return (
      <Redirect
        to={{
          pathname: redirect.tabs,
          state: { userId: username },
        }}
      />
    );
  }

  return (
    <div>
      <form>
        <h1>Log In</h1>
        <Box m={2}>
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
        <Box m={2}>
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
        <Button
          onClick={() => signUp()}
          disabled={!validateForm()}
          variant="contained"
        >
          Sign Up
        </Button>
        <Button
          onClick={() => login()}
          disabled={!validateForm()}
          variant="contained"
        >
          Login
        </Button>
      </form>
        {props.match.params.pollId && <GuestLogIn {...props} />}
    </div>
  );
}
