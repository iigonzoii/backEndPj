import { csrfFetch } from "./csrf"

//*--------ACTION TYPES------------

const LOAD_SPOTS = "spot/loadSpots"
const LOAD_SPOT = "spot/loadSpot"

//*--------ACTION CREATORS-------------
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

//* -------------THACS-------------
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
    console.log("SPOTSSSS",spots)
    // * dispatches our loadSpots action creator passing in our database info from our server
    dispatch(loadSpots(spots.data));
};

//* Takes in a spotId as the payload from our component
export const fetchSpot = (spotId) => async (dispatch) => {
    //* fetching our individual spot using the spotId in our url
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await response.json()
    //* dispatch our loadSpot action creator taking in our spot from the fetch
    dispatch(loadSpot(spot))
}


//*---------------REDUCERS-------------------
const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            let newState = {}
            action.spots.forEach(spot => {
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