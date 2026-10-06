// USE SEPARATE FRAMEWORK RECOMMENDED BY MDN
// const gameWindow = document.getElementById("paladin-jump");
// const windowRect = gameWindow.getBoundingClientRect();


// PlayState = {};

// window.onload = function() { // Runs only when page is fully loaded
//     const game = new Phaser.Game(windowRect.width, windowRect.height, Phaser.AUTO, 'paladin-jump');

//     game.state.add('play', PlayState);
//     game.state.start('play');
// }




// Game window setup
const gameWindow = document.getElementById("paladin-jump");
gameWindow.width = gameWindow.clientWidth;
gameWindow.height = gameWindow.clientHeight;
const ctx = gameWindow.getContext("2d");
let gameFrame;

// Player variables
let playerX = gameWindow.width / 2;
let playerY = gameWindow.height / 2;
const playerWidth = 10;
const playerHeight = 15;
let playerXVel = 0;
let playerYVel = 0;

let gravity = -0.5;

// Temp platform variables
let platX = Math.floor(Math.random() * gameWindow.width);
let platY = Math.floor(Math.random() * gameWindow.height);
const platWidth = 50;
const platHeight = 5;

let floorX = 0;
let floorY = gameWindow.height - 20;
const floorWidth = gameWindow.width;
const floorHeight = 10;

let onPlatform = false;


// Event listener initialization
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "d" || e.key === "D") {
        playerXVel = 3;
    }
    else if (e.key === "a" || e.key === "A") {
        playerXVel = -3;
    }

    if (e.key === "r") {
        platX = Math.floor(Math.random() * gameWindow.width);
        platY = Math.floor(Math.random() * gameWindow.height);
    }
}

function keyUpHandler(e) {
    if (e.key === "d" || e.key === "D" ||
        e.key === "a" || e.key === "A") {
        playerXVel = 0; 
    }
}

function collisionDetection() {
    if (playerX + playerWidth > platX && playerX < platX + platWidth &&
        playerY + playerHeight > platY && playerY < platY
        && playerYVel > 0) {
            playerYVel = -9;
    }
    else if (playerX > floorX && playerX < floorX + floorWidth &&
        playerY + playerHeight > floorY) {
            playerYVel = -9;
    }
}

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "#430000";
    ctx.fill();
    ctx.closePath();
}

function drawPlatforms() {
    ctx.beginPath();
    ctx.rect(platX, platY, platWidth, platHeight);
    ctx.fillStyle = "#090043";
    ctx.fill();
    ctx.closePath();
}

function drawFloor() {
    ctx.beginPath();
    ctx.rect(floorX, floorY, floorWidth, floorHeight);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
}

function checkBounds() {
    if (playerX < 0) {
        playerX = gameWindow.width;
    }
    if (playerX > gameWindow.width) {
        playerX = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, gameWindow.width, gameWindow.height)

    drawPlayer();
    drawPlatforms();
    drawFloor();

    checkBounds();
    collisionDetection();

    playerX += playerXVel;
    playerY += playerYVel - gravity;
    playerYVel += 0.25;


    
    gameFrame = requestAnimationFrame(draw)
}

function startGame() {
    gameFrame = requestAnimationFrame(draw);
}

const runButton = document.getElementById("paladin-run-button");
runButton.addEventListener("click", () => {
    startGame();
    runButton.disabled = true;
});