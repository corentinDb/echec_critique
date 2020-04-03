const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');

class Knight extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Knight';
    }

    getMoveList(board) {
        //Remplacer les commentaires par la fonction qui vérifie si une case est vide
        if (this.getPosition().x < 7 && this.getPosition().y < 6 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x + 1, this.getPosition().y + 2)));
        }
        if (this.getPosition().x > 0 && this.getPosition().y < 6 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x - 1, this.getPosition().y + 2)));
        }
        if (this.getPosition().x > 1 && this.getPosition().y < 7 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x - 2, this.getPosition().y + 1)));
        }
        if (this.getPosition().x > 1 && this.getPosition().y > 0 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x - 2, this.getPosition().y - 1)));
        }
        if (this.getPosition().x < 6 && this.getPosition().y < 7 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x + 2, this.getPosition().y + 1)));
        }
        if (this.getPosition().x < 6 && this.getPosition().y > 0 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x + 2, this.getPosition().y - 1)));
        }
        if (this.getPosition().x < 7 && this.getPosition().y > 1 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x + 1, this.getPosition().y - 2)));
        }
        if (this.getPosition().x > 0 && this.getPosition().y > 1 /*&& (case vide || (pièce ennemie && pièce != roi))*/) {
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x - 1, this.getPosition().y - 2)));
        }

        return this.moveList;
    }
}

module.exports = Knight;