import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (

    <nav>
      <div>
      <div style = {{"color": "#FF5A5F"}}className = "title"><NavLink to="/"><i className="fa-solid fa-water pointer" style = {{"color": "#FF5A5F"}} ></i></NavLink>Water B&B</div>
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
