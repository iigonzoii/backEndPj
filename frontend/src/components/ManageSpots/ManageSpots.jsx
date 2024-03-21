import "./manageSpots.css"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrUserSpots } from "../../store/spotReducer"
// import { fetchSpots } from "../../store/spotReducer"
import { useEffect } from "react"
import "../LandingPage/LandingPage.css"

function ManageSpots() {
    let navigate = useNavigate()
    const dispatch = useDispatch();
    let user = useSelector(state => state.session.user)
    let spots = useSelector(state => state.spot);
    spots = Object.values(spots)
    useEffect(() => {
        dispatch(fetchCurrUserSpots());
    }, [dispatch]);
    let isOwner = () => {
        return spots.find(spot => spot.ownerId === user.id);
    }
    let checkAvg = (rating) => {
        if (isNaN(rating)) {
            return "New"
        } else {
            return rating
        }
    }

    return (
        <>
            <h1>Manage Spots</h1>
            <div hidden={isOwner()} >
                <button className="pointer" onClick={() => { navigate("/spots/new") }}>Create a New Spot</button>
            </div>

            <div
                hidden={!isOwner()}
                className="container"
            >
                {spots && spots.map((spot, index) => (
                    <div
                        title={`${spot.name}`}
                        onClick={() => navigate(`/spots/${spot.id}`)}
                        className="spot-card-container" key={index}>
                        <img className="pointer" src={spot.previewImage} />
                        <div className="spot-data-container">
                            <div className="city-review-data">
                                <p className="cityState">{`${spot.city},${spot.state}`}</p>
                                <p className="starRating"><i className="fa-solid fa-star"></i>{`${checkAvg(spot.avgRating)}`}</p>
                            </div>
                            <p className="price">{`$${spot.price} a night`}</p>
                        </div>
                        <span>
                            <Link to={`/spots/${spot.id}/update`}><button>update</button></Link>
                            <button>delete</button>
                        </span>
                    </div>
                ))}


            </div>
        </>
    )
}


export default ManageSpots
