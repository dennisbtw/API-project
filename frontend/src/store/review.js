import { csrfFetch } from "./csrf";

// action types
const GET_REVIEWS = 'reviews/getSpotReviews'
const DELETE_REVIEWS = 'reviews/deleteReviews'
const CREATE_REVIEW = 'reviews/createReviews'
const CLEAR_REVIEWS = 'reviews/clearReviews';
// action creators

const getSpotReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

const deleteReviews = (reviewId) => {
    return {
        type: DELETE_REVIEWS,
        reviewId
    }
}

const createReview = (newReview) => {
    return {
        type: CREATE_REVIEW,
        newReview
    }
}

export const clearReviews = () => {
    return {
        type: CLEAR_REVIEWS
    };
};

// thunks
export const getReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const reviews = await response.json();

    if (response.ok) {
        dispatch(getSpotReviews(reviews));
        return reviews;
    }
}

export const deleteReviewsThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      })
    
      if (response.ok) {
        const reviews = await response.json();
        dispatch(deleteReviews(reviewId))
        return reviews
    }
}

export const createReviewThunk = (review, spotId, currentUser) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    });

    if(response.ok) {
        const newReview = await response.json();
        dispatch(createReview(newReview)); 

        dispatch(getReviewsThunk(spotId));

        return newReview;
    }
};
// reducers

const reviewsReducer = (state = {}, action) => {
    switch(action.type) {
        case GET_REVIEWS: {
            const newState = {...state};
            action.reviews.Reviews.forEach(review => {
                newState[review.id] = review
            })
            return newState;
        }
        case DELETE_REVIEWS: {
            const newState = {...state};
            delete newState[action.reviewId]
            return newState;
        }
        case CREATE_REVIEW: {
            const newState = {...state};
            if (action.newReview && action.newReview.id) {
                newState[action.newReview.id] = action.newReview;
            }
            return newState;
        }
        case CLEAR_REVIEWS: {
            return {}; 
        }
        default:
            return state;
    }
}

export default reviewsReducer