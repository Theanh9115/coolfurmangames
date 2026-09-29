// Set up canvas
const canvas = document.getElementById("breakout-canvas");
const bctx = canvas.getContext("2d");

// Ball variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

// Paddle variables
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Movement & game state variables
let rightPressed = false;
let leftPressed = false;
let interval = 0;

// Brick variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickSeparation = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Initialize bricks
let bricks = [];
for (let col = 0; col < brickColumnCount; col++) {
    bricks[col] = [];
    for (let row = 0; row < brickRowCount; row++) {
        bricks[col][row] = {x: 0, y: 0, status: 1};
    }
}

let score = 0;


document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false; 
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false; 
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - (paddleWidth / 2);
    }
}

function collisionDetection() {
    for (let col = 0; col < brickColumnCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            const brick = bricks[col][row];
            if (x > brick.x && x < brick.x + brickWidth &&
                y > brick.y && y < brick.y + brickHeight &&
                brick.status === 1) {
                    dy = -dy;
                    brick.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval);
                    }
            }
        }
    }
}

function drawBricks() {
    for (let col = 0; col < brickColumnCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].status === 1) {
                const brickX = col * (brickWidth + brickSeparation) + brickOffsetLeft;
                const brickY = row * (brickHeight + brickSeparation) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                bctx.beginPath();
                bctx.rect(brickX, brickY, brickWidth, brickHeight);
                bctx.fillStyle = "#7b5e5e";
                bctx.fill();
                bctx.closePath();
            }
        }
    }
}

function drawBall() {
    bctx.beginPath();
    bctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    bctx.fillStyle = "#0095DD";
    bctx.fill();
    bctx.closePath();
}

function drawPaddle() {
    bctx.beginPath();
    bctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    bctx.fillStyle = "#4a4b4c";
    bctx.fill();
    bctx.closePath();
}

function drawScore() {
    bctx.font = "16px Arial";
    bctx.fillStyle = "#000000"
    bctx.fillText(`Score: ${score}`, 8, 20);
}

function draw() {
    bctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX - 5 && x < paddleX + paddleWidth + 5) {
            dy = -dy;
        }
        else {
            alert("GAME OVER!");
            document.location.reload();
            clearInterval(interval); 
        }
    }

    if (rightPressed) { 
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    if (leftPressed) { 
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;
}

function startGame() {
  setInterval(draw, 10);
}

const breakoutRunButton = document.getElementById("breakout-run-button");
breakoutRunButton.addEventListener("click", () => {
    startGame();
    breakoutRunButton.disabled = true;
});