const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');

class Bishop extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Bishop';
    }

    //Se déplace en diagonale
    getMoveList() {
        //Variable servant à arrêter l'ajout de case s'il y a une pièce sur le chemin
        let stop = false;

        for (let i = this.x + 1; i <= 7; i++) {
            for (let j = this.y + 1; j <= 7; j++) {
                if (!stop /*&& case vide sauf roi*/) {
                    this.moveList += [i, j];
                } else if (!stop /*&& pièce ennemie sauf roi*/) {
                    this.moveList += [i, j];
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        //Réinitialisation de la variable
        stop = false;

        for (let i = this.x + 1; i >= 7; i++) { 
            for (let j = this.y - 1; j >= 0; j--) {
                if (!stop /*&& case vide*/) {
                    this.moveList += [i, j];
                } else if (!stop /*&& pièce ennemie sauf roi*/) {
                    this.moveList += [i, j];
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        stop = false;

        for (let i = this.x - 1; i >= 0; i--) {
            for (let j = this.y - 1; j >= 0; j--) {
                if (!stop /*&& case vide*/) {
                    this.moveList += [i, j];
                } else if (!stop /*&& pièce ennemie sauf roi*/) {
                    this.moveList += [i, j];
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        stop = false;

        for (let i = this.x - 1; i >= 0; i--) {
            for (let j = this.y + 1; j <= 7; j++) {
                if (!stop /*&& case vide*/) {
                    this.moveList += [i, j];
                } else if (!stop /*&& pièce ennemie sauf roi*/) {
                    this.moveList += [i, j];
                    stop = true;
                } else {
                    stop = true;
                }
            } 
        }

        return this.moveList;
    }
}

module.exports = Bishop;