(function () {
    const socket = io.connect('http://localhost:4269');

    let userList = returnListConnectedUser();   //Liste des utilisateurs connectées sous forme d'une chaine de caractère
    let pseudo = returnPseudo();    //Pseudo de l'utilisateur
    const tempTab = userList.split(',');    //Conversion de la chaine de caractère des utilisateurs en tableau


    if (tempTab.some((user) => user === pseudo)) {  //Si le pseudo est bien dans la liste des utilisateurs connectées
        socket.emit('newUserRequest', pseudo);          //On prévient les autres users qu'on se connecte
    } else {
        window.location = '/error';     //Sinon on redirige vers la page d'erreur
    }

    const tabUser = tempTab.filter(user => user !== pseudo);    //On retire le pseudo de l'utilisateur de la liste
    document.getElementById("pseudo").appendChild(document.createTextNode(pseudo));     //On affiche le pseudo de l'utilisateur

    let table = document.getElementById("tablePlayer");
    tabUser.forEach((user) => {     //On affiche tous les autres utilisateurs connectées
        addUserRow(pseudo, user, table);
    });


    socket.on('newUserResponse', (user) => {    //Si un nouveau utilisateur se connecte au serveur, on l'ajoute à la liste
        if (!document.getElementById(user) && user !== pseudo) {
            addUserRow(pseudo, user, table);
        }
    });

    socket.on('removeUserResponse', (user) => {     //Si un utilisateur se déconnecte du serveur, on le supprime de la liste
        if (document.getElementById(user)) {
            document.getElementById('mainChatBox').removeChild(document.getElementById('chatBox_' + user));
            table.removeChild(document.getElementById(user));
        }
    });

    socket.on('receiveMessage', (msg, sender, receiver, color) => {     //Quand l'utilisateur reçoit un message, on l'affiche dans la zone de chat correspondant à l'expéditeur
        if (receiver === pseudo) {
            addMessage(msg, sender, sender, color);
            if (document.getElementById('chatBox_' + sender).style.display === 'none') {
                let waitingMsg = document.getElementById('waitingMsg_' + sender);
                let oldCount = Number(waitingMsg.innerHTML);
                waitingMsg.innerHTML = '';
                waitingMsg.appendChild(document.createTextNode((oldCount + 1).toString()));
            }
        }
    });

    document.getElementById("deconnection").addEventListener('click', () => {   //Bouton déconnexion
        socket.emit('removeUserRequest', pseudo);
        window.location = "http://localhost:4269/destroy";
    });

    //A DEBUGUER !!!!!!!
    /* Multiple problème :
    -Fonctionne lorsque on recharge juste la page => il ne faudrait pas
    -Ne permet pas de charger le contenu de la page '/destroy' qui provoque la fermeture de la session => c'est pourtant ce qu'on veut
     */
    // window.addEventListener('beforeunload', () => {
    //     socket.emit('removeUserRequest', pseudo);
    //     socket.emit('destroyRequest');
    // })
    //A DEBUGUER !!!!!!!
})();

function addUserRow(pseudo, user, table) {      //Création d'une ligne pour un utilisateur connecté sur le serveur avec son nom et un bouton pour ouvrir un chat en direct avec lui
    let newRow = document.createElement("tr");
    table.appendChild(newRow);
    newRow.id = user.toString();

    let userCell = document.createElement("td");
    newRow.appendChild(userCell);
    userCell.appendChild(document.createTextNode(user));

    let linkCell = document.createElement("td");
    newRow.appendChild(linkCell);

    let linkChat = document.createElement("input");
    linkCell.appendChild(linkChat);
    linkChat.type = 'button';
    linkChat.value = 'discussion';

    let waitingMsg = document.createElement("td");
    newRow.appendChild(waitingMsg);
    waitingMsg.id = 'waitingMsg_' + user;
    waitingMsg.style.color = 'red';

    createTabChat(pseudo, user);

    linkChat.addEventListener('click', () => {      //Bouton pour ouvrir le chat avec l'utilisateur
        let mainDivChat = document.getElementById('mainChatBox');
        if (mainDivChat.hasChildNodes()) {
            let listChatBox = mainDivChat.childNodes;
            for (let i = 1; i < listChatBox.length; i++) {
                listChatBox[i].style.display = 'none';
            }
        }
        document.getElementById('chatBox_' + user).style.display = 'block';
        document.getElementById('waitingMsg_' + user).innerHTML = '';
    });
}

function createTabChat(localUser, corresponding) {      //Création d'une zone de chat entre l'utilisateur local (localUser) et un utilisateur connecté au serveur (corresponding)
    const socket = io.connect('http://localhost:4269');

    if (!document.getElementById('chatBox_' + corresponding)) {
        //main div
        let mainDivChat = document.getElementById('mainChatBox');

        let userChat = document.createElement("div");   //div du chat avec l'utilisateur 'user'
        mainDivChat.appendChild(userChat);
        userChat.id = 'chatBox_' + corresponding;
        userChat.className = 'chatBox';
        userChat.style.display = 'none';

        let divName = document.createElement("div");    //div pour afficher le nom de l'utilisateur
        userChat.appendChild(divName);
        divName.id = 'pseudoBox_' + corresponding;
        divName.appendChild(document.createTextNode('Vous parlez à ' + corresponding));
        divName.className = 'pseudoBox';

        let divMessage = document.createElement("div");    //div qui contient tous les messages
        userChat.appendChild(divMessage);
        divMessage.id = 'messageBox_' + corresponding;
        divMessage.className = 'messageBox';

        let formChat = document.createElement("form");      //formulaire pour l'enoive de message
        userChat.appendChild(formChat);
        formChat.className = 'chatForm';

        let inputText = document.createElement("input");    //input text
        formChat.appendChild(inputText);
        inputText.type = 'text';
        inputText.placeholder = 'Écrivez un message à ' + corresponding;
        inputText.className = 'newMessage';

        let inputSubmit = document.createElement("input");  //input submit
        formChat.appendChild(inputSubmit);
        inputSubmit.type = 'submit';
        inputSubmit.value = 'Envoyez';
        inputSubmit.className = 'submitMessage';

        formChat.addEventListener('submit', () => {
            event.preventDefault();
            let msg = inputText.value;
            if (msg.trim() !== '') {
                inputText.value = '';
                addMessage(msg, localUser, corresponding, returnColor());
                socket.emit('sendMessage', msg, localUser, corresponding, returnColor());
            }
        });
    }
}

function addMessage(msg, sender, corresponding, color) {    //Ajout d'un message dans la zone de chat
    let divAllMessage = document.getElementById('messageBox_' + corresponding); //Div qui contient tous les messages

    let divNewMessage = document.createElement("div");  //Nouvelle div pour le message qu'on ajoute
    divAllMessage.appendChild(divNewMessage);
    divNewMessage.className = 'message';
    divAllMessage.scrollTop = divAllMessage.scrollHeight - divAllMessage.clientHeight;

    let spanAuthor = document.createElement("span");    //Affichage de l'auteur du message
    spanAuthor.className = 'author';
    spanAuthor.style.color = color;
    spanAuthor.appendChild(document.createTextNode(sender + ' :'));

    divNewMessage.appendChild(spanAuthor);
    divNewMessage.appendChild(document.createTextNode(msg));
}