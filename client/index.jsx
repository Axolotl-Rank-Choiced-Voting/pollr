import { render } from 'react-dom';
import React from 'react';
// import App from './App.jsx';

// render(
//     <App socket={socket}/>,
//     document.getElementById('root')
// );


// test code, will remove
import pollSocket from './PollSocket.js';

const testFunction = async () => {
    const data = await fetch('/poll', { method: 'POST', 
    headers: {
        'Content-Type': 'Application/JSON'
    }})
    .then(data => data.json())
    
    const connected = await pollSocket.connect();
    if(connected) console.log('Connected to websocket server');

    console.log('Created poll: ', data);
    const id = pollSocket.addListener((type, data) => {
        console.log('Got message: ')
        if(type === 'get') {
            console.log(type);
            console.log(data);
            pollSocket.sendEvent('vote', {
                userId: 12342134,
                pollId: data.pollId,
                vote: 1,
            });
        }
        else if(type === 'voted') {
            console.log(type);
            console.log(data);
            pollSocket.sendEvent('close_poll', {
                userId: 12342134,
                pollId: data.pollId,
            });
        }
        else if(type === 'vote_update') {
            
        }
        else if(type === 'winner') {
            console.log(type);
            console.log(data);
        }
    });

    pollSocket.sendEvent('get', { 
        userId: 12342134,
        pollId: data.pollId,
    });    
}

testFunction();

