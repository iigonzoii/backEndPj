// import OpenModalButton from "../OpenModalButton"
// import {  useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
//todo a Title: "Confirm Delete"
    // h1
//todo a Message: "Are you sure you want to remove this spot?
    //  h3
//todo a Red button: ""
    // button
        // onclick or on submit will handle data manipulation
        // will need a thunk to delete, and probably a case in my reducer
//todo a Dark grey button: ""
    // button
        //  button will close modal on click
function DeleteSpot(){
    const {closeModal} = useModal
    return (
        <>
<form>
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to remove this spot?</h3>
        <button className="deletebtn">Yes (Delete Spot)</button>
        <button className="dontDeleteBtn">No (Keep Spot)</button>

</form>
        </>
    )
}

export default DeleteSpot
