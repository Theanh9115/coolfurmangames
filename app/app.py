from flask import Flask, request, render_template, jsonify
import json
from datetime import date
from pathlib import Path

app = Flask(__name__)

USER_DATA_PATH = Path(__file__).with_name("user-data.json")
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
    for user in load_users():
        user_date_parts = [int(part) for part in user["date"].split("-")]
        user_date = date(*user_date_parts)

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
    with USER_DATA_PATH.open(encoding="utf-8") as file:
        user_data = json.load(file)

    users = user_data["users"]
    for user in users:
        user["totalScore"] = (
            user["game1Score"] + user["game2Score"] + user["game3Score"]
        )
    return users


<<<<<<< HEAD
            # if (filter != "All time"):
            #     if (filter == "This year" and user_date[0] != current_year):
            #         continue
            #     elif (filter == "This month" and user_date[1] != current_month):
            #         continue

            # else:
            #     user["totalScore"] = user["game1Score"] + user["game2Score"] + user["game3Score"]
            #     data.append(user)

    return jsonify(data)

# @app.route("/<game_title>")
# def get_game(game_title):
#     return render_template("games.html", game_title=game_title)
    
=======
# @app.route("/score", methods=["GET"])
# def get_score():
#     selected_filter = request.args.get("filter", "All time")
#     if selected_filter not in TIME_FILTERS:
#         selected_filter = "All time"
#     return jsonify(get_users_for_filter(selected_filter))
>>>>>>> 6f38389a079d3db07dce671981d57118945c92a2
