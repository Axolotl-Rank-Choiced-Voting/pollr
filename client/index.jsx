import { render } from 'react-dom';
import React from 'react';
import App from './App.jsx';

render(
    <App socket={socket}/>,
    document.getElementById('root')
);