import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
// import { useNavigate } from "react-router-dom"

{/* (*check user login status in nav with ternary) */}
function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);


  return (

    <nav>
      <div>
      <div className = "title"><NavLink to="/"><i className="fa-solid fa-water pointer"></i></NavLink>Water B&B</div>
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
