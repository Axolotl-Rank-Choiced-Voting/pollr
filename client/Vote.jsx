import React, { useState, useEffect } from 'react';
import { Button, Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Link } from 'react-router-dom';
import pollSocket from './PollSocket.js';

function handleSubmit(event) {
    event.preventDefault();
}

// test function
let loaded = false;
let pollData;
fetch('/poll', { method: 'POST', 
    headers: {
        'Content-Type': 'Application/JSON'
    }})
    .then(data => data.json())
    .then(data => {
        console.log('Created poll: ', data);
        pollData = data;
        loaded = true;
    })
   
const Vote = (props) => {
    const [poll, setPoll] = useState(null);
    const [voted, setVoted] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const [selected, setSelected] = useState(0);

    console.log('Rerender: ', poll, voted, voteCount, selected);

    if(poll === null) {
        const listener = (type, data) => {
            console.log('Got event: ', type);
            console.log('Data: ', data)

            if(type === 'subscribe') {
                setPoll(data);
                // setVoteCount(); not implemented;
            }
            else if(type === 'vote_update') {
                setVoteCount(voteCount+1);
            }
            else if(type === 'voted') {
                setVoted(true);
                setVoteCount(voteCount+1);
            }
            else if(type === 'winner') {
                // route winner page
                alert(`Winner was ${data.winner.option}!`);
            }
        }

        function connect() {
            if(loaded){

            if(!pollSocket.connected) {
                pollSocket.connect()
                    .then(() => {
                        pollSocket.addListener(listener);
                        // pollSocket.sendEvent('subscribe', {userId:props.userId, pollId:props.pollId});
                        pollSocket.sendEvent('subscribe', {userId:props.userId, pollId:pollData.pollId});
                    });
            }
            // else {
            //     pollSocket.addListener(listener);
            //     pollSocket.sendEvent('subscribe', {userId:props.userId, pollId:props.pollId});
            // }


            } else setTimeout(this.connect.bind(this), 100);
        }
        connect();
    }

    if(!poll) return (<h3>Loading...</h3>);

    const pollOptions = poll.options.map((opt, i) => { return(
        <div>
            <FormControlLabel key={`optKey${i}`}
                value={`${i}`} 
                disabled={voted !== false ? true : false} 
                control={<Radio />} 
                label={opt} />
        </div>
    )});

    return (
        <div>
            <h1>{poll.question}</h1>
            <p>{voteCount} votes counted</p>
            <Box mb={3}>
                <FormControl component='voteOptionsForm'>
                    <RadioGroup name='voteRadioGroup' onChange={(e) => setSelected(e.target.value)}>
                        {pollOptions}
                    </RadioGroup>
                </FormControl>
            </Box>

            <Button
                onClick={() => {pollSocket.sendEvent('vote', {userId:props.userId, pollId:pollData.pollId, vote:selected})}}
                // disabled={!validateForm()}
                variant="contained">
                Vote
            </Button>
            
            {props.admin && <Button
                onClick={() => {pollSocket.sendEvent('close_poll', {userId:props.userId, pollId:pollData.pollId})}}
                // disabled={!validateForm()}
                variant="contained"
            >
                Close Poll
            </Button>}

        </div>
    );
}


export default Vote;