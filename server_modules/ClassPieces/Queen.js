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
        for (let i = this.getPosition().x - 1; i >= 0; i--) {
            if (!stop && piece === undefined) {
                this.moveList.push(new Move(this.getPosition(), new Point(i, this.getPosition().y)));
            } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                this.moveList.push(new Move(this.getPosition(), new Point(i, this.getPosition().y)));
                stop = true;
            } else {
                stop = true;
            }
        }
        //Réinitialisation de la variable
        stop = false;

        for (let i = this.getPosition().x + 1; i <= 7; i++) {
            if (!stop && piece === undefined) {
                this.moveList.push(new Move(this.getPosition(), new Point(i, this.getPosition().y)));
            } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                this.moveList.push(new Move(this.getPosition(), new Point(i, this.getPosition().y)));
                stop = true;
            } else {
                stop = true;
            }
        }
        stop = false;

        for (let j = this.getPosition().y - 1; j >= 0; j--) {
            if (!stop && piece === undefined) {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, j)));
            } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, j)));
                stop = true;
            } else {
                stop = true;
            }
        }
        stop = false;

        for (let j = this.getPosition().y + 1; j <= 7; j++) {
            if (!stop && piece === undefined) {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, j)));
            } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, j)));
                stop = true;
            } else {
                stop = true;
            }
        }
        stop = false;

        //Déplacement du fou
        for (let i = this.getPosition().x + 1; i <= 7; i++) {
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

module.exports = Queen;