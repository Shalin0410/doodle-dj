from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

app = Flask(__name__)
CORS(app)  # Allow requests from all

# Load environment variables from .env file
load_dotenv()

# Get username and password from environment variables
username = os.getenv('MONGO_USERNAME')
password = os.getenv('MONGO_PASSWORD')

# Load database name from config file
with open('config.json') as config_file:
    config = json.load(config_file)
    database_name = config['database_name']

# MongoDB Atlas Connection
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@doodle-dj.c3vk0.mongodb.net/{database_name}"
mongo = PyMongo(app)

# Sample Collection
db = mongo.db.users

@app.route('/')
def hello_world():
    return 'Hello, World from Doodle DJ!'

@app.route('/users', methods=['GET'])
def get_users():
    users = list(db.find({}, {"_id": 0}))
    return jsonify(users)

if __name__ == '__main__':
    try:
        app.run(host="0.0.0.0", port=5000, debug=True)
    except Exception as e:
        print(f"An error occurred: {e}")