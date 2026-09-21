const canvas = document.getElementById("platformer-canvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += dx;
    y += dy;
    if (x + dx > canvas.width || x + dx < 0) {
        dx = -dx;
    }
    if (y + dy < 0 || y + dy > canvas.height) {
        dy = -dy;
    }
}

function startGame() {
    setInterval(draw, 10);
}

function endGame() {
    setInterval(draw, 0);
}

const runButton = document.getElementById("run-button");
runButton.addEventListener("click", () => {
    startGame();
    runButton.disabled = true;
    endButton.disabled = false;
});

const endButton = document.getElementById("end-button");
endButton.addEventListener("click", () => {
    endButton.disabled = true;
    startButton.disabled = false;
}

);