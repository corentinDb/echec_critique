const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');

class Queen extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Queen';
    }

    //Se déplace dans toutes les directions
    getMoveList() {
        //Variable servant à arrêter l'ajout de case s'il y a une pièce sur le chemin
        let stop = false;

        //Déplacement de la tour
        for (let i = this.x - 1; i >= 0; i--) {
            if (!stop /*&& case vide*/) {
                this.moveList += [i, this.y];
            } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
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
            } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
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
            } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
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
            } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
                this.moveList += [this.x, j];
                stop = true;
            } else {
                stop = true;
            }
        }
        stop = false;

        //Déplacement du fou
        for (let i = this.x + 1; i <= 7; i++) {
            for (let j = this.y + 1; j <= 7; j++) {
                if (!stop /*&& case vide*/) {
                    this.moveList += [i, j];
                } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
                    this.moveList += [i, j];
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        stop = false;

        for (let i = this.x + 1; i >= 7; i++) { 
            for (let j = this.y - 1; j >= 0; j--) {
                if (!stop /*&& case vide*/) {
                    this.moveList += [i, j];
                } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
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
                } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
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
                } else if (!stop /*&& pièce ennemie && pièce != roi*/) {
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

module.exports = Queen;