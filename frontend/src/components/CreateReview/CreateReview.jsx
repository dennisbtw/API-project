import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReviewThunk } from "../../store/review"; 
import { getOneSpotThunk } from "../../store/spots";
import './CreateReview.css';
import { useModal } from "../../context/Modal";

const CreateReview = ({ spotId}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [activeRating, setActiveRating] = useState(0);
    const [error, setError] = useState({});
    const { closeModal } = useModal();

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
            setReviewText('');
            setRating(0);
            setActiveRating(0);
            closeModal();

            dispatch(getOneSpotThunk(spotId));
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
                    <div value={1} onClick={() => handleStarClick(1)} onMouseEnter={() => setActiveRating(1)} className={activeRating >= 1 ? 'filled' : 'empty'}>
                        ⭐️
                    </div>
                    <div value={2} onClick={() => handleStarClick(2)} onMouseEnter={() => setActiveRating(2)} className={activeRating >= 2 ? 'filled' : 'empty'}>
                        ⭐️
                    </div>
                    <div value={3} onClick={() => handleStarClick(3)} onMouseEnter={() => setActiveRating(3)} className={activeRating >= 3 ? 'filled' : 'empty'}>
                        ⭐️
                    </div>
                    <div value={4} onClick={() => handleStarClick(4)} onMouseEnter={() => setActiveRating(4)} className={activeRating >= 4 ? 'filled' : 'empty'}>
                        ⭐️
                    </div>
                    <div value={5} onClick={() => handleStarClick(5)} onMouseEnter={() => setActiveRating(5)} className={activeRating >= 5 ? 'filled' : 'empty'}>
                        ⭐️
                    </div>
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
