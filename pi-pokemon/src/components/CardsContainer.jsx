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

  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);

  // FASE 3: Estado local de modal eliminado.
  const setPokemonForDetail = useGameStore((state) => state.setPokemonForDetail);

  // Carousel Hooks
  const carouselRef = useRef(null);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 800; // Phase 4 spec: infinite horizontal flow
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (page === 1) {
      setIsFetchingLocal(true);
      getPokemon(1).then(() => {
        setTimeout(() => setIsFetchingLocal(false), 600);
      });
    } else {
      getPokemon(page);
    }
  }, [page, getPokemon]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingLocal) {
        setPage((prev) => prev + 1);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [isFetchingLocal]);

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>

      {/* Main Grid Content - Full Width Gallery */}
      <div className={`pokedex-grid-wrapper gallery-mode`}>

        {/* === MAIN CARD GRID (Now handled globally by HomePage) === */}

        {/* === CARD CAROUSEL SECTIOn === */}
        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={() => handleScroll('left')}>
            &#10094;
          </button>

          <div className="container" ref={carouselRef}>
            {isFetchingLocal && page === 1 ? (
              // Render 12 Skeleton Loaders
              Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="card-wrapper">
                  <CardSkeleton />
                </div>
              ))
            ) : pokemons.length ? (
              <>
                {pokemons.map((pokemon, index) => (
                  <div
                    key={`${pokemon.id}-${index}`}
                    className="card-wrapper"
                    style={{
                      animation: 'card-pop-in 0.4s ease-out forwards',
                      animationDelay: `${(index % 12) * 0.04}s`,
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
                ))}
                {/* Centinela Invisible */}
                <div ref={sentinelRef} style={{ minWidth: '20px', height: '100%' }}></div>
              </>
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

        {/* Pagination removed - Infinite carousel applied */}

      </div> {/* CLose Grid Wrapper */}
    </div>
  );
};

export default CardsContainer;
