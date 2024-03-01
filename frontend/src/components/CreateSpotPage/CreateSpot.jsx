import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";


import "./CreateSpotPage.css"


function CreateSpotPage() {
    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    // const [latitude, setLatitude] = useState("yes")
    const [state, setState] = useState("")
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    let handleSubmit = async (e) => {
      e.preventDefault()
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        console.log(formValues)
        const response = await csrfFetch(`/api/spots/`, {
            method:"POST"
        })
        const newSpot = await response.json()
        console.log(newSpot)
        // navigate('/')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="fruit-form"
        >
            <h2>Create a new Spot</h2>
            <p>Where&apos;s your place located</p>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <label>
                Country <span>{errors.name}</span>
                <input
                    type="text"
                    name="country"
                />
            </label>
            <label>
                Adress
                <input
                    type="text"
                    name="address"
                />
            </label>
            <label>
                City
                <input
                    type="text"
                    name="city"
                />
            </label>
            <label>
                State
            </label>
            <input
                type="text"
                name="state"
            />
            <label>
                <p>Describe your place to guests </p>
                <p>mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</p>
            </label>
            <textarea placeholder="Description"></textarea>
            <label>
                Create a title for your spot
            </label>
            <input
                type="text"
                name="name"
            />
            <label>
                Set a base price for your Spot
                <p> Competitve pricing can help your listing stand out and rank higher in search results</p>
                $<input
                placeholder="Price per night(USD)"
                type="number"
                name="price"
            />
            </label>

            <label>
                Liven up your spot with photos
                <p>Submit a link to at least one photo to publish your spot</p>
            </label>
            <input
                type="text"
                name="preview"
            />
            <input
                type="text"
                name="img_1"
            />
            <input
                type="text"
                name="img_2"
            />
            <input
                type="text"
                name="img_3"
            />
            <input
                type="text"
                name="img_4"
            />
            <button
                type="submit"
                disabled={Object.values(errors).length}
            >
                Create Spot
            </button>
        </form>
    );
}

export default CreateSpotPage
