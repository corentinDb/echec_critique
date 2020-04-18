const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');
const Board = require('./../Board');

class Bishop extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Bishop';
    }

    //Se déplace en diagonale
    getMoveList(board) {
        //On reset la moveList de la pièce
        super.getMoveList();

        let piece = new Piece;
        let point = new Point;

        //On parcourt chaque diagonale autour du fou
        let isEnd = false;
        let i = this.getPosition().x + 1;
        let j = this.getPosition().y + 1;
        while (!isEnd && j < 8 && i < 8) {
            //On récupère les coordonnées de la case sélectionnée dans le point
            point = new Point(i, j);
            //On récupère la pièce sur la case
            piece = board.getCase(point);

            //Si la case est vide
            if (!piece) {
                //On ajoute le mouvement dans moveList et on continue
                this.moveList.push(new Move(this.getPosition(), point));
            }
            //Si c'est un pièce ennemie
            else if (piece.getColor() !== this.getColor()) {
                //On ajoute le mouvement dans moveList
                this.moveList.push(new Move(this.getPosition(), point));
                //On sort de la boucle
                isEnd = true;
            }
            //Si c'est une pièce alliée
            else {
                //On sort de la boucle
                isEnd = true;
            }

            j++;
            i++;
        }

        isEnd = false;
        i = this.getPosition().x - 1;
        j = this.getPosition().y + 1;
        while (!isEnd && j < 8 && i >= 0) {
            point = new Point(i, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                break;
            } else {
                break;
            }


            j++;
            i--;
        }

        isEnd = false;
        i = this.getPosition().x + 1;
        j = this.getPosition().y - 1;
        while (!isEnd && j >= 0 && i < 8) {
            point = new Point(i, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                break;
            } else {
                break;
            }


            j--;
            i++;
        }

        isEnd = false;
        i = this.getPosition().x - 1;
        j = this.getPosition().y - 1;
        while (!isEnd && j >= 0 && i >= 0) {
            point = new Point(i, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                break;
            } else {
                break;
            }


            j--;
            i--;
        }

        return this.moveList;
    }
}

module.exports = Bishop;