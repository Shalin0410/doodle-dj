import React, { useState, useEffect } from "react";
import "./History.css"; // You can reuse Favorites.css if styling is same
import redLogo from "../../Assets/redLogo.png";
import { auth } from "../../firebaseConfig";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap"; // Import Bootstrap Carousel

const History = () => {
  const [user, setUser] = useState(null);
  const [historyImages, setHistoryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoading(true);
        fetchHistory(user.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchHistory = async (email) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/get-images?username=${email}`);
      const data = await response.json();
      setHistoryImages(data.urls || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="history-page container-fluid">
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
                    <Dropdown.Item onClick={() => navigate("/favorites")}>
                      Favorites
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

      {/* Centered Carousel */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: "-8rem", width: "100%" }}
      >
        {isLoading && (
          <div
            className="d-flex justify-content-center align-items-center flex-column"
            style={{ height: "100%" }}
          >
            <div className="spinner-border " role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Fetching your history...</p>
          </div>
        )}
        {!isLoading && historyImages.length === 0 && (
          <div className="text-center">
            <h2 className="overflow-hidden">No history yet.</h2>
            <p className="overflow-hidden">
              Start doodling and view your creations here!
            </p>
          </div>
        )}
        {!isLoading && historyImages.length > 0 && (
          <div style={{ width: "30rem", height: "30rem" }}>
            <Carousel interval={3000} pause="hover">
              {historyImages.map((url, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    src={url}
                    className="d-block w-100"
                    alt={`History ${idx}`}
                    style={{
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate("/studio", { state: { imageData: url } })
                    }
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
