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

const con = mysql.createConnection({    //Création de la connexion à la base de donnée
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


//Page d'erreur
app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/assets/views/error.html');
});


//Page principale du serveur = page de connexion
app.get('/', (req, res) => {
    if (req.session.connectionID) {
        res.render('loading', {pseudo: req.session.pseudo, userID: req.session.connectionID, existingConnection: true});
    } else {
        res.sendFile(__dirname + '/assets/views/connection.html');
    }
});

//Traitement des informations de connexion
app.post('/', (req, res) => {
    //On vérifie si les informations de connexion existe bien (condition normalement toujours vrai car vérifié avant l'envoie du formulaire mais au cas où on revérifie)
    if (req.body.login !== undefined && req.body.password !== undefined) {
        con.query('SELECT * FROM connection', (error, responseSelect) => {
            let connectionSuccessful = false;
            let userID = 0;
            let pseudo = "";
            responseSelect.forEach((row) => {
                //On vérifie chaque couple pseudo/password enregistré en BDD par rapport à celui entré par l'utilisateur
                if (serverMod.hashPassword(req.body.password) === row['password'] && req.body.login === row['pseudo']) {
                    userID = row['userID'];
                    pseudo = row['pseudo'];
                    connectionSuccessful = true;
                }
            });
            let existingConnection;
            req.session.connectionID ? existingConnection = true : existingConnection = false;

            //Si la connexion est réussite, on lance la page de chargement
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


//Page de création de compte
app.get('/registration', (req, res) => {
    //S'il est déjà connecté, on lance la page de chargement
    if (req.session.connectionID) {
        res.render('loading', {pseudo: req.session.pseudo, userID: req.session.connectionID, existingConnection: true});
    } else {
        res.sendFile(__dirname + '/assets/views/registration.html');
    }
});

//Traitement des informations de création de compte
app.post('/registration', (req, res) => {
    //On vérifie si les informations de connexion existe bien (condition normalement toujours vrai car vérifié avant l'envoie du formulaire mais on revérifie au cas où)
    if (req.body.pseudo !== undefined && req.body.password !== undefined && req.body.email !== undefined) {
        con.query('SELECT * FROM connection', (error, responseSelect) => {
            if (error) throw error;
            let validUser = true;
            let validMail = true;
            let errorMsg = '';

            //On vérifie qu'un utilistateur avec ce pseudo ou cet email n'existe pas déjà
            responseSelect.forEach((row) => {
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
                //On ajoute l'utilisteur en base de donnée
                con.query('INSERT INTO connection (`pseudo`, `password`, `email`) VALUES (?)', [data], (error, resp) => {
                    if (error) throw error;
                    let pseudo = req.body.pseudo;
                    let userID = resp.insertId;

                    serverMod.resetMessage(pseudo);   //Ajout de l'utilisateur dans le fichier message.json

                    res.render('loading', {pseudo: pseudo, userID: userID, existingConnection: false});
                });
            } else {
                res.redirect('/registration?error=' + errorMsg);
            }
        });
    } else {
        res.redirect('/redirection?error=undefined');
    }
});


app.get('/menu', (req, res) => {
    //Si l'utilisateur est bien connecté, on lance la page de chargement
    if (req.session.connectionID) {
        res.render('loading', {pseudo: req.session.pseudo, userID: req.session.connectionID, existingConnection: true});
    } else {
        res.redirect('/');
    }
});

//Si le chargement à réussi, on ouvre le menu
app.post('/loading', (req, res) => {
    if (req.body.user !== undefined) {
        req.session.connectionID = req.body.userID;
        req.session.pseudo = req.body.user;
        serverMod.resetMessage(req.session.pseudo);
        res.redirect(307, '/menu');
    }
});

//Page principale du menu
app.post('/menu', (req, res) => {
    if (req.session.connectionID) {
        res.render('menu', {localPlayer: req.session.pseudo});
    } else {
        res.redirect('/');
    }
});

//Si l'utilisateur charge la page /game directement dans l'url, on le revoit au menu
app.get('/game', (req, res) => {
    res.redirect('/menu');
});

app.post('/game', (req, res) => {       //Page du jeu
    //Si l'utilisateur est bien connecté et que les paramètres existent, on affiche la page de jeu
    if (req.session.connectionID && req.body.opponent !== undefined && req.body.color !== undefined && req.body.gameID !== undefined) {
        res.render('game', {localPlayer: req.session.pseudo, opponent: req.body.opponent, color: req.body.color, gameID: req.body.gameID});
    } else {
        res.redirect('/');
    }
});

//Page de déconnexion
app.get('/destroy', (req, res) => {
    let user = req.session.pseudo;
    //Si le pseudo n'est pas undefined ou null, pour éviter les bugs si l'utilisateur charge cette page sans être connecté
    if (user !== undefined && user !== null) {
        //Suppression de la session et des messages de l'utilisateur 'user'
        req.session.destroy(function () {
            serverMod.resetMessage(user);
            res.redirect('/');
        });
    }
});


io.sockets.on('connection', (socket) => {

    //Quand un utilisateur se connecte, on prévient les autres afin de vérifier si cet utilisateur n'est pas déjà connecté sur un autre navigateur
    socket.on('newUserRequest', (user) => {
        socket.broadcast.emit('newUserRequest', user);
    });

    //Demande des informations aux joueurs et ajout de l'utilisateur à la room à son nom
    socket.on('getUserInfo', (pseudo) => {
        socket.join(pseudo);
        socket.broadcast.emit('getUserInfo', pseudo);
    });

    //On ajoute l'utilisateur à la room pour le chat à son nom
    socket.on('joinChat', (user) => {
        socket.join('chat_' + user);
    });

    //On informe l'utilisateur 'user' que l'utilisateur 'pseudo' est déjà connecté au serveur
    socket.on('giveUserInfo', (pseudo, user, inGame) => {
        io.to(user).emit('giveUserInfo', pseudo, inGame);
    });

    //Quand un utilisateur se déconnecte, on prévient les autres
    socket.on('removeUser', (user) => {
        socket.broadcast.emit('removeUser', user);
    });

    //Demande de ping par 'pseudo' vers 'user'
    socket.on('pingUser', (pseudo, user, inGame) => {
        socket.to(user).emit('pingRequest', pseudo, inGame);
    });

    //Réponse au ping demandé par 'user' à 'pseudo'
    socket.on('pongUser', (pseudo, user, inGame) => {
        socket.to(user).emit('pongResponse', pseudo, inGame);
    });

    //On demande aux l'utilisateurs 'user' (sauf celui qui fait la demande) de se déconnecter
    socket.on('close', (user) => {
        socket.broadcast.emit('close', user);
    });

    //on prévient l'utilisateur qu'il a perdu la connexion
    socket.on('timeOut', (user) => {
        io.to(user).emit('timeOut');
    });


    //Quand un utilisateur envoie un message, on prévient les autres
    socket.on('sendMessage', (msg, sender, receiver) => {
        if (sender !== receiver) {
            //Enregistrement du message dans le fichier message.json
            fs.readFile('message.json', (err, data) => {
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
            socket.to('chat_' + receiver).emit('receiveMessage', msg, sender, receiver);
        }
    });

    //Envoie des messages enregistrés pour l'utilisateur 'user'
    socket.on('loadMessageRequest', (user) => {
        fs.readFile('message.json', (err, data) => {
            let jsonParsed = JSON.parse(data);
            let dataToSend = jsonParsed[user];
            socket.emit('loadMessageResponse', dataToSend);
        });
    });


    //Requête de 'sender' pour jouer avec 'receiver'
    socket.on('playRequestToServer', (sender, receiver) => {
        socket.to(receiver).emit('playRequestToClient', sender, receiver);
    });

    //Réponse de 'sender' à la requête de 'receiver'
    socket.on('playResponseToServer', (sender, receiver, response, color, id) => {
        if (response) listGameInstance[id] = new Board();
        socket.to(receiver).emit('playResponseToClient', sender, receiver, response, color, id);
    });


    //Ajout de l'utilisateur à la room de jeu et à la room de chat,
    socket.on('joinGame', (id, user) => {
        socket.join(id);
        socket.join(user);
        //Informe les autres utilisateurs qu'on est connecté
        socket.broadcast.emit('giveUserInfo', user, true);
    });

    //Information à l'adversaire qu'on se déconnecte
    socket.on('disconnectOpponent', (opponent) => {
        io.to(opponent).emit('disconnectUser');
    });

    //Information à l'adversaire qu'on abandonne
    socket.on('surrender', (opponent) => {
        io.to(opponent).emit('surrender');
    })

    //Envoie du board
    socket.on('getBoard', (id) => {
        socket.emit('giveBoard', listGameInstance[id]);
    });

    //Envoie de la liste des déplacements pour des coordonnées données
    socket.on('getMoveList', (id, xOrigin, yOrigin) => {
        if (listGameInstance[id] !== undefined) {
            let pointOrigin = listGameInstance[id].getCase(new Point(xOrigin, yOrigin));
            if (pointOrigin !== undefined) {
                socket.emit('giveMoveList', listGameInstance[id], exceptionMod.moveListWithCheck(listGameInstance[id], pointOrigin));
            }
        }
    });

    //Reçoie une demande de mouvement
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
                    //Vérification que le mouvement est bien dans la liste de mouvement de la pièce
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
                    //Si le roi bouge de 2 cases, il a fait un roque donc on bouge la tour également
                    if (pointOrigin.name === 'King') {
                        let moveCastling;
                        if (xOrigin - xDestination === 2) {
                            moveCastling = new Move(new Point(0, yOrigin), new Point(3, yOrigin));
                        } else if (xOrigin - xDestination === -2) {
                            moveCastling = new Move(new Point(7, yOrigin), new Point(5, yOrigin));
                        }
                        if (moveCastling !== undefined) listGameInstance[id].move(moveCastling);
                        //Si le piont a bougé en diagonale sans prendre de pièce, il a prit en passant donc on retire le pion pris
                    } else if (pointOrigin.name === 'Pawn' && xOrigin !== xDestination && oldCase === undefined) {
                        listGameInstance[id].destruct(new Point(xDestination, yOrigin));
                    }
                    //Ajout du tour et changement de couleur
                    listGameInstance[id].color === 'white' ? listGameInstance[id].color = 'black' : listGameInstance[id].color = 'white';
                    if (exceptionMod.promotion(listGameInstance[id].getCase(destination))) {        //Gestion de la promotion du pion
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
                                io.to(id).emit('resetMessage');
                                listGameInstance[id].turn++;
                                if (exceptionMod.checkmate(listGameInstance[id])) {     //Echec et mat
                                    io.to(id).emit('checkmate', listGameInstance[id]);
                                } else if (exceptionMod.pat(listGameInstance[id])) {    //Pat
                                    io.to(id).emit('pat', listGameInstance[id]);
                                } else if (exceptionMod.check(listGameInstance[id], null)) {     //Echec
                                    io.to(id).emit('check', listGameInstance[id]);
                                } else {
                                    io.to(id).emit('giveBoard', listGameInstance[id]);   //Tour suivant
                                }
                            });
                        }, 500);
                    } else {
                        io.to(id).emit('resetMessage');
                        listGameInstance[id].turn++;
                        if (exceptionMod.checkmate(listGameInstance[id])) {     //Echec et mat
                            io.to(id).emit('checkmate', listGameInstance[id]);
                        } else if (exceptionMod.pat(listGameInstance[id])) {    //Pat
                            io.to(id).emit('pat', listGameInstance[id]);
                        } else if (exceptionMod.check(listGameInstance[id], null)) {     //Echec
                            io.to(id).emit('check', listGameInstance[id]);
                        } else {
                            io.to(id).emit('giveBoard', listGameInstance[id]);   //Tour suivant
                        }
                    }
                }
            }
        }
    });
});

server.listen(port);
console.log('Server Instantiated');
