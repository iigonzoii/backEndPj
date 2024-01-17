import "./LandingPage.css"
import { useEffect } from 'react';
import { selectSpotsArr, fetchSpots } from "../../store/spotReducer"
import { useDispatch, useSelector } from 'react-redux';

// * crud action is get
// *

// * fetching data happens in thunks always



function LandingPage() {
    const dispatch = useDispatch();
    const spots = useSelector(selectSpotsArr);

    useEffect(() => {
      dispatch(fetchSpots());
    }, [dispatch]);
    console.log("SPOTS",spots)

    return (
        <div className="container">
            <img src="https://firebasestorage.googleapis.com/v0/b/react-portfolio-7e81b.appspot.com/o/juniperPass.jpg?alt=media&token=0791aeeb-c0d2-497d-9874-75fd7b25718e" />
            <div>
                <p>city and state</p>
                <p>star and avg rating</p>
                <p>$123.00 a night</p>
            </div>
        </div>
    )
}

export default LandingPage
