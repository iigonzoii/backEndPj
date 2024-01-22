import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchSpot } from "../../store/spotReducer"
import { fetchReview } from "../../store/reviewReducer"


function SpotDetailsPage() {
    const { spotId } = useParams()
    const dispatch = useDispatch();
    let spot = useSelector(state => state.spot.spotDetail);

    let review = useSelector(state => state.review)
    review = Object.values(review)
    console.log("review", review)
    useEffect(() => {
        dispatch(fetchReview(+spotId))
        dispatch(fetchSpot(+spotId));
    }, [dispatch, spotId ]);

    return (
        <div>
            <div>
                {<p>{spot && spot.name}</p>}
                {<p>{`${spot && spot.city}, ${spot && spot.state}, ${spot && spot.country}`}</p>}
            </div>
            <div>
                {spot && spot.SpotImages.map((img, index) => (
                        <div key={index}>
                            <img src={img.url} />
                        </div>
                    ))}
            </div>
            <div>
                {<p>{`Hosted by ${spot && spot.Owner.firstName} ${spot && spot.Owner.lastName}`}</p>}
                {<p>{spot && spot.description}</p>}
            </div>
            <aside>
                <p className="">{`$${spot && spot.price} a night`}</p>
                <p className="starRating "><i className="fa-solid fa-star"></i>{`${spot && spot.avgStarRating}`}</p>
                <p className="">{`${spot && spot.numReviews} reviews`}</p>
                <button className="pointer">Reserve</button>
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
