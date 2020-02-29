const Piece = require('./Piece');

class Rook extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.castling = true;
        this.name = "Rook";
    }

    moved() {
        castling = false;
    }

    //Se déplace à l'horizontale et la verticale
}

module.exports = Rook;