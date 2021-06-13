
const pollController = {};

const serverLink = 'localhost:/3000/poll/';

const activePolls = {};
let currIndex = 0;

// Standard server middleware

pollController.createPoll = (req, res, next) => {
    console.log(req.body);
    activePolls[currIndex] = {
            poll: {
            method: 'rankedChoice',
            question: req.body.pollName,
            options: req.body.optionNames,
            creatorId: req.body.userId,
            pollId: currIndex,
            voteCount: 0,
        },
        responses: [],
    }

    res.locals.pollId = currIndex;
    res.locals.link = serverLink + currIndex;
    res.locals.admin = true;
    currIndex++;
    return next();
}

// Websocket server middleware

pollController.getInformation = (req, res, next) => {
    if(!activePolls[req.pollId]) return next({
        error: 'Bad poll id request',
    });

    res.locals = activePolls[req.pollId].poll;
    return next();
}

pollController.addVote = (req, res, next) => {
    if(!activePolls[req.pollId]) return next({
        error: 'Bad poll id request',
    });

    const vote = { userId:req.userId, vote:req.vote };
    activePolls[req.pollId].responses.push({ userId: req.userId, vote:req.vote });
    activePolls[req.pollId].poll.voteCount++;
    res.locals = vote;
    return next();
}

pollController.closePoll = (req, res, next) => {
    if(!activePolls[req.pollId]) return next({
        error: 'Bad poll id request',
    });

    if(activePolls[req.pollId].poll.creatorId != req.userId) return next({
        error: 'Only the owner can close the poll',
    });

    const results = activePolls[req.pollId].poll.options.map(o => { return {option: o, count: 0}; });
    activePolls[req.pollId].responses.forEach(res => results[res.vote].count++);
    const result = results.reduce((max, opt) => opt.count > max.count ? opt : max);
    activePolls[req.pollId].poll.winner = result;
    res.locals = result;

    // make a data base request here
    // Poll.create...

    delete activePolls[req.pollId];
    return next();
}

module.exports = pollController;
