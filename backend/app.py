from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
import json
import requests
from base64 import b64encode
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
)
logger = logging.getLogger(__name__)


app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Get username and password from environment variables
username = os.getenv('MONGO_USERNAME')
password = os.getenv('MONGO_PASSWORD')
spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

# Load database name from config file
with open('config.json') as config_file:
    config = json.load(config_file)
    database_name = config['database_name']

# MongoDB Atlas Connection
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@doodle-dj.c3vk0.mongodb.net/{database_name}"
mongo = PyMongo(app)

# Sample Collection
db = mongo.db.users

# Spotify Integration
def get_spotify_token():
    url = "https://accounts.spotify.com/api/token"
    auth_header = b64encode(f"{spotify_client_id}:{spotify_client_secret}".encode()).decode()

    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "client_credentials"
    }
    logger.info("Requesting Spotify access token.")
    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()
    token = response.json()['access_token']
    logger.info("Spotify access token retrieved successfully.")
    return token

def search_spotify_tracks(keywords, token, limit=5):
    logger.info(f"Searching Spotify for keywords: {keywords}")
    url = "https://api.spotify.com/v1/search"
    params = {"q": keywords, "type": "track", "limit": limit}
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    items = response.json()["tracks"]["items"]

    logger.info(f"Found {len(items)} tracks for keywords: '{keywords}'.")

    results = [
        {
            "track_name": item["name"],
            "artists": [artist["name"] for artist in item["artists"]],
            "album": item["album"]["name"],
            "preview_url": item["preview_url"],
            "external_url": item["external_urls"]["spotify"]
        }
        for item in items
    ]

    logger.debug(f"Tracks result: {results}")
    return results

@app.route('/search', methods=['GET'])
def search_tracks():
    keywords = request.args.get("keywords")
    if not keywords:
        logger.warning("Missing 'keywords' parameter in request.")
        return jsonify({"error": "Missing 'keywords' parameter"}), 400

    try:
        token = get_spotify_token()
        results = search_spotify_tracks(keywords, token)
        logger.info(f"Returning {len(results)} results for query: '{keywords}'")
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error during /search: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/users', methods=['GET'])
def get_users():
    users = list(db.find({}, {"_id": 0}))
    return jsonify(users)

if __name__ == '__main__':
    try:
        print(f"MongoDB Username: {username}")
        print(f"Database Name: {database_name}")
        app.run(debug=True)
    except Exception as e:
        print(f"An error occurred: {e}")