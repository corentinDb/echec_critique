//Class point
class Point {
    //créer un point avec des coordonnées x et y
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //Test d'égalité
    isEqual(point) {
        return this.x === point.x && this.y === point.y;
    }
}

module.exports = Point;