import React from "react";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { Link, Redirect } from "react-router-dom";

export default function GuestLogIn(props) {
  const [guestName, setGuestName] = useState("");

  // form validation; guestname needs to be > one char
  function validateForm() {
    return guestName.length > 0;
  }

  const goToPoll = () => {
    console.log(props.match.params.pollId);
    return (
      <Redirect
        to={{
          pathname: "/vote",
          state: { pollId: props.match.params.pollId, userId: guestName },
        }}
      />
    );
  };

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form>
      <Box mb={3}>
        <div>
          <TextField
            onSubmit={handleSubmit}
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            label="guest name"
            variant="outlined"
          />
        </div>
      </Box>
      <Button
        onClick={() => goToPoll()}
        disabled={!validateForm()}
        variant="contained"
      >
        Continue to Poll
      </Button>
    </form>
  );
}
