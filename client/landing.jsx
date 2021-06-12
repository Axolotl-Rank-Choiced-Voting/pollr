import React, { useEffect } from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Link, Redirect } from 'react-router-dom';

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
  let [optionNames, setOptionNames] = useState([]);
  // redirect
  const [redirect, setRedirect] = useState(null);

  // validate that at least two poll candidates exist
  function validateForm() {
    let validCandidates = 0;
    optionNames.forEach(e => {
      if (e !== null
       || e !== undefined
       || e !== '') validCandidates += 1;
    });
    return validCandidates >= 2;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  const optionsArray = [];

  for (let i = 0; i < totalOptions; i += 1) {
    // create delete icon for all options if there are more than 2 options
    let deleteIcon = totalOptions > 2 ? true : false;
    optionsArray.push(
      <Box mb={3}>
        <span>
          <TextField
            key={`OptionText${i}`}
            type="text"
            value={optionNames[`${i}`]}
            onChange={(e) => {
              let newOptions = [...optionNames]
              newOptions[`${i}`] = e.target.value;
              setOptionNames(newOptions);
            }}
            label={`Option ${i + 1}`}
            variant="outlined"
          />
        </span>
        {deleteIcon && <span>
          <Tooltip title="Delete Poll Option">
            <IconButton
              aria-label="delete"
              onClick={() => {
                let newOptions = [...optionNames];
                newOptions.splice(`${i}`, 1);
                setTotalOptions(totalOptions -= 1);
                setOptionNames(newOptions);
              }}
              // remove delete icon from tab selection cycle
              tabindex='-1'
              >
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
        </span>
        }
      </Box>
    )
  }

  const createPoll = () => {
    // fetch request to the server on the 'poll' route, method is post, body: pollName, optionsNames, userId
    fetch('/poll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: 1234123 , pollName, optionNames})
    })
      .then(response => response.json())
      .then(data => {
        console.log('Created poll: ', data);
        setRedirect(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  if(redirect) return (
    <Redirect
      to={{
        pathname: '/vote', 
        state: { userId:1234123, pollId:redirect.pollId, pollLink:redirect.link, admin:redirect.admin }
      }}
    />);

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
          onClick={() => createPoll()}
          disabled={!validateForm()}
          variant="contained"
        >
          Start Poll
        </Button>
      </form>
    </div>
  );
}