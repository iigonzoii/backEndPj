import { useModal } from '../../context/Modal';
import { FaStar } from 'react-icons/fa6'
import "./postReview.css"
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../store/reviewReducer';
const PostReviewModal = () => {
    const { closeModal } = useModal();
    let starSelection = [1, 2, 3, 4, 5]
    // *use for stars
    const [currSelection, setCurrSelection] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState('')
    const [firstName, setFirstName] = useState("")
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    let { spotId } = useParams()
    const user = useSelector(state => state.session.user)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user) setFirstName(user.firstName)
        // ! might need to change the key names in this obj
        let newReview = {
            review,
            currSelection,
            firstName: firstName
        }
        //* return value of thunk (response) will be our new review
        await dispatch(createReview(newReview, spotId))
            .catch(async (response) => {
                let data = await response.json();
                if (data && data.errors) setErrors(data.errors)
            })
        closeModal();
        console.log("Submitted!");
    }

    return (
        <div>
            <form className='post-review' onSubmit={handleSubmit}>
                {errors && <span>{errors}</span>}
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
                <button disabled={(review.length < 10 || hoverRating !== 0)}>Submit Your Review</button>
            </form>
        </div>
    )
}

export default PostReviewModal
