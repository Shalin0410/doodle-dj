import React, { useEffect, useState } from 'react';
import "./App.css";
import LoginPage from "./Pages/Login/LoginPage";
import { Routes, Route } from "react-router-dom";
import StudioPage from "./Pages/Studio/StudioPage";
import ProtectedRoute from "./Components/ProtectedRoute"; // Add this

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Make the API call
    fetch(`${process.env.REACT_APP_API_URL}/`) // Replace with the actual URL of your Flask app
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

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
      {/* <Route path="/studio" element={<StudioPage />} /> */}
    </Routes>
  );
}

export default App;
