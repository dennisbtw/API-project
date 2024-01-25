import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReviewThunk } from "../../store/review"; 

import './CreateReview.css';

const CreateReview = ({ spotId }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [activeRating, setActiveRating] = useState(0);
    const [error, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = {
            review: reviewText,
            stars: rating
        };

        const result = await dispatch(createReviewThunk(newReview, spotId, currentUser));
        if (result.errors) {
            setError({ message: "Review already exists for this spot" });
        } else {
            // Reset form on successful submission
            setReviewText('');
            setRating(0);
            setActiveRating(0);
        }
    };

    const handleStarClick = (newRating) => {
        setRating(newRating);
        setActiveRating(newRating);
    };

    return (
        <div id="review-modal-container">
            <h1>How was your stay?</h1>
            {"message" in error && <p>{error.message}</p>}
            <form id="review-modal-form" onSubmit={handleSubmit}>
                <label id="new-review-modal-label">
                    <textarea
                        id="newReviewText"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Leave your review here..."
                    />
                </label>
                <div id="stars-container" onMouseLeave={() => setActiveRating(rating)}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            value={star}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => setActiveRating(star)}
                            className={activeRating >= star ? 'filled' : 'empty'}
                        >
                            ⭐️
                        </span>
                    ))}
                    <span id="starsSpanPostReview">Stars</span>
                </div>
                <button
                    id={reviewText.length < 10 || rating < 1 ? "disabledButton" : "postReviewButtonConfirmation"}
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