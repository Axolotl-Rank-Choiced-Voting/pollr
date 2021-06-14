const express = require("express");
const path = require("path");
const pollController = require("../controllers/pollController.js");

const router = express.Router();

router.get("/", pollController.getPolls, (req, res) => {
  res.status(200).json([...res.locals.polls]);
});

router.post("/", pollController.createPoll, (req, res) => {
  res.status(200).json(res.locals);
});

router.get("/:id", (req, res) => {
  if (req.params.id === "style.css") {
    res.status(200).sendFile(path.join(__dirname, "../../style.css"));
  } else {
    res.status(200).sendFile(path.join(__dirname, "../../index.html"));
  }
});

module.exports = router;
