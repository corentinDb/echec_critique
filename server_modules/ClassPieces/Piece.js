const Point = require('./../Point');

class Piece {
    //Dans le constructeur : couleur, coordonnées de la pièce et liste des mouvements possibles
    constructor(color, x, y) {
        this.color = color;
        this.position = new Point(x, y);
        this.moveList = [];
        this.name = '';
        this.hasMoved = false;
    }

    //Renvoie la couleur de la pièce
    getColor() {
        return this.color;
    }

    //Renvoie un objet avec comme attribut x et y (position.x et position.y)
    getPosition() {
        return this.position;
    }

    //Renvoie le nom de la pièce
    getName() {
        return this.name;
    }

    //Indique que la pièce s'est déplacé au moins une fois
    moved() {
        this.hasMoved = true;
    }

    //Change les coordonnées de la pièce de manière bourrine
    setPosition(point) {
        this.position = point;
    }

    //On déclare la fonction qui sera utilisée pour retourner la liste des mouvements possibles d'une pièce
    getMoveList(board) {
        this.moveList = [];
    };
}

module.exports = Piece;