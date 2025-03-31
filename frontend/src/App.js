import "./App.css";
import LoginPage from "./Pages/Login/LoginPage";
import { Routes, Route } from "react-router-dom";
import StudioPage from "./Pages/Studio/StudioPage";
import ProtectedRoute from "./Components/ProtectedRoute"; // Add this

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
      {/* <Route path="/studio" element={<StudioPage />} /> */}
    </Routes>
  );
}

export default App;
