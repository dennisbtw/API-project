import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpotThunk } from "../../store/spots";
import './SpotDetail.css';
import SpotReviews from "../Reviews/Reviews";
// import CreateReview from "../CreateReview/CreateReview";
const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);

    useEffect(() => {
        dispatch(getOneSpotThunk(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.SpotImages) return null;

    const imagesArr = spot.SpotImages;

    return (
        <div id="spot-detail-main-container">
            <div id="spot-detail-heading-info-container">
                <p className="spot-title">{spot.name}</p>
                <span id="spot-detail-location-info">{spot.city}, {spot.state}, {spot.country}</span>
            </div>
            <div className="spot-detail-all-images-container">
                <div className="spot-detail-image-container">
                    <img className="spot-detail-main-img" src={imagesArr[0].url} alt="Main Spot"/>
                </div>
                <div className="small-images-container">
                    {imagesArr.slice(1).map((image, index) => (
                        <div key={index} className="indiv-small-img-boxes">
                            <img className="spot-detail-small-image" src={image.url} alt={`Spot Image ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
            <div id="spot-info-container">
                <div id="spot-info">
                    <h2 id="hosted-by-name-header">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                    <p>{spot.description}</p>
                </div>
                <div id="reservation-section">
                <div className="price-rating-numReview">
                    <h2>${spot.price}</h2>
                    <span>night</span>
                </div>
                    <button id="reserve-button" onClick={() => alert("Feature coming soon")}>Reserve</button>
                </div>
            </div>
            <SpotReviews spotId={spotId} />
            {/* <CreateReview spotId={spotId} /> */}
        </div>
    );
};

export default SpotDetail;
