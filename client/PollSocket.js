const wsURL = 'ws://localhost:8001/';

class PollSocket {
    constructor() {
        this.connect = () => {
            this.socket = new WebSocket(wsURL);          

            this.socket.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                this.listeners.forEach(l => l.callback(msg.type, msg.data, l.id));
            }

            return new Promise((resolve, reject) => {
                this.socket.onopen = (e) => {
                    this.connected = true;
                    resolve(true);
                };
            });
        }

        this.listeners = [];
        this.nextId = 0;
        this.connected = false;
    }

    addListener(callback) {
        this.listeners.push({ id:this.nextId, callback});
        return this.nextId++;
    }

    removeListener(id) {
        this.listeners = this.listeners.filter(l => l.id !== id);
    }

    sendEvent(type, data) {
        this.socket.send(JSON.stringify({type, data}));
    }
}

const pollSocket = new PollSocket();

export default pollSocket;