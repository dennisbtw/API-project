import { csrfFetch } from "./csrf";

// action types 
const GET_ALL_SPOTS = 'spots/getSpots'
const GET_ONE_SPOTS = 'spots/getSpot'

// action creators
const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

const getSpot = (spot) => {
    return {
        type: GET_ONE_SPOTS,
        spot
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

export const getOneSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await response.json();

    if(response.ok){
        dispatch(getSpot(spot))
        return spot;
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
        case GET_ONE_SPOTS: { 
            const newState = {...state, [action.spot.id]: action.spot};
            return newState;
        }
        
        default:
            return state;
    }
}
export default spotsReducer;