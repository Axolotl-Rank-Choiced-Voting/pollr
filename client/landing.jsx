import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';

/*
Landing page accessible only to logged in user
Contains poll creation options
*Stretch Goal: view past poll history
*/

export default function Landing() {
  const [pollName, setPollName] = useState("");
  // placeholder for poll option state
  const [optionName, setOptionName] = useState("");

  // validate that at least two options have been filled out
  function validateForm() {
    //return totalOptions > 2;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div>
      <div>
      <Link href="#" color="inherit">
        Log Out
      </Link>
      </div>
      <form>
        <div>
          <TextField
            onSubmit={handleSubmit}
            type="text"
            value={pollName}
            onChange={(e) => setPollName(e.target.value)}
            label="Poll Name"
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            type="text"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
            label="Option 1"
            variant="outlined"
          />
        </div>
        <div>
          <Button
            onClick={() => {alert('clicked')}}
          >
            +
          </Button>
        </div>
        <Button
          onClick={() => {alert('clicked')}}
          disabled={!validateForm()}
          variant="contained"
        >
          Start Poll
        </Button>
      </form>
    </div>
  );
}