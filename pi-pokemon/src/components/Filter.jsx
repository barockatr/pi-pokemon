import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterByCreate, orderByAttack, orderByName, filterByType, clearHome, getTypes } from '../redux/actions';
import './Filter.css';

function Filter({ setCurrentPage }) {
  const dispatch = useDispatch();
  const types = useSelector((state) => state.types);

  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

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
