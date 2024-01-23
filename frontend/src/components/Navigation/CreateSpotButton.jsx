import { Link } from 'react-router-dom'


export const CreateSpotButton = ({user}) => {
    if (!user) return null;

    return (
        <Link to='/spots/new'>
            <button className='create-spot-button'>
                Create a New Spot
            </button>
        </Link>
    )
}