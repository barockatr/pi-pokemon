import React, { useEffect, useState, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import Card from './Card';
import CardSkeleton from './CardSkeleton';
import SidebarPokedex from './CardsContainer/SidebarPokedex';
import TutorialModal from './TutorialModal';
import CardDetailModal from './CardDetailModal';
import './CardsContainer.css';

const CardsContainer = () => {
  const pokemons = useGameStore((state) => state.pokemons);
  const getPokemon = useGameStore((state) => state.getPokemons);

  // Module 20: Skeletons & Layout Transition State
  const [isFetchingLocal, setIsFetchingLocal] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  // FASE 3: Estado local de modal eliminado.
  const setPokemonForDetail = useGameStore((state) => state.setPokemonForDetail);
  const cardsPerPage = 12;

  // Carousel Hooks
  const carouselRef = useRef(null);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 350 + 32; // Card width + gap (approx)
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Artificial 600ms loader to guarantee smooth Skeleton showcase since local fetch is too fast
    setIsFetchingLocal(true);
    getPokemon().then(() => {
      setTimeout(() => setIsFetchingLocal(false), 600);
    });
  }, [getPokemon]);

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

      {/* Main Grid Content - Full Width Gallery */}
      <div className={`pokedex-grid-wrapper gallery-mode`}>

        {/* === FLOATING POKÉDEX BUTTON (bottom-right) === */}
        <button
          className="floating-pokedex-btn"
          onClick={() => setTutorialOpen(true)}
          title="Abrir Pokédex TCG"
        >
          📱
        </button>

        {/* === MAIN CARD GRID (Now handled globally by HomePage) === */}

        {/* === CARD CAROUSEL SECTIOn === */}
        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={() => handleScroll('left')}>
            &#10094;
          </button>

          <div className="container" ref={carouselRef}>
            {isFetchingLocal ? (
              // Render 12 Skeleton Loaders
              Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="card-wrapper">
                  <CardSkeleton />
                </div>
              ))
            ) : currentCards.length ? (
              currentCards.map((pokemon, index) => (
                <div
                  key={pokemon.id}
                  className="card-wrapper"
                  style={{
                    animation: 'card-pop-in 0.4s ease-out forwards',
                    animationDelay: `${index * 0.04}s`,
                    opacity: 0
                  }}
                  onClick={() => setPokemonForDetail(pokemon)}
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
              ))
            ) : (
              // Global Empty State if completely empty
              <div className="global-empty-state">
                <h2>404: POKÉMON NOT FOUND</h2>
                <p>El Prof. Oak dice que no existe registro de esto.</p>
              </div>
            )}
          </div>

          <button className="carousel-arrow right" onClick={() => handleScroll('right')}>
            &#10095;
          </button>
        </div>

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

      </div> {/* CLose Grid Wrapper */}
    </div>
  );
};

export default CardsContainer;
