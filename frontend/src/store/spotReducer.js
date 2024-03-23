import { csrfFetch } from "./csrf"

//*--------ACTION TYPES------------

const LOAD_SPOTS = "spot/loadSpots"
const LOAD_SPOT = "spot/loadSpot"
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

export const update = (updatedSpot) => {
    return {
        type: UPDATE_SPOT,
        updatedSpot
    }
}

//* -------------THACS-------------
export const deleteSpot = spotId => async dispatch =>{
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    dispatch(fetchCurrUserSpots())
    return response
}

export const fetchCurrUserSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current")
    const spots = await response.json()
    dispatch(loadSpots(spots.Spots))
}
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
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
export const fetchSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await response.json()
    dispatch(loadSpot(spot))
    return spot
}

export const updateSpot = (spotId, spot) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'Put',
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const updatedSpot = await response.json()
        dispatch(update(updatedSpot))
        return updatedSpot
    }
    return response
}





//*---------------REDUCERS-------------------
const initialState = { spotDetail: {} };

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            // console.log("ACTIONNNN",action)
            let newState = {}
            action.spots.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState
        }
        case LOAD_SPOT:
            return { ...state, spotDetail: {...action.spot}};
        case UPDATE_SPOT:
            return {...state, spotDetail: action.spot}
        default:
            return state;
    }
};

export default spotReducer;
