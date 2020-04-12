let gameMod = (function () {
    const socket = io.connect('http://localhost:4269');
    return {
        getMoveList(gameInstance, gameID, color, xOrigin, yOrigin) {    //Demande la moveList au serveur
            if (gameInstance.color === color) {
                socket.emit('getMoveList', gameID, xOrigin, yOrigin);
            }
        },

        moveRequest(gameID, xOrigin, yOrigin, xDestination, yDestination) {     //Envoie le mouvement au serveur
            socket.emit('moveRequest', gameID, xOrigin, yOrigin, xDestination, yDestination);
        }
    }
})();