import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpotThunk } from "../../store/spots";
import './SpotDetail.css';
import SpotReviews from "../Reviews/Reviews";
import CreateReview from "../CreateReview/CreateReview";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { getReviewsThunk } from "../../store/review";
import { clearReviews } from "../../store/review";

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    const sessionUser = useSelector(state => state.session.user)
    const reviews = useSelector(state => state.reviews)
    const [rendered, setRendered] = useState(false);
    const [avgRating, setAvgRating] = useState(null);
    const [numReviews, setNumReviews] = useState(0);

    useEffect(() => {
        dispatch(getOneSpotThunk(spotId));
    }, [dispatch, spotId]);
    //reviews
    // rendered

    useEffect(() => {
        const spotReviews = Object.values(reviews).filter(review => review.spotId === parseInt(spotId));
        if (spotReviews.length > 0) {
            const totalRating = spotReviews.reduce((acc, review) => acc + review.stars, 0);
            setAvgRating(totalRating / spotReviews.length);
            setNumReviews(spotReviews.length);
        }
    }, [reviews, spotId]);
    
    useEffect(() => {
        dispatch(getOneSpotThunk(spotId));
        dispatch(getReviewsThunk(spotId));
    
        return () => {
            dispatch(clearReviews());
        };
    }, [dispatch, spotId]);
    


    useEffect(() => {
        if (reviews && sessionUser) {
            const userReview = Object.values(reviews).find(review => review.userId === sessionUser.id && review.spotId === parseInt(spotId));
            
            setRendered(!!userReview);
        }
    }, [reviews, sessionUser, spotId]);

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
                    <img className="spot-detail-main-img" src={imagesArr[0].url} alt="Main Spot" />
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
                    <div className="price-and-rating-container">
                        <div className="price-container">
                            <h2>${spot.price}</h2>
                            <span className="night-span">night</span>
                        </div>
                        <div className="rating-container">
                            {numReviews > 0 ? (
                                <span className="spotReviewsReserveSection">
                                    ⭐️
                                    {avgRating.toFixed(2)}
                                    <span> · </span>
                                    {numReviews} {numReviews === 1 ? 'Review' : 'Reviews'}
                                </span>
                            ) : (
                                <span className="spotReviewsReserveSection">⭐ New</span>
                            )}
                        </div>
                    </div>
                    <button id="reserve-button" onClick={() => alert("Feature coming soon")}>Reserve</button>
                </div>
            </div>
            <section id="spotDetailReviewSection">
                <div>
                    {numReviews > 0 ? (
                        <h2 className="ratings-bottom">
                            ⭐️ {avgRating.toFixed(2)} · {numReviews} {numReviews === 1 ? 'Review' : 'Reviews'}
                        </h2>
                    ) : (
                        <h2>⭐ New</h2>
                    )}
                </div>
                {(sessionUser && !rendered && spot.Owner.id !== sessionUser.id) && (
                    <OpenModalButton
                        buttonText="Post Your Review"
                        buttonId="postYourReviewButton"
                        modalComponent={<CreateReview spotId={spotId} setRendered={setRendered} />}
                    />
                )}
                <div>
                    <SpotReviews spot={spot} rendered={rendered} />
                </div>
            </section>
        </div>
    );
};

export default SpotDetail;
