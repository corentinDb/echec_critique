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

    //Initialise les paramètres de socket io
    socket.emit('joinGame', gameID, localPlayer);

    socket.on('newUserResponse', (user) => {    //Si un nouveau utilisateur se connecte au serveur, s'il a le même nom, on lui demande de se déconnecter, sinon on le prévient qu'on est connecté
        if (user === localPlayer) {
            socket.emit('close', localPlayer);
        } else {
            socket.emit('giveConnectionInfo', localPlayer, user, true);
        }
    });

    socket.on('pingRequest', (user) => {    //Réponse à une demande de ping
        socket.emit('pongUser', localPlayer, user, true);   //On ajoute un booléen à true dans la réponse pour préciser que l'utilisateur est en jeux
    });

    socket.on('pongResponse', (user, inGame) => {   //Réception de la réponse du ping
        if (inGame) {
            pong = true;
        }
    });

    socket.on('timeOut', () => {
        alert('Délai dépassé, vous allez être redirigé vers le menu');
        window.location = 'http://localhost:4269/menu';
    });

    let pingPong = setInterval(() => {     //Ping de l'utilisateur toutes les 3 secondes pour vérifier qu'il est toujours connecté à la partie, sinon on retourne au menu et on arrête le ping régulier
        socket.emit('pingUser', localPlayer, opponent);
        socket.emit('giveConnectionInfo', localPlayer, '', true);
        setTimeout(() => {
            if (pong === false) {
                socket.emit('timeOut', opponent);
                alert('L\'adversaire est parti, vous allez être redirigé vers le menu');
                window.location = 'http://localhost:4269/menu';
                clearInterval(pingPong);
            } else {
                pong = false;
            }
        }, 2000);
    }, 20000);


    //Si le joueur est blanc, il lance la partie, s'il est noir, on demande le board après 500ms (pour être sur que la partie est bien commencé
    if (color === 'white') {
        socket.emit('startGame', gameID);
    } else {
        setTimeout(function () {
            socket.emit('getBoard', gameID);
        }, 500);
    }

    setInterval(function () {
        socket.emit('getBoard', gameID);
    }, 1000);

    socket.on('giveBoard', (gameInstance) => {
        boardCache = gameInstance;
    });

    socket.on('playTurn', (gameInstance) => {   //Début du tour
        boardCache = gameInstance;      //Update du board
        console.table(gameInstance.board);
    });

    socket.on('giveMoveList', (gameInstance, serverMoveList) => {     //Réception de la moveList
        moveList = serverMoveList;
    });

    socket.on('checkmate', (gameInstance) => {
        boardCache = gameInstance;
        gameOver = true;
        console.log(boardCache.color + ' est en échec et mat !');
    });

    socket.on('pat', (gameInstance) => {
        boardCache = gameInstance;
        gameOver = true;
        console.log(boardCache.color + ' est en pat !');
    });

    socket.on('promotion', (gameInstance, pawn) => {
        boardCache = gameInstance;
        console.log(pawn);
    });


    let game = new Phaser.Game(window.innerWidth - 200, window.innerHeight - 240, Phaser.AUTO, 'phaser-example', {
        preload: preload,
        create: create,
        update: update
    });

    let tile;
    let selectedTile;


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

    function create() {

        game.stage.backgroundColor = "#eee7bc";

        let boardSize = getBoardSize();

        let texture = game.make.bitmapData(boardSize, boardSize);
        texture.fill(17, 17, 17);

        let boardBack = game.add.sprite(game.world.centerX, game.world.centerY, texture);

        let sizeCase = getTileSize();

        let whiteCase = game.make.bitmapData(sizeCase, sizeCase);
        whiteCase.fill(255, 206, 158);

        let blackCase = game.make.bitmapData(sizeCase, sizeCase);
        blackCase.fill(209, 139, 71);

        let origin = {
            x: boardBack.x - boardBack.width / 2 + 30,
            y: boardBack.y - boardBack.height / 2 + 30
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

        texture.line(28, 28, 28, texture.height - 28, "#ffffff", 6);
        texture.line(25, texture.height - 27, texture.width - 25, texture.height - 27, "#ffffff", 6);
        texture.line(texture.width - 28, 28, texture.width - 28, texture.height - 28, "#ffffff", 6);
        texture.line(25, 27, texture.width - 25, 27, "#ffffff", 6);

        boardBack.anchor.setTo(0.5);
    }

    function getBoardSize() {
        return Math.min(game.world.height * 80 / 100, game.world.width * 80 / 100);
    }

    function getTileSize() {
        return (getBoardSize() - 60) / 8;
    }

    function BoardIdToPosition(id, color) {

        if (color === 'white')
            return {
                x: id % 8,
                y: 7 - Math.floor(id / 8)
            };
        if (color === 'black')
            return {
                x: 7 - id % 8,
                y: Math.floor(id / 8)

            };
    }


    function positionToBoardId(position, color) {
        if (color === 'white') return Number((7 - position.y) * 8 + position.x);
        if (color === 'black') return Number(position.y * 8 + 7 - position.x);
    }


    function loadBoard(board) {

        for (let sprite of tile.children) {
            sprite.key.copy(sprite.originTexture);
            sprite.move = false;
        }


        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board !== undefined && board !== null) {
                    if (board.board[j][i] !== null) {
                        let id = positionToBoardId({x: j, y: i}, color);
                        changeTexture(tile.children[id], board.board[j][i].color + board.board[j][i].name);
                    }
                }
            }
        }
    }

    function tilePosition(mouse) {

        for (let sprite of tile.children) {
            if (sprite.getBounds().contains(mouse.x, mouse.y)) return sprite;
        }
        return undefined;
    }

    function changeTexture(sprite, key) {

        let width = sprite.width;
        let height = sprite.height;

        let texture = sprite.key;
        texture.copy(key, 0, 0, 73, 73, texture.width / 2, texture.height / 2, width, height, 0, 0.5, 0.5, 0.9, 0.9);

    }

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

    function showMoveList(spriteMoveList) {
        for (let spriteMove of spriteMoveList) {
            spriteMove.key.circle(getTileSize() / 2, getTileSize() / 2, getTileSize() / 8);
            spriteMove.move = true;
        }
    }

    let selectorClick = true;
    let resetClick = true;
    let moveClick = true;
    let gameOver = false;

    let canSelect;
    color === 'white' ? canSelect = 0 : canSelect = 1;

    function update() {

        //chargement du plateau
        loadBoard(boardCache);

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
                    console.log('demande de moveList pour', selectedTile.coord);
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
            showMoveList(spriteMoveList);

            //envoie du move si l'on click sur un move
            if (game.input.activePointer.leftButton.isDown && moveClick) {
                let moveTile = hoverTile;
                if (moveTile !== undefined && moveTile.move) {
                    socket.emit('moveRequest', gameID, selectedTile.coord.x, selectedTile.coord.y, moveTile.coord.x, moveTile.coord.y);
                    console.log('envoie du move pour la position', moveTile.coord);
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

        //click relevé
        if (!game.input.activePointer.leftButton.isDown) {
            selectorClick = true;
            resetClick = true;
            moveClick = true;
        }


    }
})();