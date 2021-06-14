import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import App from "./App.jsx";
const logo = "/assets/Pollr_Text_White.png";

render(
  //<App socket={socket}/>,
  <BrowserRouter>
    <center>
      <img src={logo}></img>
    </center>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
