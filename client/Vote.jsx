import React, { useState, useEffect } from 'react';
import { Button, Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import pollSocket from './PollSocket.js';

const randomID = Math.floor(Math.random() * 1000000);

const Vote = (props) => {
    if(props.match.params.pollId !== undefined){
        props = { pollId:props.match.params.pollId, userId:'guest'+randomID }
    }
    else props = props.location.state;

    let [state, setState] = useState(null);
    const [selected, setSelected] = useState(-1);

    if(state === null) {
        const listener = (type, data) => {
            if(data.pollId != props.pollId) return;
            console.log('Got event: ', type, data);

            if(type === 'subscribe') {
                state = {poll:data, vote: { voted:false, count:data.voteCount }};
                setState({...state});
            }
            else if(type === 'vote_update') {
                state.vote.count++;
                setState({...state});
            }
            else if(type === 'voted') {
                state.vote.count++;
                state.vote.voted = true;
                setState({...state});
            }
            else if(type === 'winner') {
                // route winner page
                alert(`Winner was ${data.winner.option}!`);
            }
        }

        function connect() {
            if(!pollSocket.connected) {
                pollSocket.connect()
                    .then(() => {
                        pollSocket.addListener(listener);
                        // pollSocket.sendEvent('subscribe', {userId:props.userId, pollId:props.pollId});
                        pollSocket.sendEvent('subscribe', {userId:props.userId, pollId:props.pollId});
                    });
            }
            else {
                pollSocket.addListener(listener);
                pollSocket.sendEvent('subscribe', {userId:props.userId, pollId:props.pollId});
            }
        }
        connect();
    }

    if(!state) return (<h3>Loading...</h3>);

    const pollOptions = state.poll.options.map((opt, i) => { return(
        <div>
            <FormControlLabel key={`optKey${i}`}
                value={`${i}`} 
                disabled={state.vote.voted !== false ? true : false} 
                control={<Radio />} 
                label={opt} />
        </div>
    )});

    return (
        <div>
            <h1>{state.poll.question}</h1>
            <p>{state.vote.count} votes counted</p>
            <Box mb={3}>
                <FormControl component='voteOptionsForm'>
                    <RadioGroup name='voteRadioGroup' onChange={(e) => setSelected(e.target.value)}>
                        {pollOptions}
                    </RadioGroup>
                </FormControl>
            </Box>

            <Button
                onClick={() => {pollSocket.sendEvent('vote', {userId:props.userId, pollId:props.pollId, vote:selected})}}
                // disabled={!validateForm()}
                variant="contained"
                disabled={state.vote.voted || selected < 0}
            >
                Vote
            </Button>
            
            {props.admin && <Button
                onClick={() => {pollSocket.sendEvent('close_poll', {userId:props.userId, pollId:props.pollId})}}
                // disabled={!validateForm()}
                variant="contained"
            >
                Close Poll
            </Button>}

        </div>
    );
}


export default Vote;