import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal'
import { destroySpot } from '../../store/spots'
import './DeleteSpot.css'

const DeleteSpot = ({ spot }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    
    const onClick = e => {
        e.preventDefault();
        return dispatch(destroySpot(spot))
        .then(closeModal)
    }
    return (
        <div id='delete-container'>
            <h1>Confirm Delete</h1>
            <div className="deleteButtonContainer">
                <span>Are you sure you want to remove this spot from the listings?</span>
                <button id='confirm-delete'className='delete-buttons' onClick={onClick}>Yes (Delete Spot)</button>
                <button id='no-delete' className="delete-buttons" onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )
}

export default DeleteSpot