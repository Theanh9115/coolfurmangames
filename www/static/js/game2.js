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
const difficultyButtons = Array.from(
  document.querySelectorAll(".tic-tac-toe-difficulty"),
);
const difficultySelector = document.querySelector(
  ".tic-tac-toe-difficulty-selector",
);
const sizeButtons = Array.from(document.querySelectorAll(".tic-tac-toe-size"));
const localModeButton = modeButtons[0];
const computerModeButton = modeButtons[1];

// Game state
let cells = [];
let size = 3;
let winLength = Math.min(4, size);
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
let computerDifficulty = "easy";

/**
 * Updates the turn and score indicators to reflect the current game state.
 *
 * In computer mode, the score panel shows the player's running total; in local
 * multiplayer mode, both players' totals are displayed side by side.
 */
function updateUI() {
  turnIndicator.textContent = `${playerTurn.mark} to move`;
  if (playAgainstComputer) {
    scoreIndicator.textContent = `Score: ${p1Score}`;
  } else {
    scoreIndicator.textContent = `Player 1 Score: ${p1Score} | Player 2 Score: ${p2Score}`;
  }
}

/**
 * Builds the board for the selected board size and resets the cell collection.
 *
 * @param {number} boardSize - The dimension of the board (3, 5, or 7).
 */
function createBoard(boardSize) {
  size = boardSize;
  winLength = Math.min(4, size);
  cells = [];

  board.innerHTML = "";
  board.classList.toggle("five-by-five", size === 5);
  board.classList.toggle("seven-by-seven", size === 7);
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, minmax(0, 1fr))`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "tic-tac-toe-child";

    board.appendChild(cell);
    cells.push(cell);
  }
}

/**
 * Resets the current round while preserving the cumulative score totals.
 *
 * This clears the board state, resets turn order, and removes any pending
 * computer-move timer so the next round starts cleanly.
 */
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
/**
 * Determines whether the most recent move creates a winning line for a player.
 *
 * @param {number} index - Index of the cell that was just played.
 * @param {{ mark: string }} player - The player whose move is being evaluated.
 * @param {string[]} [board=cells.map((cell) => cell.dataset.mark || "")] - Optional board state used for simulation.
 * @returns {boolean} True if the move completes a continuous line of at least winLength marks.
 */
function checkWinner(
  index,
  player,
  board = cells.map((cell) => cell.dataset.mark || ""),
) {
  const row = Math.floor(index / size);
  const col = index % size;

  return directions.some(([rowStep, colStep]) => {
    let count = 1;

    for (const direction of [-1, 1]) {
      let nextRow = row + rowStep * direction;
      let nextCol = col + colStep * direction;

      while (
        nextRow >= 0 &&
        nextRow < size &&
        nextCol >= 0 &&
        nextCol < size &&
        board[nextRow * size + nextCol] === player.mark
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
 * Places the current player's mark and advances the round state.
 *
 * @param {number} index - Index of the target cell in the board array.
 * @returns {boolean} True if the game continues after the move; false when the round ends in a win or draw.
 */
function makeMove(index) {
  const cell = cells[index];

  if (gameOver || cell.dataset.mark) return false;

  const currentPlayer = playerTurn;

  cell.innerHTML = currentPlayer.icon;
  cell.dataset.mark = currentPlayer.mark;
  // count number of moves
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

/**
 * Schedules the computer's easy-mode move using a random empty cell.
 *
 * This keeps the opponent reactive but intentionally non-optimal so the player
 * can win or lose in a less punishing way.
 */
function makeComputerMoveEasy() {
  if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

  turnIndicator.textContent = "Computer is thinking...";

  computerMoveTimeout = setTimeout(() => {
    computerMoveTimeout = null;

    if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

    const emptyIndices = getAvailableMoves();

    if (emptyIndices.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    makeMove(emptyIndices[randomIndex]);
  }, 900);
}

/**
 * Sets the current computer difficulty and updates the button highlight state.
 *
 * @param {string} difficulty - The selected difficulty level: "easy" or "hard".
 */
function setDifficulty(difficulty) {
  computerDifficulty = difficulty;

  difficultyButtons.forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.difficulty === difficulty,
    );
  });

  if (playAgainstComputer && playerTurn === player2) {
    clearTimeout(computerMoveTimeout);
    computerMoveTimeout = null;
    makeComputerMove();
  }
}

/**
 * Dispatches the computer turn according to the active difficulty setting.
 *
 * Easy mode picks a random legal move, while hard mode evaluates the board to
 * select the strongest available move.
 */
function makeComputerMove() {
  if (computerDifficulty === "hard") {
    makeComputerMoveHard();
    return;
  }

  makeComputerMoveEasy();
}

/**
 * Returns the indices of empty cells in the provided board state.
 *
 * @param {string[]} [board=cells.map((cell) => cell.dataset.mark || "")] - Board state to inspect.
 * @returns {number[]} An array of legal move positions.
 */
function getAvailableMoves(
  board = cells.map((cell) => cell.dataset.mark || ""),
) {
  return board
    .map((mark, index) => (!mark ? index : -1))
    .filter((index) => index !== -1);
}

/**
 * Applies the minimax algorithm to evaluate the current board position.
 *
 * @param {string[]} board - The board state represented as an array of marks.
 * @param {boolean} isMaximizing - Whether the evaluation is being performed from the maximizing player's perspective.
 * @param {number | null} lastMove - The last move that was played on the board.
 * @param {number} [depth=0] - Current recursion depth used to prioritize faster wins and slower losses.
 * @returns {number} A heuristic score for the position.
 */
function minimax(board, isMaximizing, lastMove, depth = 0) {
  // Check if the previous move won
  if (lastMove !== null) {
    const lastPlayer = isMaximizing ? player1 : player2;

    if (checkWinner(lastMove, lastPlayer, board)) {
      return lastPlayer === player2 ? 10 - depth : depth - 10;
    }
  }

  // Check for a draw
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return 0;

  // Determine whose turn it is
  const currentPlayer = isMaximizing ? player2 : player1;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  // Try every available move
  for (const move of availableMoves) {
    // Simulate the move
    board[move] = currentPlayer.mark;

    // Recursively evaluate the move
    const score = minimax(board, !isMaximizing, move, depth + 1);

    // Undo the move
    board[move] = "";

    // Choose the best score
    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
    } else {
      bestScore = Math.min(bestScore, score);
    }
  }

  return bestScore;
}

/**
 * Selects the strongest move for the computer on a 3x3 board.
 *
 * The evaluation compares each legal move using minimax and chooses the action
 * that yields the highest score for the computer.
 *
 * @returns {number | null} The index of the best available move, or null if no move exists.
 */
function getBestMove() {
  const board = cells.map((cell) => cell.dataset.mark || "");

  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of getAvailableMoves(board)) {
    board[move] = player2.mark;

    const score = minimax(board, false, move, 1);

    board[move] = "";

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Schedules the computer's hard-mode move.
 *
 * For 3x3 boards, a minimax-based decision is used. For larger boards, the
 * function takes a win, blocks a loss, or plays near its existing marks.
 */
function makeComputerMoveHard() {
  if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

  turnIndicator.textContent = "Computer is thinking...";

  computerMoveTimeout = setTimeout(() => {
    computerMoveTimeout = null;

    if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

    const emptyIndices = getAvailableMoves();

    if (emptyIndices.length === 0) return;

    const bestMove = size === 3 ? getBestMove() : getTacticalMove(emptyIndices);

    if (bestMove !== null) {
      makeMove(bestMove);
    }
  }, 900);
}

/**
 * Picks a win or block, then favors squares next to the computer's marks.
 *
 * @param {number[]} emptyIndices - Legal move positions still available.
 * @returns {number} The chosen move index.
 */
function getTacticalMove(emptyIndices) {
  const board = cells.map((cell) => cell.dataset.mark || "");

  for (const player of [player2, player1]) {
    for (const move of emptyIndices) {
      board[move] = player.mark;
      const wins = checkWinner(move, player, board);
      board[move] = "";
      if (wins) return move;
    }
  }

  let bestMove = emptyIndices[0];
  let bestScore = -Infinity;

  for (const move of emptyIndices) {
    const row = Math.floor(move / size);
    const col = move % size;
    const center = (size - 1) / 2;
    let score = -(Math.abs(row - center) + Math.abs(col - center)) * 0.01;

    for (let rowStep = -1; rowStep <= 1; rowStep++) {
      for (let colStep = -1; colStep <= 1; colStep++) {
        const neighborRow = row + rowStep;
        const neighborCol = col + colStep;
        if (
          neighborRow >= 0 &&
          neighborRow < size &&
          neighborCol >= 0 &&
          neighborCol < size &&
          board[neighborRow * size + neighborCol] === player2.mark
        )
          score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

// Event listeners
board.addEventListener("click", (event) => {
  const cell = event.target.closest(".tic-tac-toe-child");
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
 * Switches between local multiplayer and computer play.
 *
 * @param {boolean} againstComputer - True to enable computer mode; false for local two-player mode.
 */
function setGameMode(againstComputer) {
  playAgainstComputer = againstComputer;
  difficultySelector.hidden = !againstComputer;

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
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDifficulty(button.dataset.difficulty);
  });
});

// Start
createBoard(size);
initializeGame();
