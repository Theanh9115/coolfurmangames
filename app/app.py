from flask import Flask, request, render_template, jsonify
import json
from datetime import date

app = Flask(__name__)


@app.route("/template")
def home():
    return render_template("template.html")

@app.route("/hello")
def hello():
    return "Hello, World!"

# Gets today's date (YYYY-MM-DD)
current_date = str(date.today()).split("-") 
today = current_date[2]
current_month = current_date[1]
current_year = current_date[0]

@app.route("/score", methods=['GET'])
def getScore():
    filter = request.args.get('filter', default="All time")
    with open("./user-data.json", "r") as file:
        user_data = json.load(file)
        data = []
        for user in user_data["users"]:
            # Add total score to json data
            user["totalScore"] = user["game1Score"] + user["game2Score"] + user["game3Score"]

            # Convert date into parsable format
            user_date = user["date"].split("-")

            # Filter results based on sort filter 
            if (filter == "Today" 
                and current_date != user_date):
                continue
            elif (filter == "This year" 
                  and current_date[0] != user_date[0]):
                continue
            elif (filter == "This month"
                  and (current_date[1] != user_date[1]
                  or current_date[0] != user_date[0])):
                continue
            else:
                data.append(user)

    return jsonify(data)
