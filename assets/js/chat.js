let chatMod = (function () {
    const socket = io.connect('http://localhost:4269');
    const pseudo = document.getElementById('localPlayer').innerHTML;

    socket.on('receiveMessage', (msg, sender, receiver) => {     //Quand l'utilisateur reçoit un message, on l'affiche dans la zone de chat correspondant à l'expéditeur
        if (receiver === pseudo) {
            chatMod.addMessage(msg, sender, sender);
            if (document.getElementById('chatBox_' + sender).style.display === 'none') {
                let waitingMsg = document.getElementById('waitingMsg_' + sender);
                let oldCount = Number(waitingMsg.innerHTML);
                waitingMsg.innerHTML = '';
                waitingMsg.appendChild(document.createTextNode((oldCount + 1).toString()));
            }
        }
    });

    return {
        joinChat(pseudo) {
            socket.emit('joinChat', pseudo);
        },
        createTabChat(localUser, corresponding) {      //Création d'une zone de chat entre l'utilisateur local (localUser) et un utilisateur connecté au serveur (corresponding)

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

                formChat.addEventListener('submit', (e) => {    //Envoie le message
                    e.preventDefault();
                    let msg = inputText.value;
                    if (msg.trim() !== '') {
                        inputText.value = '';
                        chatMod.addMessage(msg, localUser, corresponding);
                        socket.emit('sendMessage', msg, localUser, corresponding);
                    }
                });

                //Ajout des messages déjà existant dans la session
                socket.emit('loadMessageRequest', localUser);

                socket.on('loadMessageResponse', (data) => {
                    if (data[corresponding] !== undefined) {     //Si il y a bien des messages enregistré entre l'utilisateur local et le correspondant, on les affiche
                        data[corresponding].forEach((elem) => {
                            chatMod.addMessage(elem['msg'], elem['sender'], corresponding);
                        });
                    }
                });
            }
        },
        addMessage(msg, sender, corresponding) {    //Ajout d'un message dans la zone de chat
            let divAllMessage = document.getElementById('messageBox_' + corresponding); //Div qui contient tous les messages

            let divNewMessage = document.createElement("div");  //Nouvelle div pour le message qu'on ajoute
            divAllMessage.appendChild(divNewMessage);
            divNewMessage.className = 'message';
            divAllMessage.scrollTop = divAllMessage.scrollHeight - divAllMessage.clientHeight;

            let spanAuthor = document.createElement("span");    //Affichage de l'auteur du message
            spanAuthor.className = 'author';
            spanAuthor.appendChild(document.createTextNode(sender + ' :'));

            divNewMessage.appendChild(spanAuthor);
            divNewMessage.appendChild(document.createTextNode(msg));
        }
    }
})();