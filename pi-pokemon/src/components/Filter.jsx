import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterByCreate, orderByAttack, orderByName, filterByType, clearHome } from '../../Redux/Actions';
import './Filter.css';

function Filter({ setCurrentPage }) {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);

  const clearFilters = () => {
    dispatch(clearHome());
    setCurrentPage(0);
  };

  const handleType = (event) => {
    dispatch(filterByType(event.target.value));
    setCurrentPage(0);
  };

  const handleName = (event) => {
    dispatch(orderByName(event.target.value));
    setCurrentPage(0);
  };

  const handleAttack = (event) => {
    dispatch(orderByAttack(event.target.value));
    setCurrentPage(0);
  };

  const handleCreated = (event) => {
    dispatch(filterByCreate(event.target.value));
    setCurrentPage(0);
  };

  return (
    <div className="filter-container">
      <button onClick={clearFilters} className="filter-button">
        Clear filters
      </button>
      <label htmlFor="orderByAttack">Order Pokemons:</label>
      <select id="orderByAttack" onChange={handleAttack} className="filter-button">
        <option disabled defaultValue>
          Order Pokemons
        </option>
        <option value="asc">Ascendente</option>
        <option value="des">Descendente</option>
      </select>
      <label htmlFor="orderByName">Order by Name:</label>
      <select id="orderByName" onChange={handleName} className="filter-button">
        <option disabled defaultValue>
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
        <option value="fire">Fire</option>
        <option value="normal">Normal</option>
        <option value="ground">Ground</option>
        <option value="fairy">Fairy</option>
        <option value="electric">Electric</option>
        <option value="grass">Grass</option>
        <option value="poison">Poison</option>
        <option value="flying">Flying</option>
        <option value="water">Water</option>
        <option value="bug">Bug</option>
      </select>
    </div>
  );
}

export default Filter;
