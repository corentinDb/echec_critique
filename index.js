const port = 4269;

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const moduleTest = require('./server_modules/module');
const Point = require('./server_modules/Point');
const Move = require('./server_modules/Move');
const Board = require('./server_modules/Board');

app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/index.html');
});

app.get('/board', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/board.html');
});

io.sockets.on('connection', (socket) => {

    let board;

    io.emit('Hello', 'A new connetion on our webstite');

    socket.on('private message', (from, msg) => {
        console.log('I recieved a private message from' + from + ' saying ' + msg);
    });

    socket.on('newBoard', () => {

        board = new Board();

    });

    socket.on('moveBoard', (x, y, toX, toY) => {
        board.move(new Move(new Point(x,y), new Point(toX, toY)));
    });

    socket.on('resetBoard', () => {
        board.reset();
    });

    socket.on('returnBoard', () => {
        io.emit('returnBoard', board);
    });

    socket.on('rewindBoard', (turn) => {
        board.rewind(turn);
    });

    socket.on('disconnect', () => {
        io.emit('disconnection', 'user disconnected');
    });
});

server.listen(port);
console.log('server instantiated');