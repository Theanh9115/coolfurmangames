
from flask import Flask, request, render_template
import os
import sqlite3

app = Flask(__name__)

APP_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(APP_DIR)
DATABASE_PATH = os.path.join(PROJECT_DIR, "db", "coolfurmangames.db")

SCORE_COLUMNS = {
    "game1": "game1_score",
    "game2": "game2_score",
    "game3": "game3_score",
}

TIME_FILTERS = ("All time", "This year", "This month", "Today")


@app.route("/template")
def home():
    return render_template("template.html")


@app.route("/leaderboard.html")
def leaderboard():
    selected_game = request.args.get("game", "game1")
    if selected_game not in SCORE_COLUMNS:
        selected_game = "game1"

    selected_filter = request.args.get("filter", "All time")
    if selected_filter not in TIME_FILTERS:
        selected_filter = "All time"

    users = load_users(selected_game, selected_filter)

    return render_template(
        "leaderboard.html",
        users=users,
        score_field=SCORE_COLUMNS[selected_game],
        selected_game=selected_game,
        selected_filter=selected_filter,
        time_filters=TIME_FILTERS,
    )


def load_users(selected_game, selected_filter):
    filters_query = {
        "Today": "date = date('now', 'localtime')",
        "This month": "strftime('%Y-%m', date) = strftime('%Y-%m', 'now', 'localtime')",
        "This year": "strftime('%Y', date) = strftime('%Y', 'now', 'localtime')",
        "All time": "1=1"
    }

    query = f"""
        SELECT
            username,
            game1_score,
            game2_score,
            game3_score,
            date
        FROM scores
        WHERE {filters_query[selected_filter]}
        ORDER BY {SCORE_COLUMNS[selected_game]} DESC
    """

    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row

    try:
        users = conn.execute(query).fetchall()
        return [dict(user) for user in users]
    finally:
        conn.close()
        
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
                <div class="tic-tac-toe-difficulty-selector" role="group">
                    <button class="tic-tac-toe-difficulty selected" type="button" data-difficulty="easy">
                    Easy
                    </button>
                    <button class="tic-tac-toe-difficulty" type="button" data-difficulty="hard">
                    Hard
                    </button>
                </div>
                <div class="tic-tac-toe-size-selector" role="group">
                    <button class="tic-tac-toe-size selected" type="button" data-size="3">
                    3 x 3
                    </button>
                    <button class="tic-tac-toe-size" type="button" data-size="5">
                    5 x 5
                    </button>
                    <button class="tic-tac-toe-size" type="button" data-size="7">
                    7 x 7
                    </button>
                </div>
                <div class="tic-tac-toe-score-container">
                    <span class="tic-tac-toe-score" role="status"></span>
                </div>
                <p class="game-result" role="status"></p>
                <div class="tic-tac-toe" role="grid" aria-label="Tic-tac-toe board"></div>
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
    
