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
    // console.log("spotsssss", spots)
    dispatch(loadSpots(spots));
};

//* reducers
const selectedSpots = state =>  state.spots

export const selectSpotsArr = createSelector(selectedSpots, spots => spots)
const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            let newState = {}
            // console.log("action.spots",action.spots)
            action.spots.data.forEach(spot => {
                newState[spot.id] = spot
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
