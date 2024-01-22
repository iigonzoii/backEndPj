import { csrfFetch } from "./csrf"

//* action types
//* step 2

const LOAD_SPOTS = "spot/loadSpots"
const LOAD_SPOT = "spot/loadSpot"

//* action creators
//* step 3
export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}
export const loadSpot = (spot) => {
    return {
        type: LOAD_SPOT,
        spot
    }
}

//* thunks function that communicates with the backend. this manipulates all the information from front to back, back to front
//* step one

export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
    dispatch(loadSpots(spots));
};

export const fetchSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await response.json()
    dispatch(loadSpot(spot))
}

//* reducers
//* step four 
const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            let newState = {}
            action.spots.data.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState
        }
        case LOAD_SPOT:
            return { ...state, spotDetail: action.spot};
        default:
            return state;
    }
};

export default spotReducer;
