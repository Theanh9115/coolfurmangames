const canvas = document.getElementById("flappy-furman");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const context = canvas.getContext("2d");
const ff = document.getElementById("ff-buttons");
const buttonDisplay = window.getComputedStyle(ff);

const pipeW = 150;
const pipeH = 300;
const pipeSpeed = 1.5;
let clicked = false;
let gameOver = false;
let score = 0;
let lives = 3;
let pipe = [];
const pipeGap = 100;
const pipeN = new Image();
const pipeS = new Image();
const sqrlImg = new Image();
const heart = new Image();
const pass50 = new Audio("/static/audio/ff-pipe-pass.mp3");
const bgm = new Audio("/static/audio/alt-bgm.mp3");
const lastLife = new Audio("/static/audio/final-life.mp3")

pass50.volume = .3;
bgm.volume = .2;
lastLife.volume = .2;

heart.src = "/static/img/heart-life.png";
sqrlImg.src = "/static/img/squirrel-standing.png";
pipeN.src = "/static/img/northpipe.png";
pipeS.src = "/static/img/southpipe.png";

let squirrel = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    gravity: 1.75,
    velocity: -2,
};

let hearts = {
    x: canvas.width - 25,
    y: canvas.height - 285
}

//draws squirrel
function drawSquirrel() {
    context.drawImage(sqrlImg, squirrel.x - squirrel.radius, squirrel.y - squirrel.radius, 
                squirrel.radius * 2, squirrel.radius * 2);
}

//creates three seperate hearts
function drawLives(){
    context.drawImage(heart, hearts.x - 20, hearts.y, 20, 20);
    context.drawImage(heart, hearts.x - 40, hearts.y, 20, 20);
    context.drawImage(heart, hearts.x - 60, hearts.y, 20, 20);
}

function deleteLife(){
    context.fillStyle = "rgba(0,0, 0, 1)"
    if (lives == 2) {
        context.fillRect(hearts.x - 60, hearts.y, 20, 20)}
    else if (lives == 1){
        context.fillRect(hearts.x - 40, hearts.y, 20, 20)
    }
    else{
        context.fillRect(hearts.x - 20, hearts.y, 20, 20)
    }
}

function makePipe(){
    const margin = 20;
    const topGap = margin + Math.random() * (canvas.height - pipeGap - margin) 
    pipe.push({
        x: canvas.width,
        topGap: topGap,
        passed: false
    })}

function Sounds(){
    if (score % 50 == 0 && score != 0){
        pass50.play()}
    if (lives == 1){
        pass50.muted = true;
        bgm.muted = true;
        lastLife.play();
        lastLife.loop = true;}
    else{
        bgm.play();
    }
}

// most of this was made by Claude with my own changes to make collision kinda work 
function drawPipes(){
    // adds to pipe 
    if (pipe.length == 0 || pipe[pipe.length - 1].x < canvas.width - 300){
        makePipe();}

    for (var i = 0; i < pipe.length; i++) {
        const p = pipe[i];
        // draws pipes
        context.drawImage(pipeN, p.x, p.topGap, pipeW, pipeH);
        context.drawImage(pipeS, p.x, p.topGap - pipeH, pipeW, pipeH);
        p.x -= pipeSpeed;

        //ramping up speed
        if (score >= 50){
            p.x -= pipeSpeed * .5;
        }
        if (score >= 100){
            p.x -= pipeSpeed * .75;
        }
        if (score >= 200){
            p.x -= pipeSpeed * 1.25;
        }
        // hitbox
        const left = squirrel.x - squirrel.radius * .8;
        const right = squirrel.x + squirrel.radius * .8;
        const top = squirrel.y - squirrel.radius * .8;
        const bottom = squirrel.y + squirrel.radius * .8;

        // collision 
        const insidePipe = right > p.x + pipeW / 2 && left < p.x + pipeW * 2;
        const hitsPipe = top > p.topGap + pipeGap / 1.5 || bottom + pipeGap / 2 < p.topGap;

        if (hitsPipe && insidePipe) {
            console.log(top, right, p.x + pipeW, p.topGap + pipeGap / 1.5)
            lives -= 1;
            restartGame();
        }

        // hitting the bottom or top of canvas
        if (top >= canvas.height || bottom <= -canvas.height){
            lives -= 1;
            restartGame();
        }
        // updates score
        if (!p.passed && p.x + pipeGap < left) {
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

function startGame(){
    if (!clicked){
        instructions();
    }
    if (!gameOver){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawSquirrel();
        drawPipes();
        Sounds();
        // drawLives();
        
        squirrel.y += squirrel.gravity;
        context.fillStyle = "#000";
        context.font = "20px Fredoka";
        context.fillText("Score : " + score, 10, canvas.height - 10);
        context.fillText("Lives :" + lives, canvas.height, canvas.height - 270);
        requestAnimationFrame(startGame);
    }
    else{
        context.clearRect(0, 0, canvas.width, canvas.height);
        lastLife.muted = true;
        deathScreen();
    }
}

function restartGame() {
    if (lives == 0){
        gameOver = true;
    }
    else{
        squirrel.y = canvas.height / 2;
        // deleteLife();
        pipe = [];
    }
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.code === "Enter")
    moveUp();
})

const start = document.getElementById("ff-start");
const end = document.getElementById("ff-end");

start.addEventListener("click", () =>
    { startGame(); });

end.addEventListener("click", () =>{ 
        gameOver = false;
        lives = 3;
        clicked = false;
        score = 0;
        lastLife.muted = true;
        startGame();
})

// mobile movement 
if (screen.width <= 480 && clicked) {
    context.addEventListener("touchend", () => {
        moveUp();
    })
}