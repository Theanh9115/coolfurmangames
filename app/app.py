
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
        conn.close()
        return [dict(user) for user in users]
    finally:
        conn.close()
        
@app.route("/<game_name>")
def get_game(game_name):
    games = ["paladin-jump.txt", "tic-tac-toe.txt", "flappy-furman.txt"]
    content = []
    for g in games:
        with open(g, "r") as f:
            content.append(f.read())
            
    games = {
        "paladin-jump": content[0],
        "tic-tac-toe": content[1],
        "flappy-furman": content[2]
    }
    
    scripts = {
        "paladin-jump": "/static/js/paladin-jump.js",
        "tic-tac-toe": "/static/js/game2.js",
        "flappy-furman": "/static/js/game3.js"
    }

    return render_template("games.html", game_name=game_name, games=games, scripts=scripts)
    
