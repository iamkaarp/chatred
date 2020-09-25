const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { v4: uuidv4 } = require('uuid');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '../dist')));

const channels = [
    {
        id: 1,
        name: 'Default',
    },
];

io.on('connection', socket => {
    socket.join(channels[0]);
    socket.on('message', (payload) => {
        socket.emit('message', payload.message);
        console.log(payload.channel.name);
    });
    socket.on('join', channel => {
        let chan = channels.find(channels => channels.name === channel);
        if(!chan) {
            channels.push(
                {
                    id: uuidv4(),
                    name: channel,
                },
            );
        }
        chan = channels.find(channels => channels.name === channel);
        socket.join(chan.name);
        io.to(socket.id).emit('joined', chan);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

