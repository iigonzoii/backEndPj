import { useModal } from '../../context/Modal';
import { FaStar } from 'react-icons/fa6'
import "./postReview.css"
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/reviewReducer';
import { fetchSpot } from '../../store/spotReducer';
const PostReviewModal = ({ spotId }) => {
    const { closeModal } = useModal();
    let starSelection = [1, 2, 3, 4, 5]
    const [currSelection, setCurrSelection] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState('')
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newReview = {
            review,
            stars: currSelection
        }
        await dispatch(createReview(newReview, +spotId))
            .catch(async (response) => {
                let data = await response.json();
                if (data && data.errors) setErrors(data.errors)
            })
        await dispatch(fetchSpot(+spotId))
        closeModal();
        console.log("Submitted! and spotId", spotId);
    }

    return (
        <div>
            <form className='post-review' onSubmit={handleSubmit}>
                {errors && <span>{errors.review}</span>}
                <h3>How was your stay?</h3>
                <textarea value={review}
                    onChange={e => setReview(e.target.value)}
                    rows="7" cols="30" placeholder='Leave your review here...'
                >

                </textarea>
                <div className="rating-input">
                    {starSelection.map(selection => {
                        return <div key={selection}
                            className={currSelection >= selection || hoverRating >= selection ? "filled" : "empty"}
                            onMouseEnter={() => setHoverRating(selection)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setCurrSelection(selection)}
                        >
                            {currSelection >= selection || hoverRating >= selection ? <FaStar /> : <i className="fa-regular fa-star"></i>}

                        </div>
                    })}
                    <span> Stars</span>
                </div>

                <button disabled={(review.length < 10 || currSelection === 0)}
                >Submit Your Review</button>
            </form>
        </div>
    )
}

export default PostReviewModal
