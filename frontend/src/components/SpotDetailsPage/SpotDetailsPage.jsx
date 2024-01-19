import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchSpot } from "../../store/spotReducer"


function SpotDetailsPage() {
    const { spotId } = useParams()
    const dispatch = useDispatch();
    let spot = useSelector(state => state.spot.spotDetail);
    console.log("dalsijfldsiajkf", spotId)
    useEffect(() => {
        dispatch(fetchSpot(+spotId));
    }, [dispatch, spotId]);

    return (
        <div>
            <div>
                {<p>{spot && spot.name}</p>}
                {<p>{`${spot && spot.city},${spot && spot.state}, ${spot && spot.country}`}</p>}
            </div>
            <div>
                {spot && spot.SpotImages.map((img, index) => (
                        <div key={index}>
                            <img src={img.url} />
                        </div>
                    ))}
            </div>
            <div>
                {<p>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</p>}
                {<p>{spot.description}</p>}
            </div>
            <aside>
                <p className="">{`$${spot.price} a night`}</p>
                <p className="starRating "><i className="fa-solid fa-star"></i>{`${spot.avgStarRating}`}</p>
                <p className="">{`${spot.numReviews} reviews`}</p>
                <button className="pointer">Reserve</button>
            </aside>
            <div>
            <p className="starRating "><i className="fa-solid fa-star"></i>{`${spot.avgStarRating}`}</p>
            <p className="">{`${spot.numReviews} reviews`}</p>
            </div>
            <div>
                
            </div>
        </div>
    )
}

export default SpotDetailsPage
