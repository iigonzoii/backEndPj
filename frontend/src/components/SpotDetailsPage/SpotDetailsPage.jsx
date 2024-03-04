import { useEffect } from "react"
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

    let review = useSelector(state => state.review)
    review = Object.values(review)
    console.log("review", review)
    useEffect(() => {
        dispatch(fetchReviews(+spotId))
        dispatch(fetchSpot(+spotId));
    }, [dispatch, spotId ]);

    return (
        <div className="spot-detail-container">
            <div>
                {<p>{spot && spot.name}</p>}
                {<p>{`${spot && spot.city}, ${spot && spot.state}, ${spot && spot.country}`}</p>}
            </div>
            <div className="img-container">
                {spot && spot.SpotImages.map((img, index) => (
                        <div key={index}>
                            <img src={img.url} />
                        </div>
                    ))}
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
                        <div key ={index}>
                            <p>{review.User.firstName}</p>
                            <p>{review.createdAt.split("-")[1]} {review.createdAt.split("-")[0]}</p>
                            <p>{review.review}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default SpotDetailsPage
