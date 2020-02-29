const Piece = require('./Piece');

class King extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.castling = true;
        this.check = false;
        this.name = "King";
    }

    //Si le roi a bougé, il ne peut plus roquer
    moved() {
        this.castling = false;
    }

    //Changement du statut du roi (switch entre échec ou non)
    check() {
        if (this.check) {this.check = false;} else {this.check = true;}
    }

    //Se déplace d'une case dans toute les directions s'il n'est pas en échec

    getMoveList() {
        //Remplacer les commentaires par les fonctions qui vérifient les conditions
        if (x < 7 && y < 7 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x + 1, this.y + 1];}
        if (y < 7 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x, this.y + 1];}
        if (x > 0 && y < 7 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x - 1, this.y + 1];}
        if (x > 0 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x - 1, this.y];}
        if (x > 0 && y > 0 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x - 1, this.y - 1];}
        if (y > 0 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x, this.y - 1];}
        if (x < 7 && y > 0 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x + 1, this.y - 1];}
        if (x < 7 /*&& pas de pièce alliée && pas en échec*/) {this.moveList += [this.x + 1, this.y];}

        return this.moveList;
    }
}

module.exports = King;