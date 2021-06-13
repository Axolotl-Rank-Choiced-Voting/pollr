const ws = require("nodejs-websocket");


const routes = [];

const wsServer = { 
    socket:ws.createServer((conn) => {
        conn.on("text", (str) => {
            const msg = JSON.parse(str);

            console.log('Received: ' + msg.type + ' ' + msg.data.pollId + ' ' + msg.data.userId);
            
            let routeIndex = -1;
            for(let i = 0; i < routes.length; i++) {
                if(routes[i].start === msg.type) {
                    routeIndex = i;
                    break;
                }
            }
            // console.log('routes: ', routes);

            if(routeIndex === -1) conn.send(JSON.stringify({ type:'error', data: {error: 'Unknown message type'}}));
            else dispatcher(msg.data, {conn, locals:{}}, ...routes[routeIndex].stops);
        })

        conn.on("close", (code, reason) => {
            let routeIndex = -1;
            for(let i = 0; i < routes.length; i++) {
                if(routes[i].start === 'close') {
                    routeIndex = i;
                    break;
                }
            }
            if(routeIndex !== -1) dispatcher({}, {conn, locals:{}}, ...routes[routeIndex].stops);
        })

        conn.on('error', (err) => {
            console.log(`Errr on connection '${conn.key}': ${err}`);
        });
    }).listen(8001),

    use: (...stops) => {
        routes.push({ start:stops[0], stops:stops.slice(1) })
    }
}

wsServer.socket.on('listening', () => {
    console.log('Websocket server listnening on port 8001...');
});

wsServer.socket.on('connection', (conn) => {
    console.log('Connection established with ', conn.key);
});

wsServer.socket.on('close', () => {
    console.log('Websocket server has shut down');
});

wsServer.socket.on('error', (e) => {
    console.log('Websocket error caught: ', e);
});

const dispatcher = (req, res, ...route) => {
    if(route[0]) route[0](req, res, (error) => {
        if(error) {
            res.conn.send(JSON.stringify({ type:'error', data: { error }}));
        }
        else {
            dispatcher(req, res, ...route.slice(1));
        }
    });
}



module.exports = wsServer;
