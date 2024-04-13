import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteSpot } from "../../store/spotReducer"
import { useState } from "react"

function DeleteSpot({ spotId }) {
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({})

    const deleteClick = (e) => {
        e.preventDefault()
        setErrors({})
        dispatch(deleteSpot(spotId))
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
                    <h5>Are you sure you want to remove this spot from the listings?</h5>
                    {errors.message && (
                        <div>{errors}</div>
                    )}
                    <div><button onClick={deleteClick} className="deletebtn">Yes (Delete Spot)</button></div>
                    <button onClick={closeModal} className="dontDeleteBtn">No (Keep Spot)</button>
                </div>
            </form>
        </>
    )
}

export default DeleteSpot
