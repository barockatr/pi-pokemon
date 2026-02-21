import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className='loading-overlay'>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
        alt="Loading Pokeball"
        className="spinning-pokeball"
      />
      <p className="loading-text">CARGANDO DATOS...</p>
    </div>
  );
};

export default Loading;