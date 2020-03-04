const Piece = require('./Piece');

class Rook extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.castling = true;
        this.name = "Rook";
    }

    moved() {
        castling = false;
    }

    //Se déplace à l'horizontale et la verticale
    getMoveList() {
        //Variable servant à arrêter l'ajout de case s'il y a une pièce sur le chemin
        let stop = false;

        for (let i = this.x - 1; i >= 0; i--) {
            if (!stop /*&& case vide*/) {
                this.moveList += [i, this.y];
            } else if (!stop /*&& pièce ennemie*/) {
                this.movelist += [i, this.y];
                stop = true;
            } else {
                stop = true;
            }
        }
        //Réinitialisation de la variable
        stop = false;

        for (let i = this.x + 1; i <= 7; i++) {
            if (!stop /*&& case vide*/) {
                this.moveList += [i, this.y];
            } else if (!stop /*&& pièce ennemie*/) {
                this.moveList += [i, this.y];
                stop = true;
            } else {
                stop= true;
            }
        }
        stop = false;

        for (let j = this.y - 1; j >= 0; j--) {
            if (!stop /*&& case vide*/) {
                this.moveList += [this.x, j];
            } else if (!stop /*&& pièce ennemie*/) {
                this.moveList += [this.x, j];
                stop = true;
            } else {
                stop = true;
            }
        }
        stop = false;

        for (let j = this.y + 1; j <= 7; j++) {
            if (!stop /*&& case vide*/) {
                this.moveList += [this.x, j];
            } else if (!stop /*&& pièce ennemie*/) {
                this.moveList += [this.x, j];
                stop = true;
            } else {
                stop = true;
            }
        }

        return this.moveList;
    }
}

module.exports = Rook;