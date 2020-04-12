const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');
const Board = require('./../Board');

class Pawn extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = 'Pawn';
    }

    //Se déplace case par case en avant
    getMoveList(board) {
        //On reset la moveList de la pièce
        super.getMoveList();

        let piece = new Piece;
        let piece2 = new Piece;
        let eat1 = new Piece;
        let eat2 = new Piece;

        //Si le pion est blanc
        if (this.getColor() === 'white') {
            //variables dans lesquelles on récupère les pièces aux position demandées

            //On récupère les cases devant le pion en vérifiant si chaque case est bien sur l'échiquier
            if (this.getPosition().y < 7) {
                piece = board.getCase(new Point(this.getPosition().x, this.getPosition().y + 1));
            }
            if (this.getPosition().y < 6) {
                piece2 = board.getCase(new Point(this.getPosition().x, this.getPosition().y + 2));
            }
            if (this.getPosition().x < 7 && this.getPosition().y < 7) {
                eat1 = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y + 1));
            } else {
                eat1 = undefined;
            }
            if (this.getPosition().x > 0 && this.getPosition().y < 7) {
                eat2 = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y + 1));
            } else {
                eat2 = undefined;
            }

            //Déplacement classique
            //Si la case devant le pion est vide
            if (!piece && this.getPosition().y < 7) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y + 1)));
            }

            //Premier déplacement
            //Si le pion n'a pas bougé et que les deux cases devant lui sont vides
            if (!this.hasMoved && !piece && !piece2) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y + 2)));
            }

            //Déplacements pour manger
            //S'il y a une pièce ennemie devant le pion en diagonale, on ajoute le mouvement à moveList
            if (eat1 && eat1.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), eat1.getPosition()));
            }
            if (eat2 && eat2.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), eat2.getPosition()));
            }
        }
        //S'il est noir, on décrémente y au lieu de l'incrémenter
        else if (this.getColor() === 'black') {
            if (this.getPosition().y > 0) {
                piece = board.getCase(new Point(this.getPosition().x, this.getPosition().y - 1));
            }
            if (this.getPosition().y > 1) {
                piece2 = board.getCase(new Point(this.getPosition().x, this.getPosition().y - 2));
            }
            if (this.getPosition().x < 7 && this.getPosition().y > 0) {
                eat1 = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y - 1));
            } else {
                eat1 = undefined;
            }
            if (this.getPosition().x > 0 && this.getPosition().y > 0) {
                eat2 = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y - 1));
            } else {
                eat2 = undefined;
            }

            if (!piece && this.getPosition().y > 0) {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y - 1)));
            }

            if (!this.hasMoved && !piece && !piece2) {
                this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y - 2)));
            }

            if (eat1 && eat1.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), eat1.getPosition()));
            }
            if (eat2 && eat2.getColor() !== this.getColor()) {
                this.moveList.push(new Move(this.getPosition(), eat2.getPosition()));
            }

        }
        //Sinon on renvoie une erreur
        else {
            console.error('Bad color : expected black or white, got ', this.getColor());
        }

        return this.moveList;
    }
}

module.exports = Pawn;