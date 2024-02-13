
const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#gameScore");
const resetButton = document.querySelector("#resetBtn");
const ctx = gameBoard.getContext("2d");
const boardWidth = gameBoard.width;
const boardHeight = gameBoard.height;

const paddleColor = "black";
const ballColor = "crimson";
const ballRadius = 10;
const paddleMovement = 20;

let roundNumber = 1;
let ballSpeed;
let ballX;
let ballY;
let ballDirectionX;
let ballDirectionY;
let paddleRight = { x: 370, y: 160, width: 20, height: 80 };
let paddleLeft = { x: 10, y: 160, width: 20, height: 80 };
let scoreRight = 0;
let scoreLeft = 0;
let gameOn = false;

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", newGame);

function startGame() {
    createBall();
    newFrame();
}

function newFrame() {
    if (gameOn) {
        setTimeout(() => {
            clearBoard();
            checkGameOver();
            drawPaddles();
            moveBall();
            drawBall(ballX, ballY);
            checkHit();
            newFrame();
        }, 10)
    } else {
        gameOverText();
    }
}

function clearBoard() {
    ctx.clearRect(0, 0, boardWidth, boardHeight);
}

function drawPaddles() {
    ctx.fillStyle = paddleColor;
    ctx.fillRect(paddleRight.x, paddleRight.y, paddleRight.width, paddleRight.height);
    ctx.fillRect(paddleLeft.x, paddleLeft.y, paddleLeft.width, paddleLeft.height);
}

function createBall() {
    ballSpeed = 1;
    ballX = boardWidth / 2;
    ballY = boardHeight / 2;
    if (roundNumber % 2 == 1) {
        ballDirectionX = 1;
        ballDirectionY = 1;
    } else {
        ballDirectionX = -1;
        ballDirectionY = -1;
    }
    drawBall(ballX, ballY);
}

function drawBall(x, y) {
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function moveBall() {
    ballX += ballDirectionX * ballSpeed;
    ballY += ballDirectionY * ballSpeed;
}

function checkHit() {
    // Y Hit
    if (ballY <= 0 + ballRadius || ballY >= boardHeight - ballRadius) {
        ballDirectionY *= -1;
    }
    // X Hit
    if (ballX <= 0 + ballRadius) {
        scoreRight += 1;
        updateScore();
        createBall();
        return
    }
    if (ballX >= boardWidth - ballRadius) {
        scoreLeft += 1;
        updateScore()
        createBall();
        return
    }
    // Paddle Hit
    if (ballX >= paddleRight.x - ballRadius) {
        if (ballY > paddleRight.y && ballY < paddleRight.y + paddleRight.height) {
            ballX = paddleRight.x - ballRadius; // Prevent ball stuck
            ballDirectionX *= -1;
            ballSpeed += 0.5;
            return
        }
    }
    if (ballX <= paddleLeft.x + paddleLeft.width + ballRadius) {
        if (ballY > paddleLeft.y && ballY < paddleLeft.y + paddleLeft.height) {
            ballX = paddleLeft.x + paddleLeft.width + ballRadius; // Prevent ball stuck
            ballDirectionX *= -1;
            ballSpeed += 0.5;
            return
        }
    }
}

function changeDirection(event) {
    const direction = event.key;
    const topBorder = 0;
    const bottomBorder = boardHeight - paddleRight.height;
    switch (direction) {
        case "ArrowUp":
            if (paddleRight.y > topBorder) {
                paddleRight.y -= paddleMovement;
            }
            break;
        case "ArrowDown":
            if (paddleRight.y < bottomBorder) {
                paddleRight.y += paddleMovement;
            }
            break;
        case "w":
            if (paddleLeft.y > topBorder) {
                paddleLeft.y -= paddleMovement;
            }
            break;
        case "s":
            if (paddleLeft.y < bottomBorder) {
                paddleLeft.y += paddleMovement;
            }
    }
}

function updateScore() {
    scoreText.textContent = `${scoreLeft} : ${scoreRight}`;
    roundNumber += 1;
}

function checkGameOver() {
    if (scoreLeft == 3 || scoreRight == 3) {
        gameOn = false;
    }
}

function gameOverText() {
    ctx.fillStyle = "gray";
    ctx.font = "50px Impact";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", boardWidth / 2, boardHeight / 2);
}

function newGame() {
    if (gameOn == false) {
         roundNumber = 1;
    ballSpeed = 1;
    paddleRight = { x: 370, y: 160, width: 20, height: 80 };
    paddleLeft = { x: 10, y: 160, width: 20, height: 80 };
    scoreRight = 0;
    scoreLeft = 0;
    gameOn = true;
    updateScore();
    startGame();   
    }
}
