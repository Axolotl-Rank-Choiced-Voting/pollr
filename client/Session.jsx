import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const Session = (props) => {
  const [loading, loadState] = useState(null);

  if(!loading) {
    fetch('/login')
      .then(data => data.json())
      .then(data => {
        console.log(data);
        loadState(data);
      })
      .catch(err => console.log('Error in session request: ', err));
  }

  if(!loading) return (
    <h3>loading</h3>
  );

  return (
    <Redirect
        to={{
          pathname: loading.tabs,
          state: { userId: loading.userId },
        }}
      />
  );
}

export default Session;