const Piece = require('./Piece');

class Knight extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = "Knight";
    }

    getMoveList () {
        //Remplacer les commentaires par la fonction qui vérifie si une case est vide
        if (x < 7 && y < 6 /*&& pas de pièce alliée*/) {this.moveList += [this.x + 1, this.y + 2];}
        if (x > 0 && y < 6 /*&& pas de pièce alliée*/) {this.moveList += [this.x - 1, this.y + 2];}
        if (x > 1 && y < 7 /*&& pas de pièce alliée*/) {this.moveList += [this.x - 2, this.y + 1];}
        if (x > 1 && y > 0 /*&& pas de pièce alliée*/) {this.moveList += [this.x - 2, this.y - 1];}
        if (x < 6 && y < 7 /*&& pas de pièce alliée*/) {this.moveList += [this.x + 2, this.y + 1];}
        if (x < 6 && y > 0 /*&& pas de pièce alliée*/) {this.moveList += [this.x + 2, this.y - 1];}
        if (x < 7 && y > 1 /*&& pas de pièce alliée*/) {this.moveList += [this.x + 1, this.y - 2];}
        if (x > 0 && y > 1 /*&& pas de pièce alliée*/) {this.moveList += [this.x - 1, this.y - 2];}

        return this.moveList;
    }
}

module.exports = Knight;