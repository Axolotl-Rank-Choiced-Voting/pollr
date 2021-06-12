import { render } from 'react-dom';
import React from 'react';
// import App from './App.jsx';

// render(
//     <App socket={socket}/>,
//     document.getElementById('root')
// );


// test code, will remove
const wbURL = 'ws://localhost:8001/';
const testFunction = async () => {
    const data = await fetch('/poll', { method: 'POST', 
    headers: {
        'Content-Type': 'Application/JSON'
    }})
    .then(data => data.json())
    
    console.log(data);
    const socket = new WebSocket(wbURL);
    socket.onopen = (e) => socket.send(JSON.stringify({type:'get', 
        data: {
            userId: 12342134,
            pollId: data.pollId,
        }
    }));

    socket.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        console.log('Got message: ')
        if(msg.type === 'get') {
            console.log(msg.type);
            console.log(msg.data);
            socket.send(JSON.stringify({
                type: 'vote',
                data: {
                    userId: 12342134,
                    pollId: data.pollId,
                    vote: 1,
                }
            }));
        }
        else if(msg.type === 'voted') {
            console.log(msg.type);
            console.log(msg.data);
            socket.send(JSON.stringify({
                type: 'close_poll',
                data: {
                    userId: 12342134,
                    pollId: data.pollId,
                }
            }));
        }
        else if(msg.type === 'vote_update') {
            
        }
        else if(msg.type === 'winner') {
            console.log(msg.type);
            console.log(msg.data);
            socket.close();
        }
    }
}

testFunction();

