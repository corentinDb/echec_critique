const Piece = require('./Piece');

class Pawn extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.firstMove = true;
        this.name = "Pawn";
    }

    //Si le pion a bougé, il ne peut plus avancer de deux cases
    moved() {
        this.firstMove = false;
    }

    //Se déplace d'un case en avant sauf au premier coup où il peut manger de deux et mange en diagonale
    getMoveList() {
        //Si la case y+1 est libre
        this.moveList += [this.x, this.y];

        if (firstMove /*&& si la case y+2 est libre*/) {
            this.moveList += [this.x, this.y + 2];
        }

        return this.moveList;
    }
}

module.exports = Pawn;