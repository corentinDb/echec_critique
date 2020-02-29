const Piece = require('./Piece');

class Queen extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = "Queen";
    }

    //Se déplace dans toutes les directions
}

module.exports = Queen;