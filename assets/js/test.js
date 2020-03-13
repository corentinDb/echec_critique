(function () {

    const socket = io.connect('http://localhost:4269');

    socket.on('returnPoint', (message) => {
        console.log(message);
    });

    function clicked() {
        console.log('clicked');
        socket.emit('private message', 'Nico', 'Salut serveur, comment va ?');
    }

    document.getElementById('clicked').addEventListener('click', clicked);
})();