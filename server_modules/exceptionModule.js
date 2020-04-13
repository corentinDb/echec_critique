exceptionModule.exports = {
    check(board, position, color) {
        let ls;
        if (color === 'black') {
            ls = board.searchPiece('', 'white');
        }
        else {
            ls = board.searchPiece('', 'black');
        }
        for (let piece in ls) {
            if (position in piece.getMoveList(board)) {
                return true;
            }
        }
        return false;
    },
    checkmate(board, color) {
        let position = board.searchPiece('king',color).getPosition();
        if (this.check(board,position,color) === true) {
            let ls;
            ls = board.searchPiece('', color);
            for (let piece in ls) {
                if (piece.getMoveList(board).length !== 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    castling(board,king,rook) {
        if (king.getColor() !== rook.getColor()) return false;
        if (!king.hasMoved && !rook.hasMoved) {
            if (rook.getPosition().x > king.getPosition().x) {
                for (let i = king.getPosition().x + 1; i < king.getPosition().x + 3; i++) {
                    if (board.getCase(new Point(i, king.getPosition().y)) !== null) {
                        return false;
                    }
                    else if (king.getPosition().x + 3 - i && this.check(board, new Point(i, king.getPosition().y), king.getColor())) {
                        return false;
                    }
                }
            }
            else {
                for (let i = king.getPosition().x - 1; i < king.getPosition().x - 4; i--) {

                    if (board.getCase(new Point(i, king.getPosition().y)) !== null) {
                        return false;
                    }
                    else if (i - king.getPosition().x - 4 && this.check(board, new Point(i, king.getPosition().y), king.getColor())) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false
    },
    promotion(pawn) {
        return ((pawn.getColor() === 'black' && pawn.getPosition().y === 0) || (pawn.getColor() === 'white' && pawn.getPosition().y === 7))
    },
    pat(board, color) {
        if (this.check(board, color) === false) {
            let ls;
            ls = board.searchPiece('', color);
            for (let piece in ls) {
                if (piece.getMoveList(board).length !== 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    //A FINIR
    // enPassant(board,pawn,position) {
    //     if (!pawn.hasMoved && board.getCase(position)!==null) {
    //         if (pawn.getColor() === 'black') return board.getCase(new Point(position.x, position.y + 1)) === null;
    //         else return board.getCase(new Point(position.x, position.y - 1)) === null;
    //
    //     }
    // },
    outOfBound(position) {
        return (position.x < 0 || position.x > 7 || position.y < 0 || position.y > 7)
    }
}();