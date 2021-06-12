const ws = require("nodejs-websocket");
const pollController = require('./controllers/pollController.js');

const connections = [];

const WSServer = ws.createServer((conn) => {
    connections.push({
        conn,
        polls: {},
        id: null,
        voted: {},
    })

    conn.on("text", (str) => {
        const msg = JSON.parse(str);
        msg.data.conn = conn;
        
        let connIndex = 0;
        for(; connIndex < connections.length; connIndex++) {
            if(connections[connIndex].conn === conn) break;
        }

        console.log('Received: ' + msg.type);
        if(msg.type === 'get') {
            connections[connIndex].polls[msg.data.pollId] = true;
            connections[connIndex].voted[msg.data.pollId] = false;
            connections[connIndex].userId = msg.data.userId;
            dispatcher(msg.data, {locals:{}}, pollController.getInformation, (req, res) => {
                conn.send(JSON.stringify({ type:'get', data: {...res.locals}}));
            });
        }
        else if(msg.type === 'vote') {
            dispatcher(msg.data, {locals:{}}, pollController.addVote, (req, res) => {
                connections[connIndex].voted[req.pollId] = true;
                connections.forEach(connEl => {
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
                connections.forEach(connEl => {
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
