const canvas = document.getElementById("flappy-furman");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const context = canvas.getContext("2d");
const ff = document.getElementById("ff-buttons");
const buttonDisplay = window.getComputedStyle(ff);
const mobileUp = document.getElementById("ff-move-up");
const mobileDown = document.getElementById("ff-move-down");

let squirrel = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    gravity: 0.4,
    velocity: -2,
};

const pipeW = 150;
const pipeH = 300;
const pipeSpeed = 1.25;
let clicked = false;
let gameOver = false;
let score = 0;
let attempts = 0;
let pipe = [];
const pipeGap = 100;
const pipeN = new Image();
const pipeS = new Image();
const sqrlImg = new Image();

sqrlImg.src = "/static/img/squirrel-standing.png";
pipeN.src = "/static/img/northpipe.png";
pipeS.src = "/static/img/southpipe.png";

function drawSquirrel() {
    context.drawImage(sqrlImg, squirrel.x - squirrel.radius, squirrel.y - squirrel.radius, 
                squirrel.radius * 2, squirrel.radius * 2);
}

function makePipe(){
    const margin = 30;
    const topGap = margin + Math.random() * (canvas.height - pipeGap - margin)
    pipe.push({
        x: canvas.width,
        topGap: topGap,
        passed: false
    })}

function drawPipes(){
    // adds to pipe 
    if (pipe.length == 0 || pipe[pipe.length - 1].x < canvas.width - 300){
        makePipe();}

    for (var i = 0; i < pipe.length; i++) {
        const p = pipe[i];
        //draws pipes
        context.drawImage(pipeN, p.x, p.topGap, pipeW, pipeH);
        context.drawImage(pipeS, p.x, p.topGap - pipeH, pipeW, pipeH);
        pipe[i].x -= pipeSpeed;

        const left = squirrel.x - (squirrel.radius * .8);
        const right = squirrel.x + (squirrel.radius * .8);
        const top = squirrel.y - (squirrel.radius * .8);
        const bottom = squirrel.y + (squirrel.radius * .8);

        const insidePipe = right > p.x && left < p.x + pipeW * 2;
        const hitsPipe = top > p.topGap + pipeGap / 2 || bottom + pipeGap / 2 < p.topGap;

        if (hitsPipe && insidePipe) {
            restartGame();
        }

        if (top >= canvas.height || bottom <= -canvas.height){
            restartGame();
        }
        // updates score
        if (p.x + pipeGap == squirrel.x) {
            p.passed = true;
            score += 10;}}

        // remove pipes that are off-screen
        pipe = pipe.filter(p => p.x + pipeW > 0);
}

function instructions(){
    clicked = true;
    context.font = "30px Sans";
    context.fillStyle = "#3f1954";
    context.fillText("Welcome to Flappy Furman!", 
        canvas.width / 2 - 150, canvas.height / 2);
    context.fillText("Click to start.", 
        canvas.width / 2 - 150, canvas.height / 2 + 30)
}

function deathScreen(){
    context.font = "60px Sans";
    context.fillStyle = "#775fc6";
    context.fillText("YOU DIED.", canvas.width / 2 - 150, canvas.height / 2);
    context.fillText("Score : " + score, canvas.width / 2 - 150, canvas.height / 1.5)
}

function moveUp(){
    squirrel.y -= 40;
}

function moveDown(){
    squirrel.y += 40;
}

function startGame(){
    if (!clicked){
        instructions();
    }
    else if (!gameOver){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawSquirrel();
        drawPipes()
        
        squirrel.y += squirrel.gravity;
        context.fillStyle = "#000";
        context.font = "20px Fredoka";
        context.fillText("Score : " + score, 10, canvas.height - 10);
        requestAnimationFrame(startGame);
    }
    else{
        context.clearRect(0, 0, canvas.width, canvas.height);
        deathScreen();
    }
}

function restartGame() {
    if (attempts == 3){
        gameOver = true;
    }
    else{
        squirrel.y = canvas.height / 2;
        attempts += 1;
        pipe = [];
    }
}

document.addEventListener("keydown", function (e) {
    if (e.key === "s" || e.key === "ArrowDown"){
        moveDown();
    }
    if (e.key === "w" || e.key === "ArrowUp"){
        moveUp();
    }
})

const start = document.getElementById("ff-start");
const end = document.getElementById("ff-end");

start.addEventListener("click", () =>
    { startGame(); });

end.addEventListener("click", () =>{ 
        gameOver = false;
        attempts = 0;
        clicked = false;
        score = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        startGame();
    })

// //mobile movement 
let mobileMovement = false;
let upButton, downButton;

if (buttonDisplay.getPropertyValue("display") != "none" && clicked) {
    mobileMovement = true;
    mobileButtons();
} 
function mobileButtons(){
    upButton = document.createElement("button");
    upButton.innerHTML = "↑"
    downButton = document.createElement("button");
    downButton.innerHTML = "↓"
    start.parentNode.replaceChild(upButton, start);
    end.parentNode.replaceChild(downButton, end);
}