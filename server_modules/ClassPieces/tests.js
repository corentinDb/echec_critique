const Board= require('./../Board');


let board = new Board();
console.log(board);

let roiBlanc = board.searchPiece('King', 'white')[0];
console.log(roiBlanc);

console.log(roiBlanc.getMoveList(board));

let cavalierBlanc = board.searchPiece('Knight', 'white')[0];
console.log(cavalierBlanc);

console.log(cavalierBlanc.getMoveList(board));
