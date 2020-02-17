(function () {

    const socket = io.connect('http://localhost:4269');

    socket.on('returnBoard', (board) => {
        console.log(board)
    });

    socket.emit('newBoard');
    socket.emit('returnBoard');
    socket.emit('moveBoard', 4, 1, 4, 3);
    socket.emit('moveBoard', 5, 1, 5, 3);
    socket.emit('moveBoard', 6, 1, 6, 3);
    socket.emit('moveBoard', 7, 1, 7, 3);
    socket.emit('moveBoard', 5, 0, 1, 4);
    socket.emit('moveBoard', 6, 0, 5, 2);
    socket.emit('returnBoard');
    socket.emit('rewindBoard', 2);
    socket.emit('returnBoard');
    socket.emit('rewindBoard', 2);
    socket.emit('returnBoard');


})();
