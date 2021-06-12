const server = require('../websocket.js');
const pollController = require('../controllers/pollController.js');

const connections = {};

server.use('subscribe', pollController.getInformation, (req, res) => {
    const userId = req.userId;
    if(!connections[userId]) {
        connections[userId] = {
            conn: res.conn,
            userId,
            polls: {},
            voted: {},
        } 
    }           

    connections[userId].polls[req.pollId] = true;
    connections[userId].voted[req.pollId] = false;

    res.conn.send(JSON.stringify({ type:'subscribe', data: {...res.locals}}));
});

server.use('vote', pollController.addVote, (req, res) => {
    connections[req.userId].voted[req.pollId] = true;
    Object.keys(connections).forEach(id => {
        const connEl = connections[id];
        if(connEl.conn === res.conn) {
            res.conn.send(JSON.stringify({ type:'voted', data: { pollId: req.pollId, voted:true}}));
        }
        else if(connEl.polls[req.pollId]) {
            connEl.conn.send(JSON.stringify({ type:'vote_update', data: { pollId: req.pollId, vote:res.locals}}))
        }
    });
});

server.use('close_poll', pollController.closePoll, (req, res) => {
    Object.keys(connections).forEach(id => {
        const connEl = connections[id];
        if(connEl.polls[req.pollId]) {
            connEl.conn.send(JSON.stringify({type:'winner', data: { pollId: req.pollId, winner: res.locals }}));
            delete connEl.polls[req.pollId];
            delete connEl.voted[req.pollId];
        }
    })
});

server.use('close', (req, res) => {
    Object.keys(connections).forEach(id => {
        if(connections[id].conn.key === res.conn.key) delete connections[id];
    });
})

module.exports = connections;
