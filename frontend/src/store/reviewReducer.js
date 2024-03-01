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

export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const review = await response.json()
    //* review is an object and we key into the array to make our reducer cleaner 
    dispatch(loadReviews(review.Reviews))
}

//* reducers

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            //* empty object for our future state
            let newState = {}
            //* go through our array and for each object create a key referencing the specific id for each object and set the value to the contents of said object///normalize data
            action.review.forEach(review => {
                newState[review.id] = review
            })
            //* return an object that now has all the reviews
            return newState
        }
        default:
            return state;
    }
};

export default reviewReducer;
