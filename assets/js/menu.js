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
        disabledSwitch('play_with_' + user, inGame);
        disabledSwitch('chatButton_' + user, inGame);
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
        disabledSwitch('play_with_' + user, inGame);
        disabledSwitch('chatButton_' + user, inGame);
        socket.emit('pongUser', pseudo, user);
    });

    //Réception de la réponse du ping
    socket.on('pongResponse', (user, inGame) => {
        if (!document.getElementById(user)) {
            addUserRow(pseudo, user, table);
        }
        disabledSwitch('play_with_' + user, inGame);
        disabledSwitch('chatButton_' + user, inGame);
        pong[user] = true;
    });

    //Réponse à une requête de 'sender' pour jouer avec 'receiver'
    socket.on('playRequestToClient', (sender, receiver) => {
        confirmBox(sender, receiver);
    });

    socket.on('playResponseToClient', (sender, receiver, response, color, id) => {
        //Si la réponse s'adresse à l'utilisateur local, soit on lance la partie, soit on l'informe du refus de jouer
        if (receiver === pseudo) {
            if (response) {
                startGame(sender, color, id);
            } else {
                alertBox(sender + ' a refusé de jouer avec vous :\'(<br>C\'est vraiment pas un(e) ami(e) !');
            }
        } else if (response && sender !== pseudo) {     //Sinon, si la réponse est positif, on bloque les boutons des joueurs qui commence leur partie
            disabledSwitch('play_with_' + receiver, true);
            disabledSwitch('chatButton_' + receiver, true);
            disabledSwitch('play_with_' + sender, true);
            disabledSwitch('chatButton_' + sender, true);
        }
    });

    //Informe que les utilisateurs 'user1' et 'user2' sont revenu de leur partie
    socket.on('backInfo', (user1, user2) => {
        disabledSwitch('play_with_' + user1, false);
        disabledSwitch('chatButton_' + user1, false);
        disabledSwitch('play_with_' + user2, false);
        disabledSwitch('chatButton_' + user2, false);
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
    newRow.className = 'userRow';
    newRow.id = user.toString();

    let userCell = document.createElement("td");
    newRow.appendChild(userCell);
    userCell.id = 'userCell';
    userCell.appendChild(document.createTextNode(user));


    let linkCell = document.createElement("td");
    linkCell.className = 'buttonCell';
    newRow.appendChild(linkCell);

    let linkChat = document.createElement("button");
    linkCell.appendChild(linkChat);
    linkChat.id = 'chatButton_' + user;
    linkChat.className = 'userButton';
    // linkChat.innerHTML = 'Discussion';
    let spanButton1 = document.createElement("span");
    spanButton1.appendChild(document.createTextNode('Discussion'));
    linkChat.appendChild(spanButton1);

    let waitingMsg = document.createElement("td");
    newRow.appendChild(waitingMsg);
    waitingMsg.id = 'waitingMsg_' + user;
    waitingMsg.className = 'waitingMsg';

    let connectionButton = document.createElement("button");
    linkCell.appendChild(connectionButton);
    connectionButton.id = 'play_with_' + user;
    connectionButton.className = 'userButton';
    // connectionButton.innerHTML = 'Jouer';
    let spanButton2 = document.createElement("span");
    spanButton2.appendChild(document.createTextNode('Jouer'));
    connectionButton.appendChild(spanButton2);


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
        }, 1000);
    }, 4000);


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

function confirmBox(sender, receiver) {
    if (!document.getElementById('alertDiv')) {

        const socket = io.connect('http://localhost:4269');

        for (let elem of document.body.children) {
            elem.hidden = 'true';
        }
        document.body.id = 'alertBody';

        let mainAlertDiv = document.getElementById('alertMenu');
        mainAlertDiv.style.display = 'block';

        let confirmDiv = document.createElement("div");
        mainAlertDiv.appendChild(confirmDiv);
        confirmDiv.id = 'alertDiv';


        let confirmText = document.createElement("p");
        confirmDiv.appendChild(confirmText);
        confirmText.id = 'alertTxt';
        confirmText.appendChild(document.createTextNode(sender + ' veut jouer avec vous !'));

        let acceptButton = document.createElement("button");
        confirmDiv.appendChild(acceptButton);
        acceptButton.className = 'confirmButton';
        acceptButton.innerHTML = 'Confirmer';

        let refuseButton = document.createElement("button");
        confirmDiv.appendChild(refuseButton);
        refuseButton.className = 'confirmButton';
        refuseButton.innerHTML = 'Refuser';

        acceptButton.addEventListener('click', () => {
            let colorTab = ['black', 'white'];
            let color1 = colorTab[Math.floor(Math.random() * 2)];
            let color2;
            color1 === 'black' ? color2 = 'white' : color2 = 'black';

            let id = 'game' + sender + receiver;
            socket.emit('playResponseToServer', receiver, sender, true, color2, id);
            startGame(sender, color1, id);
        });

        refuseButton.addEventListener('click', () => {
            socket.emit('playResponseToServer', receiver, sender, false);
            for (let elem of document.body.children) {
                if (elem !== mainAlertDiv) {
                    elem.hidden = '';
                }
            }
            mainAlertDiv.style.display = 'none';
            document.body.id = 'mainBody';
            mainAlertDiv.removeChild(confirmDiv);
        });
    }
}

function alertBox(msg) {
    if (!document.getElementById('alertDiv')) {

        for (let elem of document.body.children) {
            elem.hidden = 'true';
        }
        document.body.id = 'alertBody';

        let mainAlertDiv = document.getElementById('alertMenu');
        mainAlertDiv.style.display = 'block';

        let alertDiv = document.createElement("div");
        mainAlertDiv.appendChild(alertDiv);
        alertDiv.id = 'alertDiv';


        let alertText = document.createElement("p");
        alertDiv.appendChild(alertText);
        alertText.id = 'alertTxt';
        alertText.innerHTML = msg;

        let cryButton = document.createElement("button");
        alertDiv.appendChild(cryButton);
        cryButton.className = 'alertButton';
        cryButton.innerHTML = 'Je vais pleurer tout(e) seul(e) dans mon coin :\'(';

        cryButton.addEventListener('click', () => {
            for (let elem of document.body.children) {
                if (elem !== mainAlertDiv) {
                    elem.hidden = '';
                }
            }
            mainAlertDiv.style.display = 'none';
            document.body.id = 'mainBody';
            mainAlertDiv.removeChild(alertDiv);
        })
    }
}

function disabledSwitch(id, inGame) {
    let elem = document.getElementById(id);
    if (elem !== null && elem !== undefined) {
        elem.disabled = inGame;
        inGame ? elem.style.backgroundColor = 'rgba(76, 175, 80, 0.72)' : elem.style.backgroundColor = '#4CAF50';
    }
}