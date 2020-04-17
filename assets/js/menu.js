let pong = [];
let pingPong = [];
(function () {
    const socket = io.connect('http://localhost:4269');

    const pseudo = document.getElementById('localPlayer').innerHTML;  //Pseudo de l'utilisateur

    document.getElementById('pseudoGraphics').appendChild(document.createTextNode(pseudo));     //On affiche le pseudo de l'utilisateur

    socket.emit('getUserInfo', pseudo);          //On prévient les autres users qu'on se connecte
    chatMod.joinChat(pseudo);

    let table = document.getElementById('tablePlayer');

    socket.on('newUserRequest', (user) => {
        if (user === pseudo) {
            socket.emit('close', pseudo);
        }
    });

    socket.on('getUserInfo', (user) => {    //Si un nouveau utilisateur se connecte au serveur, on l'ajoute à la liste
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        socket.emit('giveUserInfo', pseudo, user, false);
    });

    socket.on('giveUserInfo', (user, inGame) => {
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        document.getElementById("play_with_" + user).disabled = inGame;
    });

    socket.on('removeUser', (user) => {     //Si un utilisateur se déconnecte du serveur, on le supprime de la liste
        if (document.getElementById(user)) {
            document.getElementById('mainChatBox').removeChild(document.getElementById('chatBox_' + user));
            table.removeChild(document.getElementById(user));
        }
    });

    socket.on('disconnect', () => {
        for (let interval of pingPong) {
            clearInterval(interval);
        }
        socket.on('connect', () => {
            window.location = 'http://localhost:4269';
        })
    });

    socket.on('pingRequest', (user, inGame) => {        //Réponse à une demande de ping
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        document.getElementById("play_with_" + user).disabled = inGame;
        socket.emit('pongUser', pseudo, user);
    });

    socket.on('pongResponse', (user, inGame) => {       //Réception de la réponse du ping
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        document.getElementById("play_with_" + user).disabled = inGame;
        pong[user] = true;
    });

    socket.on('playRequestToClient', (sender, receiver) => {
        if (receiver === pseudo) {
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
        }
    });

    socket.on('playResponseToClient', (sender, receiver, response, color, id) => {
        if (receiver === pseudo) {
            if (response) {
                startGame(sender, color, id);
            } else {
                alert(sender + ' a refusé de jouer avec vous :\'(\nC\'est vraiment pas un(e) ami(e) !');
            }
        } else if (response && sender !== pseudo) {
            let playWithSender = document.getElementById("play_with_" + sender);
            let playWithReceiver = document.getElementById("play_with_" + receiver);
            if (playWithSender === undefined || playWithSender === null) {
                socket.emit('pingUser', pseudo, sender);
            } else {
                playWithSender.disabled = true;
            }
            if (playWithReceiver === undefined || playWithReceiver === null) {
                socket.emit('pingUser', pseudo, receiver);
            } else {
                playWithReceiver.disabled = true;
            }
        }
    });

    socket.on('backInfo', (user1, user2) => {
        document.getElementById("play_with_" + user1).disabled = false;
        document.getElementById("play_with_" + user2).disabled = false;
    });


    document.getElementById("deconnection").addEventListener('click', () => {   //Bouton déconnexion
        socket.emit('removeUser', pseudo);
        window.location = "http://localhost:4269/destroy";
    });
})();

function addUserRow(pseudo, user, table) {      //Création d'une ligne pour un utilisateur connecté sur le serveur avec son nom et un bouton pour ouvrir un chat en direct avec lui
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


    let pingPongInterval = setInterval(() => {     //Ping de l'utilisateur toutes les 3 secondes pour vérifier qu'il est toujours connecté, sinon on retire la ligne de cette utilisateur et on arrête le ping régulier
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
    }, 2000);

    pingPong.push(pingPongInterval);

    linkChat.addEventListener('click', () => {      //Bouton pour ouvrir le chat avec l'utilisateur
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

function startGame(player, color, id) {     //Redirige vers la page de jeu avec les informations nécessaire
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