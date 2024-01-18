import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>

      <div className = "title pointer"><i className="fa-solid fa-water"></i>Water B&B</div>
      <div>
        <NavLink to="/">Home</NavLink>
      </div>
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}

    </nav>
  );
}

export default Navigation;
