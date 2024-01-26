import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { CreateSpotButton } from './CreateSpotButton';
import logo from '../../../public/Animal_Crossing_Leaf.png'
function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id='navigation-modal-container'>
      <div className='navigation-container'>
        <div className='home-logo-name'>
            <NavLink to="/"><img src={logo} className='nav-logo' /></NavLink>
            <NavLink to="/">
              <p className='napnook-name'>NapNook</p>
              </NavLink>
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
