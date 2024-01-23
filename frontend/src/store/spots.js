import { csrfFetch } from "./csrf";

// action types 
const GET_ALL_SPOTS = 'spots/getSpots'
const GET_ONE_SPOTS = 'spots/getSpot'
const CREATE_SPOT = 'spots/createSpot'
const DELETE_SPOT = 'spots/deleteSpot'
// const UPDATE_SPOT = 'spots/updateSpot'

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

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
  }
}

// const updatedSpot = (spot) => {
//   return {
//     type: UPDATE_SPOT,
//     spot
//   }
// }

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

export const createSpotThunk = (spot, images) => async (dispatch) => {
  try {
    const response = await csrfFetch ('/api/spots', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(spot)
        });

    if(response.ok) {
      const newSpot = await response.json();
      const newImgArr = await dispatch(AddImageThunk(newSpot.id, images));
      const updatedSpot = { ...newSpot, images: newImgArr };
      dispatch(NewSpotStoreThunk(updatedSpot));
      return updatedSpot;
    }
  } catch (error) {
    const errors = await error.json();
    return errors;
  }
}
  
export const AddImageThunk = (spotId, images) => async () => {
  try {
    const newImgArr = [];
    for(let image of images) {
      const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: image,
          preview: true
        })
      })
      if(response.ok) {
        const newImg = await response.json();
        newImgArr.push(newImg)
      }
  
    }
    return newImgArr;
  
  } catch (error) {
    const errors = await error.json();
    return errors
  }
  }
  
  export const NewSpotStoreThunk = (newSpot) => (dispatch) => {
    dispatch(createSpot(newSpot))
}
  
export const destroySpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    dispatch(deleteSpot(spot.id))
  }
}

export const currentSpotThunk = () => async (dispatch) => {
  const response = await fetch('/api/spots/current', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if(response.ok) {
    const spots = await response.json();
    dispatch(getAllSpots(spots))
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
        case GET_ONE_SPOTS: { 
            const newState = {...state, [action.spot.id]: action.spot};
            return newState;
        }
        case CREATE_SPOT: {
            const newState = {...state, [action.spot.id]: action.spot};
            return newState;
        }
        case DELETE_SPOT:{
          const newState = {...state};
          delete newState[action.spotId]
          return newState
        }
        default:
            return state;
    }
}
export default spotsReducer;