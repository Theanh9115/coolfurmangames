// Game window setup
const gameWindow = document.getElementById("paladin-jump");
gameWindow.width = gameWindow.clientWidth;
gameWindow.height = gameWindow.clientHeight;
const ctx = gameWindow.getContext("2d");
let gameFrame;

// Player variables
let playerX = gameWindow.width / 2;
let playerY = gameWindow.height - 50;
const playerWidth = 10;
const playerHeight = 15;
let playerXVel = 0;
let playerYVel = -9;

const gravity = -0.1;
const terminalVelocity = 15;

let score = 0;

// Platform variables
const platWidth = 50;
const platHeight = 5;
let platforms = [];
let initializePlatforms = true;

// Event listener initialization
keysPressed = {};
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  keysPressed[e.key.toLowerCase()] = true;

}

function keyUpHandler(e) {
  keysPressed[e.key.toLowerCase()] = false;
}

function handleMovementInput() {
    // Move only if their respective direction keys are pressed
    if (keysPressed["d"] && !keysPressed["a"]) {
        playerXVel = 4;
    }
    if (keysPressed["a"] && !keysPressed["d"]) {
        playerXVel = -4;
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
    if (
      playerX + playerWidth > platform.x &&
      playerX < platform.x + platWidth &&
      playerY + playerHeight > platform.y &&
      playerY < platform.y &&
      playerYVel > 0
    ) {
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

function drawPlatforms() {
    ctx.beginPath();
    for (const platform of platforms) {
        ctx.rect(platform.x, platform.y, platWidth, platHeight);
        ctx.fillStyle = "#090043";
        ctx.fill();
    }
    ctx.closePath();
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

    // Move platforms and lock player height upon progression
    if (playerY < gameWindow.height / 2) {
        playerY = gameWindow.height / 2;

        for (const platform of platforms) {
            platform.y -= playerYVel;
            score += 0.1;
        }
    }

    // When platform moves off-screen, remove it
    for (const platform of platforms) {
        if (platform.y > gameWindow.height) {
            // platforms.splice(platforms.indexOf(platform), 1);
            platforms.shift()
            console.log("Platform removed!")
        }
    }
}

function generatePlatforms() {
    // Platform initialization
    // Only runs when game first starts
    if (initializePlatforms) {
        // Generate 7 platforms on top half of screen
        for (let i = 0; i < 7; i++) {
            platforms.push(
            {x: Math.floor(Math.random() * (gameWindow.width - platWidth)),
            y: Math.floor(Math.random() * ((gameWindow.height / 2) - platHeight))});
        }

        // Generate 15 platforms on bottom half of screen
        for (let i = 0; i < 15; i++) {
            platforms.push(
            {x: Math.floor(Math.random() * (gameWindow.width - platWidth)),
            y: Math.floor(Math.random() * (gameWindow.height - (gameWindow.height / 2)) + (gameWindow.height / 2)) 
            });
        }

        // Sort platforms from highest to lowest y value
        platforms.sort((a,b) => b.y - a.y);

        initializePlatforms = false;
    }
    // Generate platforms between 30-40 pixels of each other
    if (platforms[platforms.length - 1].y > Math.random() * (60-50) + 50) {
        platforms.push(
        {x: Math.floor(Math.random() * (gameWindow.width - platWidth)),
        y: 0});
    }
    
}

function updateVerticalMovement() {
    playerX += playerXVel;
    playerY += playerYVel - gravity;
    playerYVel += 0.25;
    if (playerYVel > terminalVelocity) {
        playerYVel = terminalVelocity;
    }
}

function drawScore() {
    let drawOrder = [
        {rect: () => ctx.rect(0, 0, gameWindow.width, 40), color: "white"},
        {rect: () => ctx.rect(0, 41, gameWindow.width, 1), color: "#b9adc0"},
        {rect: () => ctx.rect(0, 42, gameWindow.width, 1), color: "#8558a57b"}];

    // Draw banner with drop shadow behind text
    let i = 0;
    while (i < drawOrder.length) {
        ctx.beginPath();
        drawOrder[i].rect();
        ctx.fillStyle = drawOrder[i].color;
        ctx.fill();
        ctx.closePath();
        i++;
    }
    
    // Draw score text
    ctx.font = "24px Fredoka, sans-serif";
    ctx.fillStyle = "black";
    let intScore = Math.trunc(score) // Hides decimals in score output
    ctx.fillText(`Score: ${intScore}`, 10, 30)
}

function draw() {
    ctx.clearRect(0, 0, gameWindow.width, gameWindow.height);

    generatePlatforms();
    drawPlayer();
    drawPlatforms();
    handleMovementInput();
    checkBounds();
    collisionDetection();
    updateVerticalMovement();
    drawScore();

    gameFrame = requestAnimationFrame(draw);
}

function startGame() {
  gameFrame = requestAnimationFrame(draw);
}

const runButton = document.getElementById("paladin-run-button");
runButton.addEventListener("click", () => {
  startGame();
  runButton.disabled = true;
});
