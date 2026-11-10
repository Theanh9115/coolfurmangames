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
let winningLines = [];
let linesByCell = [];
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
  // Cache every possible winning line and the lines touching each cell.
  // The large-board AI reuses these lists throughout its search.
  winningLines = [];
  linesByCell = Array.from({ length: size * size }, () => []);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      for (const [rowStep, colStep] of directions) {
        const endRow = row + rowStep * (winLength - 1);
        const endCol = col + colStep * (winLength - 1);
        if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
          continue;
        }

        const line = Array.from(
          { length: winLength },
          (_, step) => (row + rowStep * step) * size + col + colStep * step,
        );
        winningLines.push(line);
        line.forEach((index) => linesByCell[index].push(line));
      }
    }
  }
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
 * Places the current player's mark and advances the state.
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
 * @param {number} [alpha=-Infinity] - Best score guaranteed to the maximizing player.
 * @param {number} [beta=Infinity] - Best score guaranteed to the minimizing player.
 * @returns {number} The exact outcome score when both players play optimally.
 */
function minimax(
  board,
  isMaximizing,
  lastMove,
  depth = 0,
  alpha = -Infinity,
  beta = Infinity,
) {
  // Check if the previous move won
  if (lastMove !== null) {
    const lastPlayer = isMaximizing ? player1 : player2;

    if (checkWinner(lastMove, lastPlayer, board)) {
      const winScore = board.length + 1 - depth;
      return lastPlayer === player2 ? winScore : -winScore;
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
    const score = minimax(board, !isMaximizing, move, depth + 1, alpha, beta);

    // Undo the move
    board[move] = "";

    // Choose the best score
    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
    }

    // The other player already has a better choice elsewhere in the tree.
    if (beta <= alpha) break;
  }

  return bestScore;
}

// Large-board AI adapted from Wong Hong Wei's Tic Tac Toe engine:
// https://wonghongwei.com/tictactoe/
/** Finds a one-move win for the given mark, or null if none exists. */
function findImmediateMove(boardState, mark) {
  for (const line of winningLines) {
    const marks = line.filter((index) => boardState[index] === mark).length;
    const empty = line.filter((index) => boardState[index] === "");
    if (marks === winLength - 1 && empty.length === 1) return empty[0];
  }
  return null;
}

/** Rates one empty cell by the unblocked winning lines it could extend. */
function scoreCandidate(boardState, index, mark) {
  const opponent = mark === player2.mark ? player1.mark : player2.mark;
  let score = 0;

  for (const line of linesByCell[index]) {
    let marks = 0;
    let blocked = false;
    for (const cellIndex of line) {
      if (boardState[cellIndex] === opponent) {
        blocked = true;
        break;
      }
      if (boardState[cellIndex] === mark) marks++;
    }
    // Longer existing lines are more valuable than several isolated marks.
    if (!blocked) score += 8 ** marks;
  }

  return score;
}

/** Orders legal moves and keeps only the most promising ones for a fast search. */
function candidateMoves(boardState, mark, limit) {
  const center = (size - 1) / 2;
  return getAvailableMoves(boardState)
    .map((index) => {
      const row = Math.floor(index / size);
      const col = index % size;
      const opponent = mark === player2.mark ? player1.mark : player2.mark;
      return {
        index,
        // Balance building our lines, blocking theirs, and a small center bias.
        score:
          scoreCandidate(boardState, index, mark) +
          scoreCandidate(boardState, index, opponent) * 0.86 -
          (Math.abs(row - center) + Math.abs(col - center)) * 0.01,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ index }) => index);
}

/** Estimates a nonterminal board when the search reaches its depth limit. */
function evaluateBoard(boardState) {
  let score = 0;

  for (const line of winningLines) {
    let xCount = 0;
    let oCount = 0;
    for (const index of line) {
      if (boardState[index] === player1.mark) xCount++;
      if (boardState[index] === player2.mark) oCount++;
    }
    // A line containing both marks can no longer produce a win.
    if (xCount && oCount) continue;
    if (oCount) score += 10 ** oCount;
    if (xCount) score -= 10 ** xCount * 1.08;
  }

  return score;
}

/** Searches ahead with alpha-beta pruning and a fixed move/depth budget. */
function boundedMinimax(boardState, depth, isMaximizing, lastMove, alpha, beta) {
  if (lastMove !== null) {
    const lastPlayer = isMaximizing ? player1 : player2;
    if (checkWinner(lastMove, lastPlayer, boardState)) {
      const winScore = 1_000_000 + depth * 1_000;
      return lastPlayer === player2 ? winScore : -winScore;
    }
  }

  if (getAvailableMoves(boardState).length === 0) return 0;
  // Unlike 3x3, larger boards stop here and use a position estimate.
  if (depth === 0) return evaluateBoard(boardState);

  const mark = isMaximizing ? player2.mark : player1.mark;
  const limit = size === 5 ? 10 : 8;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of candidateMoves(boardState, mark, limit)) {
    boardState[move] = mark;
    const score = boundedMinimax(
      boardState,
      depth - 1,
      !isMaximizing,
      move,
      alpha,
      beta,
    );
    boardState[move] = "";

    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
    }
    if (beta <= alpha) break;
  }

  return bestScore;
}

/** Handles forced tactics first, then searches the best large-board candidates. */
function getBestLargeMove(boardState) {
  // Winning now takes priority over blocking an opponent threat.
  const winningMove = findImmediateMove(boardState, player2.mark);
  if (winningMove !== null) return winningMove;

  const blockingMove = findImmediateMove(boardState, player1.mark);
  if (blockingMove !== null) return blockingMove;

  // A smaller budget on 7x7 keeps the computer responsive.
  const depth = Math.min(size === 5 ? 4 : 3, getAvailableMoves(boardState).length);
  const limit = size === 5 ? 10 : 8;
  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of candidateMoves(boardState, player2.mark, limit)) {
    boardState[move] = player2.mark;
    const score = boundedMinimax(
      boardState,
      depth - 1,
      false,
      move,
      -Infinity,
      Infinity,
    );
    boardState[move] = "";
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Selects a computer move using full search on 3x3 and bounded search on larger boards.
 *
 * The evaluation compares each legal move using minimax and chooses the action
 * that yields the highest score for the computer.
 *
 * @returns {number | null} The index of the best available move, or null if no move exists.
 */
function getBestMove() {
  const board = cells.map((cell) => cell.dataset.mark || "");

  if (size > 3) return getBestLargeMove(board);

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
 * Uses full-depth minimax on 3x3 and bounded minimax on larger boards.
 */
function makeComputerMoveHard() {
  if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

  turnIndicator.textContent = "Computer is thinking...";

  computerMoveTimeout = setTimeout(() => {
    computerMoveTimeout = null;

    if (!playAgainstComputer || gameOver || playerTurn !== player2) return;

    const emptyIndices = getAvailableMoves();

    if (emptyIndices.length === 0) return;

    const bestMove = getBestMove();

    if (bestMove !== null) {
      makeMove(bestMove);
    }
  }, 100);
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
    // Want to go near center
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
  difficultySelector.classList.toggle("is-hidden", !againstComputer);

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
setGameMode(false);
