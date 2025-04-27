import redLogo from "../../Assets/redLogo.png";
// import LogoutBtn from "../../Components/LogoutBtn/LogoutBtn";
import "./StudioPage.css";
import { useState, useEffect } from "react";
import DrawingCanvas from "../../Components/DrawingCanvas/DrawingCanvas";
import MusicPlayer from "../../Components/MusicPlayer/MusicPlayer";
import { auth } from "../../firebaseConfig";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const StudioPage = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const initialImageData = location.state?.imageData || null;

  useEffect(() => {
    if (initialImageData) {
      // Clear the state without changing the page (replace current history entry)
      navigate(location.pathname, { replace: true });
    }
  }, [initialImageData, navigate, location.pathname]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const handleDrawingSubmit = async (imageData) => {
    setIsLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageData, username: user.email }),
      });
      const data = await response.json();
      const songs = data.results || [];
      setSongs(songs.length ? songs : []);
    } catch (error) {
      console.error("Error getting song recommendations:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="studio-page container-fluid">
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
                    <Dropdown.Item onClick={() => navigate("/favorites")}>
                      Favorites
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
      <div className="row" style={{ marginTop: "-13rem" }}>
        <div className="col-md-8">
          <DrawingCanvas
            onSubmit={handleDrawingSubmit}
            isLoading={isLoading}
            initialImageData={initialImageData}
          />
        </div>
        <div className="col-md-4 overflow-hidden d-flex flex-column align-items-center justify-content-center">
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center flex-column"
              style={{ height: "100%" }}
            >
              <div className="spinner-border " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">
                Finding the perfect track for your doodle...
              </p>
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center mt-4 overflow-hidden song-list-color">
              <p
                className="mb-3 overflow-hidden song-list"
                style={{ fontSize: "3vw" }}
              >
                Let your creativity flow.
              </p>
              <p className="song-list" style={{ fontSize: "1.5vw" }}>
                Your next favorite song is just a doodle away.
              </p>
            </div>
          ) : (
            <MusicPlayer songs={songs} setSongs={setSongs} user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
