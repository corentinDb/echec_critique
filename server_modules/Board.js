const Point = require('./Point');
const Pawn = require('./ClassPieces/Pawn');
const Rook = require('./ClassPieces/Rook');
const Knight = require('./ClassPieces/Knight');
const Bishop = require('./ClassPieces/Bishop');
const Queen = require('./ClassPieces/Queen');
const King = require('./ClassPieces/King');

//Class plateau
class Board {

    //construit un plateau
    constructor() {
        //creation du plateau de 8 par 8
        this.board = new Array(8);
        for (let i = 0; i < 8; i++) this.board[i] = new Array(8);

        //remplissage du plateau

        //pions
        for (let i = 0; i < 8; i++) {
            this.insert(new Pawn('white', i, 1), new Point(i, 1));
            this.insert(new Pawn('black', i, 6), new Point(i, 6));
        }

        //tours
        this.insert(new Rook('white', 0, 0), new Point(0, 0));
        this.insert(new Rook('white', 7, 0), new Point(7, 0));
        this.insert(new Rook('black', 0, 7), new Point(0, 7));
        this.insert(new Rook('black', 7, 7), new Point(7, 7));

        //cavaliers
        this.insert(new Knight('white', 1, 0), new Point(1, 0));
        this.insert(new Knight('white', 6, 0), new Point(6, 0));
        this.insert(new Knight('black', 1, 7), new Point(1, 7));
        this.insert(new Knight('black', 6, 7), new Point(6, 7));

        //fous
        this.insert(new Bishop('white', 2, 0), new Point(2, 0));
        this.insert(new Bishop('white', 5, 0), new Point(5, 0));
        this.insert(new Bishop('black', 2, 7), new Point(2, 7));
        this.insert(new Bishop('black', 5, 7), new Point(5, 7));

        //reines
        this.insert(new Queen('white', 3, 0), new Point(3, 0));
        this.insert(new Queen('black', 3, 7), new Point(3, 7));

        //rois
        this.insert(new King('white', 4, 0), new Point(4, 0));
        this.insert(new King('black', 4, 7), new Point(4, 7));

        //initialisation du nombre de tour à 0
        this.turn = 0;

        //creation du replay (contient les deplacements effectués)
        this.replay = [];
    }

    //renvoie le pion d'une case donnée
    getCase(point) {
        if (point !== undefined) return this.board[point.x][point.y];
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

        this.getCase(destination).moved();

        this.replay[this.turn] = move;
    }

    //reset le plateau
    reset() {

        let newBoard = new Board();
        this.board = newBoard.board;
        this.turn = newBoard.turn;
        this.replay = newBoard.replay;

    }

    //permet de revenir n tours precédement
    rewind(turn) {

        let moves = this.replay;

        for (let i = 0; i < turn; i++) {
            moves.pop();
        }

        this.reset();

        for (let move of moves) {
            this.move(move);
        }

    }

    //permet de trouver une pièce sur l'échiquier
    searchPiece(name, color) {
        let tab = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                let piece = this.getCase(new Point(i, j));
                if (piece !== undefined && (piece.getName() === name || name === '') && piece.getColor() === color) {
                    tab.push(piece);
                }
            }
        }

        if (tab.length === 0) {
            console.error('Unable to find ', name, ' of color', color);
        }

        return tab;
    }

}

module.exports = Board;
