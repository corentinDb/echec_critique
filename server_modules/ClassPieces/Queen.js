const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');
const Board = require('./../Board');

class Queen extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Queen';
    }

    //Se déplace dans toutes les directions
    getMoveList(board) {
        //On reset la moveList de la pièce
        super.getMoveList();

        let point = new Point;
        let piece = new Piece;

        //On utilise les mouvements de la tour
        //On parcourt chaque ligne et colonne autour de la reine 
        let isEnd = false;
        let i = this.getPosition().x - 1;
        while (!isEnd && i >= 0) {
            //On récupère les coorodonnées de la case dans un point
            point = new Point(i, this.getPosition().y);
            //On récupère la pièce sur la case
            piece = board.getCase(point);

            //Si la case est vide
            if (!piece) {
                //On ajoute le mouvement dans moveList et on continue
                this.moveList.push(new Move(this.getPosition(), point));
            }
            //Si c'est une pièce ennemie
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
            i--;
        }

        isEnd = false;
        i = this.getPosition().x + 1;
        while (!isEnd && i < 8) {

            point = new Point(i, this.getPosition().y);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                isEnd = true;
            } else {
                isEnd = true;
            }
            i++;
        }

        isEnd = false;
        i = this.getPosition().y - 1;
        while (!isEnd && i >= 0) {
            point = new Point(this.getPosition().x, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                isEnd = true;
            } else {
                isEnd = true;
            }
            i--;
        }

        isEnd = false;
        i = this.getPosition().y + 1;
        while (!isEnd && i < 8) {
            point = new Point(this.getPosition().x, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                isEnd = true;
            } else {
                isEnd = true;
            }
            i++;
        }

        //On utilise les mouvements du fou
        //On parcourt chaque diagonale autour de la reine
        isEnd = false;
        i = this.getPosition().x + 1;
        let j = this.getPosition().y + 1;
        while (!isEnd && i < 8 && j < 8) {
            //On récupère les coordonnées de la case sélectionnée dans le point
            point = new Point(i, j);
            //On récupère la pièce sur la case
            piece = board.getCase(point);

            //Si la case est vide
            if (!piece) {
                //On ajoute le mouvement à moveList et on continue
                this.moveList.push(new Move(this.getPosition(), point));
            }
            //Si c'est un pièce ennemie 
            else if (piece.getColor() !== this.getColor()) {
                //On ajoute le mouvement
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

        i = this.getPosition().x - 1;
        j = this.getPosition().y + 1;
        while (!isEnd && i >= 0 && j < 8) {
            point = new Point(i, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                isEnd = true;
            } else {
                isEnd = true;
            }

            j++;
            i--;
        }

        i = this.getPosition().x + 1;
        j = this.getPosition().y - 1;
        while (!isEnd && i < 8 && j >= 0) {
            point = new Point(i, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                isEnd = true;
            } else {
                isEnd = true;
            }

            j--;
            i++;
        }

        i = this.getPosition().x - 1;
        j = this.getPosition().y - 1;
        while (!isEnd && i >= 0 && j >= 0) {
            point = new Point(i, j);
            piece = board.getCase(point);

            if (!piece) {
                this.moveList.push(new Move(this.getPosition(), point));
            } else if (piece.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), point));
                isEnd = true;
            } else {
                isEnd = true;
            }

            j--;
            i--;
        }

        return this.moveList;
    }
}

module.exports = Queen;