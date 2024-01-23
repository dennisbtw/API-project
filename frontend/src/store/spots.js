import { csrfFetch } from "./csrf";

// action types 
const GET_ALL_SPOTS = 'spots/getSpots'
const GET_ONE_SPOTS = 'spots/getSpot'
const CREATE_SPOT = 'spots/createSpot'

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
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    });

    if (res.ok) {
        const data = await res.json();
        const resPreviewImage = await csrfFetch(`/api/spots/${data.id}/images`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                url: images.previewImage,
                preview: true
            })
        });

        if (resPreviewImage.ok) {
            const previewImageData = await resPreviewImage.json();
            data.previewImage = previewImageData.url;
        }

        const imageKeys = ['image1', 'image2', 'image3', 'image4'];
        for (const key of imageKeys) {
            const imageUrl = images[key];
            if (imageUrl) {
                const resImage = await csrfFetch(`/api/spots/${data.id}/images`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        url: imageUrl,
                        preview: false
                    })
                });

                if (resImage.ok) {
                    const imageData = await resImage.json();
                    data[key] = imageData.url;
                }
            }
        }

        dispatch(createSpot(data));
        return data;
    }
};
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
        case CREATE_SPOT:
            const newState = {...state, [action.spot.id]: action.spot};
            return newState;
        default:
            return state;
    }
}
export default spotsReducer;