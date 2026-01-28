import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/home");
  };

  return (
    <div className="landing">
      <h1>Welcome to Pokémon App</h1>
      <button onClick={handleButtonClick}>Enter</button>
    </div>
  );
};

export default LandingPage;
