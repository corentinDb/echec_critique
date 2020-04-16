const sha512 = require('js-sha512');
const fs = require('fs');
const exceptionMod = require('./exceptionModule');
const Move = require('./Move');
module.exports = {
    hashPassword(msg) {    //Hashage avec salage
        let string1 = 'Okay, Houston, we\'ve had a problem here !';
        let string2 = 'On a un echec critique numéro ' + msg.length;
        return sha512(msg + string1 + string2).toUpperCase();
    },
    resetMessage(user) {   //Fonction qui peut ajouter un utilisateur au fichier message.json mais aussi supprimer les messages enregistrés pour l'utilisateur 'user'
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
};