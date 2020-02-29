const Piece = require('./Piece');

class Knight extends Piece {
    constructor(color, x, y) {
        super(color, x, y);
        this.name = "Knight";
    }

    //Se déplace en "L"
}

module.exports = Knight;