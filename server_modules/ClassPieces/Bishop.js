const Piece = require('./Piece');

class Bishop extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = "Bishop";
    }

    //Se déplace en diagonale
    getMoveList() {
        for (let i = this.x + 1; i <= 7; i++) {
            for (let j = this.y + 1; j <= 7; j++) {
                if ((i <= 7 && j <= 7) /*|| case vide || pièce ennemie*/) {
                    this.moveList += [i, j];
                }
            }
            for (let j = this.y - 1; j >= 0; j--) {
                if ((i <= 7 && j >= 0) /*|| case vide || pièce ennemie*/) {
                    this.moveList += [i, j];
                }
            }
        }
        for (let i = this.x - 1; i >= 0; i--) {
            for (let j = this.y - 1; j >= 0; j--) {
                if ((i >= 0 && j >= 0) /*|| case vide || pièce ennemie*/) {
                    this.moveList += [i, j];
                }
            }
            for (let j = this.y + 1; j <= 7; j++) {
                if ((i >= 0 && j <= 7) /*|| case vide || pièce ennemie*/) {
                    this.moveList += [i, j];
                }
            } 
        }

        return this.moveList;
    }
}

module.exports = Bishop;