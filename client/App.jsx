import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './login.jsx';
import Landing from './landing.jsx';

const Url = '';

export default function App() {
  // switch tag to determine which page to load
  return (
    <main>
      <Switch>
        <Route path="/" component={ Login } exact />
        {/* <Route path="/landing" component={ Landing } exact /> */}
        <Route path="/landing" render={(props) => <Landing value="test" />} exact />
      </Switch>
    </main>
  );
}