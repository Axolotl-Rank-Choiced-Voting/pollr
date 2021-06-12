const ws = require("nodejs-websocket");


const routes = [];

const wsServer = { 
    socket:ws.createServer((conn) => {
        conn.on("text", (str) => {
            const msg = JSON.parse(str);

            console.log('Received: ' + msg.type + ' ' + msg.data.pollId);
            
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

        // conn.on("close", (code, reason) => {
        //     console.log("Connection closed")
        // })
    }).listen(8001),

    use: (...stops) => {
        routes.push({ start:stops[0], stops:stops.slice(1) })
    }
}

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

console.log('Websocket server listnening on port 8001...');

module.exports = wsServer;
