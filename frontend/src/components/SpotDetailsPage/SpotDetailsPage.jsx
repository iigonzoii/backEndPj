import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchSpot } from "../../store/spotReducer"
import { fetchReviews } from "../../store/reviewReducer"
import './SpotDetailsPage.css'
import OpenModalButton from "../OpenModalButton/index.js"
import DeleteReview from "../DeleteReviewModal/DeleteReview.jsx"
import PostReviewModal from "../PostReviewModal/PostReview"

function SpotDetailsPage() {
    const { spotId } = useParams()
    const dispatch = useDispatch();
    let spot = useSelector(state => state.spot.spotDetail);
    const session = useSelector(state => state.session);
    console.log("SPOTTTTT", spot)
    let reserve = () => alert("Feature coming soon")
    let [isLoaded, setIsLoaded] = useState(false)
    let review = useSelector(state => state.review)
    console.log("REVIEWWWW", review)
    review = Object.values(review).reverse()
    let userHasReview
    if (session.user !== null) userHasReview = review.find(currReview => currReview.userId === session.user.id)
    console.log("SeSSION", session)
    let month = ["January", "February", "March", "April", "May", "June", "July", "October", "November", "December"]
    let checkRating = () => {
        if (isNaN(spot.avgStarRating)) {
            return "New"
        } else {
            return spot.avgStarRating
        }
    }
    let checkIfOne = () => {
        if (spot.numReviews === 1) {
            return 1 + " Review"
        } else {
            return spot.numReviews + " Reviews"
        }
    }
    useEffect(() => {
        dispatch(fetchReviews(+spotId))
            .then(() => dispatch(fetchSpot(+spotId)))
            .then(() => setIsLoaded(true));
    }, [dispatch, spotId]);
    return (
        <div className="spot-detail-container">
            {isLoaded && <><div>
                {<p>{spot && spot.name}</p>}
                {<p>{`${spot && spot.city}, ${spot && spot.state}, ${spot && spot.country}`}</p>}
            </div>
                <div className="img-container">
                    <img className="large-img" src={spot.SpotImages[0].url}>
                    </img>
                    <div className="small-img">
                        {spot && spot.SpotImages.slice(1).map((img, index) => (
                            <img key={index} src={img.url} />
                        ))}
                    </div>
                </div>
                <div className="host-description">
                    {<p>{`Hosted by ${spot && spot.Owner.firstName} ${spot && spot.Owner.lastName}`}</p>}
                    {<p>{spot && spot.description}</p>}
                    <aside className="reservation-box">
                        <span>{`$${spot && spot.price} a night `}
                            <i className="fa-solid fa-star"></i>{spot && checkRating()}
                            <span
                                hidden={(spot?.numReviews === 0)}> &#183; {spot && spot.numReviews} {spot?.numReviews > 1 ? ' Reviews' : ' Review'}
                            </span>
                        </span>
                        <div><button className="pointer" onClick={reserve}>Reserve</button></div>
                    </aside>
                </div>
                <div className="reviews-container">
                    <div>
                        <p className="stars-reviews"><i className="fa-solid fa-star"></i>{`${spot && checkRating()}`}</p>
                        <p>{spot && checkIfOne()}</p>
                    </div>

                    <div>
                        <span hidden={!session.user || spot.Owner.id === session.user.id || userHasReview}>
                            <OpenModalButton
                                buttonText="Post Your Review"
                                modalComponent={<PostReviewModal reviewId={review.id} />}
                            />
                        </span>
                    </div>
                    <span hidden={review.length !== 0 || (session.user && spot.Owner.id === session.user.id)}>Be the first to post a review!</span>
                    <div className="review-data">
                        {review && review.map((review, index) => (
                            <div key={index}>
                                <p>{review.User.firstName}</p>
                                <p>{month[new Date(review.createdAt).getMonth()]} {review.createdAt.split("-")[0]}</p>
                                <p>{review.review}</p>
                                <div>
                                    <OpenModalButton
                                        buttonText="Delete"
                                        modalComponent={<DeleteReview reviewId={review.id} />}
                                    />
                                </div>
                            </div>

                        ))}

                    </div>
                </div>
            </>}
        </div>
    )
}

export default SpotDetailsPage
