import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemon } from '../redux/actions';
import Card from './Card';
import Loading from './Loading';
import Filter from './Filter';
import SearchBar from './SearchBar';
import TutorialModal from './TutorialModal';
import './CardsContainer.css';

const CardsContainer = () => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isTutorialOpen, setTutorialOpen] = useState(false);
  const cardsPerPage = 12;

  useEffect(() => {
    dispatch(getPokemon());
  }, [dispatch]);

  useEffect(() => {
    setPageCount(Math.ceil(pokemons.length / cardsPerPage));
  }, [pokemons.length, cardsPerPage]);

  const handleNextClick = () => {
    if (currentPage < pageCount - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevClick = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const currentCards = pokemons.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage);

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>

      {/* === GLASSMORPHISM NAVBAR === */}
      <div className="navBar">
        <div className="toolbar-row">
          <Filter setCurrentPage={setCurrentPage} />
          <SearchBar setCurrentPage={setCurrentPage} />
        </div>
      </div>

      {/* === FLOATING POKÉDEX BUTTON (bottom-right) === */}
      <button
        className="floating-pokedex-btn"
        onClick={() => setTutorialOpen(true)}
        title="Abrir Pokédex TCG"
      >
        📱
      </button>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setTutorialOpen(false)} />

      {/* === CARD GRID with staggered animation === */}
      {currentCards.length ? (
        <div className="container">
          {currentCards.map((pokemon, index) => (
            <div
              key={pokemon.id}
              style={{
                animation: 'card-pop-in 0.4s ease-out forwards',
                animationDelay: `${index * 0.06}s`,
                opacity: 0
              }}
            >
              <Card
                id={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                types={pokemon.types}
                life={pokemon.life}
                attack={pokemon.attack}
                moves={pokemon.moves}
              />
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}

      {/* === PAGINATION === */}
      {pokemons.length > 0 && (
        <div className="handlePageContainer">
          <button disabled={currentPage === 0} onClick={handlePrevClick} className="handlePageButton">
            {'<'}
          </button>
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              className={`handlePageButton ${currentPage === index ? 'active' : ''}`}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === pageCount - 1} onClick={handleNextClick} className="handlePageButton">
            {'>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CardsContainer;
