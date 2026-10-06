from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)


@app.route("/template")
def home():
    return render_template("template.html")

@app.route("/hello")
def hello():
    return "Hello, World!"

@app.route("/score", methods=['GET'])
def getScore():
    with open("./user-data.json", "r") as file:
        user_data = json.load(file)
        for user in user_data["users"]:
            user["totalScore"] = user["game1Score"] + user["game2Score"] + user["game3Score"]
    return jsonify(user_data)
