import { csrfFetch } from "./csrf";

// action types 
const GET_ALL_SPOTS = 'spots/getSpots'

// action creators
const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

// thunk action creators

export const getAllSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
    

    if (response.ok) {
        dispatch(getAllSpots(spots));
        return spots;
    }
    
}

// reducer 

const spotsReducer = (state= {}, action) => {
    switch(action.type){
        case GET_ALL_SPOTS: {
            const newState = {...state};
            action.spots.Spots.forEach(spot => {
                newState[spot.id] = spot;
            });

            return newState
        }
        default:
            return state
    }
}
export default spotsReducer;