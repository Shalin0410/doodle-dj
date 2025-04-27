import React, { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./Pages/Login/LoginPage";
import { Routes, Route, Navigate } from "react-router-dom";
import StudioPage from "./Pages/Studio/StudioPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import Favorites from "./Pages/Favorites/Favorites";
import History from "./Pages/History/History";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h2>Please open this website on a desktop for the best experience.</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/studio"
        element={
          <ProtectedRoute>
            <StudioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/studio" replace />} />
    </Routes>
  );
}

export default App;
