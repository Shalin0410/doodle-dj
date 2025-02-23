import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import "./LoginBtn.css";
import { Button } from "react-bootstrap";

const LoginBtn = ({ text }) => {
  const firebaseConfig = {
    apiKey: "AIzaSyCv1QT-zGNH5iQAxebM8wD2Ksp5lgbVckw",
    authDomain: "doodledj-c05e8.firebaseapp.com",
    projectId: "doodledj-c05e8",
    storageBucket: "doodledj-c05e8.firebasestorage.app",
    messagingSenderId: "842732855029",
    appId: "1:842732855029:web:228cffa41f9fd67506afbc",
    measurementId: "G-Y3BQELYETJ",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log("User: ", user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
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
