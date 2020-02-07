const port = 4269;

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const moduleTest = require('./server_modules/module');
const ClassTest = require('./server_modules/Class');
app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res, next) => {
    moduleTest.a();
    res.sendFile(__dirname+'/assets/views/index.html');
});

app.get('/view', (req, res, next) => {
    moduleTest.b();
    let test = new ClassTest();
    test.testHello();
    res.sendFile(__dirname + '/assets/views/view.html');
});

app.get('/registration', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/registration.html');
});

io.sockets.on('connection',(socket)=> {
    io.emit('Hello', 'A new connetion on our webstite');
    socket.on('private message', (from, msg) => {
        console.log('I recieved a private message from' + from + ' saying ' + msg);
    });
    socket.on('disconnect', () => {
        io.emit('disconnection','user disconnected');
    });
});

server.listen(port);
console.log('server instantiated');