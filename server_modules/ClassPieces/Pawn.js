const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');

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
            if (this.getPosition().y < 7 /*&& case vide*/) {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y + 1)));
            }

            //Premier déplacement
            if (this.firstMove /*&& case vide*/) {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y + 2)));
            }

            //Déplacements pour manger
            if (this.getPosition().x > 0 && this.getPosition().y < 7 /*&& pièce ennemie && pièce != roi*/) {this.moveList.push(this.getPosition().x - 1, this.getPosition().y + 1);}
            if (this.getPosition().x < 7 && this.getPosition().y < 7 /*&& pièce ennemie && pièce != roi*/) {this.moveList.push(this.getPosition().x + 1, this.getPosition().y + 1);}

        //S'il est noir
        } else if (this.color === 'black') {
            if (this.getPosition().y < 7 /*&& case vide*/) {
                this.moveList.push(this.getPosition().x, this.getPosition().y - 1);
            }
            
            if (this.firstMove /*&& case vide*/) {
                this.moveList.push(this.getPosition().x, this.getPosition().y - 2);
            }
            
            if (this.getPosition().x > 0 && this.getPosition().y < 7 /*&& pièce ennemie && pièce != roi*/) {
                this.moveList.push(this.getPosition().x - 1, this.getPosition().y - 1);
            }
            if (this.getPosition().x < 7 && this.getPosition().y < 7 /*&& pièce ennemie && pièce != roi*/) {
                this.moveList.push(this.getPosition().x + 1, this.getPosition().y - 1);
            }

        } else {
            console.error('Bad color : expected black or white, got ', this.color);
        }

        return this.moveList;
    }
}

module.exports = Pawn;