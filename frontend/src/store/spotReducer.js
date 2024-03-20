import { csrfFetch } from "./csrf"

//*--------ACTION TYPES------------

const LOAD_SPOTS = "spot/loadSpots"
const LOAD_SPOT = "spot/loadSpot"
//!might not need update
const UPDATE_SPOT = "spot/updateSpot"

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
//! i think i can use the loadSpot action in my update spot thunk and not even need update ac
export const update = (updatedSpot) => {
    return {
        type: UPDATE_SPOT,
        updatedSpot
    }
}

//* -------------THACS-------------
export const fetchCurrUserSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current")
    const spots = await response.json()
    console.log("fetchCurrSpots", spots)
    dispatch(loadSpots(spots.Spots))
}
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
    console.log("SPOTSSSS", spots)
    // * dispatches our loadSpots action creator passing in our database info from our server
    dispatch(loadSpots(spots.data));
};

export const newImage = payload => async dispatch => {
    const response = csrfFetch(`/api/spots/${payload.id}/images`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    })
}

export const createSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        body: JSON.stringify(spot),
        headers: { "Content-Type": "application/json" }
    })
    const newSpot = await response.json()
    dispatch(loadSpot(newSpot))
    return newSpot
}

//* Takes in a spotId as the payload from our component
export const fetchSpot = (spotId) => async (dispatch) => {
    //* fetching our individual spot using the spotId in our url
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await response.json()
    // console.log("SPOTSTHUNK", spot)
    //* dispatch our loadSpot action creator taking in our spot from the fetch
    dispatch(loadSpot(spot))
}

export const updateSpot = (spotId, spot) => async dispatch => {
    const response = await csrfFetch(`api/spots${spotId}`, {
        method: 'Put',
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const updatedSpot = await response.json()
        //? line 83 might be conflicting with line 72, maybe I do need update action creator instead of just using loadSpot
        dispatch(loadSpot(updatedSpot))
        return response
    }
    return response
}




//*---------------REDUCERS-------------------
const initialState = { spotDetai: {} };

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            console.log("ACTIONNNN",action)
            let newState = {}
            action.spots.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState
        }
        case LOAD_SPOT:
            return { ...state, spotDetail: action.spot };
        default:
            return state;
    }
};

export default spotReducer;
