import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./LoginBtn.css";
import { auth } from "../../firebaseConfig"; // Import auth from firebaseConfig

const LoginBtn = ({ text }) => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User: ", result.user);
        navigate("/studio");
      })
      .catch((error) => {
        console.error("Login error: ", error);
      });
  };

  return (
    <Button
      variant="light"
      className="login-btn mt-4 rounded"
      onClick={signInWithGoogle}
    >
      <div className="d-flex align-items-center gap-3">
        <FcGoogle style={{ fontSize: "2rem" }} />
        <div>{text}</div>
      </div>
    </Button>
  );
};

export default LoginBtn;
