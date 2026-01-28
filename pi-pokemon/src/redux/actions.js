import axios from 'axios';

export const GET_POKEMONS = 'GET_POKEMONS';
export const GET_POKEMON_BY_NAME = 'GET_POKEMON_BY_NAME';
export const GET_TYPES = 'GET_TYPES';
export const FILTER_BY_TYPE = 'FILTER_BY_TYPE';
export const FILTER_BY_CREATE = 'FILTER_BY_CREATE';
export const ORDER_BY_NAME = 'ORDER_BY_NAME';
export const ORDER_BY_ATTACK = 'ORDER_BY_ATTACK';
export const CLEAR_HOME = 'CLEAR_HOME';

export const getPokemon = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('http://localhost:3001/pokemons');
      return dispatch({
        type: GET_POKEMONS,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const getTypes = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('http://localhost:3001/types');
      return dispatch({
        type: GET_TYPES,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const getPokemonByName = (name) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`http://localhost:3001/pokemons?name=${name}`);
      return dispatch({
        type: GET_POKEMON_BY_NAME,
        payload: data,
      });
    } catch (error) {
      console.error(error);
      alert('Pokemon not found');
    }
  };
};

export const filterByType = (payload) => {
  return {
    type: FILTER_BY_TYPE,
    payload
  };
};

export const filterByCreate = (payload) => {
  return {
    type: FILTER_BY_CREATE,
    payload
  };
};

export const orderByName = (payload) => {
  return {
    type: ORDER_BY_NAME,
    payload
  };
};

export const orderByAttack = (payload) => {
  return {
    type: ORDER_BY_ATTACK,
    payload
  };
};

export const clearHome = () => {
  return {
    type: CLEAR_HOME
  };
};
