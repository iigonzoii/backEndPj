import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchSpot } from "../../store/spotReducer"
import { fetchReviews } from "../../store/reviewReducer"
import css from './SpotDetailsPage.module.css'
import OpenModalButton from "../OpenModalButton/index.js"
import DeleteReview from "../DeleteReviewModal/DeleteReview.jsx"
import PostReviewModal from "../PostReviewModal/PostReview"


function SpotDetailsPage() {
    const { spotId } = useParams()
    console.log("spotIDDDDDD", spotId)
    const dispatch = useDispatch();
    let spot = useSelector(state => state.spot.spotDetail);
    const session = useSelector(state => state.session);
    console.log("SPOTTTTT", spot)
    let reserve = () => alert("Feature coming soon")
    let [isLoaded, setIsLoaded] = useState(false)
    let review = useSelector(state => state.review)
    review = Object.values(review).reverse()
    console.log("REVIEWWWW", review)
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
        //! if i get build errors then take this stupid spotId out of here
    }, [dispatch, spotId]);
    return (
        <div className={css.spotDetailContainer}>
            {isLoaded && <><div>
                {<p>{spot && spot.name}</p>}
                {<p>{`${spot && spot.city}, ${spot && spot.state}, ${spot && spot.country}`}</p>}
            </div>
                <div className={css.imgContainer}>
                    <img className={css.largeImg} src={spot.SpotImages[0].url}>
                    </img>
                    <div className={css.smallImg}>
                        {spot && spot.SpotImages.slice(1).map((img, index) => (
                            <img key={index} src={img.url} />
                        ))}
                    </div>
                </div>

                <div className={css.hostDescription}>
                    <div className={css.hostDiv}>
                        <p>{`Hosted by ${spot && spot.Owner.firstName} ${spot && spot.Owner.lastName}`}</p>
                        <p>{spot && spot.description}</p>
                    </div>

                    <aside className={css.reservationBox}>
                        <div className={css.infoBox}>
                            <span className={css.reserveItem1}> {`$${spot && spot.price}  night `}</span>
                            <span className={css.reserveItems2}> <i className="fa-solid fa-star"></i>{spot && checkRating()}
                                <span
                                    hidden={(spot?.numReviews === 0)}> &#183; {spot && spot.numReviews} {spot?.numReviews > 1 ? ' Reviews' : ' Review'}
                                </span>
                            </span>
                        </div>
                        <button className={css.pointer} onClick={reserve}>Reserve</button>
                    </aside>

                </div>
                <div className={css.reviewsContainer}>
                    <div>
                        <span hidden={checkRating() !== 'New'} className={css.starsReviews}><i className={"fa-solid fa-star"} ></i>{`${spot && checkRating()}`}  </span>

                        <span hidden={checkRating() === 'New'} className={css.starsReviews}><i className={"fa-solid fa-star"} ></i>{`${spot && checkRating()}`} &#183; </span>

                        <span hidden={checkRating() === 'New'}>{spot && checkIfOne()}</span>
                    </div>
                    <div>
                        <span hidden={!session.user || spot.Owner.id === session.user.id || userHasReview} >
                            <OpenModalButton
                            cssm="post-your-review"
                                buttonText="Post Your Review"
                                modalComponent={<PostReviewModal spotId={spot.id} />}
                            />
                        </span>
                    </div>
                    <span hidden={review.length !== 0 || (session.user && spot.Owner.id === session.user.id || session.user === null)}>Be the first to post a review!</span>
                    <div className={css.reviewData}>
                        {review && review.map((review, index) => (
                            <div key={index}>
                                <p>{review.User.firstName}</p>
                                <p className={css.date}>{month[new Date(review.createdAt).getMonth()]} {review.createdAt.split("-")[0]}</p>
                                <p>{review.review}</p>
                                <div hidden={session.user && session.user.id !== review.User.id || session.user === null}>
                                    <OpenModalButton
                                        cssm="manage-delete"
                                        buttonText="Delete"
                                        modalComponent={<DeleteReview reviewId={review.id}
                                            spotId={spot.id}
                                        />}
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
