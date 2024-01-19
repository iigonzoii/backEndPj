import "./LandingPage.css"
import { useEffect } from 'react';
import { fetchSpots } from "../../store/spotReducer"
import { useDispatch, useSelector } from 'react-redux';




function LandingPage() {
    const dispatch = useDispatch();
    let spots = useSelector(state => state.spot);
    spots = Object.values(spots)
    console.log(spots)
    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);


    return (
        <div className="container">
            {spots && spots.map((spot, index) => (
                <div key={index}>
                    <img className="pointer" src={spot.previewImage} />
                    <div className="spotDataGrid">
                        <p className="cityState">{`${spot.city},${spot.state}`}</p>
                        <p className="starRating "><i className="fa-solid fa-star"></i>{`${spot.avgRating}`}</p>
                        <p className="price">{`$${spot.price} a night`}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LandingPage
