const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');
const Board = require('./../Board');

class Rook extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Rook';
    }

    //Se déplace à l'horizontale et la verticale
    getMoveList(board) {
        //On reset la moveList de la pièce
        super.getMoveList();
        
        let piece = new Piece;
        let point = new Point;

        //On parcourt chaque ligne et colonne autour de la tour
        for (let i = this.getPosition().x - 1; i >= 0; i--) {
            //On récupère les coordonnées de la case dans un point
            point = new Point(i, this.getPosition().y);
            //On récupère la pièce sur la case
            piece = board.getCase(point);

            //Si la case est vide
            if (!piece) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), point));
            } 
            //Si c'est une pièce ennemie
            else if (piece.getColor() !== this.getColor()) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), point));
                //On sort de la boucle for
                break;
            } 
            //Si c'est une pièce alliée
            else {
                //On sort de la boucle for
                break;
            }
        }

        for (let i = this.getPosition().x + 1; i <= 7; i++) {
            point = new Point(i, this.getPosition().y);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                break;
            } else {
                break;
            }
        }

        for (let j = this.getPosition().y - 1; j >= 0; j--) {
            point = new Point(this.getPosition().x, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                break;
            } else {
                break;
            }
        }

        for (let j = this.getPosition().y + 1; j <= 7; j++) {
            point = new Point(this.getPosition().x, j);
            piece = board.getCase(point);
            
            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                break;
            } else {
                break;
            }
        }

        return this.moveList;
    }
}

module.exports = Rook;