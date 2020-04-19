(function () {
    const socket = io.connect('http://localhost:4269');

    //Récupère les infos du joueur
    const localPlayer = document.getElementById('localPlayer').innerHTML;
    const opponent = document.getElementById('opponent').innerHTML;
    const color = document.getElementById('color').innerHTML;
    const gameID = document.getElementById('gameID').innerHTML;

    let pong = false;
    let boardCache;
    let moveList = [];
    let tempBoard;
    let gameOver = false;

    //Initialise les paramètres de socket io
    socket.emit('joinGame', gameID, localPlayer);
    chatMod.joinChat(localPlayer);

    //Force la fermeture si un utilisateur avec le même pseudo se connecte
    socket.on('newUserRequest', (user) => {
        if (user === localPlayer) socket.emit('close', localPlayer);
    });

    //Si un nouveau utilisateur se connecte au serveur, on l'ajoute à la liste
    socket.on('getUserInfo', (user) => {
        socket.emit('giveUserInfo', localPlayer, user, true);
    });

    //Si le socket est déconnecté du serveur, on redirige vers la page principale
    socket.on('disconnect', () => {
        setTimeout(() => {
            window.location = 'http://localhost:4269';
        }, 200);
    });

    //Réponse à une demande de ping
    socket.on('pingRequest', (user) => {
        socket.emit('pongUser', localPlayer, user, true);   //On ajoute true dans la réponse pour préciser que l'utilisateur est en jeux
    });

    //Réception de la réponse du ping
    socket.on('pongResponse', (user, inGame) => {
        if (inGame) pong = true;
    });

    //Si on a pas répondu à une demande de ping de l'adversaire, celui ci nous déconnecte
    socket.on('timeOut', () => {
        alertBox('Délai dépassé, vous allez être redirigé vers le menu', 'Je rejouerai quand j\'aurai la fibre');
    });

    //Si l'adversaire est partie, on retourne au menu
    socket.on('disconnectUser', () => {
        if (!gameOver) {
            alertBox('L\'adversaire est parti, vous allez être redirigé vers le menu', 'C\'est un(e) petit(e) joueur(euse) !<br>Il/Elle a peur de perdre !');
        } else {
            alertBox('La partie est fini', 'Retourner au menu');
        }
    });

    //Si l'adversaire abandonne, on retourne au menu
    socket.on('surrender', () => {
        alertBox('L\'adversaire a abandonné !<br>Félicitation, vous êtes le grand vainqueur !', 'C\'est un(e) petit(e) joueur(euse) !<br>Il/Ellle ne fini pas la partie !');
    })

    //Ping de l'utilisateur toutes les 3 secondes pour vérifier qu'il est toujours connecté à la partie, sinon on retourne au menu et on arrête le ping régulier
    let pingPong = setInterval(() => {
        socket.emit('pingUser', localPlayer, opponent);
        socket.emit('giveConnectionInfo', localPlayer, '', true);
        setTimeout(() => {
            if (pong === false) {
                socket.emit('timeOut', opponent);
                alertBox('L\'adversaire a dépassé le delai de connexion, vous allez être redirigé vers le menu', 'Je vais lui payer la fibre<br>pour jouer avec lui !');
                clearInterval(pingPong);
            } else {
                pong = false;
            }
        }, 2000);
    }, 5000);

    //Bouton retour au menu
    document.getElementById('back').addEventListener('click', () => {
        socket.emit('disconnectOpponent', opponent);
        backMenu();
    });

    //Bouton abandon
    document.getElementById('surrender').addEventListener('click', () => {
        socket.emit('surrender', opponent);
        alertBox('Il/Elle est trop fort ! J\'abandonne !', 'Je vais pleurer tout(e) seul(e)<br>dans mon coin !');
    })

    //Récupération du board au chargement puis toutes les 2 secondes
    socket.emit('getBoard', gameID);
    setInterval(function () {
        socket.emit('getBoard', gameID);
    }, 2000);

    //Update du board, le passage au tour suivant s'effectue automatiquement lorsque la couleur est modifié
    socket.on('giveBoard', (gameInstance) => {
        boardCache = gameInstance;
    });

    //Réception de la liste de mouvement
    socket.on('giveMoveList', (gameInstance, serverMoveList) => {
        moveList = serverMoveList;
    });

    //Reset du message d'information
    socket.on('resetMessage', () => {
        text.text = '';
    })

    //Informe de l'echec et mat
    socket.on('checkmate', (gameInstance) => {
        boardCache = gameInstance;
        gameOver = true;
        text.text = 'Partie terminée, ' + boardCache.color + ' est en échec et mat !';
    });

    //Informe du pat
    socket.on('pat', (gameInstance) => {
        boardCache = gameInstance;
        gameOver = true;
        text.text = 'Partie terminée, il y Pat!';
    });

    //Informe de la promotion du pion et demande à l'utilisateur de choisir
    socket.on('promotion', (gameInstance, pawn) => {
        boardCache = gameInstance;
        tempBoard = boardCache.board.slice();
        getPromotion(pawn.position);
    });

    //Informe de l'echec mais sans mat
    socket.on('check', (gameInstance) => {
        boardCache = gameInstance;
        text.text = boardCache.color + ' est en échec !';
    });

    let game = new Phaser.Game(window.innerWidth, window.innerHeight * (65 / 100), Phaser.AUTO, 'phaser-example', {
        preload: preload,
        create: create,
        update: update
    });

    let tile;
    let missing;
    let promote;
    let selectedTile;
    let text;

    //chargement des images
    function preload() {
        game.load.image('whiteKnight', '../images/cavalier blanc.png');
        game.load.image('blackKnight', '../images/cavalier noir.png');
        game.load.image('whiteBishop', '../images/fou blanc.png');
        game.load.image('blackBishop', '../images/fou noir.png');
        game.load.image('whitePawn', '../images/pion blanc.png');
        game.load.image('blackPawn', '../images/pion noir.png');
        game.load.image('whiteQueen', '../images/reine blanc.png');
        game.load.image('blackQueen', '../images/reine noir.png');
        game.load.image('whiteKing', '../images/roi blanc.png');
        game.load.image('blackKing', '../images/roi noir.png');
        game.load.image('whiteRook', '../images/tour blanc.png');
        game.load.image('blackRook', '../images/tour noir.png');
        game.load.image('selectedTile', '../images/selectedTile.png');
    }

    //donne la taille du plateau
    function getBoardSize() {
        return Math.min(game.world.height * 80 / 100, game.world.width * 70 / 100);
    }

    //donne la taille d'une case
    function getTileSize() {
        return (getBoardSize() - getBoardSize() * 0.06) / 8;
    }

    //transforme l'id d'une case en coordonnées du plateau
    function BoardIdToPosition(id, color) {
        if (color === 'white') return {x: id % 8, y: 7 - Math.floor(id / 8)};
        if (color === 'black') return {x: 7 - id % 8, y: Math.floor(id / 8)};
    }

    //transforme les coordonnées du plateau en id de case
    function positionToBoardId(position, color) {
        if (color === 'white') return Number((7 - position.y) * 8 + position.x);
        if (color === 'black') return Number(position.y * 8 + 7 - position.x);
    }

    //creation de l'interface de jeu
    function create() {
        game.stage.backgroundColor = "#dddddd";

        let boardSize = getBoardSize();

        let texture = game.make.bitmapData(boardSize, boardSize);
        texture.fill(17, 17, 17);

        let boardBack = game.add.sprite(game.world.centerX, game.world.centerY, texture);
        boardBack.anchor.setTo(0.5);

        let sizeCase = getTileSize();

        let whiteCase = game.make.bitmapData(sizeCase, sizeCase);
        whiteCase.fill(255, 206, 158);

        let blackCase = game.make.bitmapData(sizeCase, sizeCase);
        blackCase.fill(209, 139, 71);

        let origin = {
            x: boardBack.x - boardBack.width / 2 + getBoardSize() * 0.03,
            y: boardBack.y - boardBack.height / 2 + getBoardSize() * 0.03
        };

        tile = game.add.group();
        let id = 0;

        for (let j = 0; j < 4; j++) {
            let sprite;
            let position;
            let tileTexture;

            for (let i = 0; i < 4; i++) {
                position = {x: origin.x + i * 2 * sizeCase, y: origin.y + j * 2 * sizeCase};
                tileTexture = game.make.bitmapData(sizeCase, sizeCase);
                tileTexture.copy(whiteCase);
                sprite = game.add.sprite(position.x, position.y, tileTexture);
                sprite.originTexture = whiteCase;
                sprite.coord = BoardIdToPosition(id++, color);
                tile.add(sprite);

                position = {x: origin.x + sizeCase + i * 2 * sizeCase, y: origin.y + j * 2 * sizeCase};
                tileTexture = game.make.bitmapData(sizeCase, sizeCase);
                tileTexture.copy(blackCase);
                sprite = game.add.sprite(position.x, position.y, tileTexture);
                sprite.originTexture = blackCase;
                sprite.coord = BoardIdToPosition(id++, color);
                tile.add(sprite);
            }

            for (let i = 0; i < 4; i++) {
                position = {x: origin.x + i * 2 * sizeCase, y: origin.y + sizeCase + j * 2 * sizeCase};
                tileTexture = game.make.bitmapData(sizeCase, sizeCase);
                tileTexture.copy(blackCase);
                sprite = game.add.sprite(position.x, position.y, tileTexture);
                sprite.originTexture = blackCase;
                sprite.coord = BoardIdToPosition(id++, color);
                tile.add(sprite);

                position = {x: origin.x + sizeCase + i * 2 * sizeCase, y: origin.y + sizeCase + j * 2 * sizeCase};
                tileTexture = game.make.bitmapData(sizeCase, sizeCase);
                tileTexture.copy(whiteCase);
                sprite = game.add.sprite(position.x, position.y, tileTexture);
                sprite.originTexture = whiteCase;
                sprite.coord = BoardIdToPosition(id++, color);
                tile.add(sprite);
            }
        }

        missing = {
            whiteGroup: game.add.group(),
            white: 0,
            blackGroup: game.add.group(),
            black: 0
        };

        let originWhite = {
            x: boardBack.x - getTileSize() - getBoardSize() / 2,
            y: boardBack.y + boardBack.height - getBoardSize() / 2 - getTileSize() - getBoardSize() * 0.03
        };

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 8; i++) {
                let position = {
                    x: originWhite.x - getTileSize() * j,
                    y: originWhite.y - getTileSize() * i
                };

                let missingCase = game.make.bitmapData(sizeCase, sizeCase);
                let sprite = game.add.sprite(position.x, position.y, missingCase);
                missing.whiteGroup.add(sprite);
            }

        }

        let originBlack = {
            x: boardBack.x + boardBack.width - getBoardSize() / 2,
            y: boardBack.y + boardBack.height - getBoardSize() / 2 - getTileSize() - getBoardSize() * 0.03
        };

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 8; i++) {
                let position = {
                    x: originBlack.x + getTileSize() * j,
                    y: originBlack.y - getTileSize() * i
                };

                let missingCase = game.make.bitmapData(sizeCase, sizeCase);
                let sprite = game.add.sprite(position.x, position.y, missingCase);
                missing.blackGroup.add(sprite);
            }

        }

        let style = {font: "bold 32px Arial", fill: "#000000", boundsAlignH: "center", boundsAlignV: "middle"};
        text = game.add.text(0, 0, "", style);

        text.setTextBounds(boardBack.x - getBoardSize() / 2, boardBack.y - getBoardSize() / 2 - getTileSize(), boardBack.width, getTileSize());

        let mainChatBox = document.createElement("div");
        document.body.appendChild(mainChatBox);
        mainChatBox.id = 'mainChatBox';

        chatMod.createTabChat(localPlayer, opponent);
        document.getElementById('chatBox_' + opponent).style.display = 'block';
    }

    //permet de superposer une texture sur un sprite
    function changeTexture(sprite, key, opacity, size) {
        let width = sprite.width;
        let height = sprite.height;
        let texture = sprite.key;

        if (size !== undefined) texture.copy(key, 0, 0, 73, 73, texture.width / 2, texture.height / 2, width, height, 0, 0.5, 0.5, size, size, opacity, null, false);
        else if (opacity !== undefined) texture.copy(key, 0, 0, 73, 73, texture.width / 2, texture.height / 2, width, height, 0, 0.5, 0.5, 0.9, 0.9, opacity, null, false);
        else texture.copy(key, 0, 0, 73, 73, texture.width / 2, texture.height / 2, width, height, 0, 0.5, 0.5, 0.9, 0.9);
    }

    //compare 2 plateaux
    function compare(board1, board2) {
        let sameTile = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board1[i][j] === board2[i][j]) sameTile++;
            }
        }
        return sameTile === 64;
    }

    //donne l'inventaire du plateau
    function inventory(board) {
        let inventory = {
            white: {pawn: 0, rook: 0, knight: 0, bishop: 0, queen: 0, king: 0},
            black: {pawn: 0, rook: 0, knight: 0, bishop: 0, queen: 0, king: 0}
        };

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] !== null) {
                    let colorInventory = (board[i][j].color === 'white') ? inventory.white : inventory.black;

                    switch (board[i][j].name) {
                        case('Pawn'):
                            colorInventory.pawn++;
                            break;
                        case('Rook'):
                            colorInventory.rook++;
                            break;
                        case('Knight'):
                            colorInventory.knight++;
                            break;
                        case('Bishop'):
                            colorInventory.bishop++;
                            break;
                        case('Queen'):
                            colorInventory.queen++;
                            break;
                        case('King'):
                            colorInventory.king++;
                            break;
                    }
                }
            }
        }
        return inventory;
    }

    //ajoute les pièces manquantes sur les cotés du plateau
    function addMissingPiece(board, tempBoard) {
        let boardInventory = inventory(board);
        let tempBoardInventory = inventory(tempBoard);

        let totalBoardInventoryWhite = boardInventory.white.pawn + boardInventory.white.rook + boardInventory.white.knight + boardInventory.white.bishop + boardInventory.white.queen + boardInventory.white.king;
        let totalTempBoardInventoryWhite = tempBoardInventory.white.pawn + tempBoardInventory.white.rook + tempBoardInventory.white.knight + tempBoardInventory.white.bishop + tempBoardInventory.white.queen + tempBoardInventory.white.king;

        let totalBoardInventoryBlack = boardInventory.black.pawn + boardInventory.black.rook + boardInventory.black.knight + boardInventory.black.bishop + boardInventory.black.queen + boardInventory.black.king;
        let totalTempBoardInventoryBlack = tempBoardInventory.black.pawn + tempBoardInventory.black.rook + tempBoardInventory.black.knight + tempBoardInventory.black.bishop + tempBoardInventory.black.queen + tempBoardInventory.black.king;

        if (totalBoardInventoryWhite < totalTempBoardInventoryWhite) {
            if (boardInventory.white.pawn < tempBoardInventory.white.pawn) changeTexture(missing.whiteGroup.children[missing.white], 'whitePawn');
            if (boardInventory.white.rook < tempBoardInventory.white.rook) changeTexture(missing.whiteGroup.children[missing.white], 'whiteRook');
            if (boardInventory.white.knight < tempBoardInventory.white.knight) changeTexture(missing.whiteGroup.children[missing.white], 'whiteKnight');
            if (boardInventory.white.bishop < tempBoardInventory.white.bishop) changeTexture(missing.whiteGroup.children[missing.white], 'whiteBishop');
            if (boardInventory.white.queen < tempBoardInventory.white.queen) changeTexture(missing.whiteGroup.children[missing.white], 'whiteQueen');
            if (boardInventory.white.king < tempBoardInventory.white.king) changeTexture(missing.whiteGroup.children[missing.white], 'whiteKing');
            missing.white++;
        }

        if (totalBoardInventoryBlack < totalTempBoardInventoryBlack) {
            if (boardInventory.black.pawn < tempBoardInventory.black.pawn) changeTexture(missing.blackGroup.children[missing.black], 'blackPawn');
            if (boardInventory.black.rook < tempBoardInventory.black.rook) changeTexture(missing.blackGroup.children[missing.black], 'blackRook');
            if (boardInventory.black.knight < tempBoardInventory.black.knight) changeTexture(missing.blackGroup.children[missing.black], 'blackKnight');
            if (boardInventory.black.bishop < tempBoardInventory.black.bishop) changeTexture(missing.blackGroup.children[missing.black], 'blackBishop');
            if (boardInventory.black.queen < tempBoardInventory.black.queen) changeTexture(missing.blackGroup.children[missing.black], 'blackQueen');
            if (boardInventory.black.king < tempBoardInventory.black.king) changeTexture(missing.blackGroup.children[missing.black], 'blackKing');
            missing.black++;
        }

    }

    //charge le plateau
    function loadBoard(board) {
        for (let sprite of tile.children) {
            sprite.key.copy(sprite.originTexture);
            sprite.move = false;
        }

        if (board !== undefined && board !== null) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (board.board[j][i] !== null) {
                        let id = positionToBoardId({x: j, y: i}, color);
                        changeTexture(tile.children[id], board.board[j][i].color + board.board[j][i].name);
                    }
                }
            }

            if (tempBoard === undefined) tempBoard = boardCache.board.slice();

            if (!compare(boardCache.board, tempBoard)) {
                addMissingPiece(boardCache.board, tempBoard);
                tempBoard = boardCache.board.slice();
            }
        }
    }

    //renvoie le sprite pour une position sur l'écran
    function tilePosition(mouse) {
        for (let sprite of tile.children) {
            if (sprite.getBounds().contains(mouse.x, mouse.y)) return sprite;
        }
        return undefined;
    }

    //renvoie tous les sprites de la move liste d'un sprite donné
    function getSpriteMoveList(sprite) {
        let spriteMoveList = [];
        if (moveList[0] !== undefined) {
            if (moveList[0].origin.x === sprite.coord.x && moveList[0].origin.y === sprite.coord.y) {
                for (let move of moveList) {
                    spriteMoveList.push(tile.children[positionToBoardId(move.destination, color)]);
                }
            }
        }
        return spriteMoveList;
    }

    //affiche une moveList
    function showMoveList(spriteMoveList, originPiece) {
        for (let spriteMove of spriteMoveList) {
            if (originPiece.color === 'white') spriteMove.key.circle(getTileSize() / 2, getTileSize() / 2, getTileSize() / 8, '#FFFFFF');
            else spriteMove.key.circle(getTileSize() / 2, getTileSize() / 2, getTileSize() / 8);
            spriteMove.move = true;
        }
    }

    //déclanche une promotion
    function getPromotion(position) {
        let tileId = positionToBoardId(position, color);
        let promoteTile = tile.children[tileId];
        let promotePiece = boardCache.board[position.x][position.y];

        if (color === promotePiece.color) {
            let origin = {
                x: promoteTile.x - (3 / 2) * getTileSize(),
                y: promoteTile.y - getTileSize() / 2
            };

            let texture = ['Rook', 'Knight', 'Bishop', 'Queen'];

            promote = game.add.group();

            for (let i = 0; i < 4; i++) {
                let tileTexture = game.make.bitmapData(getTileSize(), getTileSize());
                tileTexture.circle(getTileSize() / 2, getTileSize() / 2, getTileSize() / 2 - 1, '#000000');
                tileTexture.circle(getTileSize() / 2, getTileSize() / 2, getTileSize() / 2 - 2, '#F5F5F5');
                if (i !== 3) tileTexture.rect(getTileSize() / 2, 1, getTileSize() / 2, getTileSize() - 2, '#000000');
                if (i !== 0) tileTexture.rect(0, 1, getTileSize() / 2, getTileSize() - 2, '#000000');
                if (i !== 3) tileTexture.rect(getTileSize() / 2 - 1, 2, getTileSize() / 2 + 2, getTileSize() - 4, '#F5F5F5');
                if (i !== 0) tileTexture.rect(-1, 2, getTileSize() / 2 + 2, getTileSize() - 4, '#F5F5F5');
                let spritePosition = {x: origin.x + i * getTileSize(), y: origin.y};
                let sprite = game.add.sprite(spritePosition.x, spritePosition.y, tileTexture);
                changeTexture(sprite, promotePiece.color + texture[i], 0.6, 0.6);
                let originTexture = game.make.bitmapData(getTileSize(), getTileSize());
                originTexture.copy(sprite.key);
                sprite.originTexture = originTexture;
                sprite.pieceKey = promotePiece.color + texture[i];
                sprite.promoteColor = promotePiece.color;
                sprite.promotePiece = texture[i];
                sprite.tilePosition = position;
                promote.add(sprite);
            }
        }
    }

    //fonction qui permet la selection d'une promotion
    function choosePromote(promote, mouse) {
        let hoverSprite = undefined;

        for (let sprite of promote.children) {
            sprite.key.copy(sprite.originTexture);
            if (sprite.getBounds().contains(mouse.x, mouse.y)) hoverSprite = sprite;
        }

        if (hoverSprite !== undefined) {
            changeTexture(hoverSprite, hoverSprite.pieceKey, 1, 0.6);

            if (game.input.activePointer.leftButton.isDown && promoteClick) {
                promoteClick = false;
                return {
                    color: hoverSprite.promoteColor,
                    piece: hoverSprite.promotePiece,
                    position: hoverSprite.tilePosition
                };
            }
        }
        return undefined;
    }

    let selectorClick = true;
    let resetClick = true;
    let moveClick = true;
    let promoteClick = true;

    let canSelect;
    color === 'white' ? canSelect = 0 : canSelect = 1;


    //Boucle principal du jeu
    function update() {
        //chargement du plateau
        loadBoard(boardCache);

        //si promotion en cours
        if (promote !== undefined) {
            let promoteResult = choosePromote(promote, game.input.mousePointer);
            if (promoteResult !== undefined) {
                socket.emit('promotionResponse', promoteResult);
                promote.destroy(true);
                promote = undefined;
            }
        } else {
            //affichage texture selectionné
            if (selectedTile !== undefined) changeTexture(selectedTile, 'selectedTile');

            //recperation du tile survolé
            let hoverTile = tilePosition(game.input.mousePointer);

            //action sur le tile survolé
            if (hoverTile !== undefined) {
                //changement de texture
                changeTexture(hoverTile, 'selectedTile');

                //si click alors on selectionne la texture
                if (game.input.activePointer.leftButton.isDown && selectorClick && boardCache.turn % 2 === canSelect && !gameOver) {

                    //on recupère la pièce et on demande les deplacement
                    let hoverPiece = boardCache.board[hoverTile.coord.x][hoverTile.coord.y];
                    if (hoverPiece !== null && hoverPiece.color === color) {
                        selectedTile = hoverTile;
                        if (boardCache.color === color) {
                            socket.emit('getMoveList', gameID, selectedTile.coord.x, selectedTile.coord.y);
                        }
                    }
                    selectorClick = false;
                }
            }

            //action sur tile secectionné
            if (selectedTile !== undefined) {
                //on recupère la pièce
                let selectedPiece = boardCache.board[selectedTile.coord.x][selectedTile.coord.y];

                //on recupère les tile où le deplacment est possible
                let spriteMoveList = getSpriteMoveList(selectedTile);

                //on affiche les déplacement possible
                showMoveList(spriteMoveList, selectedPiece);

                //envoie du move si l'on click sur un move
                if (game.input.activePointer.leftButton.isDown && moveClick) {
                    let moveTile = hoverTile;
                    if (moveTile !== undefined && moveTile.move) {
                        socket.emit('moveRequest', gameID, selectedTile.coord.x, selectedTile.coord.y, moveTile.coord.x, moveTile.coord.y);
                    }
                }

                //reset si l'on clique autre part
                if (game.input.activePointer.leftButton.isDown && resetClick) {
                    let resetTile = hoverTile;

                    if (resetTile !== undefined) {
                        let resetPiece = boardCache.board[resetTile.coord.x][resetTile.coord.y];
                        if (resetPiece === null || resetPiece.color !== color) selectedTile = undefined;
                    } else selectedTile = undefined;

                    resetClick = false;
                }
            }
        }

        //click relevé
        if (!game.input.activePointer.leftButton.isDown) {
            selectorClick = true;
            resetClick = true;
            moveClick = true;
            promoteClick = true;
        }
    }
})();


//Fonction pour retour au menu sans passer par la page de loading
function backMenu() {
    let form = document.createElement("form");
    form.method = 'post';
    form.action = '/menu';

    document.body.appendChild(form);
    form.submit();
}

function alertBox(msg, button) {
    if (!document.getElementById('alertDiv')) {
        let mainAlertDiv = document.getElementById('alertMenu');
        mainAlertDiv.style.display = 'block';

        for (let elem of document.body.children) {
            if (elem !== mainAlertDiv) {
                elem.hidden = 'true';
            }
        }
        document.body.id = 'alertBody';

        let alertDiv = document.createElement("div");
        mainAlertDiv.appendChild(alertDiv);
        alertDiv.id = 'alertDiv';

        let alertText = document.createElement("p");
        alertDiv.appendChild(alertText);
        alertText.id = 'alertTxt';
        alertText.innerHTML = msg;

        let returnButton = document.createElement("button");
        alertDiv.appendChild(returnButton);
        returnButton.className = 'gameButton';
        returnButton.innerHTML = button;

        returnButton.addEventListener('click', () => {
            backMenu();
        })
    }
}