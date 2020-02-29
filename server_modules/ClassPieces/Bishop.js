const Piece = require('./Piece');

class Bishop extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = "Bishop";
    }

    //Se déplace en diagonale
}

module.exports = Bishop;