const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');
const Board = require('./../Board');

class Knight extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Knight';
    }

    getMoveList(board) {
        //Si la case ne sort pas de l'échiquier
        if (this.getPosition().x < 7 && this.getPosition().y < 6) {
            //On récupère la pièce sur la case
            let piece = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y + 2));
            //Si la case est vide ou la pièce ennemie (sauf roi)
            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }
        //On recommence pour les 7 autres possibilités de déplacement du cheval
        if (this.getPosition().x > 0 && this.getPosition().y < 6) {
            let piece = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y + 2));
            
            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x > 1 && this.getPosition().y < 7) {
            let piece = board.getCase(new Point(this.getPosition().x - 2, this.getPosition().y + 1));
            
            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x > 1 && this.getPosition().y > 0) {
            let piece = board.getCase(new Point(this.getPosition().x - 2, this.getPosition().y - 1));
            
            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x < 6 && this.getPosition().y < 7) {
            let piece = board.getCase(new Point(this.getPosition().x + 2, this.getPosition().y + 1));

            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x < 6 && this.getPosition().y > 0) {
            let piece = board.getCase(new Point(this.getPosition().x + 2, this.getPosition().y - 1));

            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x < 7 && this.getPosition().y > 1) {
            let piece = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y - 2));

            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }

        if (this.getPosition().x > 0 && this.getPosition().y > 1) {
            let piece = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y - 2));

            if (piece === undefined || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }
        }   

        return this.moveList;
    }
}

module.exports = Knight;