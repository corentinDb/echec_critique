(function () {
    const socket = io.connect('http://localhost:4269');

    let userList = returnListConnectedUser();
    let pseudo = returnPseudo();
    const tempTab = userList.split(',');


    if (tempTab.some((user) => user === pseudo)) {  //Si le pseudo est bien dans la liste des utilisateurs connectées
        socket.emit('newUserRequest', pseudo);          //On prévient les autres users qu'on se connecte
    } else {
        window.location = '/error';
    }

    const tabUser = tempTab.filter(user => user !== pseudo);
    document.getElementById("pseudo").appendChild(document.createTextNode(pseudo));

    let table = document.getElementById("tablePlayer");
    tabUser.forEach((user) => {
        addUserRow(pseudo, user, table);
    });


    socket.on('newUserResponse', (user) => {
        if (!document.getElementById(user) && user !== pseudo) {
            addUserRow(pseudo, user, table);
        }
    });

    socket.on('removeUserResponse', (user) => {
        if (document.getElementById(user)) {
            if (user !== pseudo) {
                document.getElementById('mainChatBox').removeChild(document.getElementById('chatBox_' + user));
                table.removeChild(document.getElementById(user));
            }
        }
    });

    socket.on('receiveMessage', (msg, sender, receiver, color) => {
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

    document.getElementById("deconnection").addEventListener('click', () => {
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

function addUserRow(pseudo, user, table) {
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

    linkChat.addEventListener('click', () => {
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

function createTabChat(localUser, corresponding) {
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

function addMessage(msg, sender, corresponding, color) {
    let divAllMessage = document.getElementById('messageBox_' + corresponding); //Div qui contient tous les messages

    let divNewMessage = document.createElement("div");  //Nouvelle div pour le message qu'on ajoute
    divAllMessage.appendChild(divNewMessage);
    divNewMessage.className = 'message';
    divAllMessage.scrollTop = divAllMessage.scrollHeight - divAllMessage.clientHeight;

    let spanAuthor = document.createElement("span");
    spanAuthor.className = 'author';
    spanAuthor.style.color = color;
    spanAuthor.appendChild(document.createTextNode(sender + ' :'));

    divNewMessage.appendChild(spanAuthor);
    divNewMessage.appendChild(document.createTextNode(msg));
}