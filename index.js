const EventEmitter = require('events');
const WebSocket = require('ws');

const messageTypes = {
    MESSAGE: 1,
    TOPIC: 2,
    USERS: 3,
    STATUS: 5,
};

class Movienight extends EventEmitter {
    constructor(url, username, colour='#000000') {
        super();
        this.url = url;
        this.username = username;
        this.colour = colour;
        this.connectWebsocket();
        this.pinger = setInterval(() => {
            this.send(2, '');
        }, 1000);
    }

    handle(type, ...args) {
        switch (type) {
        case messageTypes.MESSAGE:
            this.handleMessage(...args);
            return;
        case messageTypes.USERS:
            this.handleUserEvent(...args);
            return;
        case messageTypes.TOPIC:
            this.handleTopic(...args); 
            return;
        case messageTypes.STATUS:
            this.handleStatus(...args);
            return;
        } 
        console.error(`Unhandled message type ${type}`);
        console.error(JSON.stringify(args));
    }

    connectWebsocket() {
        this.ws = new WebSocket(this.url);
        this.ws.on('open', () => {
            this.send(6, JSON.stringify({
                Name: this.username, Color: this.colour
            }));
 
        });

        this.ws.on('message', (msg) => {
            const { Type: type, Data: data } = JSON.parse(msg);
            if (!Object.values(messageTypes).includes(type)) {
                console.error(`Unknown message type ${type}`);
                return;
            }
            this.handle(type, data); 
        });
    }

    close() {
        this.ws.close();
    }

    send(type, data) {
        this.ws.send(JSON.stringify({
            Type: type, Message: data
        }));
    }

    getUsers() {
        this.send(1, ''); 
    }

    sendMessage(msg) {
        this.send(0, msg);
    }

    handleMessage(msgData) {
        const { From: from, Message: msg } = msgData;

        if (from.length === 0) {
            this.emit('server_message', msg);
        } else {
            this.emit('message', { from, msg });
        }
    }

    handleUserEvent(msgData) {
        const { User: user, Event: e } = msgData;

        switch (e) {
        case 0:
            this.emit('join', user);
            if (user === this.username) {
                this.emit('login');
            }
            break;
        case 1:
            this.emit('leave', user);
            break;
        case 5:
            this.emit('rename', {
                from: user.split(':')[0],
                to: user.split(':')[1]
            });
            break;
        }
    }

    handleTopic(msgData) {
        const { Command: command, Arguments: args } = msgData;

        switch(command) {
        case 0:
            this.emit('topic', args[0]);
            break;
        }
    }

    handleServerMessage(msgData) {
        const { Type: type, Data: data } = msgData;
        switch (type) {
        case 6:
            break;
        }
    }

    handleStatus(msgData) {
        const { Type: type, Data: data } = msgData;
        switch (type) {
        case 1:
            this.emit('userlist', data);
            break;
        case 2:
            // PING
            this.emit('ping');
            break;
        case 3:
            // AUTH
            this.emit('auth', data);
            break;
        case 4: 
            // COLOUR
            this.emit('color', data);
            break;
        case 5:
            // EMOTE
            this.emit('emote', data);
            break;
        case 6:
            this.emit('connect');
            break;
        case 7:
            // NOTIFY
            this.emit('notify', data);
            break;
        }
    }
    
}

module.exports = Movienight;
