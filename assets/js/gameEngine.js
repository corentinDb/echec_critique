(function () {
    const socket = io.connect('http://localhost:4269');

    //Récupère les infos du joueur
    const localPlayer = document.getElementById('localPlayer').innerHTML;
    const opponent = document.getElementById('opponent').innerHTML;
    const color = document.getElementById('color').innerHTML;
    const gameID = document.getElementById('gameID').innerHTML;

    //Initialise la game
    socket.emit('joinGame', gameID);

    //Si le joueur est blanc, il lance la partie après 2 secondes (pour être sur que les 2 joueurs sont connectées)
    setTimeout(function () {
        if (color === 'white') {
            socket.emit('startGame', gameID);
        }
    }, 2000);


    socket.on('playTurn', (gameInstance) => {   //Début du tour
        //fonction pour afficher le board
        //Activer selection des pièces de couleur gameInstance.color
    });

    socket.on('giveMoveList', (gameInstance, moveList) => {     //Réception de la moveList
        //affichage des possibilités de déplacement
        //vérifier qu'une moveList a précédement été demandé
        //Activer selection move
    });

    //Dans la fonction de selection des pièces, si selection pièce activé :
    //x/y Origin => position dont on veut la moveList
    //game.getMoveList(gameInstance, gameID, color, xOrigin, yOrigin);

    //Dans la fonction de selection des pièces, si selection move activé :
    //x/y Origin => position actuel     x/y Destination => position futur
    //game.moveRequest(gameID, xOrigin, yOrigin, xDestination, yDestination);


    document.getElementById("back").addEventListener('click', () => {   //Bouton retour au menu
        socket.emit('backMenu', gameID, localPlayer, opponent);
        window.location = "http://localhost:4269/menu";
    });

    socket.on('backMenu', (user) => {   //Retour au menu automatique si l'adversaire part
        if (user === localPlayer) {
            window.location = "http://localhost:4269/menu";
        }
    });


    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
    });
})();