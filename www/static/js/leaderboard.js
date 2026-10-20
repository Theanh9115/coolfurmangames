const leaderboardBody = document.getElementById("leaderboard-body");
let data = null;

const gameTabs = document.getElementById("game-tabs");
const gameButtons = gameTabs.querySelectorAll("button");

const game1Button = document.getElementById("game1-button");
game1Button.addEventListener("click", changeActiveTab);
const game2Button = document.getElementById("game2-button");
game2Button.addEventListener("click", changeActiveTab);
const game3Button = document.getElementById("game3-button");
game3Button.addEventListener("click", changeActiveTab);
const gameButtonList = [game1Button, game2Button, game3Button];

const leaderboardFilter = document.getElementById("time-filter");
leaderboardFilter.addEventListener("change", resetLeaderboard);

// Retrieve scores upon page entry
getScores(leaderboardFilter.value);

// Fetch scores
async function getScores(filter) {
  const url = `/score?filter=${encodeURIComponent(filter)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch leaderboard data. Status: ${response.status}`,
    );
  }

  data = await response.json();

  updateLeaderboard(data);
}

function resetLeaderboard() {
  // Clear leaderboard
  const rows = leaderboardBody.querySelectorAll("tr");
  for (const row of rows) {
    row.remove();
  }

  // Refresh scores
  getScores(leaderboardFilter.value);
}

// Create a table cell for a score with both full and mobile-friendly formats
function createScoreCell(score) {

  // Create a table cell
  const cell = document.createElement("td");

  // Create span elements for both full and mobile-friendly formats
  const fullScore = document.createElement("span");
  fullScore.className = "score-desktop";
  fullScore.textContent = String(score);

  const mobileScore = document.createElement("span");
  mobileScore.className = "score-mobile";
  mobileScore.textContent = formatScore(score);

  cell.append(fullScore, mobileScore); // Append both formats to the cell

  // Add click event listener to toggle between full and mobile-friendly formats
  cell.addEventListener("click", () => {
  cell.classList.toggle("show-full-score");
});

  return cell; // Return the cell with both formats and the click event listener
}

async function updateLeaderboard(data) {
  // Sort leaderboard by total score
  data.sort((a, b) => b["totalScore"] - a["totalScore"]);

  // Create new row per user in JSON data and add it to the leaderboard
  // for (let i = 0; i < data["users"].length; i++)
  let rankNum = 1;
  for (const user of data) {
    // Create row for the user and all of their associated info
    const newRow = document.createElement("tr");
    // Leaderboard rank
    const rank = document.createElement("td");
    rank.textContent = rankNum;
    // Username
    const username = document.createElement("td");
    username.textContent = user.username;
    // Paladin-game high score
    const game1Score = createScoreCell(user.game1Score);
    game1Button.score = game1Score
    // Tic tac toe high score
    const game2Score = createScoreCell(user.game2Score);
    game2Button.score = game2Score
    // Game 3 high score
    const game3Score = createScoreCell(user.game3Score);
    game3Button.score = game3Score
    // Total score across all games
    const totalScore = createScoreCell(user.totalScore);
    // Date of score
    const date = document.createElement("td");
    date.textContent = user.date || "N/A";

    // Package all user info into a list
    // Certain scores will be included depending on active tab
    for (const button of gameButtonList) {
      if (button.className.includes("game-tab active")) {
        cells = [rank, username, button.score, date];
      }
    }

    // Append all values to the row
    for (const cell of cells) {
      newRow.appendChild(cell);
    }

    // Append row to the leaderboard
    leaderboardBody.appendChild(newRow);
    rankNum++;
  }
}

function changeActiveTab(event) {
  currentButton = event.currentTarget;
  // Change the theme of the tab buttons
  for (const btn of gameButtons) {
    if (localStorage.getItem("theme") == "dark") {
      btn.className = "game-tab dark";
    } else {
      btn.className = "game-tab";
    }
  }
  // Change the theme of current tab
  if (localStorage.getItem("theme") == "dark") {
    currentButton.className = "game-tab active dark";
  } else {
    currentButton.className = "game-tab active";
  }

  resetLeaderboard();
}

// Format score for display
function formatScore(score) {
  const numericScore = Number(score);

  // Check if the score is a valid number
  if (!Number.isFinite(numericScore)) {
    return "N/A";
  }

  // Format the score based on its value
  if (numericScore >= 1000000000) {
    return `${(numericScore / 1000000000).toFixed(1)}B`;
  }
  
  return String(numericScore);
}
