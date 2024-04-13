import { csrfFetch } from "./csrf"

//* action types

const LOAD_REVIEWS = "review/loadReviews"
const LOAD_REVIEW = "review/loadReview"
const DELETE_REVIEW="review/deleteReview"

//* action creators

export const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}
export const loadReview = (review) => {
    return {
        type: LOAD_REVIEW,
        review
    }
}
export const reviewDelete = (review) => {
    return {
        type: DELETE_REVIEW,
        review
    }
}

//* thunks


export const createReview = (review, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(review),
        headers: { "Content-Type": "application/json" }
    })
    const newReview = await response.json()
    dispatch(loadReview(newReview))
    return newReview
}

export const fetchReviews = (spotId) => async (dispatch) => {
    // //* review is an object and we key into the array to make our reducer cleaner
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    let review = await response.json()
    //* review is an object and we key into the array to make our reducer cleaner
    dispatch(loadReviews(review.Reviews))
}

export const deleteReview = (reviewId,spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })
    if (response.ok) {
        dispatch(deleteReview(reviewId))
        .then(dispatch(fetchReviews(spotId)))
        .then(reviews => {
            dispatch(loadReviews(reviews.Reviews))
        })
    }
    return response
    // dispatch thunks to repopulate the updated reviews if this doesnt work
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            //* empty object for our future state
            let newState = {}
            //* go through our array and for each object create a key referencing the specific id for each object and set the value to the contents of said object///normalize data
            action.reviews.forEach(review => {
                newState[review.id] = review
            })
            //* return an object that now has all the reviews
            return newState
        }
        case LOAD_REVIEW: {
            return {...state, [action.review.id]: action.review}
        }
        case DELETE_REVIEW: {
            let newState = {...state}
            delete newState.action.review
            return newState
        }
        default:
            return state;
    }
};

export default reviewReducer;
