const leaderboardBody = document.querySelector("#leaderboard-body");

fetch("/score")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard data");
    }
    return response.json();
  })
  .then((data) => {
    data["users"].sort((a, b) => b["totalScore"] - a["totalScore"]);

    data["users"].forEach((user, index) => {
      const newRow = document.createElement("tr");
      const rank = document.createElement("td");
      const username = document.createElement("td");
      const game1Score = document.createElement("td");
      const game2Score = document.createElement("td");
      const game3Score = document.createElement("td");
      const totalScore = document.createElement("td");
      const date = document.createElement("td");

      rank.textContent = index + 1;
      username.textContent = user["username"];
      game1Score.textContent = user["game1Score"];
      game2Score.textContent = user["game2Score"];
      game3Score.textContent = user["game3Score"];
      totalScore.textContent = user["totalScore"];
      date.textContent = user["date"] || "N/A";

      [
        rank,
        username,
        game1Score,
        game2Score,
        game3Score,
        totalScore,
        date,
      ].forEach((cell) => {
        newRow.appendChild(cell);
      });

      leaderboardBody.appendChild(newRow);
    });
  })
  .catch((error) => {
    console.error("Leaderboard error:", error);
  });
