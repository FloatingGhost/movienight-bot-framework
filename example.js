const Movienight = require('./index');

const m = new Movienight('http://localhost:8089/ws', 'bot');

m.on('connect', () => {
    m.sendMessage('hehe');
    console.log('Setup complete');
    m.getUsers();
});

m.on('userlist', (users) => {
    console.log(`Users: ${users}`);
});

m.on('ping', () => console.log('PING!'));

m.on('topic', (topic) => {
    console.log('Topic is', topic);
});

m.on('message', (msg) => {
    console.log(`From ${msg.from}: ${msg.msg}`);
    if (msg.msg == 'ping') {
        m.sendMessage('pong!');
    }
});

m.on('join', (u) => { console.log(`${u} joined`); });
m.on('leave', (u) => { console.log(`${u} left`); });
m.on('rename', ({from, to}) => {
    console.log(`${from} is now known as ${to}`);
});
m.on('color', (c) => console.log(c));
m.on('server_message', (msg) => {
    console.log(`Server says: ${msg}`);
});
