import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  let navigate = useNavigate()

  return (
   <nav>
      <div >
        <NavLink to="/" className={"logo"}><i className="fa-solid fa-water pointer logo" ></i>Water B&B</NavLink>
      </div>
      {isLoaded && sessionUser && (
        <div className='buttons-container'>
          <p  className="pointer create-spot" style={{ display: 'inline' }} onClick={() => { navigate("/spots/new") }}>Create a New Spot</p>
          <div hidden={sessionUser} className='pro-btn'>
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}
      {isLoaded && (
        <div className='pro-btn'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
