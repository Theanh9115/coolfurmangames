const canvas = document.getElementById("flappy-furman");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const context = canvas.getContext("2d");

const squirrel = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    gravity: 0.4,
    velocity: -2,
    lift: -3
};

const terminalVelocity = 20;
let clicked = false;
let gameOver = false;
let score = 0;
let attempts = 0;
const pipes = [];
const pipeGap = 175;
const sqrlImg = new Image();
sqrlImg.src = "/static/img/squirrel-standing.png";


function drawSquirrel() {
    context.drawImage(sqrlImg, squirrel.x - squirrel.radius, squirrel.y - squirrel.radius, 
                squirrel.radius * 2, squirrel.radius * 2);
}

// function drawPipes() {
//     for (let i = 0; i = canvas.height || squirrel.y &let;= 0) {
//         gameOver = true;
//     }
// }
document.addEventListener("keydown", moveUp)

function startGame(){
    if (!clicked){
        requestAnimationFrame(instructions())
    }
    if (!gameOver){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawSquirrel();
        squirrelMovement();
        requestAnimationFrame(startGame)
        
        context.fillStyle = "#000";
        context.font = "20px Fredoka";
        context.fillText("Score : " + score, 10, canvas.height - 10);
        
    }
    else{
        context.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(deathScreen())
    }
}
function squirrelMovement(){
    squirrel.y += squirrel.gravity;
    if (squirrel.y >= canvas.height && attempts < 3){
        attempts += 1;
        restartGame();
    }
}

function instructions(){
    context.font = "25px Sans";
    context.fillStyle = "#3f1954";
    context.fillRect(50, 100, canvas.width / 2 + 75, canvas.height / 2 +20, "#a05cc5")
    context.textAlign = "center";
    context.fillText("Welcome to Flappy Furman! Press space to start.", 
        canvas.width / 2 - 200, canvas.height / 2);
    clicked = true;
}

function deathScreen(){
    context.font = "60px Sans";
    context.fillStyle = "#775fc6";
    context.fillText("YOU DIED.", 
        canvas.width / 2 - 175, canvas.height / 2);
}

function moveUp(){
    squirrel.y -= 40;
}

function restartGame() {
    // pipes.length = 0;
    squirrel.y = canvas.height / 2;
    score = 0;
    gameOver = false;
    startGame();
}

document.getElementById("flappy-furman-start").addEventListener("click", () =>
    { startGame(); });
document.getElementById("flappy-furman-end").addEventListener("click", () => 
    { gameOver=true; startGame()});
