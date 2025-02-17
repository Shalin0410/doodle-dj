import React from "react";
import "./LoginPage.css";
import LoginBtn from "../../Components/LoginBtn/LoginBtn";

const LoginPage = () => {
  return (
    <div className=" d-flex justify-content-between login-page">
      <div className=" container d-flex justify-content-between flex-column">
        <h1 className="logo"> Doodle DJ</h1>
        <h1 className="tag-line">
          Where Art <br />
          Sparks Music
        </h1>
      </div>
      <div className="login-btn-container">
        <LoginBtn text="Sign in" />
      </div>
    </div>
  );
};

export default LoginPage;
