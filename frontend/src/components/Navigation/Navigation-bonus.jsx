import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { CreateSpotButton } from './CreateSpotButton';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
      <CreateSpotButton user={sessionUser} />
      </li>
      {isLoaded && (
        <li>
          <NavLink to="/">Home</NavLink>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
