const Point = require('./Point');
const Move = require('./Move');

module.exports = {
    check(board, position, color) {
        if (position === '') {
            position = board.searchPiece('King', color)[0].getPosition();
        }
        let ls;
        if (color === 'black') {
            ls = board.searchPiece('', 'white');
        } else {
            ls = board.searchPiece('', 'black');
        }
        for (let piece of ls) {
            let moveList = piece.getMoveList(board);
            for (let i = 0; i < moveList.length; i++) {
                if (moveList[i].getDestination().isEqual(position)) {
                    return true;
                }
            }
        }
        return false;
    },
    moveListWithCheck(gameInstance, pointOrigin, color) {
        let moveList = pointOrigin.getMoveList(gameInstance);

        let newMoveList = [];
        for (let move of moveList) {
            let tempPiece = gameInstance.getCase(move.getDestination());
            gameInstance.simulateMove(move);
            if (pointOrigin.name === 'King') {
                if (!this.check(gameInstance, move.getDestination(), color)) {
                    newMoveList.push(move);
                }
            } else {
                if (!this.check(gameInstance, '', color)) {
                    newMoveList.push(move);
                }
            }
            gameInstance.simulateMove(new Move(move.getDestination(), move.getOrigin()));
            gameInstance.insert(tempPiece, move.getDestination());
        }
        if (pointOrigin.name === 'King') {
            if (gameInstance.getCase(new Point(0, 0)) !== undefined && gameInstance.getCase(new Point(0, 0)).name === 'Rook' && this.castling(gameInstance, pointOrigin, gameInstance.getCase(new Point(0, 0)))) {
                newMoveList.push(new Move(pointOrigin.getPosition(), new Point(2, 0)));
            }
            if (gameInstance.getCase(new Point(7, 0)) !== undefined && gameInstance.getCase(new Point(7, 0)).name === 'Rook' && this.castling(gameInstance, pointOrigin, gameInstance.getCase(new Point(7, 0)))) {
                newMoveList.push(new Move(pointOrigin.getPosition(), new Point(6, 0)));
            }
            if (gameInstance.getCase(new Point(0, 7)) !== undefined && gameInstance.getCase(new Point(0, 7)).name === 'Rook' && this.castling(gameInstance, pointOrigin, gameInstance.getCase(new Point(0, 7)))) {
                newMoveList.push(new Move(pointOrigin.getPosition(), new Point(2, 7)));
            }
            if (gameInstance.getCase(new Point(7, 7)) !== undefined && gameInstance.getCase(new Point(7, 7)).name === 'Rook' && this.castling(gameInstance, pointOrigin, gameInstance.getCase(new Point(7, 7)))) {
                newMoveList.push(new Move(pointOrigin.getPosition(), new Point(6, 7)));
            }
        }
        return newMoveList;
    },
    checkmate(board, color) {
        if (this.check(board, '', color) === true) {
            let ls;
            ls = board.searchPiece('', color);
            for (let piece of ls) {
                if (this.moveListWithCheck(board, piece, color).length !== 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    pat(board, color) {
        if (this.check(board, '', color) === false) {
            let ls;
            ls = board.searchPiece('', color);
            for (let piece of ls) {
                if (this.moveListWithCheck(board, piece, color).length !== 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    castling(board, king, rook) {
        if (king.getColor() !== rook.getColor()) return false;
        if (!king.hasMoved && !rook.hasMoved) {
            if (rook.getPosition().x > king.getPosition().x) {
                for (let i = king.getPosition().x + 1; i < king.getPosition().x + 3; i++) {
                    if (board.getCase(new Point(i, king.getPosition().y)) !== undefined) {
                        return false;
                    } else if (/*king.getPosition().x + 3 - i && */this.check(board, new Point(i, king.getPosition().y), king.getColor())) {
                        return false;
                    }
                }
            } else {
                for (let i = king.getPosition().x - 1; i > king.getPosition().x - 4; i--) {

                    if (board.getCase(new Point(i, king.getPosition().y)) !== undefined) {
                        return false;
                    } else if (/*i - king.getPosition().x - 4 && */this.check(board, new Point(i, king.getPosition().y), king.getColor())) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    promotion(pawn) {
        return ((pawn.getColor() === 'black' && pawn.getPosition().y === 0) || (pawn.getColor() === 'white' && pawn.getPosition().y === 7))
    }
};