const Point = require('./Point');
const Move = require('./Move');

//Class plateau
class Board {

    //construit un plateau
    constructor() {

        //creation du plateau de 8 par 8
        this.board = new Array(8);
        for (let i = 0; i < 8; i++) this.board[i] = new Array(8);

        let array = [1, 2, 3, 4, 5, 3, 2, 1];
        for (let i = 0; i < 8; i++) {
            this.insert(array[i], new Point(i, 7));
            this.insert(array[i] + 6, new Point(i, 0));
            this.insert(6, new Point(i, 6));
            this.insert(12, new Point(i, 1));
        }

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

    //permet de déplacer un pion d'une case à une autre (augmente le nombre de tour et ajoute le mouvement dans replay)
    move(move) {

        let origin = move.getOrigin();
        let destination = move.getDestination();

        this.insert(this.getCase(origin), destination);
        this.destruct(origin);

        this.replay[this.turn] = move;
        this.turn++;

    }

    //reset le plateau
    reset(){

        let newBoard = new Board();
        this.board = newBoard.board;
        this.turn = newBoard.turn;
        this.replay = newBoard.replay;

    }

    //permet de revenir n tours precédement
    rewind(turn) {

        let moves = this.replay;

        for (let i = 0; i < turn; i++){
            moves.pop();
        }

        this.reset();

        for (let move of moves) {
            this.move(move);
        }

    }

}

module.exports = Board;