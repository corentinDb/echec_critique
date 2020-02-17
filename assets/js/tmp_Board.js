//Class point
class Point {
    //créer un point avec des coordonnées x et y
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

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

//Class plateau
class Board {

    //construit un plateau
    constructor() {

        //creation du plateau de 8 par 8
        this.board = new Array(8);
        for (let i = 0; i < 8; i++) this.board[i] = new Array(8);

        //initialisation du nombre de tour à 0
        this.turn = 0;

        //creation du replay (contient les deplacements effectués)
        this.replay = [];
    }

    //renvoie le pion d'une case donnée
    getCase(point) {
        return (this.board[point.x][point.y]);
    }

    //permet d'inserer un pion pour une case donnée
    insert(pion, point) {
        this.board[point.x][point.y] = pion;
    }

    //permet de detruire le pion d'une case donnée
    destruct(point) {
        delete this.board[point.x][point.y];
    }

    //permet de déplacer un pion d'une case à une autre ( augmente ou diminue le nombre de tour et ajoute ou supprime le mouvement du replay en fonction du parametre booléen rewind)
    move(move) {

        let origin = move.getOrigin();
        let destination = move.getDestination();

        this.replay[this.turn] = move;
        this.turn++;

        this.insert(this.getCase(origin), destination);
        this.destruct(origin);

    }

    //permet de revenir n tours precédement
    rewind(turn) {

    }

}


