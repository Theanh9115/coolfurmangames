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

const gravity = -0.5;
const terminalVelocity = 15;

// Platform variables
const platWidth = 50;
const platHeight = 5;
let platforms = [];
generatePlatforms();

// Event listener initialization
keysPressed = {};
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {

    keysPressed[e.key.toLowerCase()] = true;
    
    // Temp: randomize platform position
    if (keysPressed["r"]) {
        platforms = [];
        generatePlatforms();
    }
}

function keyUpHandler(e) {
    keysPressed[e.key.toLowerCase()] = false;
}

function handleMovementInput() {
    // Move only if their respective direction keys are pressed
    if (keysPressed["d"] && !keysPressed["a"]) {
        playerXVel = 3;
    }
    if (keysPressed["a"] && !keysPressed["d"]) {
        playerXVel = -3;
    }
    // Stop moving if both or none of movement keys are pressed
    if ((!keysPressed["d"] && !keysPressed["a"]) ||
        (keysPressed["d"] && keysPressed["a"])) {
            playerXVel = 0;
     } 
}


function collisionDetection() {
    // Hit any generated platforms
    for (platform of platforms) {
        if (playerX + playerWidth > platform.x && playerX < platform.x + platWidth &&
            playerY + playerHeight > platform.y && playerY < platform.y && playerYVel > 0) {
                playerYVel = -9;
            }
    }
}

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "#430000";
    ctx.fill();
    ctx.closePath();
}

function generatePlatforms() {
    // Generate 10 platforms in random positions
    for (let i = 0; i < 10; i++) {
        platforms.push(
        {x: Math.floor(Math.random() * gameWindow.width - platWidth),
        y: Math.floor(Math.random() * gameWindow.height - platHeight)});
    }
}

function drawPlatforms() {
    ctx.beginPath();
    for (platform of platforms) {
        ctx.rect(platform.x, platform.y, platWidth, platHeight);
        ctx.fillStyle = "#090043";
        ctx.fill();
    }
    ctx.closePath()
}

function checkBounds() {
    if (playerX < 0) {
        playerX = gameWindow.width;
    }
    if (playerX > gameWindow.width) {
        playerX = 0;
    }
    if (playerY > gameWindow.height) {
        playerY = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, gameWindow.width, gameWindow.height)

    drawPlayer();
    drawPlatforms();
    // drawFloor();

    handleMovementInput();
    checkBounds();
    collisionDetection();

    playerX += playerXVel;
    playerY += playerYVel - gravity;
    playerYVel += 0.25;
    if (playerYVel > terminalVelocity) {
        playerYVel = terminalVelocity;
    }

    
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