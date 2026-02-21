import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/home");
  };

  return (
    <div className="landing-wrapper">
      <h1 className="landing-title">PI Pokémon TCG</h1>

      <button className="pokeball-cta" onClick={handleButtonClick} title="Enter the TCG Dashboard">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
          alt="Pokeball Enter"
          className="pokeball-img"
        />
      </button>

      <p className="landing-subtitle">Click the Pokéball to start</p>
    </div>
  );
};

export default LandingPage;
