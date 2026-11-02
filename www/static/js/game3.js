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
let constant;
const pipe = [];
const pipeGap = 200;
const pipeN = new Image()
const pipeS = new Image()
const sqrlImg = new Image();

sqrlImg.src = "/static/img/squirrel-standing.png";
pipeN.src = "/static/img/northpipe.png";
pipeS.src = "/static/img/southpipe.png";

pipe[0] = {
  x: canvas.width,
  y: 0,
};

function drawSquirrel() {
    context.drawImage(sqrlImg, squirrel.x - squirrel.radius, squirrel.y - squirrel.radius, 
                squirrel.radius * 2, squirrel.radius * 2);
}

function drawPipes(){
    for (var i = 0; i < pipe.length; i++) {
        constant = pipeN.height + pipeGap;
        context.drawImage(pipeN, pipe[i].x, pipe[i].y);
        context.drawImage(pipeS, pipe[i].x, canvas.height + constant);
        pipe[i].x-= 1.5;

        if (pipe[i].x == 150){
        pipe.push({
            x: canvas.width,
            y: Math.floor(Math.random() * (pipeN.height) - pipeN.height)})
    }
        if ((squirrel.x + squirrel.width >= pipe[i].x &&
            squirrel.x <= pipe[i].x + pipeN.width &&
            (squirrel.y <= pipe[i].y + pipeN.height ||
            squirrel.y + squirrel.height >= pipe[i].y + constant)) ||
        squirrel.y + squirrel.height >= canvas.height - pipeN.height
        ) {
            restartGame();
        }
        if (pipe[i].x == 3) {
            score += 10;
}}}

function startGame(){
    if (!clicked){
        requestAnimationFrame(instructions())
    }
    if (!gameOver){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawSquirrel();
        squirrelMovement();
        drawPipes();
        requestAnimationFrame(startGame);
        
        document.addEventListener("keydown", moveUp);
        context.fillStyle = "#000";
        context.font = "20px Fredoka";
        context.fillText("Score : " + score, 10, canvas.height - 10);
    }
    else{
        context.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(deathScreen)
    }
}
function squirrelMovement(){
    squirrel.y += squirrel.gravity;

    if (squirrel.y >= canvas.height && attempts < 3){
        attempts += 1;
        restartGame();
}}

function instructions(){
    context.font = "30px Sans";
    context.fillStyle = "#3f1954";
    // context.strokeStyle = "#a05cc5";
    // context.fillRect(50, 25, canvas.width / 2 + 100, canvas.height / 2 + 100)
    context.fillText("Welcome to Flappy Furman!", 
        canvas.width / 2 - 150, canvas.height / 2);
    context.fillText("Press space to start.", 
        canvas.width / 2 - 150, canvas.height / 2 + 30)
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
}

document.getElementById("flappy-furman-start").addEventListener("click", () =>
    { startGame(); });
