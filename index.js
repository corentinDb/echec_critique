function hashPassword(msg) {    //Hashage avec salage
    let string1 = 'Okay, Houston, we\'ve had a problem here !';
    let string2 = 'On a un echec critique numéro ' + msg.length;
    return sha512(msg + string1 + string2).toUpperCase();
}

function resetMessage(user) {   //Fonction qui peut ajouter un utilisateur au fichier message.json mais aussi supprimer les messages enregistrés pour l'utilisateur 'user'
    fs.readFile('message.json', (err, data) => {
        if (err) {
            console.log("An error occured while reading JSON File.");
            return console.log(err);
        }
        let jsonParsed = JSON.parse(data);
        jsonParsed[user] = {};
        for (let userList in jsonParsed) {
            if (userList !== user) {
                jsonParsed[user][userList] = [];
                jsonParsed[userList][user] = [];
            }
        }
        let jsonContent = JSON.stringify(jsonParsed);
        fs.writeFile('message.json', jsonContent, 'utf8', (err) => {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        });
    });
}

const port = 4269;

const express = require('express');
const app = express();
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mysql = require('mysql');
const sha512 = require('js-sha512');
const fs = require('fs');

const Board = require('./server_modules/Board');
const Point = require('./server_modules/Point');
const Move = require('./server_modules/Move');

app.set('views', __dirname + '/assets/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets/'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({secret: 'Error 418 I\'m a teapot !', cookie: {maxAge: 60 * 60 * 1000}}));

let listGameInstance = [];

const con = mysql.createConnection({    //Création de la base de donnée
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'echecritique'
});

con.connect((err) => {  //Connexion à la base de donnée
    if (err) {
        console.log('Error connecting to DataBase : \n' + err);
    } else {
        console.log('Connection to DataBase established');
    }
});


app.get('/error', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/error.html');
});


app.get('/', (req, res, next) => {      //Page principale du serveur = page de connexion
    if (req.query.error === 'existing') {
        // cookies.set('connect.sid', {expires: Date.now()});
        res.clearCookie("connect.sid");
        res.sendFile(__dirname + '/assets/views/connection.html');
    } else if (req.session.connectionID) {
        res.redirect('/menu');
    } else {
        res.sendFile(__dirname + '/assets/views/connection.html');
    }
});

app.post('/', (req, res, next) => {     //Traitement des informations de connexion
    if (req.session.connectionID) {     //Si l'utilisateur est déjà connecté on l'envoie directement sur le menu
        res.redirect('/menu');
    } else {
        if (req.body.login !== undefined && req.body.password !== undefined) {  //On vérifie si les informations de connexion existe bien (condition normalement toujours vrai car vérifié avant l'envoie du formulaire mais au cas où on revérifie)
            con.query('SELECT * FROM connection', (error, responseSelect) => {
                let connectionSuccessful = false;
                responseSelect.forEach((row) => {
                    if (hashPassword(req.body.password) === row['password'] && req.body.login === row['pseudo']) {  //On vérifie chaque couple pseudo/password enregistré en BDD par rapport à celui entré par l'utilisateur
                        req.session.connectionID = row['userID'];
                        req.session.pseudo = row['pseudo'];
                        connectionSuccessful = true;
                    }
                });
                //Redirection en fonction des résultats de la tentative de connexion
                if (connectionSuccessful) {
                    resetMessage(req.session.pseudo);   //Par précaution, on reset les messages
                    res.redirect('/menu');
                } else {
                    res.redirect('/?error=wrongLogin');
                }
            });
        } else {
            res.redirect('/?error=undefined');
        }
    }
});


app.get('/registration', (req, res, next) => {      //Page de création de compte
    if (req.session.connectionID) {
        res.redirect('/menu');
    } else {
        res.sendFile(__dirname + '/assets/views/registration.html');
    }
});

app.post('/registration', (req, res, next) => {     //Traitement des informations de création de compte
    if (req.body.pseudo !== undefined && req.body.password !== undefined && req.body.email !== undefined) {     //On vérifie si les informations de connexion existe bien (condition normalement toujours vrai car vérifié avant l'envoie du formulaire mais au cas où on revérifie)
        con.query('SELECT * FROM connection', (error, responseSelect) => {
            if (error) throw error;
            let validUser = true;
            let validMail = true;
            let errorMsg = '';

            responseSelect.forEach((row) => {       //On vérifie qu'un utilistateur avec ce pseudo ou cet email n'existe pas déjà
                if (row['pseudo'] === req.body.pseudo) {
                    validUser = false;
                    errorMsg = 'wrongPseudo';
                } else if (row['email'] === req.body.email) {
                    validMail = false;
                    errorMsg = 'wrongEmail';
                }
            });

            if (validUser && validMail) {
                let data = [req.body.pseudo, hashPassword(req.body.password), req.body.email];
                con.query('INSERT INTO connection (`pseudo`, `password`, `email`) VALUES (?)', [data], (error, resp) => {   //On ajoute l'utilisteur en base de donnée
                    if (error) throw error;
                    let pseudo = req.body.pseudo;
                    req.session.connectionID = resp.insertId;
                    req.session.pseudo = pseudo;

                    resetMessage(pseudo);   //Ajout de l'utilisateur dans le fichier message.json

                    res.redirect('/menu');
                });
            } else {
                res.redirect('/registration?error=' + errorMsg);
            }
        });
    } else {
        res.redirect('/redirection?error=undefined');
    }
});


app.get('/menu', (req, res, next) => {      //Page du menu principal
    if (req.session.connectionID) {         //Si l'utilisateur est bien connecté
        res.render('menu', {pseudo: req.session.pseudo});
    } else {
        res.redirect('/');
    }
});


app.get('/destroy', (req, res, next) => {       //Page de déconnexion
    let user = req.session.pseudo;
    if (user !== undefined && user !== null) {  //Si le pseudo n'est pas undefined ou null, pour éviter les bugs si l'utilisateur charge cette page sans être connecté
        req.session.destroy(function (err) {    //Suppression de la session
            if (req.query.doubleConnection !== true) {
                resetMessage(user);     //Suppression des messages de l'utilisateur 'user'
            }
            res.redirect('/');
        })
    }
});

app.get('/game', (req, res, next) => {      //Si l'utilisateur charge la page /game directement dans l'url, on le revoit au menu
    res.redirect('/menu');
});

app.post('/game', (req, res, next) => {
    if (req.session.connectionID) {         //Si l'utilisateur est bien connecté
        res.render('game', {localPlayer: req.session.pseudo, opponent: req.body.opponent, color: req.body.color, gameID: req.body.gameID});
    } else {
        res.redirect('/');
    }
});


io.sockets.on('connection', (socket) => {

    socket.on('newUserRequest', (user) => {     //Quand un utilisateur se connecte, on prévient les autres
        socket.join(user);
        socket.broadcast.emit('newUserResponse', user);
    });

    socket.on('giveConnectionInfo', (pseudo, user) => {     //On informe l'utilisateur 'user' que l'utilisateur 'pseudo' est déjà connecté au serveur
        io.to(user).emit('giveConnectionInfo', pseudo);
    });

    socket.on('removeUserRequest', (user) => {  //Quand un utilisateur se déconnecte, on prévient les autres
        socket.broadcast.emit('removeUserResponse', user);
    });

    socket.on('close', (user, id) => {          //On demande aux l'utilisateurs 'user' ayant un ID différent de 'id' de se déconnecter
        socket.broadcast.emit('close', user, id);
    });


    socket.on('sendMessage', (msg, sender, receiver) => {    //Quand un utilisateur envoie un message, on prévient les autres
        if (sender !== receiver) {
            fs.readFile('message.json', (err, data) => {    //Enregistrement du message dans le fichier message.json
                if (err) {
                    console.log("An error occured while reading JSON File.");
                    return console.log(err);
                }
                let jsonParsed = JSON.parse(data);
                let msgJson = {};
                msgJson['sender'] = sender;
                msgJson['msg'] = msg;
                jsonParsed[sender][receiver].push(msgJson);
                jsonParsed[receiver][sender].push(msgJson);
                let jsonContent = JSON.stringify(jsonParsed);
                fs.writeFile('message.json', jsonContent, 'utf8', (err) => {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                });
            });
            socket.broadcast.emit('receiveMessage', msg, sender, receiver);
        }
    });

    socket.on('loadMessageRequest', (user) => {
        fs.readFile('message.json', (err, data) => {
            let jsonParsed = JSON.parse(data);
            let dataToSend = jsonParsed[user];
            socket.emit('loadMessageResponse', dataToSend);     //Envoie des messages enregistrés pour l'utilisateur 'user'
        });
    });


    socket.on('playRequestToServer', (sender, receiver) => {
        socket.broadcast.emit('playRequestToClient', sender, receiver);
    });

    socket.on('playResponseToServer', (sender, receiver, response, color, id) => {
        socket.broadcast.emit('playResponseToClient', sender, receiver, response, color, id);
    });


    socket.on('joinGame', (id, user) => {
        socket.join(id);
        socket.join(user);
    });

    socket.on('startGame', (id) => {
        listGameInstance[id] = new Board();
        listGameInstance[id].color = 'white';
        io.to(id).emit('playTurn', listGameInstance[id]);
    });

    socket.on('getBoard', (id) => {
        socket.emit('giveBoard', listGameInstance[id]);
    });

    socket.on('getMoveList', (id, xOrigin, yOrigin) => {
        if (listGameInstance[id] !== undefined) {
            let pointOrigin = listGameInstance[id].getCase(new Point(xOrigin, yOrigin));
            if (pointOrigin !== undefined) {
                let moveList = pointOrigin.getMoveList(listGameInstance[id]);
                socket.emit('giveMoveList', listGameInstance[id], moveList);
            }
        }
    });

    socket.on('moveRequest', (id, xOrigin, yOrigin, xDestination, yDestination) => {
        if (listGameInstance[id] !== undefined) {
            let origin = new Point(xOrigin, yOrigin);
            let destination = new Point(xDestination, yDestination);
            let newMove = new Move(origin, destination);
            let pointOrigin = listGameInstance[id].getCase(origin);
            let moveList = pointOrigin.getMoveList(listGameInstance[id]);
            let inTheList = false;

            if (pointOrigin !== undefined) {
                for (let i = 0; i < moveList.length; i++) {
                    if (moveList[i].isEqual(newMove)) {
                        inTheList = true;
                    }
                }

                if (inTheList) {
                    listGameInstance[id].move(newMove);
                    listGameInstance[id].color === 'white' ? listGameInstance[id].color = 'black' : listGameInstance[id].color = 'white';
                    listGameInstance[id].turn++;
                    io.to(id).emit('playTurn', listGameInstance[id]);
                }
            }
        }
    });

    socket.on('backMenu', (id, localPlayer, opponent) => {
        socket.to(id).emit('backMenu', opponent);
        io.emit('backInfo', localPlayer, opponent);
    });

    socket.on('pingUser', (pseudo, user) => {       //Demande de ping par 'pseudo' vers 'user'
        socket.to(user).emit('pingRequest', pseudo);
    });

    socket.on('pongUser', (pseudo, user, inGame) => {       //Réponse au ping demandé par 'user' à 'pseudo'
        socket.to(user).emit('pongResponse', pseudo, inGame);
    })
});

server.listen(port);
console.log('Server Instantiated');
