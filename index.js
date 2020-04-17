const port = 4269;

const express = require('express');
const app = express();
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mysql = require('mysql');
const fs = require('fs');

const Board = require('./server_modules/Board');
const Point = require('./server_modules/Point');
const Rook = require('./server_modules/ClassPieces/Rook');
const Knight = require('./server_modules/ClassPieces/Knight');
const Bishop = require('./server_modules/ClassPieces/Bishop');
const Queen = require('./server_modules/ClassPieces/Queen');
const Move = require('./server_modules/Move');
const exceptionMod = require('./server_modules/exceptionModule');
const serverMod = require('./server_modules/serverMod');

app.set('views', __dirname + '/assets/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets/'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({secret: 'Error 418 I\'m a teapot !', cookie: {expires: new Date(Date.now() + 60 * 60 * 1000)}}));

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


app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/assets/views/error.html');
});


app.get('/', (req, res) => {      //Page principale du serveur = page de connexion
    if (req.session.connectionID) {
        res.render('loading', {pseudo: req.session.pseudo, userID: req.session.connectionID, existingConnection: true});
    } else {
        res.sendFile(__dirname + '/assets/views/connection.html');
    }
});

app.post('/', (req, res) => {     //Traitement des informations de connexion
    if (req.body.login !== undefined && req.body.password !== undefined) {  //On vérifie si les informations de connexion existe bien (condition normalement toujours vrai car vérifié avant l'envoie du formulaire mais au cas où on revérifie)
        con.query('SELECT * FROM connection', (error, responseSelect) => {
            let connectionSuccessful = false;
            let userID = 0;
            let pseudo = "";
            responseSelect.forEach((row) => {
                if (serverMod.hashPassword(req.body.password) === row['password'] && req.body.login === row['pseudo']) {  //On vérifie chaque couple pseudo/password enregistré en BDD par rapport à celui entré par l'utilisateur
                    userID = row['userID'];
                    pseudo = row['pseudo'];
                    connectionSuccessful = true;
                }
            });
            //Redirection en fonction des résultats de la tentative de connexion
            let existingConnection;
            req.session.connectionID ? existingConnection = true : existingConnection = false;

            if (connectionSuccessful) {
                res.render('loading', {pseudo: pseudo, userID: userID, existingConnection: existingConnection});
            } else {
                res.redirect('/?error=wrongLogin');
            }
        });
    } else {
        res.redirect('/?error=undefined');
    }
});


app.get('/registration', (req, res) => {      //Page de création de compte
    if (req.session.connectionID) {
        res.render('loading', {pseudo: req.session.pseudo, userID: req.session.connectionID, existingConnection: true});
    } else {
        res.sendFile(__dirname + '/assets/views/registration.html');
    }
});

app.post('/registration', (req, res) => {     //Traitement des informations de création de compte
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
                let data = [req.body.pseudo, serverMod.hashPassword(req.body.password), req.body.email];
                con.query('INSERT INTO connection (`pseudo`, `password`, `email`) VALUES (?)', [data], (error, resp) => {   //On ajoute l'utilisteur en base de donnée
                    if (error) throw error;
                    let pseudo = req.body.pseudo;
                    let userID = resp.insertId;

                    serverMod.resetMessage(pseudo);   //Ajout de l'utilisateur dans le fichier message.json

                    res.render('loading', {pseudo: pseudo, userID: userID, existingConnection: existingConnection});
                });
            } else {
                res.redirect('/registration?error=' + errorMsg);
            }
        });
    } else {
        res.redirect('/redirection?error=undefined');
    }
});


app.get('/menu', (req, res) => {      //Page du menu principal
    if (req.session.connectionID) {         //Si l'utilisateur est bien connecté
        res.render('loading', {pseudo: req.session.pseudo, userID: req.session.connectionID, existingConnection: true});    //On revérifie qu'il est bien connecté
    } else {
        res.redirect('/');
    }
});

app.post('/menu', (req, res) => {
    if (req.body.user !== undefined && req.body.userID !== undefined) {
        req.session.connectionID = req.body.userID;
        req.session.pseudo = req.body.user;
        res.render('menu', {pseudo: req.session.pseudo});
    }
});

app.get('/destroy', (req, res) => {       //Page de déconnexion
    let user = req.session.pseudo;
    if (user !== undefined && user !== null) {  //Si le pseudo n'est pas undefined ou null, pour éviter les bugs si l'utilisateur charge cette page sans être connecté
        req.session.destroy(function (err) {    //Suppression de la session
            serverMod.resetMessage(user);     //Suppression des messages de l'utilisateur 'user'
            res.redirect('/');
        });
    }
});

app.get('/game', (req, res) => {      //Si l'utilisateur charge la page /game directement dans l'url, on le revoit au menu
    res.redirect('/menu');
});

app.post('/game', (req, res) => {
    if (req.session.connectionID && req.body.opponent !== undefined && req.body.color !== undefined && req.body.gameID !== undefined) {         //Si l'utilisateur est bien connecté et que les paramètres existent
        res.render('game', {localPlayer: req.session.pseudo, opponent: req.body.opponent, color: req.body.color, gameID: req.body.gameID});
    } else {
        res.redirect('/');
    }
});


io.sockets.on('connection', (socket) => {

    socket.on('newUserRequest', (user) => {     //Quand un utilisateur se connecte, on prévient les autres
        socket.broadcast.emit('newUserRequest', user);
    });

    socket.on('getUserInfo', (pseudo) => {
        socket.join(pseudo);
        socket.broadcast.emit('getUserInfo', pseudo);
    });

    socket.on('giveUserInfo', (pseudo, user, inGame) => {     //On informe l'utilisateur 'user' que l'utilisateur 'pseudo' est déjà connecté au serveur
        io.to(user).emit('giveUserInfo', pseudo, inGame);
    });

    socket.on('removeUser', (user) => {  //Quand un utilisateur se déconnecte, on prévient les autres
        socket.broadcast.emit('removeUser', user);
    });

    socket.on('pingUser', (pseudo, user, inGame) => {       //Demande de ping par 'pseudo' vers 'user'
        socket.to(user).emit('pingRequest', pseudo, inGame);
    });

    socket.on('pongUser', (pseudo, user, inGame) => {       //Réponse au ping demandé par 'user' à 'pseudo'
        socket.to(user).emit('pongResponse', pseudo, inGame);
    });

    socket.on('close', (user) => {          //On demande aux l'utilisateurs 'user' (sauf celui qui fait la demande) de se déconnecter
        socket.broadcast.emit('close', user);
    });

    socket.on('timeOut', (user) => {
        io.to(user).emit('timeOut');
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
        socket.broadcast.emit('newUserResponse', user, true);
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
                socket.emit('giveMoveList', listGameInstance[id], exceptionMod.moveListWithCheck(listGameInstance[id], pointOrigin));
            }
        }
    });

    socket.on('moveRequest', (id, xOrigin, yOrigin, xDestination, yDestination) => {
        if (listGameInstance[id] !== undefined) {
            let origin = new Point(xOrigin, yOrigin);
            let destination = new Point(xDestination, yDestination);
            let newMove = new Move(origin, destination);
            let pointOrigin = listGameInstance[id].getCase(origin);
            let moveList = exceptionMod.moveListWithCheck(listGameInstance[id], pointOrigin);
            let inTheList = false;

            if (pointOrigin !== undefined) {
                for (let i = 0; i < moveList.length; i++) {
                    if (moveList[i].isEqual(newMove)) {
                        inTheList = true;
                    }
                }

                if (inTheList) {
                    let oldCase;
                    if (pointOrigin.name === 'Pawn') {
                        oldCase = listGameInstance[id].getCase(newMove.getDestination());
                    }
                    listGameInstance[id].move(newMove);
                    if (pointOrigin.name === 'King') {
                        let moveCastling;
                        if (xOrigin - xDestination === 2) {
                            moveCastling = new Move(new Point(0, yOrigin), new Point(3, yOrigin));
                        } else if (xOrigin - xDestination === -2) {
                            moveCastling = new Move(new Point(7, yOrigin), new Point(5, yOrigin));
                        }
                        if (moveCastling !== undefined) listGameInstance[id].move(moveCastling);
                    } else if (pointOrigin.name === 'Pawn' && xOrigin !== xDestination && oldCase === undefined) {
                        listGameInstance[id].destruct(new Point(xDestination, yOrigin));
                    }
                    listGameInstance[id].turn++;
                    listGameInstance[id].color === 'white' ? listGameInstance[id].color = 'black' : listGameInstance[id].color = 'white';
                    if (listGameInstance[id].getCase(destination).name === 'Pawn') {
                        if (exceptionMod.promotion(listGameInstance[id].getCase(destination))) {
                            io.to(id).emit('giveBoard', listGameInstance[id]);
                            setTimeout(function () {
                                socket.emit('promotion', listGameInstance[id], listGameInstance[id].getCase(destination));
                                socket.on('promotionResponse', (promoteResult) => {
                                    let color = promoteResult.color;
                                    switch (promoteResult.piece) {
                                        case 'Bishop':
                                            listGameInstance[id].insert(new Bishop(color, xDestination, yDestination), new Point(xDestination, yDestination));
                                            break;
                                        case 'Rook':
                                            listGameInstance[id].insert(new Rook(color, xDestination, yDestination), new Point(xDestination, yDestination));
                                            break;
                                        case 'Knight':
                                            listGameInstance[id].insert(new Knight(color, xDestination, yDestination), new Point(xDestination, yDestination));
                                            break;
                                        case 'Queen':
                                            listGameInstance[id].insert(new Queen(color, xDestination, yDestination), new Point(xDestination, yDestination));
                                            break;
                                        default:
                                            listGameInstance[id].insert(new Queen(color, xDestination, yDestination), new Point(xDestination, yDestination));
                                            break;
                                    }
                                });
                            }, 500);
                        }
                    }
                    if (exceptionMod.checkmate(listGameInstance[id])) {
                        io.to(id).emit('checkmate', listGameInstance[id]);
                    } else if (exceptionMod.pat(listGameInstance[id])) {
                        io.to(id).emit('pat', listGameInstance[id]);
                    } else {
                        io.to(id).emit('playTurn', listGameInstance[id]);
                    }
                }
            }
        }
    });

    socket.on('backMenu', (id, localPlayer, opponent) => {
        socket.to(id).emit('backMenu', opponent);
        io.emit('backInfo', localPlayer, opponent);
    });

});

server.listen(port);
console.log('Server Instantiated');
