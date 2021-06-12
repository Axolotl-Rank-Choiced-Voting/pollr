import React, { useEffect } from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

/*
Landing page accessible only to logged in user
Contains poll creation options
*Stretch Goal: view past poll history
*/

export default function Landing(props) {
  //console.log('props: ', props);
  // poll title
  const [pollName, setPollName] = useState("");
  // total number of poll candidates
  let [totalOptions, setTotalOptions] = useState(2);
  // names of poll candidates
  let [optionNames, setOptionNames] = useState(['Option 1', 'Option 2']);

  // validate that at least two poll candidates exist
  function validateForm() {
    return totalOptions >= 2;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  const optionsArray = [];

  for (let i = 0; i < totalOptions; i += 1) {
    let deleteIcon = totalOptions > 2 ? true : false;
    optionsArray.push(
      <Box mb={3}>
        <div>
          <TextField
            key={[i]}
            type="text"
            onChange={(e) => {
              optionNames[`${i}`] = e.target.value;
              setOptionNames(optionNames);
            }}
            label={`Option ${i + 1}`}
            variant="outlined"
          />
        </div>
      </Box>
    )
  }

  // websocket logic goes here?
  // useEffect(() => {
    
  // });

  return (
    <div>
      <h1>Create Poll</h1>
      <div>
      <a href="#">
        Log Out
      </a>
      </div>
      <form>
        <Box mb={3}>
          <div>
            <TextField
              id='pollname'
              onSubmit={handleSubmit}
              type="text"
              value={pollName}
              onChange={(e) => setPollName(e.target.value)}
              label="Poll Name"
              variant="outlined"
            />
          </div>
        </Box>
        { [optionsArray] }
        <div>
          <Button
            onClick={() => {setTotalOptions(totalOptions += 1)}}
            variant="outlined"
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