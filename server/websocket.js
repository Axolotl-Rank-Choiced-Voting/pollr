const ws = require("nodejs-websocket");
const pollController = require('./controllers/pollContorller.js');

const connections = {};

const WSServer = ws.createServer((conn) => {
    connections[conn] = {
        polls: {},
        id: null,
        voted: {},
    }

    conn.on("text", (str) => {
        const msg = JSON.parse(str);
        msg.conn = conn;

        if(msg.type === 'get') {
            connections.polls[msg.data.id] = true;
            connections.polls[msg.data.id] = false;
            dispatcher(msg.data, {}, pollController.getInformation(msg, {}), responder);
        }
        else if(msg.type === 'vote') {
            dispatcher(msg.data, {}, pollController.addVote(msg, {}), responder);
        }
        else if(msg.type === 'close_poll') {
            dispatcher(msg.data, {}, pollController.closePoll(msg, {}), responder);
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
    for(let i = 0; i < route.length; i++) {
        const error = route[i](req, res);
        if(error) {
            WSServer.send(JSON.stringify({ type:'error', data: { error }}));
            break;
        }
    }
}

const responder = (req, res) => {
    if(req.type === 'get') {
        req.conn.send(JSON.stringify({ type:'get', data: {...res}}));
    }
    else if(req.type === 'vote') {
        req.conn.voted[req.pollId] = true;
        connections.forEach(conn => {
            if(conn === req.conn) {
                conn.send(JSON.stringify({ type:'voted', data: { pollId: req.pollId, voted:true}}));
            }
            else {
                conn.send(JSON.stringify({ type:'vote_update', data: { pollId: req.pollId, userId:req.userId}}))
            }
        });
    }
    else if(req.type === 'close_poll') {
        connections.forEach(conn => {
            if(conn.polls[req.pollId]) {
                conn.send(JSON.stringify({type:'winner', data: { pollId: req.pollId, winner: res }}));
                delete conn.polls[req.pollId];
                delete conn.voted[req.pollId];
            }
        })
    }
}

console.log('Websocket server listnening on port 8001...');

module.export = WSServer;
