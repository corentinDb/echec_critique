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
        super.getMoveList();
        //Déclaration du point dans lequel on stockera les cordonnée d'une case
        let point = new Point;

        //Si la case ne sort pas de l'échiquier
        if (this.getPosition().x < 7 && this.getPosition().y < 7) {
            //On récupère les coordonnées de la case sélectionnée dans le point
            point.setPoint(this.getPosition().x + 1, this.getPosition().y + 1);
            //On récupère la pièce sur la case
            let piece = board.getCase(point);
            //Si la case est vide ou si la pièce est ennemie (sauf roi)
            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        //On recommence pour chacune des 7 autres possibilités
        if (this.getPosition().y < 7) {
            point.setPoint(this.getPosition().x, this.getPosition().y + 1);
            let piece = board.getCase(point);

            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x > 0 && this.getPosition().y < 7) {
            point.setPoint(this.getPosition().x - 1, this.getPosition().y + 1);
            let piece = board.getCase(point);

            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x > 0) {
            point.setPoint(this.getPosition().x - 1, this.getPosition().y);
            let piece = board.getCase(point);

            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x > 0 && this.getPosition().y > 0) {
            point.setPoint(this.getPosition().x - 1, this.getPosition().y - 1);
            let piece = board.getCase(point);

            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), ));
            }        
        }

        if (this.getPosition().y > 0) {
            point.setPoint(this.getPosition().x, this.getPosition().y - 1);
            let piece = board.getCase(point);

            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x < 7 && this.getPosition().y > 0) {
            point.setPoint(this.getPosition().x + 1, this.getPosition().y - 1);
            let piece = board.getCase(point);

            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        if (this.getPosition().x < 7) {
            point.setPoint(this.getPosition().x + 1, this.getPosition().y)
            let piece = board.getCase(point);

            if ((!piece || (piece.color !== this.color && piece.name !== 'King')) /*&& pas en échec*/) {
                this.moveList.push(new Move(this.getPosition(), point));
            }
        }

        return this.moveList;
    }


}

module.exports = King;