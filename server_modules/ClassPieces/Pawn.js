const Piece = require('./Piece');

class Pawn extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.firstMove = true;
        this.name = "Pawn";
    }

    //Si le pion a bougé, il ne peut plus avancer de deux cases
    moved() {
        this.firstMove = false;
    }

    //Se déplace case par case en avant
    getMoveList() {
        //Déplacement classique
        if (y < 7 /*&& case vide*/) {this.moveList += [this.x, this.y];}
        //Premier déplacement
        if (this.firstMove /*&& case vide*/) {this.moveList += [this.x, this.y + 2];}
        //Déplacements pour manger
        if (x > 0 && y < 7 /*&& pièce ennemie*/) {this.moveList += [this.x - 1, this.y + 1];}
        if (x < 7 && y < 7 /*&& pièce ennemie*/) {this.moveList += [this.x + 1, this.y + 1];}

        return this.moveList;
    }
}

module.exports = Pawn;