import React, { useEffect, useState, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import Card from './Card';
import CardSkeleton from './CardSkeleton';
import CardDetailModal from './CardDetailModal';
import './CardsContainer.css';

const CardsContainer = () => {
  const pokemons = useGameStore((state) => state.pokemons);
  const getPokemon = useGameStore((state) => state.getPokemons);
  const hasMore = useGameStore((state) => state.hasMore);
  const resetPokedex = useGameStore((state) => state.resetPokedex); // Phase 1: Reset Action

  // Module 20: Skeletons & Layout Transition State
  const [isFetchingLocal, setIsFetchingLocal] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFlash, setShowFlash] = useState(false); // Phase 3: Flash Effect

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

  const handleResetRegion = () => {
    // 1. Mostrar Flash effect
    setShowFlash(true);

    // 2. Ejecutar scroll suave al inicio
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }

    // 3. Resetear el estado local y global después de un breve delay
    setTimeout(() => {
      setPage(1);
      resetPokedex();
      setShowFlash(false);
    }, 500); // 500ms coincides con la duración del flash-bang CSS
  };

  useEffect(() => {
    setIsFetchingLocal(true);
    getPokemon(page).then(() => {
      setTimeout(() => setIsFetchingLocal(false), 600);
    });
  }, [page, getPokemon]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Phase 2: Gatillo Silencioso y Freno de Seguridad
      if (entries[0].isIntersecting && !isFetchingLocal && hasMore) {
        setPage((prev) => prev + 1);
      }
    }, {
      root: carouselRef.current,
      rootMargin: "0px 400px 0px 0px", // Trigger 400px before reaching the end
      threshold: 0.5
    });

    const currentSentinel = sentinelRef.current;

    if (currentSentinel) {
      if (hasMore) {
        observer.observe(currentSentinel);
      } else {
        observer.disconnect();
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [pokemons.length, isFetchingLocal, hasMore]);

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
                {/* Phase 3: Automagic Skeletons when loading next pages */}
                {isFetchingLocal && page > 1 && Array.from({ length: 3 }).map((_, i) => (
                  <div key={`loading-${i}`} className="card-wrapper">
                    <CardSkeleton />
                  </div>
                ))}

                {/* Centinela Silencioso (Phase 3) */}
                {hasMore && (
                  <div ref={sentinelRef} style={{ width: '1px', height: '100%', flexShrink: 0 }}></div>
                )}

                {/* UX "Fin de la Pokédex" */}
                {!hasMore && (
                  <button className="end-of-pokedex" onClick={handleResetRegion}>
                    <span className="master-ball-icon">🟣</span>
                    <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem', lineHeight: '1.8', color: '#aaa' }}>
                      HAS LLEGADO AL LÍMITE DE<br />LA REGIÓN DE KANTO
                    </p>
                  </button>
                )}
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

      {/* Screen Flash Overlay */}
      {showFlash && <div className="screen-flash-overlay"></div>}
    </div>
  );
};

export default CardsContainer;
