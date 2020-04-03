const Point = require('./Point');
const Piece = require('./ClassPieces/Piece');

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
    insert(piece, point) {
        this.board[point.x][point.y] = piece;
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

        //change les coordonnées contenues dans la pièce
        this.getCase(destination).setPosition(destination);

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

    //Permet de trouver une pièce sur l'échiquier
    searchPiece(name, color) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                piece = this.getCase(new Point(i, j));
                if (piece !== undefined && piece.name === name && piece.color === color) {
                    return piece;
                }
            }
        }

        console.error('Unable to find ', name, ' of color', color);
        return undefined;
    }
}

module.exports = Board;