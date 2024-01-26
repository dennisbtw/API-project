import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReviewThunk } from "../../store/review"; 
import { getOneSpotThunk } from "../../store/spots";
import './CreateReview.css';
import { useModal } from "../../context/Modal";

const CreateReview = ({ spotId }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewError, setReviewError] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = {
            review: reviewText,
            stars: rating
        };

        const result = await dispatch(createReviewThunk(newReview, spotId, currentUser));
        if (result.errors) {
            setReviewError({ message: "Review already exists for this spot" });
        } else {
            setReviewText('');
            setRating(0);
            setHoverRating(0);
            closeModal();

            dispatch(getOneSpotThunk(spotId));
        }
    };

    const handleStarClick = (newRating) => {
        setRating(newRating);
        setHoverRating(newRating);
    };

    return (
        <div id="create-review-modal">
            <h1>How was your stay?</h1>
            {"message" in reviewError && <p>{reviewError.message}</p>}
            <form id="create-review-form" onSubmit={handleSubmit}>
                <label id="review-text-label">
                    <textarea
                        id="review-text-input"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Leave your review here..."
                    />
                </label>
                <div id="rating-stars" onMouseLeave={() => setHoverRating(rating)}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <div 
                            key={star}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            className={hoverRating >= star ? 'star-filled' : 'star-empty'}
                        >
                            ⭐️
                        </div>
                    ))}
                    <span className="rating-label"> stars </span>
                </div>
                <button
                    id={reviewText.length < 10 || rating < 1 ? "review-submit-disabled" : "review-submit-active"}
                    type="submit"
                    disabled={reviewText.length < 10 || rating < 1}
                >
                    Submit Your Review
                </button>
            </form>
        </div>
    );
};

export default CreateReview;