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
            console.log("JSON file has been saved.");
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

app.set('views', __dirname + '/assets/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets/'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({secret: 'Error 418 I\'m a teapot !', cookie: {maxAge: 60 * 60 * 1000}}));

let connectedUserList = [];

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
    if (req.session.connectionID) {
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
                let existingConenction = false;
                responseSelect.forEach((row) => {
                    if (hashPassword(req.body.password) === row['password'] && req.body.login === row['pseudo']) {  //On vérifie chaque couple pseudo/password enregistré en BDD par rapport à celui entré par l'utilisateur
                        if (!connectedUserList.some((user) => user === row['pseudo'])) {    //On vérifie que l'utilisateur est pas déjà connecté sur un autre ordinateur / navigateur
                            req.session.connectionID = row['userID'];
                            req.session.pseudo = row['pseudo'];
                            connectedUserList.push(row['pseudo']);
                            connectionSuccessful = true;
                        } else {
                            existingConenction = true;
                        }
                    }
                });
                //Redirection en fonction des résultats de la tentative de connexion
                if (connectionSuccessful) {
                    resetMessage(req.session.pseudo);   //Par précaution, on reset les messages
                    res.redirect('/menu');
                } else if (existingConenction) {
                    res.redirect('/?error=existing');
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
    if (req.session.connectionID) {     //Si l'utilisateur est déjà connecté on l'envoie directement sur le menu
        res.redirect('/menu');
    } else {
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
                        connectedUserList.push(req.body.pseudo);

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
    }
});


app.get('/menu', (req, res, next) => {      //Page du menu principal
    if (req.session.connectionID) {         //Si l'utilisateur est bien connecté
        res.render('menu', {pseudo: req.session.pseudo, userList: connectedUserList});
    } else {
        res.redirect('/');
    }
});


app.get('/destroy', (req, res, next) => {       //Page de déconnexion
    let user = req.session.pseudo;
    if (user !== undefined && user !== null) {  //Si le pseudo n'est pas undefined ou null, pour éviter les bugs si l'utilisateur charge cette page sans être connecté
        let index = connectedUserList.indexOf(user);
        connectedUserList.splice(index, 1);     //On retire le pseudo de la liste des utilisateurs
        req.session.destroy(function (err) {    //Suppression de la session
            resetMessage(user);     //Suppression des messages de l'utilisateur 'user'
            res.redirect('/');
        })
    }
});


io.sockets.on('connection', (socket) => {
    socket.on('newUserRequest', (user) => {     //Quand un utilisateur se connecte, on prévient les autres
        io.emit('newUserResponse', user);
    });

    socket.on('removeUserRequest', (user) => {  //Quand un utilisateur se déconnecte, on prévient les autres
        io.emit('removeUserResponse', user);
    });

    socket.on('sendMessage', (msg, sender, receiver) => {    //Quand un utilisateur envoie un message, on prévient les autres
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
                console.log("JSON file has been saved.");
            });
        });
        io.emit('receiveMessage', msg, sender, receiver);
    });

    socket.on('loadMessageRequest', (user) => {
        fs.readFile('message.json', (err, data) => {
            let jsonParsed = JSON.parse(data);
            let dataToSend = jsonParsed[user];
            socket.emit('loadMessageResponse', dataToSend);     //Envoie des messages enregistrés pour l'utilisateur 'user'
        });
    });
});

server.listen(port);
console.log('Server Instantiated');
