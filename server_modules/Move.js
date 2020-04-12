const Point = require('./Point');

//Class deplacement
class Move {

    //créer un deplacement avec un point origin et un point destination
    constructor(origin, destination) {
        this.origin = origin;
        this.destination = destination;
    }

    //renvoie l'origin
    getOrigin() {
        return (this.origin);
    }

    //renvoie la desination
    getDestination() {
        return (this.destination);
    }

    isEqual(move) {
        return this.getOrigin().x === move.getOrigin().x && this.getOrigin().y === move.getOrigin().y && this.getDestination().x === move.getDestination().x && this.getDestination().y === move.getDestination().y;
    }
}

module.exports = Move;