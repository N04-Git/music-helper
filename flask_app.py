# Libraries
from flask import Flask, render_template

# App
app = Flask(__name__)

# Routes
@app.route('/')
@app.route('/home')
def home():
    return render_template("home.html")

@app.route('/key')
def key():
    return render_template("key.html")

@app.route('/sheets')
def sheets():
    return render_template("sheets.html")

@app.route('/knowledge')
def knowledge():
    return render_template("knowledge.html")



# Run
if __name__ == "__main__":
    app.run(debug=False, port=8020)