import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchSpot } from "../../store/spotReducer"
import { fetchReviews } from "../../store/reviewReducer"
import './SpotDetailsPage.css'


function SpotDetailsPage() {
    const { spotId } = useParams()
    const dispatch = useDispatch();
    let spot = useSelector(state => state.spot.spotDetail);
    let reserve = () => alert("Feature coming soon")
    let [isLoaded, setIsLoaded] = useState(false)
    let review = useSelector(state => state.review)
    review = Object.values(review)
    console.log("review", review)
    useEffect(() => {
        dispatch(fetchReviews(+spotId))
        .then(() => dispatch(fetchSpot(+spotId)))
        .then(() => setIsLoaded(true));
    }, [dispatch, spotId]);

    return (
        <div className="spot-detail-container">
            { isLoaded && <><div>
                {<p>{spot && spot.name}</p>}
                {<p>{`${spot && spot.city}, ${spot && spot.state}, ${spot && spot.country}`}</p>}
            </div>

            <div className="img-container">
                <img className="large-img" src={spot.SpotImages[0].url}>
                </img>
                <div className="small-img">
                    {spot && spot.SpotImages.slice(1).map((img, index) => (
                        <div key={index}>
                            <img src={img.url} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="host-description">
                {<p>{`Hosted by ${spot && spot.Owner.firstName} ${spot && spot.Owner.lastName}`}</p>}
                {<p>{spot && spot.description}</p>}
            </div>
            <aside className="reservation-box">
                <span className="">{`$${spot && spot.price} a night`}</span>
                <span className="starRating "><i className="fa-solid fa-star"></i>{`${spot && spot.avgStarRating}`}</span>
                <span >{`${spot && spot.numReviews} reviews`}</span>
                <div><button className="pointer" onClick={reserve}>Reserve</button></div>
            </aside>
            <div>
                <p className="starRating "><i className="fa-solid fa-star"></i>{`${spot && spot.avgStarRating}`}</p>
                <p className="">{`${spot && spot.numReviews} reviews`}</p>
            </div>
            <div>
                {review && review.map((review, index) => (
                    <div key={index}>
                        <p>{review.User.firstName}</p>
                        <p>{review.createdAt.split("-")[1]} {review.createdAt.split("-")[0]}</p>
                        <p>{review.review}</p>
                    </div>
                ))}
            </div>
            </>}
        </div>
    )
}

export default SpotDetailsPage
