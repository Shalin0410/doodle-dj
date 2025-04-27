import React, { useState, useEffect } from "react";
import "./Favorites.css";
import redLogo from "../../Assets/redLogo.png";
import { auth } from "../../firebaseConfig";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";

const Favorites = () => {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]); // Favorite songs list
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // Optionally fetch user's favorites here
        fetchFavorites(user.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = async (email) => {
    try {
      const API_URL = "http://localhost:5001";
      const response = await fetch(`${API_URL}/favorites?username=${email}`);
      const data = await response.json();
      setSongs(data.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  return (
    <div className="favorites-page container-fluid">
      <div className="row">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-between flex-column">
            <h1 className="logo">
              <div className="d-flex overflow-y-hidden">
                <img src={redLogo} style={{ width: "5rem" }} alt="Logo" />
                Doodle DJ
              </div>
            </h1>
          </div>

          <div className="me-5 mt-3 d-flex align-items-center gap-3">
            {user && (
              <div>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm border border-1"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "50%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <span>{user.displayName}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="email-tooltip">{user.email}</Tooltip>
                      }
                    >
                      <Dropdown.Item disabled className="text-muted">
                        {user.email.length > 22
                          ? user.email.slice(0, 22) + "..."
                          : user.email}
                      </Dropdown.Item>
                    </OverlayTrigger>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => navigate("/studio")}>
                      Studio
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => navigate("/history")}>
                      History
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#" onClick={() => auth.signOut()}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centered Music Player */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: "-13rem" }}
      >
        {songs.length > 0 ? (
          <MusicPlayer
            songs={songs}
            setSongs={setSongs}
            user={user}
          />
        ) : (
          <div className="text-center">
            <h2>No favorite songs yet.</h2>
            <p>Start doodling and save your favorites!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
