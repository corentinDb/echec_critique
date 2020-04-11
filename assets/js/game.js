(function () {

    const socket = io.connect('http://localhost:4269');

    let boardCache;
    socket.emit('board');
    socket.on('board', (board) => {
        boardCache = board;
    });

    let moveList = [
        {
            origin: {
                x: 5,
                y: 1
            },
            destination: {
                x: 5,
                y: 2
            }
        },
        {
            origin: {
                x: 5,
                y: 1
            },
            destination: {
                x: 5,
                y: 3
            }
        }
    ];

    let color = 'white';
    //let color = 'black';


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

        let blackTileId = 0;
        let whiteTileId = 63;


        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board.board[j][i] !== null)
                    if (color === 'white') changeTexture(tile.children[whiteTileId], board.board[j][i].color + board.board[j][i].name);
                    else if (color === 'black') changeTexture(tile.children[blackTileId], board.board[j][i].color + board.board[j][i].name);
                blackTileId++;
                whiteTileId--;
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
        if (moveList[0].origin.x === sprite.coord.x && moveList[0].origin.y === sprite.coord.y) {
            for (let move of moveList) {
                spriteMoveList.push(tile.children[positionToBoardId(move.destination, color)]);
            }
        }
        return spriteMoveList;
    }

    function showMoveList(spriteMoveList){
        for (let spriteMove of spriteMoveList) {
            spriteMove.key.circle(getTileSize() / 2, getTileSize() / 2, getTileSize() / 8)
            spriteMove.move = true;
        }
    }

    let selectorClick = true;
    let resetClick = true;
    let moveClick = true;

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
            if (game.input.activePointer.leftButton.isDown && selectorClick) {



                //on recupère la pièce et on demande les deplacement
                let hoverPiece = boardCache.board[hoverTile.coord.x][hoverTile.coord.y];
                if (hoverPiece !== null && hoverPiece.color === color) {
                    selectedTile = hoverTile;
                    console.log('demande de moveList pour', selectedTile.coord);
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

            if(game.input.activePointer.leftButton.isDown && moveClick) {

                let moveTile = hoverTile;
                if  (moveTile !== undefined) if(moveTile.move) console.log('envoie du move pour la position', moveTile.coord);

            }

            if(game.input.activePointer.leftButton.isDown && resetClick) {

                let resetTile = hoverTile;

                if  (resetTile !== undefined) {

                    let resetPiece = boardCache.board[resetTile.coord.x][resetTile.coord.y];
                    if (resetPiece === null || resetPiece.color !== color) selectedTile = undefined;
                }
                else selectedTile = undefined;


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