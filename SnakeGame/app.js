
const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#gameScore");
const resetButton = document.querySelector("#resetBtn");

const ctx = gameBoard.getContext("2d");
const boardWidth = gameBoard.getAttribute("width");
const boardHeight = gameBoard.getAttribute("height");

const snakeColor = "gray";
const foodColors = ["red", "green", "purple", "orange", "yellow"];
const unitSize = 20;

let snakeSegments = [[190, 190], [170, 190], [150, 190]];
let head = snakeSegments[0];
let foodColor;
let foodX;
let foodY;
let xMovement = unitSize;
let yMovement = 0;
let score = 0;
let gameOn = false;

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", newGame);

function drawSnake() {
    ctx.fillStyle = snakeColor;
    snakeSegments.forEach(segment => {
        ctx.fillRect(segment[0], segment[1], unitSize, unitSize);
    })
}

function move() {
    let headX = head[0] + xMovement;
    let headY = head[1] + yMovement;
    head = [headX, headY];
    snakeSegments.unshift(head);
    if (checkAte()) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        snakeSegments.pop();
    }
}

function createFood() {
    foodColor = foodColors[Math.floor(Math.random() * 5)];
    foodX = Math.floor(Math.random() * (boardWidth - unitSize) + unitSize / 2);
    foodY = Math.floor(Math.random() * (boardHeight - unitSize) + unitSize / 2);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    // ctx.fillRect(foodX, foodY, unitSize / 2, unitSize / 2);
    ctx.beginPath();
    ctx.arc(foodX, foodY, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function playGame() {
    gameOn = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    drawSnake()
    newFrame();
}

function newFrame() {
    if (gameOn) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            move();
            drawSnake();
            checkGameOver();
            newFrame();
        }, 100)
    } else {
        gameOverText();
    }
}

function clearBoard() {
    ctx.clearRect(0, 0, boardWidth, boardHeight);
}

function checkGameOver() {
    switch (true) {
        case head[0] < 0:
        case head[0] >= boardWidth:
        case head[1] < 0:
        case head[1] >= boardHeight:
            gameOn = false;
    }
    for (let seg of snakeSegments.slice(1)) {
        if (head[0] == seg[0] && head[1] == seg[1]) {
            gameOn = false;
        }  
    }
}

function checkAte() {
    let x = head[0];
    let y = head[1];
    for (let i = x; i < x + unitSize; i++) {
        if (i == foodX) {
            for (let j = y; j < y + unitSize; j++) {
                if (j == foodY) {
                    return true;
                }
            }
        }
    }
    return false;
}

function changeDirection(event) {
    const direction = event.key;
    let up = (yMovement == -unitSize);
    let down = (yMovement == unitSize);
    let right = (xMovement == unitSize);
    let left = (xMovement == -unitSize);
    switch (true) {
        case direction == "ArrowRight" && !left:
            xMovement = unitSize;
            yMovement = 0;
            break;
        case direction == "ArrowLeft" && !right:
            xMovement = -unitSize;
            yMovement = 0;
            break;
        case direction == "ArrowUp" && !down:
            xMovement = 0;
            yMovement = -unitSize;
            break;
        case direction == "ArrowDown" && !up:
            xMovement = 0;
            yMovement = unitSize;
    }
}

function gameOverText() {
    ctx.fillStyle = "black";
    ctx.font = "50px Impact";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", boardWidth / 2, boardHeight / 2);
}

function newGame() {
    if (gameOn == false) {
        xMovement = unitSize;
        yMovement = 0;
        score = 0;
        snakeSegments = [[190, 190], [170, 190], [150, 190]];
        head = snakeSegments[0];
        clearBoard();
        playGame();
    }
}
