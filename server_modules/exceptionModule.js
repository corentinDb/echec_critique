const Point = require('./Point');
const Move = require('./Move');

module.exports = {
    //Détecte si la case à la couleur courante du board est en echec. Si la position est null, on cherche le roi
    check(gameInstance, position) {
        if (position === null) {
            position = gameInstance.searchPiece('King', gameInstance.color)[0].getPosition();
        }
        let ls;
        if (gameInstance.color === 'black') {
            ls = gameInstance.searchPiece('', 'white');
        } else {
            ls = gameInstance.searchPiece('', 'black');
        }
        for (let piece of ls) {
            let moveList = piece.getMoveList(gameInstance);
            for (let i = 0; i < moveList.length; i++) {
                if (moveList[i].getDestination().isEqual(position)) {
                    return true;
                }
            }
        }
        return false;
    },
    //Sélectionne les mouvements de la pièce en entrée qui ne mettent pas en échec son roi ou qui le sort d'une situation d'échec
    moveListWithCheck(gameInstance, pointOrigin) {
        let moveList = pointOrigin.getMoveList(gameInstance);

        let newMoveList = [];
        for (let move of moveList) {
            let tempPiece = gameInstance.getCase(move.getDestination());
            gameInstance.simulateMove(move);
            if (pointOrigin.name === 'King') {
                if (!this.check(gameInstance, move.getDestination())) {
                    newMoveList.push(move);
                }
            } else {
                if (!this.check(gameInstance, null)) {
                    newMoveList.push(move);
                }
            }
            gameInstance.simulateMove(new Move(move.getDestination(), move.getOrigin()));
            gameInstance.insert(tempPiece, move.getDestination());
        }
        //Si c'est un roi et qu'il peut roque, on ajoute le mouvement
        if (pointOrigin.name === 'King') {
            let y;
            (gameInstance.color === 'white') ? y = 0 : y = 7;
            if (gameInstance.getCase(new Point(0, y)) !== undefined && gameInstance.getCase(new Point(0, y)).name === 'Rook' && this.castling(gameInstance, pointOrigin, gameInstance.getCase(new Point(0, y)))) {
                newMoveList.push(new Move(pointOrigin.getPosition(), new Point(2, y)));
            }
            if (gameInstance.getCase(new Point(7, y)) !== undefined && gameInstance.getCase(new Point(7, y)).name === 'Rook' && this.castling(gameInstance, pointOrigin, gameInstance.getCase(new Point(7, y)))) {
                newMoveList.push(new Move(pointOrigin.getPosition(), new Point(6, y)));
            }
        }
        return newMoveList;
    },
    //Détecte l'echec et mat pour la couleur courante du board
    checkmate(gameInstance) {
        if (this.check(gameInstance, null) === true) {
            let ls;
            ls = gameInstance.searchPiece('', gameInstance.color);
            for (let piece of ls) {
                if (this.moveListWithCheck(gameInstance, piece).length !== 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    //Détecte le pat pour la couleur courante du board
    pat(gameInstance) {
        if (gameInstance.searchPiece('', 'white').length === 1 && gameInstance.searchPiece('', 'black').length === 1) {
            return true;
        }
        if (this.check(gameInstance, null) === false) {
            let ls;
            ls = gameInstance.searchPiece('', gameInstance.color);
            for (let piece of ls) {
                if (this.moveListWithCheck(gameInstance, piece).length !== 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    //Détecte si le roque, pour le roi et la tour entrée, est possible
    castling(gameInstance, king, rook) {
        if (king.getColor() !== rook.getColor()) return false;
        if (!king.hasMoved && !rook.hasMoved && !this.check(gameInstance, null)) {
            if (rook.getPosition().x > king.getPosition().x) {
                for (let i = king.getPosition().x + 1; i < king.getPosition().x + 3; i++) {
                    if (gameInstance.getCase(new Point(i, king.getPosition().y)) !== undefined) {
                        return false;
                    } else if (this.check(gameInstance, new Point(i, king.getPosition().y))) {
                        return false;
                    }
                }
            } else {
                for (let i = king.getPosition().x - 1; i > king.getPosition().x - 4; i--) {
                    if (gameInstance.getCase(new Point(i, king.getPosition().y)) !== undefined) {
                        return false;
                    } else if (this.check(gameInstance, new Point(i, king.getPosition().y))) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    //Détecte si la promotion d'un pion est possible
    promotion(pawn) {
        if (pawn.name === 'Pawn') {
            return ((pawn.getColor() === 'black' && pawn.getPosition().y === 0) || (pawn.getColor() === 'white' && pawn.getPosition().y === 7))
        } else {
            return false;
        }
    }
};