import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteReview } from "../../store/reviewReducer"
import { useState } from "react"

function DeleteReview({reviewId}){
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})
    
    const deleteClick = (e) => {
        e.preventDefault()
        setErrors({})
        dispatch(deleteReview(reviewId))
            .then(closeModal)
            .catch(async (res) => {
                let data = await res.json()
                if (data && data.errors) setErrors(data.errors)
            })
    }
    return (
        <>
         <form className="delete-form">
                <div><h3>Confirm Delete</h3>
                    <h5>Are you sure you want to delete this review?</h5>
                    {errors.message && (
                        <div>{errors}</div>
                    )}
                    <div><button onClick={deleteClick} className="deletebtn">Yes (Delete Review)</button></div>
                    <button onClick={closeModal} className="dontDeleteBtn">No (Keep Review)</button>
                </div>
            </form>
        </>
    )
}

export default DeleteReview
