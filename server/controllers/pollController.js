const { Poll } = require("../../models/pollModels.js");
const mongoose = require("mongoose");

const pollController = {};

const serverLink = "localhost:/3000/poll/";

// const activePolls = {};

// Standard server middleware
let currIndex = 0;
async function getLastIndex() {
  if (mongoose.connections[0]._readyState === 1) {
    const polls = await Poll.find({});
    currIndex = polls.reduce((max, poll) => Math.max(poll.pollId, max), -1) + 1;
  } else setTimeout(getLastIndex, 100);
}
getLastIndex();

pollController.getPolls = async (req, res, next) => {
  const polls = await Poll.find({});
  res.locals.polls = polls;
  return next();
};

pollController.createPoll = async (req, res, next) => {
  console.log(req.body);

  await Poll.create({
    method: "highestVote",
    question: req.body.pollName,
    options: req.body.optionNames,
    creatorId: req.body.userId.toString(),
    pollId: currIndex.toString(),
    voteCount: 0,
    responses: [],
    winner: {
      option: "",
      count: 0,
    },
    active: true,
  });

  res.locals.pollId = currIndex;
  res.locals.link = serverLink + currIndex;
  res.locals.admin = true;
  currIndex++;
  return next();
};

// Websocket server middleware

pollController.getInformation = async (req, res, next) => {
  const currPoll = await Poll.findOne({ pollId: req.pollId });
  if (!currPoll)
    return next({
      error: "Bad poll id request",
    });

  res.locals = currPoll._doc;
  return next();
};

pollController.addVote = async (req, res, next) => {
  const currPoll = await Poll.findOne({ pollId: req.pollId });

  if (!currPoll)
    return next({
      error: "Bad poll id request",
    });

  const vote = { userId: req.userId, vote: req.vote };
  currPoll.responses.push({
    userId: req.userId,
    vote: req.vote,
  });
  currPoll.voteCount++;
  await currPoll.save();

  res.locals = vote;
  return next();
};

pollController.closePoll = async (req, res, next) => {
  const currPoll = await Poll.findOne({ pollId: req.pollId });

  if (!currPoll)
    return next({
      error: "Bad poll id request",
    });

  if (currPoll.creatorId != req.userId)
    return next({
      error: "Only the owner can close the poll",
    });

  const results = currPoll.options.map((o) => {
    return { option: o, count: 0 };
  });
  currPoll.responses.forEach((result) => results[result.vote].count++);
  const result = results.reduce((max, opt) =>
    opt.count > max.count ? opt : max
  );
  currPoll.winner = result;
  currPoll.active = false;
  res.locals = result;
  await currPoll.save();

  return next();
};

module.exports = pollController;
