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

}

module.exports = Move;