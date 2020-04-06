const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');
const Board = require('./../Board');

class King extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.check = false;
        this.name = 'King';
    }

    //Changement du statut du roi (switch entre échec ou non)
    setCheck() {
        this.check = !this.check;
    }

    getCheck() {
        return this.check;
    }

    //Se déplace d'une case dans toute les directions s'il n'est pas en échec
    getMoveList(board) {
        //Si la case ne sort pas de l'échiquier
        if (this.getPosition().x < 7 && this.getPosition().y < 7) {
            //On récupère la pièce sur la case
            piece = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y + 1));
            //Si la case est vide ou si la pièce est ennemie (sauf roi)
            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().y < 7) {
            piece = board.getCase(new Point(this.getPosition().x, this.getPosition().y + 1));

            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x > 0 && this.getPosition().y < 7) {
            piece = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y + 1));

            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x > 0) {
            piece = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y));

            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x > 0 && this.getPosition().y > 0) {
            piece = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y - 1));

            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), ));
            }        
        }

        if (this.getPosition().y > 0) {
            piece = board.getCase(new Point(this.getPosition().x, this.getPosition().y - 1));

            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x < 7 && this.getPosition().y > 0) {
            piece = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y - 1));

            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x < 7) {
            piece = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y));

            if ((piece === undefined || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        return this.moveList;
    }


}

module.exports = King;