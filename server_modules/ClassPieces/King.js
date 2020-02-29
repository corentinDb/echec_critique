const Piece = require('./Piece');

class King extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.castling = true;
        this.name = "King";
    }

    //Si le roi a bougé, il ne peut plus roquer
    moved() {
        this.castling = false;
    }

    //Se déplace d'une case dans toute les directions s'il n'est pas en échec

    getMoveList() {
        return this.moveList;
    }
}

module.exports = King;