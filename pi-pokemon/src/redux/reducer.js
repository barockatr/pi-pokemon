import {
    GET_POKEMONS,
    GET_POKEMON_BY_NAME,
    GET_TYPES,
    FILTER_BY_TYPE,
    FILTER_BY_CREATE,
    ORDER_BY_NAME,
    ORDER_BY_ATTACK,
    CLEAR_HOME
} from './actions';

const initialState = {
    pokemons: [],
    allPokemons: [],
    types: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_POKEMONS:
            // Lógica de shuffling (mezclado) dinámica para ofrecer una vista fresca
            const shuffled = [...action.payload].sort(() => Math.random() - 0.5);
            return {
                ...state,
                pokemons: shuffled,
                allPokemons: shuffled
            };
        case GET_POKEMON_BY_NAME:
            return {
                ...state,
                pokemons: action.payload
            };
        case GET_TYPES:
            return {
                ...state,
                types: action.payload
            };
        case FILTER_BY_TYPE:
            const allPokemons = state.allPokemons;
            const typeFiltered = action.payload === 'all'
                ? allPokemons
                : allPokemons.filter(p => p.types.includes(action.payload));
            return {
                ...state,
                pokemons: typeFiltered
            };
        case FILTER_BY_CREATE:
            const allPokes = state.allPokemons;
            const createdFilter = action.payload === 'created'
                ? allPokes.filter(p => p.created)
                : allPokes.filter(p => !p.created);
            return {
                ...state,
                pokemons: action.payload === 'all' ? allPokes : createdFilter
            };
        case ORDER_BY_NAME:
            const sortedName = action.payload === 'asc'
                ? [...state.pokemons].sort((a, b) => a.name.localeCompare(b.name))
                : [...state.pokemons].sort((a, b) => b.name.localeCompare(a.name));
            return {
                ...state,
                pokemons: sortedName
            };
        case ORDER_BY_ATTACK:
            const sortedAttack = action.payload === 'asc'
                ? [...state.pokemons].sort((a, b) => a.attack - b.attack)
                : [...state.pokemons].sort((a, b) => b.attack - a.attack);
            return {
                ...state,
                pokemons: sortedAttack
            };
        case CLEAR_HOME:
            return {
                ...state,
                pokemons: state.allPokemons
            };
        default:
            return state;
    }
};

export default reducer;
