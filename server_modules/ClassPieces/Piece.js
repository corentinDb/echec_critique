const Point = require('./../Point');
const Move = require('./../Move');

class Piece {
    //Dans le constructeur : couleur, coordonnées de la pièce et liste des mouvements possibles
    constructor(color, x, y) {
        this.color = color;
        this.position = new Point(x, y);
        this.moveList = [];
        this.name = '';
    }

    //Renvoie la couleur de la pièce
    getColor() {
        return this.color;
    }

    //Renvoie un objet avec comme attribut x et y (position.x et position.y)
    getPosition() {
        return (this.position);
    }

    //Renvoie le nom de la pièce
    getName() {
        return this.name;
    }

    //Donne les coordonnées sous la forme D4 pour x = 4 et y = 4 par exemple
    getPositionB() {
        return `${'ABCDEFGH'[this.getPosition().x]}${this.getPosition().y + 1}`;
    }

    //Change les coordonnées de la pièce de manière bourrine
    setPosition(point) {
        this.position = point;
    }

    //Change les coordonées à partir d'une entrée telle que E5 ou c6
    setPositionB(alpha) {
        //On prend les deux premiers éléments de la chaine et on les met dans un tableau en upper case
        const [x, y] = alpha.toUpperCase();
        //x prend la valeur de l'index de la lettre dans la chaine ci-dessous
        this.getPosition().x = 'ABCDEFGH'.indexOf(x);
        //y prend la valeur du caractère converti en nombre moins 1
        this.getPosition().y = Number(y) - 1;
    }

    //On déclare la fonction qui sera utilisée pour retourner la liste des mouvements possibles d'une pièce
    getMoveList() {
    };
}

module.exports = Piece;