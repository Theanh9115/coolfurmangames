from flask import Flask, request, render_template, jsonify
import json
from datetime import date

app = Flask(__name__)

USER_DATA_PATH = "./user-data.json"
SCORE_FIELDS = {
    "game1": "game1Score",
    "game2": "game2Score",
    "game3": "game3Score",
}
TIME_FILTERS = ("All time", "This year", "This month", "Today")


@app.route("/template")
def home():
    return render_template("template.html")


@app.route("/leaderboard.html")
def leaderboard():
    selected_game = request.args.get("game", "game1")
    if selected_game not in SCORE_FIELDS:
        selected_game = "game1"

    selected_filter = request.args.get("filter", "All time")
    if selected_filter not in TIME_FILTERS:
        selected_filter = "All time"

    users = get_users_for_filter(selected_filter)
    users.sort(key=lambda user: user[SCORE_FIELDS[selected_game]], reverse=True)
    return render_template(
        "leaderboard.html",
        users=users,
        score_field=SCORE_FIELDS[selected_game],
        selected_game=selected_game,
        selected_filter=selected_filter,
        time_filters=TIME_FILTERS,
    )


def get_users_for_filter(selected_filter):
    today = date.today()
    filtered_users = []
    # Loop through user and get the users at a filter
    for user in load_users():
        # Split year month and day
        year, month, day = map(int, user["date"].split("-"))
        # Covert to date
        user_date = date(year, month, day)

        if selected_filter == "Today" and user_date != today:
            continue
        if selected_filter == "This month" and (
            user_date.year != today.year or user_date.month != today.month
        ):
            continue
        if selected_filter == "This year" and user_date.year != today.year:
            continue

        filtered_users.append(user)
    return filtered_users

def load_users():
    with open(USER_DATA_PATH, "r") as file:
        user_data = json.load(file)

    users = user_data["users"]
    return users


# @app.route("/score", methods=["GET"])
# def get_score():
#     selected_filter = request.args.get("filter", "All time")
#     if selected_filter not in TIME_FILTERS:
#         selected_filter = "All time"
#     return jsonify(get_users_for_filter(selected_filter))

@app.route("/<game_name>")
def get_game(game_name):
    games = {
        "paladin-jump": """
            <main>
                <div class="game-page-card">
                    <canvas id="paladin-jump-canvas"></canvas>
                    <div class="start-game-card" id="paladin-jump-start">
                        <div class="start-game-card-info">
                            <h1>Paladin Jump!</h2>
                            <h3>Get the highest score you can by jumping from platform to platform!</h3>
                        </div>
                        <button class="game-run-button">Start Game</button>
                        </div>
                    <div id="paladin-jump-kill-screen">
                        <h1>You died!</h1>
                        <h2 id="paladin-jump-kill-score">Score: </h2>
                        <button id="paladin-jump-restart-button">Restart</button>
                    </div>
                    <div id="paladin-jump-move-buttons">
                        <button id="pj-move-left">←</h1>
                        <button id="pj-move-right">→</h1>
                    </div>
                </div>
            </main>
        """,

        "tic-tac-toe": """
            <main>
                <h1>Game 2</h1>
                <div class="tic-tac-toe-controls">
                    <span class="player" role="status"></span>
                    <button type="button" class="reset-btn">New Game</button>
                </div>
                <div class="tic-tac-toe-mode-selector">
                    <button class="tic-tac-toe-mode selected" type="button">Local</button>
                    <button class="tic-tac-toe-mode" type="button">Vs Computer</button>
                </div>
                <div class="tic-tac-toe-score-container">
                    <span class="tic-tac-toe-score" role="status"></span>
                </div>
                <p class="game-result" role="status"></p>
                <div class="tic-tac-toe">
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                    <div class="tic-tac-toe-child"></div>
                </div>
            </main>
        """,

        "flappy-furman": """
            <main>
                <h1 id="game-title">Flappy Furman</h1>
                <div id = "game-3">
                    <canvas id="flappy-furman"></canvas>
                    <button id="flappy-furman-start">Start Game</button>
                    <button id="flappy-furman-end">Reset Game</button>
                </div>
            </main>
        """
    }
    
    scripts = {
        "paladin-jump": "/static/js/paladin-jump.js",
        "tic-tac-toe": "/static/js/game2.js",
        "flappy-furman": "/static/js/game3.js"
    }

    return render_template("games.html", game_name=game_name, games=games, scripts=scripts)
    
