import DeleteSpot from "../DeleteSpot/DeleteSpot";
import UpdateButtons from "./UpdateButton";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { currentSpotThunk } from "../../store/spots";

const ManageSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spotsObj = useSelector(state => state.spots);
    const sessionUser = useSelector(state => state.session.user);
    const userSpots = Object.values(spotsObj).filter(spot => spot.ownerId === sessionUser.id);

    useEffect(() => {
        dispatch(currentSpotThunk());
    }, [dispatch]);

    const navigateToSpot = (e) => {
        if (e.target.closest('.navigate-spot')) {
            navigate(`/spots/${spot.id}`);
        }
    }

    return (
        <div className="manage-spots-container">
            <h1>Manage Spots</h1>
            <button id="create-spot-button-manage-spot" onClick={() => navigate('/spots/new')}>Create a New Spot</button>
            <div className="spots-list">
                {userSpots.map(spot => (
                    <div key={spot.id} className="spot-tile" onClick={navigateToSpot}>
                        <div className="navigate-spot">
                            <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail navigate-spot" />
                            <div className="spot-info navigate-spot">
                                <div>{spot.city}, {spot.state}</div>
                                <div>
                                    <span role="img" aria-label="star">⭐</span>
                                    {spot.avgRating > 0 ? spot.avgRating.toFixed(2) : 'New'}
                                </div>
                                <span>${spot.price} per night</span>
                            </div>
                        </div>
                        <div className="spot-actions">
                            <UpdateButtons spotId={spot.id} className="navigate-spot"/>
                            <OpenModalButton
                                buttonText='Delete'
                                className='delete-button'
                                modalComponent={<DeleteSpot spot={spot}/>}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageSpots;