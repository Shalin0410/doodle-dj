import React from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./LogoutBtn.css";
import { auth } from "../../firebaseConfig"; // Import auth from firebaseConfig

const LogoutBtn = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-light logout-btn p-2 px-4 rounded-5"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default LogoutBtn;
