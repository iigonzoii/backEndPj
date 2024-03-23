import {  useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteSpot } from "../../store/spotReducer"
import { useState } from "react"

function DeleteSpot({ spotId}) {
    const { closeModal } = useModal
    const deleteClick = (e) => {
        e.preventDefault()

        // dispatch our delete spot takingin the spot id
        // check for errors
    }
    return (
        <>
            <form className="delete-form">
                <div><h3>Confirm Delete</h3>
                    <h5>Are you sure you want to remove this spot from the listings?</h5>
                    <div><button className="deletebtn">Yes (Delete Spot)</button></div>
                    <button onClick={closeModal} className="dontDeleteBtn">No (Keep Spot)</button>
                </div>
            </form>
        </>
    )
}

export default DeleteSpot
