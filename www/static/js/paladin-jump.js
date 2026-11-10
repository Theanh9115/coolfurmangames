// Initialize HTML elements
const gameWindow = document.getElementById("paladin-jump-canvas");
const killScreen = document.getElementById("paladin-jump-kill-screen");
const killScreenScore = document.getElementById("paladin-jump-kill-score");
const restartButton = document.getElementById("paladin-jump-restart-button");
const gameButtons = document.getElementById("paladin-jump-move-buttons");
const buttonDisplay = window.getComputedStyle(gameButtons);
const leftButton = document.getElementById("pj-move-left");
const rightButton = document.getElementById("pj-move-right");
const runButton = document.querySelector(".game-run-button");
const gameCard = document.querySelector(".start-game-card");

// Initialize sprite sheet
const spriteSheet = new Image();
const backgroundImg = new Image();
spriteSheet.src = "/static/img/pj-sprites.png";
backgroundImg.src = "/static/img/pj-background.png";

// Game window variables and parameters
gameWindow.width = gameWindow.clientWidth;
gameWindow.height = gameWindow.clientHeight;
const ctx = gameWindow.getContext("2d");
let gameRunning = false;

// Delta time variables
const fps = 59;
const frameInterval = 1000 / fps;
let previousTime = performance.now();
let deltaTime, deltaTimeMultiplier;

// Hide game and kill screens
gameWindow.style.setProperty("display", "none");
killScreen.style.setProperty("display", "none");

// Player initialization
const playerWidth = 13;
const playerHeight = 24;
const gravity = -0.1;
const terminalVelocity = 15;
let playerX, playerY, playerXVel, playerYVel, score, facing;
let initializeMovement = false;

// Platform initialization
const platWidth = 60;
const platHeight = 6;
let platforms, initializePlatforms;

// Event listener initialization
let keysPressed = {};
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Mobile movement button functionality
let leftButtonHeld, rightButtonHeld;
let mobileMovement = false;
if (buttonDisplay.getPropertyValue("display") != "none") mobileMovement = true;

function keyDownHandler(e) {
  keysPressed[e.key.toLowerCase()] = true;
}

function keyUpHandler(e) {
  keysPressed[e.key.toLowerCase()] = false;
}

function initializeGame() {
    // Player variables
    playerX = gameWindow.width / 2;
    playerY = gameWindow.height - 50;
    playerXVel = 0;
    playerYVel = -9;
    score = 0;
    initializeMovement = true;
    facing = "left";

    // Platform variables
    platforms = [];
    initializePlatforms = true;

    // Reset movement key/button values
    keysPressed = {};
    leftButtonHeld = false;
    rightButtonHeld = false;
    leftButton.addEventListener("pointerdown", () => {leftButtonHeld = true});
    leftButton.addEventListener("pointerup", () => {leftButtonHeld = false});
    rightButton.addEventListener("pointerdown", () => {rightButtonHeld = true});
    rightButton.addEventListener("pointerup", () => {rightButtonHeld = false});

    // Game is fully visible, overlays are hidden
    gameWindow.style.setProperty("display", "block");
    gameWindow.style.setProperty("opacity", 1);
    gameCard.style.setProperty("display", "none");
    killScreen.style.setProperty("display", "none");

    // Delta time variables
    deltaTime = 0;
    deltaTimeMultiplier = 1;

    // Game is running
    gameRunning = true;
}

function handleMovementInput() {
    // Buttons move the player if in mobile view
    if (mobileMovement) {
        if (leftButtonHeld && !rightButtonHeld) {
            playerXVel = -4 * deltaTimeMultiplier;
            facing = "left";
        }
        if (rightButtonHeld && !leftButtonHeld) {
            playerXVel = 4 * deltaTimeMultiplier;
            facing = "right";
        }
        if ((!leftButtonHeld && !rightButtonHeld) ||
            (leftButtonHeld && rightButtonHeld)) {
                playerXVel = 0;
        } 
    }
    // Arrow keys (A and D) move player otherwise
    else {
        // Move only if their respective direction keys are pressed
        if (keysPressed["d"] && !keysPressed["a"]) {
            playerXVel = 4 * deltaTimeMultiplier;
            facing = "right";
        }

        if (keysPressed["a"] && !keysPressed["d"]) {
            playerXVel = -4 * deltaTimeMultiplier;
            facing = "left";
        }
        // Stop moving if both or none of movement keys are pressed
        if ((!keysPressed["d"] && !keysPressed["a"]) ||
            (keysPressed["d"] && keysPressed["a"])) {
                playerXVel = 0;
        }
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
    // Save un-transformed context
    ctx.save(); 

    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);

    // Player will appear upright if y velocity near
    if (playerYVel > -2 && playerYVel < 2) {
        // Flip image if player changes direction
        if (facing == "right") {
            ctx.drawImage(spriteSheet, 1, 43, playerWidth, playerHeight, 
                        playerX, playerY, playerWidth, playerHeight);
        }
        else ctx.drawImage(spriteSheet, 1, 16, playerWidth, playerHeight, 
                        playerX, playerY, playerWidth, playerHeight);
    }
    // Player will be in jumping pose if y velocity is high
    else {
        // Flip image if player changes direction
        if (facing == "right") {
            ctx.drawImage(spriteSheet, 21, 43, playerWidth, playerHeight, 
                        playerX, playerY, playerWidth, playerHeight);
        }
        else ctx.drawImage(spriteSheet, 21, 16, playerWidth, playerHeight, 
                        playerX, playerY, playerWidth, playerHeight);
    }
    
    ctx.closePath();

    // Restore un-transformed context
    ctx.restore();
}

function drawPlatforms() {
    ctx.beginPath();
    for (const platform of platforms) {
        ctx.rect(platform.x, platform.y, platWidth, platHeight);
        ctx.drawImage(spriteSheet, 0, 0, 60, 15, platform.x, platform.y, 60, 14);
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
        gameRunning = false;
        killScreenScore.textContent = `Score: ${Math.trunc(score)}`
        killScreen.style.setProperty("display", "flex");
        gameWindow.style.setProperty("opacity", 0.3);
    }

    // Move platforms and lock player height upon progression
    if (playerY < gameWindow.height / 2) {
        playerY = gameWindow.height / 2;

        for (const platform of platforms) {
            platform.y -= playerYVel * deltaTimeMultiplier;
            score += 0.1 * deltaTimeMultiplier;
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
    // Delta time will not affect Y values when first spawning in
    if (initializeMovement) {
        playerY += playerYVel;
        initializeMovement = false;
    }
    // Delta time affects Y movement normally after spawning
    else {
        playerY += (playerYVel * deltaTimeMultiplier) - gravity;
        playerYVel += 0.25 * deltaTimeMultiplier;
        if (playerYVel > terminalVelocity) {
            playerYVel = terminalVelocity;
        }
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
    let intScore = Math.trunc(score); // Hides decimals in score output
    ctx.fillText(`Score: ${intScore}`, 20, 30);
}



function draw(currentTime) {
    // Clear canvas
    ctx.clearRect(0, 0, gameWindow.width, gameWindow.height);
    // Add cenetered background image
    const scaleFactor = Math.max(gameWindow.width / backgroundImg.width, gameWindow.height / backgroundImg.height);
    ctx.drawImage(backgroundImg, 0 - (backgroundImg.width / 2), 0, 
                backgroundImg.width * scaleFactor, backgroundImg.height * scaleFactor);

    // Matching frame rates
    deltaTime = currentTime - previousTime;
    deltaTimeMultiplier = deltaTime / frameInterval;
    previousTime = currentTime;

    // Progress game by 1 frame
    generatePlatforms();
    drawPlatforms();
    drawPlayer();
    handleMovementInput();
    checkBounds();
    collisionDetection();
    updateVerticalMovement();
    drawScore();

    if (gameRunning) requestAnimationFrame(draw);
}

function startGame() {
    initializeGame();
    requestAnimationFrame(draw);
}

runButton.addEventListener("click", () => {
    initializeGame();
    startGame();
});

restartButton.addEventListener("click", () => {
    initializeGame();
    startGame();
});
