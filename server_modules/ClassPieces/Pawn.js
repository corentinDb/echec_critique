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
        //Si le pion est blanc
        if (this.color === 'white') {

            //variables
            let piece;
            let piece2;
            let eat1;
            let eat2;

            //On récupère les cases devant le pion
            if (this.getPosition().y < 7) {piece = board.getCase(new Point(this.getPosition().x, this.getPosition().y + 1));}
            if (this.getPosition().y < 6) {piece2 = board.getCase(new Point(this.getPosition().x, this.getPosition().y + 2));}
            if (this.getPosition().x < 7 && this.getPosition().y < 7) {eat1 = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y + 1));}
            if (this.getPosition().x > 0 && this.getPosition().y < 7) {eat2 = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y + 1));}
            
            //Déplacement classique
            //Si la case devant le pion est vide
            if (piece === undefined && this.getPosition().y < 7) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), piece.getPosition()));
            }

            //Premier déplacement
            //Si le pion n'a pas bougé et que les deux cases devant lui sont vides
            if (!this.hasMoved && piece === undefined && piece2 === undefined) {
                //On ajoute le mouvement à moveList
                this.moveList.push(new Move(this.getPosition(), piece2.getPosition()));
            }

            //Déplacements pour manger
            //S'il y a une pièce ennemie (sauf roi) devant le pion en diagonale, on ajoute le mouvement à moveList
            if (eat1 !== undefined && eat1.color !== this.color && eat1.name !== 'King') {
                this.moveList.push(this.getPosition(), eat1.getPosition());
            }
            if (eat2 !== undefined && eat2.color !== this.color && eat2.name !== 'King') {
                this.moveList.push(this.getPosition(), eat2.getPosition());
            }
        } 
        //S'il est noir, on décrémente y au lieu de l'incrémenter
        else if (this.color === 'black') {

            //variables
            let piece;
            let piece2;
            let eat1;
            let eat2;

            if (this.getPosition().y > 0) {piece = board.getCase(new Point(this.getPosition().x, this.getPosition().y - 1));}
            if (this.getPosition().y > 1) {piece2 = board.getCase(new Point(this.getPosition().x, this.getPosition().y - 2));}
            if (this.getPosition().x < 7 && this.getPosition().y > 0) {eat1 = board.getCase(new Point(this.getPosition().x + 1, this.getPosition().y - 1));}
            if (this.getPosition().x > 0 && this.getPosition().y > 0) {eat2 = board.getCase(new Point(this.getPosition().x - 1, this.getPosition().y - 1));}

            if (piece === undefined && this.getPosition().y > 0) {
                this.moveList.push(this.getPosition(), piece.getPosition());
            }
            
            if (!this.hasMoved && piece === undefined && piece2 === undefined) {
                this.moveList.push(this.getPosition(), piece2.getPosition());
            }
            
            if (eat1 !== undefined && eat1.color !== this.color && eat1.name !== 'King') {
                this.moveList.push(this.getPosition(), eat1.getPosition());
            }
            if (eat2 !== undefined && eat2.color !== this.color && eat2.name !== 'King') {
                this.moveList.push(this.getPosition(), eat2.getPosition());
            }

        } 
        //Sinon on renvoie une erreur
        else {
            console.error('Bad color : expected black or white, got ', this.color);
        }

        return this.moveList;
    }
}

module.exports = Pawn;