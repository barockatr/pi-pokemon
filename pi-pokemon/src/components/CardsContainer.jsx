import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemon } from '../../Redux/Actions';
import Cards from '../Cards/Card'; // Asegúrate de tener la importación correcta
import Loading from '../Loading/Loading';
import Filter from '../Filter/Filter';
import SearchBar from '../SearchBar/SearchBar';
import './CardsContainer.css';

const CardsContainer = () => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const cardsPerPage = 12;

  useEffect(() => {
    dispatch(getPokemon());
  }, [dispatch]);

  useEffect(() => {
    setPageCount(Math.ceil(pokemons.length / cardsPerPage));
  }, [pokemons.length, cardsPerPage]);

  const handleNextClick = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="navBar">
        <Filter setCurrentPage={setCurrentPage} />
        <SearchBar setCurrentPage={setCurrentPage} />
      </div>
      {pokemons.length ? (
        <div className="container">
          {pokemons
            .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
            .map((pokemon) => (
              <Cards
                key={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                types={pokemon.types}
              />
            ))}
        </div>
      ) : (
        <Loading />
      )}
      {pokemons.length > 0 && (
        <div className="handlePageContainer">
          <button
            disabled={currentPage === 0}
            onClick={handlePrevClick}
            className="handlePageButton"
          >
            {"<"}
          </button>
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              className={`handlePageButton ${
                currentPage === index ? 'active' : ''
              }`}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === pageCount - 1}
            onClick={handleNextClick}
            className="handlePageButton"
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CardsContainer;
