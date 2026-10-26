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

// Get the cells' div
let ticTacToeChildren = document.getElementsByClassName("tic-tac-toe-child");

let resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", () => initializeGame());

// Reset the board and player state to start a fresh game.
function initializeGame() {
  player1.win = false;
  player2.win = false;
  playerTurn = player1;
  clearGrid();
}

// Place the current player's icon in the clicked cell if it is empty.
function placeMove(e) {
  const cell = e.currentTarget;
  if (cell.innerHTML !== "") {
    return;
  }

  cell.innerHTML = playerTurn.icon;
  cell.dataset.mark = playerTurn.mark;
  switchTurn();
}

// Swap turns after each valid move and update the turn indicator.
function switchTurn() {
  playerTurn = playerTurn == player1 ? player2 : player1;
}

// Check whether the current board state is a win or a draw.
function checkGameEnd() {
  updateWinningStatus();
  if (player1.win) {
    alert("Player 1 is the winner!!!");
    initializeGame();
    return;
  }
  if (player2.win) {
    alert("Player 2 is the winner!!!");
    initializeGame();
    return;
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
  }
}

// Clear every game cell so the board can be reset.
function clearGrid() {
  for (const elem of ticTacToeChildren) {
    elem.innerHTML = "";
    delete elem.dataset.mark;
  }
}
