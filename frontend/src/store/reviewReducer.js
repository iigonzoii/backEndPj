import { csrfFetch } from "./csrf"

//* action types

const LOAD_REVIEWS = "review/loadReviews"
const LOAD_REVIEW = "review/loadReview"

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

//* thunks

// export const fetchReviews = () => async (dispatch) => {
//     const response = await csrfFetch('/api/reviews');
//     const reviews = await response.json();
//     console.log("reviews",reviews)
//     dispatch(loadReviews(reviews));
// };

export const fetchReview = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const review = await response.json()
    // console.log("REVIEW",review)
    dispatch(loadReview(review.Reviews))
}

//* reducers

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEW: {
            let newState = {}
            console.log("ACTIN.REVIEW",action.review)
            action.review.forEach(review => {
                newState[review.id] = review
            })
            return newState
        }
        default:
            return state;
    }
};

export default reviewReducer;
