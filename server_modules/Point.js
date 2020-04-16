//Class point
class Point {
    //créer un point avec des coordonnées x et y
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    reverse() {
        let tmp = this.x;
        this.x = this.y;
        this.y = tmp;
    }

    isEqual(point) {
        return this.x === point.x && this.y === point.y;
    }
}

module.exports = Point;