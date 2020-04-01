const Piece = require('./Piece');
const Point = require('./../Point');
const Move = require('./../Move');

class King extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.castling = true;
        this.check = false;
        this.name = 'King';
    }

    //Si le roi a bougé, il ne peut plus roquer
    moved() {
        this.castling = false;
    }

    //Changement du statut du roi (switch entre échec ou non)
    setCheck() {
        this.check = !this.check;
    }

    getCheck() {
        return this.check;
    }

    //Se déplace d'une case dans toute les directions s'il n'est pas en échec
    getMoveList() {
        //Remplacer les commentaires par les fonctions qui vérifient les conditions
        if (this.getPosition().x < 7 && this.getPosition().y < 7 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x + 1, this.getPosition().y + 1)));
        if (this.y < 7 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y + 1)));
        if (this.x > 0 && this.y < 7 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x - 1, this.getPosition().y + 1)));
        if (this.x > 0 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x - 1, this.getPosition().y)));
        if (this.x > 0 && this.y > 0 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x - 1, this.getPosition().y - 1)));
        if (this.y > 0 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x, this.getPosition().y - 1)));
        if (this.x < 7 && this.y > 0 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x + 1, this.getPosition().y - 1)));
        if (this.x < 7 /*&& (case vide || pièce ennemie) && pas en échec*/)
            this.moveList.push(new Move(this.getPosition(), new Point(this.getPosition().x + 1, this.getPosition().y)));

        return this.moveList;
    }


}

module.exports = King;