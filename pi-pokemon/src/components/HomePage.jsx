import React, { useState, useEffect } from "react";
import CardsContainer from "./CardsContainer";
import useGameStore from "../store/useGameStore";
import CardDetailModal from "./CardDetailModal";
import PokedexSidebar from "./PokedexSidebar";
import "./HomePage.css";

const HomePage = () => {
  const pokemons = useGameStore(state => state.pokemons);

  return (
    <div className="homepage">
      {/* 🔴 RED POKEDEX DASHBOARD (UI Navegación) */}
      <PokedexSidebar />

      {/* GRID PRINCIPAL */}
      <CardsContainer />
    </div>
  );
};

export default HomePage;
