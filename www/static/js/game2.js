// Players
const player1 = {
  icon: '<svg viewBox="0 0 100 100" width="64" height="64" fill="none"><path d="M20 20L80 80M80 20L20 80" stroke="currentColor" stroke-width="10" stroke-linecap="round"></path></svg>',
  mark: "X",
};

const player2 = {
  icon: '<svg viewBox="0 0 100 100" width="64" height="64" fill="none"><circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="10"></circle></svg>',
  mark: "O",
};

// HTML elements
const cells = Array.from(document.querySelectorAll(".tic-tac-toe-child"));
const turnIndicator = document.querySelector(".player");
const scoreIndicator = document.querySelector(".tic-tac-toe-score");
const resetBtn = document.querySelector(".reset-btn");
const resultIndicator = document.querySelector(".game-result");

// Game state
const size = Math.sqrt(cells.length);
const rowScores = Array(size).fill(0);
const colScores = Array(size).fill(0);

let diagonalScore = 0;
let antiDiagonalScore = 0;
let moveCount = 0;
let score = 0;
let playerTurn = player1;
let gameOver = false;
let computerMoveTimeout = null;

// Update indicators
function updateUI() {
  turnIndicator.textContent = `${playerTurn.mark} to move`;
  scoreIndicator.textContent = `Score: ${score}`;
}

// Reset the game
function initializeGame() {
  clearTimeout(computerMoveTimeout);
  computerMoveTimeout = null;

  cells.forEach((cell) => {
    cell.innerHTML = "";
    delete cell.dataset.mark;
  });

  resultIndicator.textContent = "";
  rowScores.fill(0);
  colScores.fill(0);

  diagonalScore = 0;
  antiDiagonalScore = 0;
  moveCount = 0;
  gameOver = false;
  playerTurn = player1;

  updateUI();
}

// Check if the latest move wins
function checkWinner(index, player) {
  const row = Math.floor(index / size);
  const col = index % size;
  const value = player === player1 ? 1 : -1;

  rowScores[row] += value;
  colScores[col] += value;

  if (row === col) diagonalScore += value;
  if (row + col === size - 1) antiDiagonalScore += value;

  return [
    rowScores[row],
    colScores[col],
    diagonalScore,
    antiDiagonalScore,
  ].some((sum) => Math.abs(sum) === size);
}

// Place a mark and handle the game result
function makeMove(index) {
  const cell = cells[index];

  if (gameOver || cell.dataset.mark) return false;

  const currentPlayer = playerTurn;

  cell.innerHTML = currentPlayer.icon;
  cell.dataset.mark = currentPlayer.mark;
  moveCount++;

  if (checkWinner(index, currentPlayer)) {
    gameOver = true;

    if (currentPlayer === player1) {
      score++;
    }

    updateUI();
    turnIndicator.textContent = "Game over";
    resultIndicator.textContent = `${currentPlayer.mark} wins!`;
    return false;
  }

  if (moveCount === cells.length) {
    gameOver = true;
    turnIndicator.textContent = "Game over";
    resultIndicator.textContent = "It's a draw!";
    return false;
  }

  playerTurn = currentPlayer === player1 ? player2 : player1;
  updateUI();

  return true;
}

// Computer randomly chooses an empty cell
function makeComputerMove() {
  if (gameOver || playerTurn !== player2) return;

  turnIndicator.textContent = "Computer is thinking...";

  computerMoveTimeout = setTimeout(() => {
    computerMoveTimeout = null;

    if (gameOver || playerTurn !== player2) return;

    const emptyIndices = cells
      .map((cell, index) => (!cell.dataset.mark ? index : -1))
      .filter((index) => index !== -1);

    if (emptyIndices.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    makeMove(emptyIndices[randomIndex]);
  }, 900);
}

// Event listeners
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (playerTurn !== player1 || gameOver) return;

    if (makeMove(index)) {
      makeComputerMove();
    }
  });
});

resetBtn.addEventListener("click", initializeGame);

// Start
initializeGame();
