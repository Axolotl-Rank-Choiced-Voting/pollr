import { render } from 'react-dom';
import React from 'react';
// import App from './App.jsx';

// render(
//     <App socket={socket}/>,
//     document.getElementById('root')
// );


// test code, while remove
const wbURL = 'ws://localhost:8001/';
const socket = new WebSocket(wbURL);
socket.onopen = (e) => socket.send(JSON.stringify({type:'message', data:'hello'}));
socket.onmessage = (e) => {
    socket.close();
    console.log(e.type);
    console.log(e.data);
}