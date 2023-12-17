import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";

const LandingPage = () => {
  const history = useHistory();

  const handleButtonClick = () => {
    history.push("/home");
  };

  return (
    <div>
      <h1>Landing Page</h1>
      <img src="C:\Users\tony_\OneDrive\Escritorio\pi-pokemon\PI-Pokemon-main\pokemon.png" alt="POKEMON" />
      <button onClick={handleButtonClick}>Go to Home Page</button>
    </div>
  );
};

export default LandingPage;