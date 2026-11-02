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
const board = document.querySelector(".tic-tac-toe");
const turnIndicator = document.querySelector(".player");
const scoreIndicator = document.querySelector(".tic-tac-toe-score");
const resetBtn = document.querySelector(".reset-btn");
const resultIndicator = document.querySelector(".game-result");
const modeButtons = Array.from(document.querySelectorAll(".tic-tac-toe-mode"));
const sizeButtons = Array.from(document.querySelectorAll(".tic-tac-toe-size"));
const localModeButton = modeButtons[0];
const computerModeButton = modeButtons[1];

// Game state
let cells = [];
let size = 3;
let winLength = Math.min(5, size);
const directions = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];
let moveCount = 0;
let p1Score = 0;
let p2Score = 0;
let playerTurn = player1;
let gameOver = false;
let computerMoveTimeout = null;
let playAgainstComputer = false;

/** Refreshes the turn and score indicators to reflect the current game state. */
function updateUI() {
  turnIndicator.textContent = `${playerTurn.mark} to move`;
  if (playAgainstComputer) {
    scoreIndicator.textContent = `Score: ${p1Score}`;
  } else {
    scoreIndicator.textContent = `Player 1 Score: ${p1Score} | Player 2 Score: ${p2Score}`;
  }
}

function createBoard(boardSize) {
  size = boardSize;
  winLength = Math.min(5, size);
  cells = [];

  board.innerHTML = "";
  board.classList.toggle("five-by-five", size === 5);
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, minmax(0, 1fr))`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "tic-tac-toe-child";

    board.appendChild(cell);
    cells.push(cell);
  }
}

/** Clears the board and resets the current round without changing cumulative scores. */
function initializeGame() {
  clearTimeout(computerMoveTimeout);
  computerMoveTimeout = null;

  cells.forEach((cell) => {
    cell.innerHTML = "";
    delete cell.dataset.mark;
  });

  resultIndicator.textContent = "";
  moveCount = 0;
  gameOver = false;
  playerTurn = player1;

  updateUI();
}

/**
 * Checks whether the move at `index` completes a winning line for `player`.
 *
 * Counts contiguous matching marks in both directions along each line
 * orientation, treating the latest move as the center of the line.
 *
 * @param {number} index - Flat index of the most recently played cell.
 * @param {{ mark: string }} player - Player whose mark was placed.
 * @returns {boolean} Whether a line contains at least `winLength` marks.
 */
function checkWinner(index, player) {
  // Get the move row and column
  const row = Math.floor(index / size);
  const col = index % size;

  // Check consecutive marks for each direction
  return directions.some(([rowStep, colStep]) => {
    let count = 1;

    for (const direction of [-1, 1]) {
      let nextRow = row + rowStep * direction;
      let nextCol = col + colStep * direction;

      // Check the consecutive position contain player mark.
      // Increment count if cell's mark is player mark, else end the loop and check the opposite direction
      while (
        nextRow >= 0 &&
        nextRow < size &&
        nextCol >= 0 &&
        nextCol < size &&
        cells[nextRow * size + nextCol].dataset.mark === player.mark
      ) {
        count++;
        nextRow += rowStep * direction;
        nextCol += colStep * direction;
      }
    }

    return count >= winLength;
  });
}

/**
 * Places the current player's mark and updates the round state.
 *
 * @param {number} index - Flat index of the cell to play.
 * @returns {boolean} Whether the round continues after this move.
 */
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
      p1Score++;
    } else if (!playAgainstComputer) {
      p2Score++;
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

/** Schedules a computer turn and plays a randomly selected empty cell. */
function makeComputerMove() {
  if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

  turnIndicator.textContent = "Computer is thinking...";

  computerMoveTimeout = setTimeout(() => {
    computerMoveTimeout = null;

    if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

    const emptyIndices = cells
      .map((cell, index) => (!cell.dataset.mark ? index : -1))
      .filter((index) => index !== -1);

    if (emptyIndices.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    makeMove(emptyIndices[randomIndex]);
  }, 900);
}

// Event listeners
board.addEventListener("click", (event) => {
  const cell = event.target;
  const index = cells.indexOf(cell);

  if (index === -1 || gameOver) return;
  if (playAgainstComputer && playerTurn === player2) return;

  if (makeMove(index) && playAgainstComputer) {
    makeComputerMove();
  }
});

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const newSize = Number(button.dataset.size);

    if (newSize === size) return;

    sizeButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");

    createBoard(newSize);
    initializeGame();
  });
});

/**
 * Selects local or computer play and starts a fresh round.
 *
 * @param {boolean} againstComputer - Whether the opponent is the computer.
 */
function setGameMode(againstComputer) {
  playAgainstComputer = againstComputer;

  modeButtons.forEach((button) => {
    button.classList.toggle(
      "selected",
      button === (againstComputer ? computerModeButton : localModeButton),
    );
  });

  initializeGame();
}

resetBtn.addEventListener("click", initializeGame);
localModeButton.addEventListener("click", () => setGameMode(false));
computerModeButton.addEventListener("click", () => setGameMode(true));

// Start
createBoard(size);
initializeGame();
