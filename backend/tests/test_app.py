import pytest
import sys
import os
from unittest.mock import patch, MagicMock

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_hello_world(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.data == b'Hello, World!'


def test_get_users(client):
    mock_users = [{"name": "John Doe", "email": "johndoe@example.com"}]
    with patch("app.db.find", MagicMock(return_value=mock_users)):
        response = client.get('/users')
        assert response.status_code == 200
        assert response.get_json() == mock_users