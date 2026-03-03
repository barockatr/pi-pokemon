import React, { useState, useEffect } from "react";
import CardsContainer from "./CardsContainer";
import useGameStore from "../store/useGameStore";
import CardDetailModal from "./CardDetailModal";
import "./HomePage.css";


const HomePage = () => {
  const pokemons = useGameStore(state => state.pokemons);

  return (
    <div className="homepage">
      {/* GRID PRINCIPAL */}
      <CardsContainer />
    </div>
  );
};

export default HomePage;
