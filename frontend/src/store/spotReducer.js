import { createSelector } from "reselect"

//* action types

const LOAD_SPOTS = "spot/loadSpots"

//* action creators

export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

//* thunks

export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    const spots = await response.json();
    dispatch(loadSpots(spots));
};

//* reducers
const selectedSpots = state =>  state.spotState.entries

export const selectSpotsArr = createSelector(selectedSpots, spots => Object.values(spots))
const initialState = { entries: {} };

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            let newState = { ...state, entries: { ...state.entries} }
            action.spots.forEach(spot => {
                newState.entries[spot.id] = spot
            })
            return newState
        }
        // case ADD_ARTICLE:
        //     return { ...state, entries: [...state.entries, action.spot] };
        default:
            return state;
    }
};

export default spotReducer;
