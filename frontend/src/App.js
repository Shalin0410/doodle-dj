import React from "react";
import "./App.css";
import LoginPage from "./Pages/Login/LoginPage";
import { Routes, Route } from "react-router-dom";
import StudioPage from "./Pages/Studio/StudioPage";
import ProtectedRoute from "./Components/ProtectedRoute"; // Add this
import Favorites from "./Pages/Favorites/Favorites";
import History from "./Pages/History/History";
import { Navigate } from "react-router-dom"; // Add this

function App() {
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
