const ws = require("nodejs-websocket");
const pollController = require('./controllers/pollController.js');

const connections = {};

const WSServer = ws.createServer((conn) => {

    conn.on("text", (str) => {
        const msg = JSON.parse(str);
        msg.data.conn = conn;
        const userId = msg.data.userId;

        console.log('Received: ' + msg.type);
        if(msg.type === 'get') {
            if(!connections[userId]) {
                connections[userId] = {
                    conn,
                    userId,
                    polls: {},
                    voted: {},
                } 
            }           

            connections[userId].polls[msg.data.pollId] = true;
            connections[userId].voted[msg.data.pollId] = false;
            connections[userId].userId = userId;
            connections[userId].conn = conn;

            dispatcher(msg.data, {locals:{}}, pollController.getInformation, (req, res) => {
                conn.send(JSON.stringify({ type:'get', data: {...res.locals}}));
            });
        }
        else if(msg.type === 'vote') {
            dispatcher(msg.data, {locals:{}}, pollController.addVote, (req, res) => {
                connections[userId].voted[req.pollId] = true;
                Object.keys(connections).forEach(id => {
                    const connEl = connections[id];
                    if(connEl.conn === conn) {
                        conn.send(JSON.stringify({ type:'voted', data: { pollId: req.pollId, voted:true}}));
                    }
                    else {
                        connEl.conn.send(JSON.stringify({ type:'vote_update', data: { pollId: req.pollId, userId:req.userId, votedFor: req.vote}}))
                    }
                });
            });
        }
        else if(msg.type === 'close_poll') {
            dispatcher(msg.data, {locals:{}}, pollController.closePoll, (req, res) => {
                Object.keys(connections).forEach(id => {
                    const connEl = connections[id];
                    if(connEl.polls[req.pollId]) {
                        connEl.conn.send(JSON.stringify({type:'winner', data: { pollId: req.pollId, winner: res.locals }}));
                        delete connEl.polls[req.pollId];
                        delete connEl.voted[req.pollId];
                    }
                })
            });
        }
        else {
            WSServer.send(JSON.stringify({ type:'error', data: {error: 'Unkown message type'}}));
        }
    })

    // conn.on("close", (code, reason) => {
    //     console.log("Connection closed")
    // })
}).listen(8001);

const dispatcher = (req, res, ...route) => {
    if(route[0]) route[0](req, res, (error) => {
        if(error) {
            req.conn.send(JSON.stringify({ type:'error', data: { error }}));
        }
        else {
            dispatcher(req, res, ...route.slice(1));
        }
    });
}

console.log('Websocket server listnening on port 8001...');

module.exports = WSServer;
