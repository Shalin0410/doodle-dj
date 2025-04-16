import React from "react";
import "./LoginPage.css";
import LoginBtn from "../../Components/LoginBtn/LoginBtn";
import rightImage from "../../Assets/rightImage.png";
import redLogo from "../../Assets/redLogo.png";

const LoginPage = () => {
  return (
    <div className="login-page d-flex flex-column">
      <div className=" d-flex justify-content-between ">
        <div className="d-flex justify-content-between flex-column">
          <h1 className="logo">
            <div className="d-flex overflow-y-hidden">
              <img src={redLogo} style={{ width: "5rem" }} alt="Logo" />
              Doodle DJ
            </div>
          </h1>
        </div>
        <div className="login-btn-container me-5">
          <LoginBtn text="Sign in" />
        </div>
      </div>

      <div className="d-flex flex-column container m-auto">
        <div className="tag-line">Where Art Sparks Music.</div>
        <p className="hero-caption">
          DoodleDJ transforms your sketches into music- <br />
          just draw, and we'll match your vibe with the perfect tunes!
        </p>
      </div>

      <div className=" d-flex justify-content-end">
        <img className="right-image" src={rightImage} alt="rightImage" />
      </div>
      <div className="d-flex justify-content-center align-items-center p-2 footer">
        2025 © Byte On | All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
