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
        super.getMoveList();
        //Variable servant à arrêter l'ajout de case s'il y a une pièce sur le chemin
        let stop = false;
        let piece = new Piece;
        let point = new Point;

        //On parcourt chaque diagonale autour du fou
        for (let i = this.getPosition().x + 1; i <= 7; i++) {
            for (let j = this.getPosition().y + 1; j <= 7; j++) {
                //On récupère les coordonnées de la case dans un point
                point.setPoint(i, j);
                //On récupère la pièce sur la case
                piece = board.getCase(point);

                //Si la case est vide
                if (!stop && piece === undefined) {
                    //On ajoute le mouvement à moveList et on continue
                    this.moveList.push(new Move(this.getPosition(), point));
                } 
                //Si c'est une pièce ennemie (sauf roi)
                else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    //On ajoute le mouvement à moveList
                    this.moveList.push(new Move(this.getPosition(), point));
                    //On arrête d'ajouter des mouvements sur cette diagonale
                    stop = true;
                }
                //Si c'est une pièce alliée ou un roi
                else {
                    //On arrête d'ajouter des mouvements sur cette diagonale
                    stop = true;
                }
            }
        }
        //Réinitialisation de la variable
        stop = false;

        for (let i = this.getPosition().x + 1; i >= 7; i++) {
            for (let j = this.getPosition().y - 1; j >= 0; j--) {
                point.setPoint(i, j);
                piece = board.getCase(point);

                if (!stop && piece === undefined) {
                    this.moveList.push(new Move(this.getPosition(), point));
                } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    this.moveList.push(new Move(this.getPosition(), point));
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        stop = false;

        for (let i = this.getPosition().x - 1; i >= 0; i--) {
            for (let j = this.getPosition().y - 1; j >= 0; j--) {
                point.setPoint(i, j);
                piece = board.getCase(point);

                if (!stop && piece === undefined) {
                    this.moveList.push(new Move(this.getPosition(), point));
                } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    this.moveList.push(new Move(this.getPosition(), point));
                    stop = true;
                } else {
                    stop = true;
                }
            }
        }
        stop = false;

        for (let i = this.getPosition().x - 1; i >= 0; i--) {
            for (let j = this.getPosition().y + 1; j <= 7; j++) {
                point.setPoint(i, j);
                piece = board.getCase(point);

                if (!stop && piece === undefined) {
                    this.moveList.push(new Move(this.getPosition(), point));
                } else if (!stop && piece.color !== this.color && piece.name !== 'King') {
                    this.moveList.push(new Move(this.getPosition(), point));
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