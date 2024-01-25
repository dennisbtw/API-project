import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { CreateSpotButton } from './CreateSpotButton';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id='navigation-modal-container'>
      <div className='navigation-container'>
        <div>
            <span>
              <NavLink to="/">Home</NavLink>
            </span>
        </div>
        {isLoaded && (
          <div className='right-navigation'>
              <div>
                <CreateSpotButton user={sessionUser} />
                <ProfileButton user={sessionUser} />
              </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default Navigation;
