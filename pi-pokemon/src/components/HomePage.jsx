import React, { useState, useEffect } from "react";
import CardsContainer from "./CardsContainer";
import useGameStore from "../store/useGameStore";
import CardDetailModal from "./CardDetailModal";
import PokedexSidebar from "./PokedexSidebar";
import "./HomePage.css";

const HomePage = () => {
  const selectedPokemonForDetail = useGameStore(state => state.selectedPokemonForDetail);
  const setPokemonForDetail = useGameStore(state => state.setPokemonForDetail);

  return (
    <div className="homepage">
      {/* 🔴 RED POKEDEX DASHBOARD (UI Navegación) */}
      <PokedexSidebar />

      {/* GRID PRINCIPAL */}
      <CardsContainer />

      {/* FASE 2: Modal Centralizado */}
      {selectedPokemonForDetail && (
        <CardDetailModal
          pokemon={selectedPokemonForDetail}
          onClose={() => setPokemonForDetail(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
