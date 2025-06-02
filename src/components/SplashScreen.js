import React from "react";
import "./SplashScreen.css";

function SplashScreen() {
  return (
    <div className="splash-container">
      <img src={require("../assets/favicon.png")} alt="Logo" className="splash-logo" />
    </div>
  );
}

export default SplashScreen;
