const Piece = require('./Piece');

class Pawn extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.firstMove = true;
        this.name = 'Pawn';
    }

    //Si le pion a bougé, il ne peut plus avancer de deux cases
    moved() {
        this.firstMove = false;
    }

    //Se déplace case par case en avant
    getMoveList() {
        //Si le pion est blanc
        if (this.color === 'white') {
            //Déplacement classique
            if (this.y < 7 /*&& case vide*/) {this.moveList += [this.x, this.y + 1];}
            
            //Premier déplacement
            if (this.firstMove /*&& case vide*/) {this.moveList += [this.x, this.y + 2];}
            
            //Déplacements pour manger
            if (this.x > 0 && this.y < 7 /*&& pièce ennemie*/) {this.moveList += [this.x - 1, this.y + 1];}
            if (this.x < 7 && this.y < 7 /*&& pièce ennemie*/) {this.moveList += [this.x + 1, this.y + 1];}

        //S'il est noir
        } else if (this.color === 'black') {
            if (this.y < 7 /*&& case vide*/) {this.moveList += [this.x, this.y - 1];}
            
            if (this.firstMove /*&& case vide*/) {this.moveList += [this.x, this.y - 2];}
            
            if (this.x > 0 && this.y < 7 /*&& pièce ennemie*/) {this.moveList += [this.x - 1, this.y - 1];}
            if (this.x < 7 && this.y < 7 /*&& pièce ennemie*/) {this.moveList += [this.x + 1, this.y - 1];}

        } else {
            console.error('Bad color : unknown color');
        }

        return this.moveList;
    }
}

module.exports = Pawn;