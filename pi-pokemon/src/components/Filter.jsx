import React, { useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import './Filter.css';

function Filter({ setCurrentPage }) {
  const [attackRangeVal, setAttackRangeVal] = useState(0);
  const [lifeRangeVal, setLifeRangeVal] = useState(0); // Nuevo estado local para slider HP

  const types = useGameStore((state) => state.types);
  const getTypes = useGameStore((state) => state.getTypes);
  const clearHome = useGameStore((state) => state.clearHome);
  const filterByType = useGameStore((state) => state.filterByType);
  const orderByName = useGameStore((state) => state.orderByName);
  const filterByAttackRange = useGameStore((state) => state.filterByAttackRange);
  const filterByLifeRange = useGameStore((state) => state.filterByLifeRange); // Nuevo action store
  const filterByCreate = useGameStore((state) => state.filterByCreate);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  const clearFilters = () => {
    setAttackRangeVal(0);
    setLifeRangeVal(0);
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

  const handleAttackRange = (event) => {
    const val = parseInt(event.target.value, 10);
    setAttackRangeVal(val);
    setLifeRangeVal(0); // Reset the other slider to prevent compound confusion for now
    filterByAttackRange(val);
    setCurrentPage(0);
  };

  const handleLifeRange = (event) => {
    const val = parseInt(event.target.value, 10);
    setLifeRangeVal(val);
    setAttackRangeVal(0); // Reset the other slider
    filterByLifeRange(val);
    setCurrentPage(0);
  };


  const handleCreated = (event) => {
    filterByCreate(event.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="filter-container">
      <button onClick={clearFilters} className="filter-button clear-btn">
        Limpiar Filtros
      </button>

      <details className="filter-accordion" open>
        <summary>Filtros Tácticos de Combate</summary>
        <div className="accordion-content">
          <label>Poder de Ataque Crítico: {attackRangeVal}+</label>
          <div className="range-slider-wrapper">
            <input
              type="range"
              min="0"
              max="200"
              value={attackRangeVal}
              onChange={handleAttackRange}
              className="premium-range-slider"
            />
            <div className="range-bookends">
              <span>0</span>
              <span>200+</span>
            </div>
          </div>

          <label>Puntos de Vida (HP) Mínimos: {lifeRangeVal}+</label>
          <div className="range-slider-wrapper">
            <input
              type="range"
              min="0"
              max="200"
              value={lifeRangeVal}
              onChange={handleLifeRange}
              className="premium-range-slider hp-slider"
              style={{
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            />
            <div className="range-bookends">
              <span>0</span>
              <span>200+</span>
            </div>
          </div>

          <label htmlFor="orderByName">Ordenar Alfabéticamente:</label>
          <select id="orderByName" onChange={handleName} className="filter-button" defaultValue="all">
            <option value="all" disabled>Seleccionar</option>
            <option value="asc">A-Z</option>
            <option value="des">Z-A</option>
          </select>
        </div>
      </details>

      <details className="filter-accordion">
        <summary>Filtros de Búsqueda</summary>
        <div className="accordion-content">
          <label htmlFor="filterCreated">Origen:</label>
          <select id="filterCreated" onChange={handleCreated} className="filter-button">
            <option value="all">Todos</option>
            <option value="api">Oficiales</option>
            <option value="created">Creados</option>
          </select>
          <label>Tipo de Elemento:</label>
          <div className="type-grid-filter">
            {/* "All" Button */}
            <button
              className={`type-btn-pill ${useGameStore.getState().currentFilters?.type === 'all' || !useGameStore.getState().currentFilters?.type ? 'active' : ''}`}
              onClick={() => handleType({ target: { value: 'all' } })}
            >
              Todos
            </button>

            {types?.map((type) => (
              <button
                key={type.id}
                className={`type-btn-pill type-${type.name}`}
                onClick={() => handleType({ target: { value: type.name } })}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}

export default Filter;
