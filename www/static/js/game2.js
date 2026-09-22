const player1 = "X";
const player2 = "O";

const draw = 0;
const player1Win = 1;
const player2Win = 2;
let playerTurn = player1;

let r1c1 = document.getElementById("r1c1");
let r1c2 = document.getElementById("r1c2");
let r1c3 = document.getElementById("r1c3");
let r2c1 = document.getElementById("r2c1");
let r2c2 = document.getElementById("r2c2");
let r2c3 = document.getElementById("r2c3");
let r3c1 = document.getElementById("r3c1");
let r3c2 = document.getElementById("r3c2");
let r3c3 = document.getElementById("r3c3");

let playerTurnSpan = document.querySelector(".player");

let resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", () => initializeGame());

function initializeGame() {
  playerTurn = player1;
  playerTurnSpan.innerText = "";
  playerTurnSpan.innerText = playerTurn;
  clearGrid();
}

function placeMove(e) {
  if (e.target.innerText == "") {
    e.target.innerText = playerTurn;
    if (isGameEnd()) {
      alert();
      initializeGame();
    }
  } else {
    placeMove(e);
  }
  switchTurn();
}

function switchTurn() {
  playerTurn = playerTurn == player1 ? player2 : player1;
  playerTurnSpan.innerText = "";
  playerTurnSpan.innerText = playerTurn;
}

function isGameEnd() {
  if (
    checkWinner() == player1Win ||
    checkWinner() == player2Win ||
    checkWinner() ||
    draw
  )
    return true;
}

function checkWinner() {
  if (
    r1c1.innerText == player1 &&
    r1c2.innerText == player1 &&
    r1c3.innerText == player1
  ) {
    return player1Win;
  } else if (
    r2c1.innerText == player1 &&
    r2c2.innerText == player1 &&
    r2c3.innerText == player1
  ) {
    return player1Win;
  } else if (
    r3c1.innerText == player1 &&
    r3c2.innerText == player1 &&
    r3c3.innerText == player1
  ) {
    return player1Win;
  } else if (
    r1c1.innerText == player1 &&
    r2c1.innerText == player1 &&
    r3c1.innerText == player1
  ) {
    return player1Win;
  } else if (
    r1c2.innerText == player1 &&
    r2c2.innerText == player1 &&
    r3c2.innerText == player1
  ) {
    return player1Win;
  } else if (
    r1c3.innerText == player1 &&
    r2c3.innerText == player1 &&
    r3c3.innerText == player1
  ) {
    return player1Win;
  } else if (
    r1c1.innerText == player1 &&
    r2c2.innerText == player1 &&
    r3c3.innerText == player1
  ) {
    return player1Win;
  } else if (
    r1c3.innerText == player1 &&
    r2c2.innerText == player1 &&
    r3c1.innerText == player1
  ) {
    return player1Win;
  } else if (
    r1c1.innerText == player2 &&
    r1c2.innerText == player2 &&
    r1c3.innerText == player2
  ) {
    return player2Win;
  } else if (
    r2c1.innerText == player2 &&
    r2c2.innerText == player2 &&
    r2c3.innerText == player2
  ) {
    return player2Win;
  } else if (
    r3c1.innerText == player2 &&
    r3c2.innerText == player2 &&
    r3c3.innerText == player2
  ) {
    return player2Win;
  } else if (
    r1c1.innerText == player2 &&
    r2c1.innerText == player2 &&
    r3c1.innerText == player2
  ) {
    return player2Win;
  } else if (
    r1c2.innerText == player2 &&
    r2c2.innerText == player2 &&
    r3c2.innerText == player2
  ) {
    return player2Win;
  } else if (
    r1c3.innerText == player2 &&
    r2c3.innerText == player2 &&
    r3c3.innerText == player2
  ) {
    return player2Win;
  } else if (
    r1c1.innerText == player2 &&
    r2c2.innerText == player2 &&
    r3c3.innerText == player2
  ) {
    return player2Win;
  } else if (
    r1c3.innerText == player2 &&
    r2c2.innerText == player2 &&
    r3c1.innerText == player2
  ) {
    return player2Win;
  } else if (
    r1c1.innerText != "" &&
    r1c2.innerText != "" &&
    r1c3.innerText != "" &&
    r2c1.innerText != "" &&
    r2c2.innerText != "" &&
    r2c3.innerText != "" &&
    r3c1.innerText != "" &&
    r3c2.innerText != "" &&
    r3c3.innerText != ""
  ) {
    return draw;
  }
}

function clearGrid() {
  r1c1.innerText = "";
  r1c2.innerText = "";
  r1c3.innerText = "";
  r2c1.innerText = "";
  r2c2.innerText = "";
  r2c3.innerText = "";
  r3c1.innerText = "";
  r3c2.innerText = "";
  r3c3.innerText = "";
}
