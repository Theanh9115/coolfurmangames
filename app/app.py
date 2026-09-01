from flask import Flask, render_template

app = Flask(__name__)


@app.route("/template")
def home():
    return render_template("template.html")


