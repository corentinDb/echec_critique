const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');

class Bishop extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Bishop';
    }

    //Se déplace en diagonale
    getMoveList(board) {
        //Variable servant à arrêter l'ajout de case s'il y a une pièce sur le chemin
        let stop = false;
        let piece = new Piece;

        for (let i = this.getPosition().x + 1; i <= 7; i++) {
            for (let j = this.getPosition().y + 1; j <= 7; j++) {
                piece = board.getCase((i, j));

                //Si la case est vide
                if (!stop && piece === undefined) {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
                } 
                //Si c'est une pièce ennemie
                else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
                    stop = true;
                }
                //Si c'est une pièce alliée ou un roi
                else {
                    stop = true;
                }
            }
        }
        //Réinitialisation de la variable
        stop = false;

        for (let i = this.getPosition().x + 1; i >= 7; i++) {
            for (let j = this.getPosition().y - 1; j >= 0; j--) {
                if (!stop && piece === undefined) {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
                } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        stop = false;

        for (let i = this.getPosition().x - 1; i >= 0; i--) {
            for (let j = this.getPosition().y - 1; j >= 0; j--) {
                if (!stop && piece === undefined) {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
                } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        stop = false;

        for (let i = this.getPosition().x - 1; i >= 0; i--) {
            for (let j = this.getPosition().y + 1; j <= 7; j++) {
                if (!stop && piece === undefined) {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
                } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    this.moveList.push(new Move(this.getPosition(), new Point(i, j)));
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