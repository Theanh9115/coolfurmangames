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
            # Convert date into parsable format
            user_date = user["date"].split("-")
            # Filter results based on sort filter 
            user["totalScore"] = user["game1Score"] + user["game2Score"] + user["game3Score"]
            data.append(user)

            # if (filter == "All time"):
            #     user["totalScore"] = user["game1Score"] + user["game2Score"] + user["game3Score"]
            #     data.append(user)
            # elif (filter == "This year" and current_year == user_date[0]):
            #     user["totalScore"] = user["game1Score"] + user["game2Score"] + user["game3Score"]
            #     data.append(user)


            # if (filter != "All time"):
            #     if (filter == "This year" and user_date[0] != current_year):
            #         continue
            #     elif (filter == "This month" and user_date[1] != current_month):
            #         continue

            # else:
            #     user["totalScore"] = user["game1Score"] + user["game2Score"] + user["game3Score"]
            #     data.append(user)

    return jsonify(data)
