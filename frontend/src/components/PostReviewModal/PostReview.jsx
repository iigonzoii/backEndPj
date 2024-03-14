// Import the useModal context hook
import { useModal } from '../../context/Modal';
import { FaStar} from 'react-icons/fa6'
import "./postReview.css"
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/reviewReducer';

const PostReviewModal = () => {
    // Get the closeModal function from the context
    const { closeModal } = useModal();
    let starSelection = [1, 2, 3, 4, 5]
    const [currSelection, setCurrSelection] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState('')
    console.log("currrrr",currSelection)
    // Function that runs when form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        // Instead of a console log this would most likely be a thunk dispatch
        dispatch(createReview(review, spotId))
        console.log("Submitted!");
        // This will cause the modal to close after the console log has occurred
        closeModal();
    }
    const dispatch = useDispatch()
    let { spotId } = useParams()
    return (
        <div>
            <form className='post-review' onSubmit={handleSubmit}>
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
                </div>
                <button>Submit Your Review</button>
            </form>
        </div>
    )
}

export default PostReviewModal
