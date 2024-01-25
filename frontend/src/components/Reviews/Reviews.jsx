import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsThunk } from "../../store/review";
import { useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReview from "../DeleteReview/DeleteReview";

const SpotReviews = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const reviews = useSelector(state => state.reviews);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(getReviewsThunk(spotId));
    }, [dispatch, spotId]);

    function month(date) {
        const dateCreated = new Date(date);
        const month = dateCreated.getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[month];
    }

    function year(date) {
        const dateCreated = new Date(date);
        return dateCreated.getFullYear();
    }
    
    // const reviewsForSpot = Object.values(reviews).filter(review => review.spotId === parseInt(spotId));

    const reviewsForSpot = Object.values(reviews)
        .filter(review => review.spotId === parseInt(spotId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    if (!reviewsForSpot.length) {
        return <p>No reviews available for this spot.</p>;
    }

    return (
        <section>
            {reviewsForSpot.map((review) => (
                <div key={review.id}>
                    <h3 className="review-name">{review.User?.firstName}</h3>
                    <p className="review-dates">{month(review.createdAt)} {year(review.createdAt)}</p>
                    <p className="review-comments">{review.review}</p>
                    {sessionUser?.id === review.User?.id && (
                        <OpenModalButton
                            buttonText='Delete'
                            className='delete-button'
                            modalComponent={<DeleteReview reviewId={review.id}/>}
                        />
                    )}
                </div>
            ))}
        </section>
    );
};

export default SpotReviews;
