function hashPassword(msg) {
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
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(session({secret: 'Error 418 I\'m a teapot !', cookie: {maxAge: 60 * 60 * 1000}}));

let connectedUserList = [];

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'echecritique'
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to DataBase : \n' + err);
        return;
    }
    console.log('Connection to DataBase established');
});

//TEMPORAIRE !!!
app.get('/p', (req, res, next) => {
    res.redirect('http://localhost/phpmyadmin');
});
//TEMPORAIRE !!!


app.get('/', (req, res, next) => {
    if (req.session.connectionID) {
        res.redirect('/menu');
    } else {
        res.sendFile(__dirname + '/assets/views/connection.html');
    }
});

app.post('/', (req, res, next) => {
    if (req.session.connectionID) {
        res.redirect('/menu');
    } else {
        if (req.body.login !== undefined && req.body.password !== undefined) {
            con.query('SELECT * FROM connection', (error, responseSelect) => {
                let connectionSuccessful = false;
                let existingConenction = false;
                responseSelect.forEach((row) => {
                    if (hashPassword(req.body.password) === row['password'] && (req.body.login === row['pseudo'] || req.body.login === row['email'])) {
                        if (!connectedUserList.some((user) => user === row['pseudo'])) {
                            req.session.connectionID = row['userID'];
                            req.session.pseudo = row['pseudo'];
                            connectedUserList.push(row['pseudo']);
                            connectionSuccessful = true;
                        } else {
                            existingConenction = true;
                        }
                    }
                });
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


app.get('/registration', (req, res, next) => {
    if (req.session.connectionID) {
        res.redirect('/menu');
    } else {
        res.sendFile(__dirname + '/assets/views/registration.html');
    }
});

app.post('/registration', (req, res, next) => {
    if (req.session.connectionID) {
        res.redirect('/menu');
    } else {
        if (req.body.pseudo !== undefined && req.body.password !== undefined && req.body.email !== undefined) {
            con.query('SELECT * FROM connection', (error, responseSelect) => {
                if (error) throw error;
                let validUser = true;
                let validMail = true;
                let errorMsg = '';

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
                    let data = [req.body.pseudo, hashPassword(req.body.password), req.body.email];
                    con.query('INSERT INTO connection (`pseudo`, `password`, `email`) VALUES (?)', [data], (error, resp) => {
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


app.get('/menu', (req, res, next) => {
    if (req.session.connectionID) {
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '<meta charset="UTF-8">\n' +
            '<title>Menu</title>\n' +
            '<link rel="stylesheet" type="text/css" href="../css/menu.css"/>\n' +
            '<link rel="stylesheet" type="text/css" href="../css/main.css"/>\n\n' +
            '</head>\n' +
            '<body id="mainContener">\n' +
            '<div id="divUser">' +
            '<input type="button" value="déconnexion" id="deconnection">\n' +
            '<p id="pseudo">Votre peusdo : </p>\n' +
            '<table id="tablePlayer">\n' +
            '<tr><td>Autre utilisateur :</td></tr>' +
            '</table>' +
            '</div>' +
            '</body>\n' +
            '<script src="/socket.io/socket.io.js"></script>\n' +
            '<script>function returnPseudo() {\n' +
            '    return \'' + req.session.pseudo + '\';\n' +
            '}\n' +
            'function returnListConnectedUser() {\n' +
            '    return \'' + connectedUserList + '\';\n' +
            '}</script>\n' +
            '<script src="../js/menu.js"></script>\n' +
            '</html>'
        );
        res.end();
    } else {
        res.redirect('/');
    }
});


app.get('/destroy', (req, res, next) => {
    let index = connectedUserList.indexOf(req.session.pseudo);
    connectedUserList.splice(index, 1);
    req.session.destroy(function (err) {
        res.redirect('/');
    })
});


io.sockets.on('connection', (socket) => {
    socket.on('newUserRequest', (user) => {
        io.emit('newUserResponse', user);
    });

    socket.on('removeUserRequest', (user) => {
        io.emit('removeUserResponse', user);
    });
});


server.listen(port);
console.log('Server Instantiated');
