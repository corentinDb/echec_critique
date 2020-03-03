function hashPassword(msg) {    //Hashage avec salage
    let string1 = 'Okay, Houston, we\'ve had a problem here !';
    let string2 = 'On a un echec critique numéro ' + msg.length;
    return sha512(msg + string1 + string2).toUpperCase();
}

const port = 4269;

const express = require('express');
const app = express();
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mysql = require('mysql');
const sha512 = require('js-sha512');

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
        console.error('Error connecting to DataBase : \n' + err);
        return;
    } else {
        console.log('Connection to DataBase established');
    }
});

//TEMPORAIRE !!!
app.get('/p', (req, res, next) => {
    res.redirect('http://localhost/phpmyadmin');
});

app.get('/error', (req, res, next) => {
    res.send('Une erreur inconnue s\'est produite !<br>Merci de contacter un admin !');
});
//TEMPORAIRE !!!

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
                        req.session.connectionID = resp.insertId;
                        req.session.pseudo = req.body.pseudo;
                        connectedUserList.push(req.body.pseudo);
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
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html>\n' +     //Code html
            '<html lang="en">\n' +
            '<head>\n' +
            '<meta charset="UTF-8">\n' +
            '<title>Menu</title>\n' +
            '<link rel="stylesheet" type="text/css" href="../css/menu.css"/>\n' +
            '<link rel="stylesheet" type="text/css" href="../css/main.css"/>\n' +
            '</head>\n' +
            '<body>\n' +
            '    <div id="divUser">\n' +
            '        <input type="button" value="déconnexion" id="deconnection">\n' +
            '        <p id="pseudo">Votre peusdo : </p>\n' +
            '        <table>\n' +
            '            <thead>\n' +
            '            <tr><th>Autre utilisateur :</th></tr>\n' +
            '            </thead>\n' +
            '            <tbody id="tablePlayer">\n' +
            '            </tbody>\n' +
            '        </table>\n' +
            '    </div>\n' +
            '    <div id="mainChatBox">\n' +
            '    </div>\n' +
            '    <script src="/socket.io/socket.io.js"></script>\n' +
            '    <script>\n' +
            '        function returnPseudo() {\n' +     //Récupération du pseudo de l'utilisateur
            '            return \'' + req.session.pseudo + '\';\n' +
            '        }\n' +
            '        function returnListConnectedUser() {\n' +      //Récupération de la liste des utilisateurs connectés au serveur
            '            return \'' + connectedUserList + '\';\n' +
            '        }\n' +
            '        function returnColor() {\n' +      //Récupération d'un code couleur héxadécimal en fonction du pseudo
            '           return \'#' + sha512(req.session.pseudo).substring(0, 6) + '\'\n' +
            '        }\n' +
            '    </script>\n' +
            '    <script src="../js/menu.js"></script>\n' +
            '</body>\n' +
            '</html>'
        );
        res.end();
    } else {
        res.redirect('/');
    }
});


app.get('/destroy', (req, res, next) => {       //Page de déconnexion
    let index = connectedUserList.indexOf(req.session.pseudo);
    connectedUserList.splice(index, 1);     //On retire le pseudo de la liste des utilisateurs
    req.session.destroy(function (err) {    //Suppression de la session
        res.redirect('/');
    })
});


io.sockets.on('connection', (socket) => {
    socket.on('newUserRequest', (user) => {     //Quand un utilisateur se connecte, on prévient les autres
        io.emit('newUserResponse', user);
    });

    socket.on('removeUserRequest', (user) => {  //Quand un utilisateur se déconnecte, on prévient les autres
        io.emit('removeUserResponse', user);
    });

    socket.on('sendMessage', (msg, sender, receiver, color) => {    //Quand un utilisateur envoie un message, on prévient les autres
        io.emit('receiveMessage', msg, sender, receiver, color);
    });
});


server.listen(port);
console.log('Server Instantiated');
