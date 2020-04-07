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
        //Déclaration du point dans lequel on stockera les cordonnée d'une case
        let point = new Point;

        //Si la case ne sort pas de l'échiquier
        if (this.getPosition().x < 7 && this.getPosition().y < 6) {
            //On récupère les coordonnées de la case sélectionnée dans le point
            point.set(this.getPosition().x + 1, this.getPosition().y + 2);
            //On récupère la pièce sur la case
            let piece = board.getCase(point);
            //Si la case est vide ou la pièce ennemie (sauf roi)
            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }
        //On recommence pour les 7 autres possibilités de déplacement du cheval
        if (this.getPosition().x > 0 && this.getPosition().y < 6) {
            point.setPoint(this.getPosition().x - 1, this.getPosition().y + 2);
            let piece = board.getCase(point);
            
            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x > 1 && this.getPosition().y < 7) {
            point.setPoint(this.getPosition().x - 2, this.getPosition().y + 1);
            let piece = board.getCase(point);
            
            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x > 1 && this.getPosition().y > 0) {
            point.setPoint(this.getPosition().x - 2, this.getPosition().y - 1);
            let piece = board.getCase(point);
            
            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x < 6 && this.getPosition().y < 7) {
            point.setPoint(this.getPosition().x + 2, this.getPosition().y + 1);
            let piece = board.getCase(point);

            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x < 6 && this.getPosition().y > 0) {
            point.setPoint(this.getPosition().x + 2, this.getPosition().y - 1);
            let piece = board.getCase(point);

            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x < 7 && this.getPosition().y > 1) {
            point.setPoint(this.getPosition().x + 1, this.getPosition().y - 2);
            let piece = board.getCase(point);

            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x > 0 && this.getPosition().y > 1) {
            point.setPoint(this.getPosition().x - 1, this.getPosition().y - 2)
            let piece = board.getCase(point);

            if (!piece || (piece.color !== this.color && piece.name !== 'King')) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }   

        return this.moveList;
    }
}

module.exports = Knight;