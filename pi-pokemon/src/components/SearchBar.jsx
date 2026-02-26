import React, { useState } from "react";
import useGameStore from "../store/useGameStore";

const SearchBar = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const getPokemonByName = useGameStore(state => state.getPokemonByName);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      getPokemonByName(searchTerm);
      setSearchTerm("");
      setCurrentPage(0);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
