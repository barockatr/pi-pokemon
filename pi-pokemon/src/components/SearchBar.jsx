import React, { useState } from "react";
import useGameStore from "../store/useGameStore";

const SearchBar = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);
  const getPokemonByName = useGameStore(state => state.getPokemonByName);
  const allPokemons = useGameStore(state => state.allPokemons);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      // Verificamos si existe en el cache local (case-insensitive fuzzy basis)
      const exists = allPokemons.some(p => p.name.toLowerCase().includes(term));
      
      if (exists || term.length > 2) {
        setNoResults(false);
        getPokemonByName(term);
        setSearchTerm("");
        setCurrentPage && setCurrentPage(0);
      } else {
        setNoResults(true);
      }
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Busca por nombre o ID..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      
      {noResults && (
        <div className="search-empty-state">
          <span>💨</span>
          <p>¡Un Pokémon salvaje huyó! No encontramos coincidencias para "{searchTerm}". Intenta otra búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
