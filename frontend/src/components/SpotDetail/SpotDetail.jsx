import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { getOneSpotThunk } from "../../store/spots";

const SpotDetail = () => {
    const {spotId} = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    useEffect(() => {
        dispatch(getOneSpotThunk(spotId));
    },[dispatch, spotId]);

    if(!spot) return null;
    
    const handleReserveClick = () => {
        alert("Feature coming soon");
    };
    
    return (
        <div className="spot-detail">
        <h1>{spot.name}</h1>
        <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
        <div className="images">
            <img src={spot.images[0]} alt={spot.name} className="large-image" />
            <div className="small-images">
                {spot.images.slice(1, 5).map((image, index) => (
                    <img key={index} src={image} alt={`${spot.name} ${index + 1}`} />
                    ))}
            </div>
        </div>
        <p>Hosted by {spot.hostFirstName} {spot.hostLastName}</p>
        <p>{spot.description}</p>
        <div className="callout-info-box">
            <p>{spot.price} per night</p>
            <button onClick={handleReserveClick}>Reserve</button>
        </div>
    </div>
    );
}




export default SpotDetail;