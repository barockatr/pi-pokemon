import React, { useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import './Filter.css';

function Filter({ setCurrentPage }) {
  const types = useGameStore((state) => state.types);
  const getTypes = useGameStore((state) => state.getTypes);
  const clearHome = useGameStore((state) => state.clearHome);
  const filterByType = useGameStore((state) => state.filterByType);
  const orderByName = useGameStore((state) => state.orderByName);
  const orderByAttack = useGameStore((state) => state.orderByAttack);
  const filterByCreate = useGameStore((state) => state.filterByCreate);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  const clearFilters = () => {
    clearHome();
    setCurrentPage(0);
  };

  const handleType = (event) => {
    filterByType(event.target.value);
    setCurrentPage(0);
  };

  const handleName = (event) => {
    orderByName(event.target.value);
    setCurrentPage(0);
  };

  const handleAttack = (event) => {
    orderByAttack(event.target.value);
    setCurrentPage(0);
  };

  const handleCreated = (event) => {
    filterByCreate(event.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="filter-container">
      <button onClick={clearFilters} className="filter-button">
        Clear filters
      </button>
      <label htmlFor="orderByAttack">Order Pokemons:</label>
      <select id="orderByAttack" onChange={handleAttack} className="filter-button" defaultValue="all">
        <option value="all" disabled>
          Order Pokemons
        </option>
        <option value="asc">Menor Ataque</option>
        <option value="des">Mayor Ataque</option>
      </select>
      <label htmlFor="orderByName">Order by Name:</label>
      <select id="orderByName" onChange={handleName} className="filter-button" defaultValue="all">
        <option value="all" disabled>
          Order by Name
        </option>
        <option value="asc">A-Z</option>
        <option value="des">Z-A</option>
      </select>
      <label htmlFor="filterCreated">Filter Created:</label>
      <select id="filterCreated" onChange={handleCreated} className="filter-button">
        <option value="all">All Pokemons</option>
        <option value="api">Existing Pokemons</option>
        <option value="created">Created Pokemons</option>
      </select>
      <label htmlFor="filterByType">Filter by Type:</label>
      <select id="filterByType" onChange={handleType} className="filter-button">
        <option value="all">Select one Poke-Type</option>
        {types?.map((type) => (
          <option key={type.id} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
