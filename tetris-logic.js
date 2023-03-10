var skin = "skin2";

const piece_T = {
    name: "piece_T",
    shape: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 0] 
    ],

    sprite: `Assets/${skin}/block-pink.png`,
    rotation: [
        [[1,-1], [1,1], [-1,1], [-1,-1]],
        [[0,0], [0,0], [0,0], [0,0]],
        [[-1,-1], [1,-1], [1,1], [-1,1]],
        [[-1,1], [-1,-1], [1,-1], [1,1]]
    ]
};

const piece_I = {
    name: "piece_I",
    shape: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
    ],

    sprite: `Assets/${skin}/block-cyan.png`,
    rotation: [
        [[2,-1], [1,2], [-2,1], [-1,-2]],
        [[1,0], [0,1], [-1,0], [0,-1]],
        [[0,1], [-1,0], [0,-1], [1,0]],
        [[-1,2], [-2,-1],[1,-2], [2,1]]
    ]
};

const piece_J = {
    name: "piece_J",
    shape: [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1]
    ],

    sprite: `Assets/${skin}/block-blue.png`,
    rotation: [
        [[2,0], [0,2], [-2,0], [0,-2]],
        [[1,-1], [1,1], [-1,1], [-1,-1]],
        [[0,0], [0,0], [0,0], [0,0]],
        [[-1,1], [-1,-1], [1,-1], [1,1]]
    ]
};

const piece_Z = {
    name: "piece_Z",
    shape: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1]
    ],

    sprite: `Assets/${skin}/block-red.png`,
    rotation: [
        [[2,0], [0,2], [-2,0], [0,-2]],
        [[1,1], [-1,1], [-1,-1], [1,-1]],
        [[0, 0], [0, 0], [0, 0], [0, 0]],
        [[-1,1], [-1,-1], [1,-1], [1,1]]
    ]
};

const piece_S = {
    name: "piece_S",
    shape: [
    [0, 1],
    [1, 1],
    [1, 0],
    [2, 0]
    ],

    sprite: `Assets/${skin}/block-green.png`,
    rotation: [
        [[1,-1], [1,1], [-1,1], [-1,-1]],
        [[0,0], [0,0], [0,0], [0,0]],
        [[1,1], [-1,1], [-1,-1], [1,-1]],
        [[0,2], [-2,0], [0,-2], [2,0]]
    ]
};

const piece_O = {
    name: "piece_O",
    shape: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    ],
    
    sprite: `Assets/${skin}/block-yellow.png`,
    rotation: [
        [[0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0], [0, 0]]
    ]
};

const piece_L = {
    name: "piece_L",
    shape: [
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 0],
    ],
    
    sprite: `Assets/${skin}/block-orange.png`,
    rotation: [
        [[1,-1], [1,1], [-1,1], [-1,-1]],
        [[0,0], [0,0], [0,0], [0,0]],
        [[-1,1], [-1,-1], [1,-1], [1,1]],
        [[0,2], [-2,0], [0,-2], [2,0]]
    ]
};

var possiblePieces = [piece_I, piece_L, piece_O, piece_T, piece_Z, piece_S, piece_J];

var pieceCount = 0;
var pieces = [];

var grid = document.getElementById("grid");
grid.style.backgroundImage = `url('Assets/${skin}/tetris-grid.png')`;

var currentKey;

function createBoard(width, height)
{
    var output = [];
    for (var i = 0; i < width; i++)
    {
        output[i] = [];

        for (var j = 0; j < height; j++)
            output[i][j] = "_";
    }
        
    return output;
} 

function drawPieces()
{
    grid.innerHTML = "";

    for (let i = 0; i < board.length; i++)
    {
        for (let j = 0; j < board[i].length; j++)
        {
            if (notEmptySpace(board[i][j]))
            {
                let piece = pieces[board[i][j]-1];

                if (piece === undefined) return;

                let elem = document.createElement("img");
                elem.setAttribute("src", `${piece.sprite}`);
                elem.setAttribute("alt", "block");
                elem.style.position = "absolute";

                let blockX = i * blockWidth;
                let blockY = j * blockWidth;

                elem.style.transform = `translate(${blockX}px, ${blockY}px`;
                grid.append(elem);
            }
        }
    }
}

function update()
{   
    board = createBoard(10, 20);
    for (let i = 0; i < pieces.length; i++)
    {
        let piece = pieces[i];

        for (let j = 0; j < piece.blocks.length; j++)
        {
            let block = piece.blocks[j];
            board[block.x][block.y] = piece.id;
        }
    }
}

function notEmptySpace(space)
{
    return (space != "_" && !(space === undefined));
}

function getRow(row)
{
    let output = [];
    for (let x = 0; x < 10; x++)
    {
        output[x] = board[x][row];
    }
    return output;
}

function checkAllRowsForClears()
{
    let rows = [];
    for (let x = 19; x >= 0; x--)
    {
        if (!getRow(x).includes("_"))  rows.push(x);
    }

    let start = rows[rows.length-1];
    let len = rows.length;
    rows.forEach(row => destroyRow(row));
    moveBlocks(start, len);
    score += len * (100 + (200 * len * level));
    lines += len;
}

function getBlock(id, x, y)
{
    let piece = pieces[id-1];

    for (let j = 0; j < piece.blocks.length; j++)
    {
        let block = piece.blocks[j];
        if (block.x == x && block.y == y) return block;
    }

    return false;
}

function destroyRow(row)
{
    for (let x = 0; x < 10; x++)
    {
        if (board[x][row] != "_")
        {
            let piece = pieces[board[x][row]-1];
            let block = getBlock(board[x][row], x, row);
            piece.blocks.splice(piece.blocks.indexOf(block), 1);
        }
    }
}

function moveBlocks(start, amount)
{
    let blocks = [];
    for (let x = 0; x < 10; x++)
    {
        for (let y = start; y >= 0; y--)
        {
            if (board[x][y] != "_" && !(board[x][y] === undefined))
            {
                if (getBlock(board[x][y], x, y) != false) blocks.push(getBlock(board[x][y], x, y));
            } 
        }
    }

    blocks.forEach(block => block.moveDown(amount));
}

function checkWin()
{
    for (let x = 0; x < 10; x++)
    {
        if (getRow(0)[x] != "_") return true;
        if (getRow(1)[x] != "_") return true;
    }

    return false;
}

function storeCurrentPiece()
{
    if (!(held === undefined) && held.name == currentPiece.name) return;

    if (held === undefined)
    {
        held = currentPiece;
        currentPiece = new Piece(startCoords[0], startCoords[1], pieceQueue.shift());
        pieceQueue.push(possiblePieces[Math.floor(Math.random() * possiblePieces.length)]); 
    }

    else
    {
        if (previousHeld === held) return;
        let temp = currentPiece;
        previousHeld = temp;
        currentPiece = new Piece(startCoords[0], startCoords[1], held.typeRef);
        held = temp;
    }

    held.blocks = [];
    
    let icon = held.name;
    
    if (pieceIcon === undefined) pieceIcon = document.createElement("img");
    
    pieceIcon.setAttribute("src", `Assets/queue/${icon}.png`);
    pieceIcon.setAttribute("alt", "piece");
    pieceIcon.style.position = "absolute";
    pieceIcon.style.marginTop = "-451px";
    pieceIcon.style.marginLeft = "-76px";
    heldDiv.appendChild(pieceIcon);
}

function inputEngine(e)
{
    currentKey = e.key.toUpperCase();

    switch(currentKey)
    {
        case("A"):
            currentPiece.moveHorizontal(-1);
            break;

        case("D"):
            currentPiece.moveHorizontal(1);
            break;
        
        case("S"):
            currentPiece.moveDown();
            break;

        case("E"):
            currentPiece.rotate();
            break;

        case("F"):
            storeCurrentPiece();
            break;
    }
    update();
    drawPieces();
}

function playerInput()
{
    window.addEventListener("keydown", inputEngine);
}

function endGame()
{
    window.removeEventListener("keydown", inputEngine);
    clearInterval(game);
    let overlay = document.createElement("img");
    overlay.className = "overlay";
    grid.appendChild(overlay);

    let restartButton = document.createElement('button');
    restartButton.innerHTML = "<img src='Assets/retry-button.png' onclick='window.location.reload()'>";
    restartButton.className = "restart-button";
    grid.appendChild(restartButton);
}

class Piece {
    constructor(startX, startY, type) {
      this.startX = startX;
      this.startY = startY;
      this.id = ++pieceCount;

      this.typeRef = type;
      this.name = type['name'];
      this.type = type['shape'];
      this.sprite = type['sprite'];
      this.rotation = type['rotation'];
      this.rotationState = 4;
      this.blocks = this.createBlocks();

      this.moveable = this.canMoveDown();
      pieces.push(this);
    }

    createBlocks()
    {
        let out = [];
        for (let i = 0; i < this.type.length; i++)
        {
            out[i] = new Block(this.id, this.startX + this.type[i][0], this.startY + this.type[i][1]);
        }

        return out;
    }
    canMoveDown()
    {
        for (let i = 0; i < this.blocks.length; i++)
        {
            let currentBlock = this.blocks[i];
            if (!currentBlock.canMoveDown()) return false;
        }

        return true;
    }

    moveDown()
    {
        if (!this.canMoveDown())
        {
            if (checkWin() == true)
            {
                playing = false;
                return;
            } 

            checkAllRowsForClears();
            currentPiece = new Piece(startCoords[0], startCoords[1], pieceQueue.shift());
            pieceQueue.push(possiblePieces[Math.floor(Math.random() * possiblePieces.length)]);
            previousHeld = undefined;
            return;
        } 

        for (let i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].moveDown(1);
        }
    }

    canMoveHorizontal(direction)
    {
        // TODO Simplify
        for (let i = 0; i < this.blocks.length; i++)
        {
            let currentBlock = this.blocks[i];           
            
            if (direction == -1 && currentBlock.x <= 0) return false;
            else if (direction == 1 && currentBlock.x >= board.length-1) return false;

            if (0 < currentBlock.x && currentBlock.x < board.length-1)
            {
                let leftX = board[currentBlock.x-1][currentBlock.y];
                let rightX = board[currentBlock.x+1][currentBlock.y];
    
                if (direction == -1 && notEmptySpace(leftX)  && leftX != currentBlock.id) return false;
    
                if (direction == 1 && notEmptySpace(rightX) && rightX != currentBlock.id) return false;
            }
        }

        return true;
    }

    moveHorizontal(direction)
    {
        if (!this.canMoveHorizontal(direction)) return;

        for (let i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].moveHorizontal(direction);
        }
    }

    isNextRotationValid()
    {
        let nextRotationState = this.rotationState+1;
        if (nextRotationState >= 3) nextRotationState = 0;

        for (let i = 0; i < this.blocks.length; i++)
        {
            let rotationSet = this.rotation[i];
            let currentBlock = this.blocks[i];

            let nextPos = board[currentBlock.x + rotationSet[nextRotationState][0]][(currentBlock.y + rotationSet[nextRotationState][1])];
            if(nextPos === undefined) return false; 
            if(nextPos != this.id && nextPos != "_") return false;
        }

        return true;
    }

    rotate()
    {
        if (!this.isNextRotationValid()) return;
        
        if (this.rotationState < 3) this.rotationState++;
        else if (this.rotationState >= 3) this.rotationState = 0;

        for (let i = 0; i < this.blocks.length; i++)
        {
            let rotationSet = this.rotation[i];
            let currentBlock = this.blocks[i];

            currentBlock.x += rotationSet[this.rotationState][0];
            currentBlock.y += rotationSet[this.rotationState][1];
        }
    }
}

class Block {
    constructor(id, x, y) {
        this.x = x;
        this.y = y;
        this.id = id;
    }

    moveHorizontal(direction)
    {
        this.x += direction;
    }

    moveDown(amount)
    {
        this.y += amount;
    }
    
    getSpaceBelow()
    {
        return board[this.x][this.y+1];
    }

    canMoveDown()
    {
        if (this.getSpaceBelow() === undefined) return false;
        if (this.getSpaceBelow() != ("_") && this.getSpaceBelow() != this.id) return false;

        return true;
    }
}

var board = createBoard(10,20);
const blockWidth = 30;
const startCoords = [4,0]

const queue = document.getElementById("queue");
var pieceQueue = [];
const queueSlots = [
    ["19px","93px"],
    ["19px","207px"],
    ["19px","321px"]
]

function drawQueue()
{
    queue.innerHTML = "";
    for (let x = 0; x < pieceQueue.length; x++)
    {
        let icon = pieceQueue[x]['name'];
        let pieceIcon = document.createElement("img");
        pieceIcon.setAttribute("src", `Assets/queue/${icon}.png`);
        pieceIcon.setAttribute("alt", "piece");
        pieceIcon.className = "pieceIcon";
        pieceIcon.style.left = queueSlots[x][0];
        pieceIcon.style.top = queueSlots[x][1];
        queue.appendChild(pieceIcon);
    }
}

function startQueue()
{
    for (let x = 0; x < 4; x++)
    {
        pieceQueue.push(possiblePieces[Math.floor(Math.random() * possiblePieces.length)]);
    }
}

startQueue();
var currentPiece = new Piece(startCoords[0], startCoords[1], pieceQueue.shift());
var playing = true;

heldDiv = document.getElementById("held");
var held;
var previousHeld;
var pieceIcon = undefined;

const scoreDiv = document.getElementById("score");
const levelDiv = document.getElementById("level");
const linesDiv = document.getElementById("lines");

function updateLevels()
{
    if (lines < 10) return;
    if (level >= maxLevel) 
    {
        level = maxLevel;
        return;
    }

    level = Math.ceil(lines / 10);
}

function updateInformation()
{
    scoreDiv.innerHTML = `<p class="score-text"> ${score} </p>`;
    levelDiv.innerHTML = `<p class="score-text"> ${level} </p>`;
    linesDiv.innerHTML = `<p class="score-text"> ${lines} </p>`;
}

var score = 0;
var level = 1;
var maxLevel = 10;
var lines = 0;

function main()
{
    if (playing == false) endGame();
    else if (playing == true)
    {
        currentPiece.moveDown();
        update();
        drawPieces();
        drawQueue();
        updateLevels();
        updateInformation();
    }
}

playerInput();
main();

var maxTickRate = 300;
var minTickRate = 100;
let tickRate = (maxTickRate - minTickRate) / 10;
var game = setInterval(main, (maxTickRate - (tickRate * level)));
