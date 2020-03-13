const Piece = require('./Piece');

class Knight extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Knight';
    }

    getMoveList () {
        //Remplacer les commentaires par la fonction qui vérifie si une case est vide
        if (this.x < 7 && this.y < 6 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x + 1, this.y + 2];}
        if (this.x > 0 && this.y < 6 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x - 1, this.y + 2];}
        if (this.x > 1 && this.y < 7 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x - 2, this.y + 1];}
        if (this.x > 1 && this.y > 0 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x - 2, this.y - 1];}
        if (this.x < 6 && this.y < 7 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x + 2, this.y + 1];}
        if (this.x < 6 && this.y > 0 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x + 2, this.y - 1];}
        if (this.x < 7 && this.y > 1 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x + 1, this.y - 2];}
        if (this.x > 0 && this.y > 1 /*&& (case vide || pièce ennemie)*/) {this.moveList += [this.x - 1, this.y - 2];}

        return this.moveList;
    }
}

module.exports = Knight;