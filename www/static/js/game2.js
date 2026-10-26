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

const winningLines = [
  ["r1c1", "r1c2", "r1c3"],
  ["r2c1", "r2c2", "r2c3"],
  ["r3c1", "r3c2", "r3c3"],
  ["r1c1", "r2c1", "r3c1"],
  ["r1c2", "r2c2", "r3c2"],
  ["r1c3", "r2c3", "r3c3"],
  ["r1c1", "r2c2", "r3c3"],
  ["r1c3", "r2c2", "r3c1"],
];

// Update each player's win status based on the current board.
function updateWinningStatus() {
  for (const player of [player1, player2]) {
    player.win = winningLines.some((line) =>
      line.every(
        (id) => document.getElementById(id).dataset.mark === player.mark,
      ),
    );
  }
}

let playerTurn = player1;
const turnIndicator = document.querySelector(".player");
const scoreIndicator = document.querySelector(".tic-tac-toe-score");
let score = 0;

// Show which player is expected to move next.
function updateTurnIndicator() {
  turnIndicator.textContent =
    playerTurn === player1 ? "Player 1 (X) to move" : "Player 2 (O) to move";
}

// Display the current score.
function updateScoreIndicator() {
  scoreIndicator.textContent = `Score: ${score}`;
}

updateTurnIndicator();
updateScoreIndicator();

// Get the cells' div
let ticTacToeChildren = document.getElementsByClassName("tic-tac-toe-child");
for (const cell of ticTacToeChildren) {
  cell.addEventListener("click", placeMove);
}

let resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", () => initializeGame());

// Reset the board and player state to start a fresh game.
function initializeGame() {
  player1.win = false;
  player2.win = false;
  playerTurn = player1;
  updateTurnIndicator();
  clearGrid();
}

// Place the user's mark, check the game result, and let the computer respond.
function placeMove(e) {
  const cell = e.currentTarget;
  if (playerTurn !== player1 || cell.dataset.mark) {
    return;
  }

  cell.innerHTML = playerTurn.icon;
  cell.dataset.mark = playerTurn.mark;
  switchTurn();

  // Wait for the move to render before checking the game result.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!checkGameEnd()) {
        makeComputerMove();
      }
    });
  });
}

// Switch to the other player and refresh the turn indicator.
function switchTurn() {
  playerTurn = playerTurn == player1 ? player2 : player1;
  updateTurnIndicator();
}

// Check for a win or draw, score user wins, and reset finished games.
function checkGameEnd() {
  updateWinningStatus();
  if (player1.win) {
    score += 1;
    updateScoreIndicator();
    alert("Player 1 is the winner!!!");
    initializeGame();
    return true;
  }
  if (player2.win) {
    alert("Player 2 is the winner!!!");
    initializeGame();
    return true;
  }

  let checker = 0;
  for (const elem of ticTacToeChildren) {
    if (elem.innerHTML == "") {
      break;
    }
    checker += 1;
  }
  if (checker == ticTacToeChildren.length) {
    alert("The game is draw!!!");
    initializeGame();
    return true;
  }

  return false;
}

// Remove all marks from the board.
function clearGrid() {
  for (const elem of ticTacToeChildren) {
    elem.innerHTML = "";
    delete elem.dataset.mark;
  }
}

// Place the computer's mark in a randomly selected empty cell.
function makeComputerMove() {
  if (playerTurn !== player2) {
    return;
  }

  // Get all empty cells
  const emptyCells = Array.from(ticTacToeChildren).filter(
    (cell) => !cell.dataset.mark,
  );

  // if no empty cells do nothing
  if (emptyCells.length == 0) {
    checkGameEnd();
    return;
  }

  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  cell.innerHTML = playerTurn.icon;
  cell.dataset.mark = playerTurn.mark;
  switchTurn();

  requestAnimationFrame(() => {
    requestAnimationFrame(checkGameEnd);
  });
}
