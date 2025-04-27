from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
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
CORS(app)  # Allow requests from all

# Load environment variables from .env file
load_dotenv()

# Get username and password from environment variables
username = "aswami"
password = "7e01KrUmFjo4C4bV"
# Load database name from config file
with open('config.json') as config_file:
    config = json.load(config_file)
    database_name = config['database_name']

logger.info(database_name)

app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@doodle-dj.c3vk0.mongodb.net/{database_name}"
mongo = PyMongo(app)

db = mongo.db.users
favorites_db = mongo.db.favorites


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
            # Full playback via iframe
            "embed_url": f"https://widget.deezer.com/widget/dark/track/{item['id']}",
            "external_url": item["link"],
            "image": item["album"]["cover_medium"]
        }
        for item in items
    ]

    logger.debug(f"Deezer Tracks result: {results}")
    return results


def get_keywords_from_api(image_64):
    url = "http://34.45.241.77:8000/analyze/"
    payload = {
        "image_base64": image_64
    }

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            mood = data.get("mood", "")
            caption = data.get("caption", "")
            logger.info(mood)
            logger.info(caption)
            # keywords = [mood, caption] if mood and caption else []
            keywords = [mood] if mood else []
            return keywords
        else:
            logger.error(
                f"API error: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        logger.error(f"API call failed: {e}")
        return []


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
        if image_url.startswith("data:"):
            image_url = image_url.split(",")[1]
        keywords_list = get_keywords_from_api(image_url)

        if not keywords_list:
            return jsonify({"error": "No keywords returned from keyword API"}), 500

        keywords_str = "+".join(keywords_list)
        logger.info(keywords_str)

        backend_url = request.host_url.rstrip('/')
        results = requests.get(
            f"{backend_url}/deezer/search", params={"keywords": keywords_str})

        return jsonify({
            "message": "Keywords extracted and sent to Deezer.",
            "keywords": keywords_str,
            "results": results.json()
        }), 200

    except Exception as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500


@app.route('/get-images', methods=['GET'])
def get_images():
    user = request.args.get('username')

    if not user:
        return jsonify({"error": "Missing 'username'"}), 400

    results = db.find({"username": user})
    urls = [doc["url"] for doc in results]

    logger.info(f"Fetched {len(urls)} image URLs for user '{user}'")

    return jsonify({
        "username": user,
        "urls": urls
    })


@app.route('/deezer/search', methods=['GET'])
def deezer_search():
    keywords = request.args.get("keywords")
    if not keywords:
        logger.warning("Missing 'keywords' parameter in request.")
        return jsonify({"error": "Missing 'keywords' parameter"}), 400

    try:
        results = search_deezer_tracks(keywords)
        logger.info(
            f"Returning {len(results)} Deezer results for query: '{keywords}'")
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error during /deezer/search: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route('/favorites/add', methods=['POST'])
def add_favorite():
    data = request.get_json()
    user = data.get('username')
    song = data.get('song')

    if not user or not song:
        return jsonify({"error": "Missing 'username' or 'song'"}), 400

    existing = favorites_db.find_one({"username": user})

    if existing:
        # SAFELY check for duplicates
        if any(isinstance(fav, dict) and fav.get('preview_url') == song['preview_url'] for fav in existing['favorites']):
            return jsonify({"message": "Song already in favorites."}), 200

        favorites_db.update_one(
            {"username": user},
            {"$push": {"favorites": song}}
        )
    else:
        favorites_db.insert_one({"username": user, "favorites": [url]})

    return jsonify({"message": "favorite added successfully."}), 200


@app.route('/favorites', methods=['GET'])
def get_favorites():
    user = request.args.get('username')

    if not user:
        return jsonify({"error": "Missing 'username' parameter"}), 400

    data = favorites_db.find_one({"username": user}, {"_id": 0})

    if not data:
        return jsonify({"username": user, "favorites": []}), 200

    return jsonify(data), 200


@app.route('/favorites/delete', methods=['POST'])
def delete_favorite():
    data = request.get_json()
    user = data.get('username')
    preview_url = data.get('preview_url')

    if not user or not preview_url:
        return jsonify({"error": "Missing 'username' or 'preview_url'"}), 400

    existing = favorites_db.find_one({"username": user})

    if not existing:
        return jsonify({"error": "User not found."}), 404

    result = favorites_db.update_one(
        {"username": user},
        {"$pull": {"favorites": {"preview_url": preview_url}}}
    )

    if result.modified_count == 0:
        return jsonify({"message": "Favorite not found or already removed."}), 404

    return jsonify({"message": "Favorite removed successfully."}), 200


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/users', methods=['GET'])
def get_users():
    users = list(db.find({}, {"_id": 0}))
    return jsonify(users)


if __name__ == '__main__':
    try:
        app.run(host="0.0.0.0", port=5001, debug=True)
    except Exception as e:
        print(f"An error occurred: {e}")
