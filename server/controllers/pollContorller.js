
const pollController = {};

const serverLink = 'localhost:/3000/poll/';

const activePolls = {};
const currIndex = 0;

// Standard server middleware

pollController.createPoll = (req, res, next) => {
    activePolls[currIndex] = {
            poll: {
            method: 'rankedChoice',
            question: 'Where do you want to go for dinner?',
            options: [
                'Korean BBQ',
                'Hot pot',
                'Bar food',
                'Salads and Fixings',
            ],
            creatorId: 12342134,
            pollId: currIndex,
        },
        responses: [],
    }

    res.locals.poll = activePolls[currIndex].poll;
    res.locals.id = currIndex;
    res.locals.link = serverLink + currIndex++;
    res.locals.admin = true;
    return next();
}

// Websocket server middleware

pollController.getInformation = (req, res, next) => {
    if(!activePolls[req.pollId]) return next({
        error: 'Bad poll id request',
    });

    res = activePolls[req.pollId].poll;
    next();
}

pollController.addVote = (req, res, next) => {
    if(!activePolls[req.pollId]) return next({
        error: 'Bad poll id request',
    });

    const vote = { id:req.userId, vote: req.vote };
    activePolls[req.pollId].responses.push({ id: req.userId, });
    res = vote;
}

pollController.closePoll = (req, res, next) => {
    if(!activePolls[req.pollId]) return next({
        error: 'Bad poll id request',
    });

    if(activePolls[req.pollId].creatorId != req.userId) return next({
        error: 'Only the owner can close the poll',
    });

    const results = activePolls[req.pollId].options.map(o => { return {option: o, count: 0}; });
    activePolls[req.pollId].responses.forEach(res => results[res.vote].count++);
    const result = results.reduce((max, opt) => opt.count > max.count ? opt : max);
    activePolls[req.pollId].poll.winner = result;
    res = result;

    // make a data base request here
    // Poll.create...

    delete activePolls[req.pollId];
}

module.export = pollController;
