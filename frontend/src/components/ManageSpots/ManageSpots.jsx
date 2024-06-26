import "./manageSpots.css"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrUserSpots } from "../../store/spotReducer"
import { useEffect } from "react"
import "../LandingPage/LandingPage.css"
import "./manageSpots.css"
import OpenModalButton from "../OpenModalButton"
import DeleteSpot from "../DeleteSpot/DeleteSpot"

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
        <div className="manage-container">
                <h1>Manage Spots</h1>
                <div hidden={isOwner()} >
                    <button className="pointer create-on-manage" onClick={() => { navigate("/spots/new") }}>Create a New Spot</button>
                </div>
                <div
                    hidden={!isOwner()}
                    className="container"
                    >
                    {spots && spots.map((spot, index) => (
                        <div
                            title={`${spot.name}`}
                            className="spot-card-container " key={index}>
                            <div onClick={() => navigate(`/spots/${spot.id}`)}>
                                <img className="pointer" src={spot.previewImage} />
                                <div className="spot-data-container">
                                    <div className="city-reviewData ">
                                        <p className="cityState ">{`${spot.city},${spot.state}`}</p>
                                    <p className="price">{`$${spot.price} night`}</p>
                                    </div>
                                        <p className="starRating"><i className="fa-solid fa-star"></i>{`${checkAvg(spot.avgRating)}`}</p>
                                </div>
                            </div>
                            <span>
                                <Link to={`/spots/${spot.id}/update`}><button className="update-button">Update</button></Link>
                                <OpenModalButton
                                    cssm="manage-delete"
                                    buttonText="Delete"
                                    modalComponent={<DeleteSpot spotId={spot.id} />}
                                />
                            </span>
                        </div>
                    ))}

            </div>
        </div>
    )
}


export default ManageSpots
