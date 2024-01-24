import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import './Spots.css'

const SpotsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = useSelector(state => state.spots);
    const spotsArr = Object.values(spots);
    console.log("spots array", spotsArr);

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch])

    if(!spots) return null;

    return (
        <div id="tilesContainer">
            {spotsArr.map((spot) => (
                <div key={spot.id} id="innerTileContainerHome">
                    <div className="spotTile" title={spot.name} onClick={() => navigate(`/spots/${spot.id}`)}>
                        <img src={spot.previewImage} className="tileImage" alt={`${spot.city}, ${spot.state}`} />
                        <div>
                            <div className="location-container">
                                {spot.city}, {spot.state}
                                <div>
                                    ⭐️
                                    {typeof spot.avgRating === "number" ? spot.avgRating.toFixed(2) : 'New'}
                                </div>
                            </div>
                            <span>${spot.price} night</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpotsList;