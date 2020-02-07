(function () {
    const socket = io.connect('http://localhost:8100');
    socket.on('hello', (message) => {
        alert('le serveur a un message pour vous : ' + message);
    });
    function clicked() {
        console.log('clicked');
        socket.emit('private message', 'Nico', 'Salut serveur, comment va ?');
    }

    document.getElementById('clicked').addEventListener('click', clicked);
})();