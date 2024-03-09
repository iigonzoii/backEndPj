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
            method: "POST"
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
            <h1>Create a new Spot</h1>
            <p>Where&apos;s your place located</p>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <label>
                Country <span>{errors.name}</span>
                <input
                    placeholder="Country"
                    type="text"
                    name="country"
                />
            </label>
            <label>
                Street Address
                <input
                    placeholder="Address"
                    type="text"
                    name="address"
                />
            </label>
            <label>
                City
                <input
                    placeholder="City"
                    type="text"
                    name="city"
                />
            </label>
            <label>
                State
            </label>
            <input
                placeholder="State"
                type="text"
                name="state"
            />
            <label>
                <p>Describe your place to guests </p>
                <p>mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</p>
            </label>
            <textarea placeholder="Please write at least 30 characters"></textarea>
            <h2>
                Create a title for your spot
            </h2>
            <p>Catch guests&apos; attention with a spot title that highlights what makes your place special</p>
            <input
                placeholder="Name of your spot"
                type="text"
                name="name"
            />
            <h2>Set a base price for your Spot</h2>
            <p> Competitve pricing can help your listing stand out and rank higher in search results</p>
            $<input
                placeholder="Price per night(USD)"
                type="number"
                name="price"
            />

            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
                placeholder="Preview Image URL"
                type="text"
                name="preview"
            />
            <input
                placeholder="Image URL"
                type="text"
                name="img_1"
            />
            <input
                placeholder="Image URL"
                type="text"
                name="img_2"
            />
            <input
                placeholder="Image URL"
                type="text"
                name="img_3"
            />
            <input
                placeholder="Image URL"
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
