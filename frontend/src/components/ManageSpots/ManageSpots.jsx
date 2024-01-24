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

    return (
        <div className="manage-spots-container">
            <h1>Manage Spots</h1>
            <div className="spots-list">
                {userSpots.map(spot => (
                    <div key={spot.id} className="spot-tile" onClick={() => navigate(`/spots/${spot.id}`)}>
                        <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail" />
                        <div className="spot-info">
                            <span>{spot.city}, {spot.state}</span>
                            <span>
                                {typeof spot.avgRating === "number" && spot.avgRating > 0 ? 
                                 `⭐${spot.avgRating.toFixed(2)}` : '⭐New'}
                            </span>
                            <span>${spot.price} night</span>
                        </div>
                        <div className="spot-actions">
                        <UpdateButtons spotId={spot.id}/>
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