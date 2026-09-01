from flask import Flask, render_template

app = Flask(__name__)


@app.route("/template")
def home():
    return render_template("template.html")

@app.route("/hello")
def hello():
    return "Hello, World!"

# @app.route("/coolfurmangames")
# def main():
#     return render_template("main.html")
#Hello (ignore this comment)