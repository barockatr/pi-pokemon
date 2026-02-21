import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
      <div className="navBar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Filter setCurrentPage={setCurrentPage} />
          <SearchBar setCurrentPage={setCurrentPage} />
        </div>
        <button
          onClick={() => setTutorialOpen(true)}
          style={{
            padding: '10px 20px', backgroundColor: '#dc0a2d', color: 'white',
            border: '2px solid black', borderRadius: '8px', fontWeight: 'bold',
            fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem',
            cursor: 'pointer', boxShadow: '2px 2px 0px #000'
          }}
        >
          📱 ABRIR POKÉDEX (TUTORIAL TCG)
        </button>
      </div>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setTutorialOpen(false)} />

      {pokemons.length ? (
        <div className="container">
          {pokemons
            .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
            .map((pokemon) => (
              <Card
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                types={pokemon.types}
                life={pokemon.life}
                attack={pokemon.attack}
                moves={pokemon.moves}
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
              className={`handlePageButton ${currentPage === index ? 'active' : ''
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
