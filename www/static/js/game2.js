// AI generated SVG for X and O
const player1 = {
  icon: '<svg viewBox="0 0 100 100" width="64" height="64" fill="none"><path d="M20 20L80 80M80 20L20 80" stroke="currentColor" stroke-width="10" stroke-linecap="round"></path></svg>',
  mark: "X",
  win: false,
};

const player2 = {
  icon: '<svg viewBox="0 0 100 100" width="64" height="64" fill="none"><circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="10"></circle></svg>',
  mark: "O",
  win: false,
};

let playerTurn = player1;

// Get the cells' div
let ticTacToeChildren = document.getElementsByClassName("tic-tac-toe-child")

// Display turn
let playerTurnSpan = document.querySelector(".turn");

let resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", () => initializeGame());

// Reset the board and player state to start a fresh game.
function initializeGame() {
  player1.win = false;
  player2.win = false;
  playerTurn = player1;
  playerTurnSpan.innerText = "";
  playerTurnSpan.innerText = playerTurn.mark;
  clearGrid();
}

// Place the current player's icon in the clicked cell if it is empty.
function placeMove(e) {
  if (e.target.innerHTML == "") {
    e.target.innerHTML = playerTurn.icon;
  } else {
    placeMove(e);
  }
  switchTurn();
}

// Swap turns after each valid move and update the turn indicator.
function switchTurn() {
  playerTurn = playerTurn == player1 ? player2 : player1;
  playerTurnSpan.innerText = "";
  playerTurnSpan.innerText = playerTurn.mark;
}

// Check whether the current board state is a win or a draw.
function checkGameEnd() {
  updateWinningStatus();
  if (player1.win) {
    alert("Player 1 is the winner!!!");
    initializeGame();
  }
  if (player2.win) {
    alert("Player 2 is the winner!!!");
    initializeGame();
  }

  let checker = 0;
  for (const elem of ticTacToeChildren){
    if (elem.innerHTML == ""){break}
    checker += 1;
  }
  if (checker == ticTacToeChildren.length){
    alert("The game is draw!!!");
    initializeGame();
  }
}

// Mark the winner if any row, column, or diagonal matches the same icon.
function updateWinningStatus() {
  if (
    r1c1.innerHTML == player1.icon &&
    r1c2.innerHTML == player1.icon &&
    r1c3.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r2c1.innerHTML == player1.icon &&
    r2c2.innerHTML == player1.icon &&
    r2c3.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r3c1.innerHTML == player1.icon &&
    r3c2.innerHTML == player1.icon &&
    r3c3.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r1c1.innerHTML == player1.icon &&
    r2c1.innerHTML == player1.icon &&
    r3c1.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r1c2.innerHTML == player1.icon &&
    r2c2.innerHTML == player1.icon &&
    r3c2.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r1c3.innerHTML == player1.icon &&
    r2c3.innerHTML == player1.icon &&
    r3c3.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r1c1.innerHTML == player1.icon &&
    r2c2.innerHTML == player1.icon &&
    r3c3.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r1c3.innerHTML == player1.icon &&
    r2c2.innerHTML == player1.icon &&
    r3c1.innerHTML == player1.icon
  ) {
    player1.win = true;
  } else if (
    r1c1.innerHTML == player2.icon &&
    r1c2.innerHTML == player2.icon &&
    r1c3.innerHTML == player2.icon
  ) {
    player2.win = true;
  } else if (
    r2c1.innerHTML == player2.icon &&
    r2c2.innerHTML == player2.icon &&
    r2c3.innerHTML == player2.icon
  ) {
    player2.win = true;
  } else if (
    r3c1.innerHTML == player2.icon &&
    r3c2.innerHTML == player2.icon &&
    r3c3.innerHTML == player2.icon
  ) {
    player2.win = true;
  } else if (
    r1c1.innerHTML == player2.icon &&
    r2c1.innerHTML == player2.icon &&
    r3c1.innerHTML == player2.icon
  ) {
    player2.win = true;
  } else if (
    r1c2.innerHTML == player2.icon &&
    r2c2.innerHTML == player2.icon &&
    r3c2.innerHTML == player2.icon
  ) {
    player2.win = true;
  } else if (
    r1c3.innerHTML == player2.icon &&
    r2c3.innerHTML == player2.icon &&
    r3c3.innerHTML == player2.icon
  ) {
    player2.win = true;
  } else if (
    r1c1.innerHTML == player2.icon &&
    r2c2.innerHTML == player2.icon &&
    r3c3.innerHTML == player2.icon
  ) {
    player2.win = true;
  } else if (
    r1c3.innerHTML == player2.icon &&
    r2c2.innerHTML == player2.icon &&
    r3c1.innerHTML == player2.icon
  ) {
    player2.win = true;
  }
}

// Clear every game cell so the board can be reset.
function clearGrid() {
    for (const elem of ticTacToeChildren){
      elem.innerHTML = "";}
}
