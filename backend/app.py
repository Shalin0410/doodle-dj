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

# Load database name from config file
with open('config.json') as config_file:
    config = json.load(config_file)
    database_name = config['database_name']

logger.info(database_name)


app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@doodle-dj.c3vk0.mongodb.net/{database_name}"
mongo = PyMongo(app)

# Sample Collection
db = mongo.db.users

def search_deezer_tracks(keywords, limit=5):
    logger.info(f"Searching Deezer for keywords: {keywords}")
    url = "https://api.deezer.com/search"
    params = {
        "q": keywords,
        "limit": limit
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    items = response.json()["data"]

    logger.info(f"Found {len(items)} tracks for keywords: '{keywords}'.")

    results = [
        {
            "track_name": item["title"],
            "artist": item["artist"]["name"],
            "album": item["album"]["title"],
            "preview_url": item["preview"],  # 30s preview MP3 stream
            "embed_url": f"https://widget.deezer.com/widget/dark/track/{item['id']}",  # Full playback via iframe
            "external_url": item["link"],
            "image": item["album"]["cover_medium"]
        }
        for item in items
    ]

    logger.debug(f"Deezer Tracks result: {results}")
    return results

# @app.route('/process', methods=['POST'])
# def process():
#     data = request.get_json()
#     image_url = data.get('url')
#     user = data.get('username')

#     if not image_url or not user:
#         return jsonify({"error": "Missing 'url' or 'username'"}), 400

#     db.insert_one({"username": user, "url": image_url})

#     try:
#         keyword_response = requests.post("https://first-api.com/get_keywords", json={"image_url": image_url})
#         keyword_response.raise_for_status()
#         keywords_list = keyword_response.json().get("keywords", [])

#         if not keywords_list:
#             return jsonify({"error": "No keywords returned from keyword API"}), 500

#         keywords_str = " ".join(keywords_list)

#         requests.get("http://127.0.0.1:5000//jamendo/search", params={"keywords": keywords_str})

#         return jsonify({
#             "message": "Keywords extracted and sent to Jamendo.",
#             "keywords": keywords_list
#         }), 200

#     except requests.exceptions.RequestException as e:
#         return jsonify({"error": f"Request failed: {str(e)}"}), 500
    


def get_dummy_keywords(image_url):
    return ["main character energy"]

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    image_url = data.get('url')
    user = data.get('username')

    if not image_url or not user:
        return jsonify({"error": "Missing 'url' or 'username'"}), 400

    result = db.insert_one({"username": user, "url": image_url})
    logger.info(f"Inserted ID: {result.inserted_id}")

    try:
        keywords_list = get_dummy_keywords(image_url)

        if not keywords_list:
            return jsonify({"error": "No keywords returned from keyword API"}), 500

        keywords_str = "+".join(keywords_list)
        logger.info(keywords_str)

        results = requests.get("http://127.0.0.1:5000/deezer/search", params={"keywords": keywords_str})

        try:
            logger.debug(f"Deezer Tracks result: Status Code: {results.status_code}, Response: {results.json()}")
        except ValueError as e:
            logger.error(f"Failed to parse JSON response: {str(e)}")
        print(results)

        return jsonify({
            "message": "Keywords extracted and sent to Deezer.",
            "keywords": keywords_str,
            "results":results.json()
        }), 200


    except Exception as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500

@app.route('/deezer/search', methods=['GET'])
def deezer_search():
    keywords = request.args.get("keywords")
    if not keywords:
        logger.warning("Missing 'keywords' parameter in request.")
        return jsonify({"error": "Missing 'keywords' parameter"}), 400

    try:
        results = search_deezer_tracks(keywords)
        logger.info(f"Returning {len(results)} Deezer results for query: '{keywords}'")
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error during /deezer/search: {str(e)}", exc_info=True)
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