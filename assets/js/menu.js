let pong = [];
(function () {
    const socket = io.connect('http://localhost:4269');

    //Pseudo de l'utilisateur
    const pseudo = document.getElementById('localPlayer').innerHTML;

    let table = document.getElementById('tablePlayer');

    //On affiche le pseudo de l'utilisateur
    document.getElementById('pseudoGraphics').appendChild(document.createTextNode(pseudo));

    //On prévient les autres users qu'on se connecte
    socket.emit('getUserInfo', pseudo);
    chatMod.joinChat(pseudo);


    //Force la fermeture si un utilisateur avec le même pseudo se connecte
    socket.on('newUserRequest', (user) => {
        if (user === pseudo) {
            socket.emit('close', pseudo);
        }
    });

    //Si un nouveau utilisateur se connecte au serveur, on l'ajoute à la liste
    socket.on('getUserInfo', (user) => {
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        socket.emit('giveUserInfo', pseudo, user, false);
    });


    //Réception des infos du joueur, on l'ajoute à la ligne et on bloque les boutons
    socket.on('giveUserInfo', (user, inGame) => {
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        document.getElementById("play_with_" + user).disabled = inGame;
        document.getElementById("chatButton_" + user).disabled = inGame;
    });

    //Si un utilisateur se déconnecte du serveur, on le supprime de la liste
    socket.on('removeUser', (user) => {
        if (document.getElementById(user)) {
            document.getElementById('mainChatBox').removeChild(document.getElementById('chatBox_' + user));
            table.removeChild(document.getElementById(user));
        }
    });

    //Si le socket est déconnecté du serveur, on redirige vers la page principale
    socket.on('disconnect', () => {
        setTimeout(() => {
            window.location = 'http://localhost:4269';
        }, 200);
    });

    //Réponse à une demande de ping
    socket.on('pingRequest', (user, inGame) => {
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        document.getElementById("play_with_" + user).disabled = inGame;
        document.getElementById("chatButton_" + user).disabled = inGame;
        socket.emit('pongUser', pseudo, user);
    });

    //Réception de la réponse du ping
    socket.on('pongResponse', (user, inGame) => {
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        document.getElementById("play_with_" + user).disabled = inGame;
        document.getElementById("chatButton_" + user).disabled = inGame;
        pong[user] = true;
    });

    //Réponse à une requête de 'sender' pour jouer avec 'receiver'
    socket.on('playRequestToClient', (sender, receiver) => {
        let response = confirm(sender + ' veut jouer avec vous !');
        let colorTab = ['black', 'white'];
        let color1 = colorTab[Math.floor(Math.random() * 2)];
        let color2;
        color1 === 'black' ? color2 = 'white' : color2 = 'black';

        let id = 'game' + sender + receiver;
        socket.emit('playResponseToServer', pseudo, sender, response, color2, id);
        if (response) {
            startGame(sender, color1, id);
        }
    });

    socket.on('playResponseToClient', (sender, receiver, response, color, id) => {
        //Si la réponse s'adresse à l'utilisateur local, soit on lance la partie, soit on l'informe du refus de jouer
        if (receiver === pseudo) {
            if (response) {
                startGame(sender, color, id);
            } else {
                alert(sender + ' a refusé de jouer avec vous :\'(\nC\'est vraiment pas un(e) ami(e) !');
            }
        } else if (response && sender !== pseudo) {     //Sinon, si la réponse est positif, on bloque les boutons des joueurs qui commence leur partie
            document.getElementById("play_with_" + sender).disabled = true;
            document.getElementById("chatButton_" + sender).disabled = true;
            document.getElementById("play_with_" + receiver).disabled = true;
            document.getElementById("chatButton_" + receiver).disabled = true;
        }
    });

    //Informe que les utilisateurs 'user1' et 'user2' sont revenu de leur partie
    socket.on('backInfo', (user1, user2) => {
        document.getElementById("play_with_" + user1).disabled = false;
        document.getElementById("chatButton_" + user1).disabled = false;
        document.getElementById("play_with_" + user2).disabled = false;
        document.getElementById("chatButton_" + user2).disabled = false;
    });


    //Bouton déconnexion
    document.getElementById("deconnection").addEventListener('click', () => {
        socket.emit('removeUser', pseudo);
        window.location = "http://localhost:4269/destroy";
    });
})();

//Création d'une ligne pour un utilisateur connecté sur le serveur avec son nom et un bouton pour ouvrir un chat en direct avec lui
function addUserRow(pseudo, user, table) {
    const socket = io.connect('http://localhost:4269');

    let newRow = document.createElement("tr");
    table.appendChild(newRow);
    newRow.id = user.toString();

    let userCell = document.createElement("td");
    newRow.appendChild(userCell);
    userCell.id = 'userCell';
    userCell.appendChild(document.createTextNode(user));


    let linkCell = document.createElement("td");
    newRow.appendChild(linkCell);

    let linkChat = document.createElement("button");
    linkCell.appendChild(linkChat);
    linkChat.className = 'userButton';
    linkChat.id = 'chatButton_' + user;
    linkChat.innerHTML = 'discussion';


    let waitingMsg = document.createElement("td");
    newRow.appendChild(waitingMsg);
    waitingMsg.id = 'waitingMsg_' + user;
    waitingMsg.className = 'waitingMsg';

    let connectionButton = document.createElement("button");
    linkCell.appendChild(connectionButton);
    connectionButton.innerHTML = 'jouer avec ' + user;
    connectionButton.id = 'play_with_' + user;
    connectionButton.className = 'userButton';


    chatMod.createTabChat(pseudo, user);


    //Ping de l'utilisateur toutes les 3 secondes pour vérifier qu'il est toujours connecté, sinon on retire la ligne de cette utilisateur et on arrête le ping régulier
    let pingPong = setInterval(() => {
        socket.emit('pingUser', pseudo, user);
        setTimeout(() => {
            if (pong[user] === false) {
                if (document.getElementById(user)) {
                    document.getElementById('mainChatBox').removeChild(document.getElementById('chatBox_' + user));
                    table.removeChild(document.getElementById(user));
                    clearInterval(pingPong);
                }
            } else {
                pong[user] = false;
            }
        }, 500);
    }, 3000);


    //Bouton pour ouvrir le chat avec l'utilisateur
    linkChat.addEventListener('click', () => {
        if (document.getElementById('chatBox_' + user).style.display !== 'block') {
            let mainDivChat = document.getElementById('mainChatBox');
            if (mainDivChat.hasChildNodes()) {
                let listChatBox = mainDivChat.childNodes;
                for (let i = 1; i < listChatBox.length; i++) {
                    listChatBox[i].style.display = 'none';
                }
            }
            document.getElementById('chatBox_' + user).style.display = 'block';
            document.getElementById('waitingMsg_' + user).innerHTML = '';
        } else {
            document.getElementById('chatBox_' + user).style.display = 'none';
        }
    });

    connectionButton.addEventListener('click', () => {  //Bouton play
        socket.emit("playRequestToServer", pseudo, user);
    });
}

//Redirige vers la page de jeu avec les informations nécessaire
function startGame(player, color, id) {
    let form = document.createElement("form");
    form.method = 'post';
    form.action = '/game';

    let opponent = document.createElement("input");
    opponent.type = 'hidden';
    opponent.value = player;
    opponent.name = 'opponent';

    let colorInput = document.createElement("input");
    colorInput.type = 'hidden';
    colorInput.value = color;
    colorInput.name = 'color';

    let idInput = document.createElement("input");
    idInput.type = 'hidden';
    idInput.value = id;
    idInput.name = 'gameID';

    form.appendChild(opponent);
    form.appendChild(colorInput);
    form.appendChild(idInput);

    document.body.appendChild(form);
    form.submit();
}