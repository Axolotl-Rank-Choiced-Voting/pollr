const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const cookieController = require("../controllers/cookieController");
const userController = require("../controllers/userController");
const sessionController = require("../controllers/sessionController");

const app = express();

const PORT = 3000;

// need to define mongoURL
// mongoose.connect(mongoURL, {
//     // options for the connect method to parse the URI
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // sets the name of the DB that our collections are part of
//     dbName: 'votingDB'
//   })
//     .then(() => console.log('Connected to Mongo DB.'))
//     .catch(err => console.log(err));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../index.html"));
});

app.get("/style.css", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../style.css"));
});

app.get("/dist/bundle.js", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../dist/bundle.js"));
});

//app.use(express.static(path.join(__dirname, '../dist')));

app.get("/login", sessionController.isLoggedIn, (req, res) => {
  if (res.locals.isLoggedIn) {
    return res.status(200).json({ tabs: "home" });
  }
  return res.status(200).json({ tabs: "login" });
});

//Authentication
app.post(
  "/signup",
  userController.createUser,
  cookieController.createCookie,
  sessionController.createSession,
  (req, res) => {
    //response includes 'home' to direct frontend to homepage
    return res.status(200).json({ tabs: "home" });
  }
);

app.post(
  "/login",
  userController.verifyUser,
  cookieController.createCookie,
  sessionController.createSession,
  (req, res) => {
    if (res.locals.verified) {
      //redirect user in verifUser here
      return res.status(200).json({ tabs: "home" });
    } else {
      return res.status(200).json({ tabs: "login" });
    }
  }
);

// app.get("/guest", (req, res) => {
//   return res
//     .status(200)
//     .json({ tabs: "poll", pollId: req.body.id, userId: "guest123" });
// });

// Routers

/**
 * 404 handler
 */
app.use("*", (req, res) => {
  return res.status(404).send("Not Found");
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.log("ERROR from global error handler", err.log);
  return res.status(err.status || 500).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = app;
