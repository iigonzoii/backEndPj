// Import the useModal context hook
import { useModal } from '../../context/Modal';

const PostReviewModal = () => {
    // Get the closeModal function from the context
    const { closeModal } = useModal();

    // Function that runs when form is submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        // Instead of a console log this would most likely be a thunk dispatch
        console.log("Submitted!");
        // This will cause the modal to close after the console log has occurred
        closeModal();

    }

    return (
        <div>
            <form className='post-review' onSubmit={handleSubmit}>
                <h3>How was your stay?</h3>
                <textarea rows="7" cols="30" placeholder='Leave your review here...'></textarea>
                <div>stars go here</div>
                <button>Submit Your Review</button>
            </form>
        </div>
    )
}

export default PostReviewModal
