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

getScores();

// Fetch scores
async function getScores() {
  const url = "/score";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch leaderboard data. Status: ${response.status}`,
    );
  }

  data = await response.json();

  updateLeaderboard();
}

function clearLeaderboard() {
  const rows = leaderboardBody.querySelectorAll("tr");
  for (const row of rows) {
    row.remove();
  }
}

async function updateLeaderboard() {
  if (
    game1Button.className == "game-tab active" ||
    game1Button.className == "game-tab active dark"
  ) {
    // Sort by Game 1 score
    data["users"].sort((a, b) => b.game1Score - a.game1Score);
  }
  if (
    game2Button.className == "game-tab active" ||
    game2Button.className == "game-tab active dark"
  ) {
    // Sort by Game 2 score
    data["users"].sort((a, b) => b.game2Score - a.game2Score);
  }
  if (
    game3Button.className == "game-tab active" ||
    game3Button.className == "game-tab active dark"
  ) {
    // Sort by Game 3 score
    data["users"].sort((a, b) => b.game3Score - a.game3Score);
  }

  // Create new row per user in JSON data and add it to the leaderboard
  for (let i = 0; i < data["users"].length; i++) {
    user = data["users"][i];
    // Create row for the user and all of their associated info
    const newRow = document.createElement("tr");
    // Leaderboard rank
    const rank = document.createElement("td");
    rank.textContent = i + 1;
    // Username
    const username = document.createElement("td");
    username.textContent = user.username;
    // Paladin-game high score
    const game1Score = document.createElement("td");
    game1Score.textContent = user.game1Score;
    // Tic tac toe high score
    const game2Score = document.createElement("td");
    game2Score.textContent = user.game2Score;
    // Game 3 high score
    const game3Score = document.createElement("td");
    game3Score.textContent = user.game3Score;
    // Total score across all games
    const totalScore = document.createElement("td");
    totalScore.textContent = user.totalScore;
    // Date of score
    const date = document.createElement("td");
    date.textContent = user.date || "N/A";

    // Package all user info into a list
    // Certain scores will be included depending on active tab
    if (
      game1Button.className == "game-tab active" ||
      game1Button.className == "game-tab active dark"
    ) {
      cells = [rank, username, game1Score, date];
    } else if (
      game2Button.className == "game-tab active" ||
      game2Button.className == "game-tab active dark"
    ) {
      cells = [rank, username, game2Score, date];
    } else if (
      game3Button.className == "game-tab active" ||
      game3Button.className == "game-tab active dark"
    ) {
      cells = [rank, username, game3Score, date];
    }

    // Append all values to the row
    for (const cell of cells) {
      newRow.appendChild(cell);
    }

    // Append row to the leaderboard
    leaderboardBody.appendChild(newRow);
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

  clearLeaderboard();
  getScores();
}
