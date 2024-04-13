import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { useParams } from 'react-router-dom'
import { updateSpot } from "../../store/spotReducer";
import { fetchSpot } from "../../store/spotReducer";
import "./UpdateSpot.css"

function UpdateSpotPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { spotId } = useParams()
    useEffect(() => {
        dispatch(fetchSpot(+spotId))
        .then(spot => {
            setCountry(spot.country)
            setAddress(spot.address)
            setCity(spot.city)
            setState(spot.state)
            setDescription(spot.description)
            setSpotName(spot.name)
            setPrice(spot.price)
        })
        .then(() => setIsLoaded(true))
    }, [dispatch, spotId])

    const [isLoaded, setIsLoaded] = useState(false)
    const [errors, setErrors] = useState({})
    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [description, setDescription] = useState("")
    const [spotName, setSpotName] = useState("")
    const [price, setPrice] = useState("")

    let handleSubmit = async (e) => {
        let formErrors = {}
        e.preventDefault()
        if (address.length === 0) formErrors.address = 'Street address is required'
        if (city.length === 0) formErrors.city = "City is required"
        if (state.length === 0) formErrors.state = "State is required"
        if (country.length === 0) formErrors.country = "Country is required"
        if (description.length < 30) formErrors.description = "Description needs 30 or more characters"
        if (spotName.length === 0) formErrors.spotName = "Name is required"
        if (price < 1) formErrors.price = "Price per day must be a positive number"
        if (Object.values(formErrors).length > 0) {
            setErrors(formErrors)
            return
        } else {
            const payload = {
                country,
                address,
                city,
                state,
                description,
                name: spotName,
                price
            }
            let updatedSpot = await dispatch(updateSpot(+spotId, payload))
            navigate(`/spots/${updatedSpot.id}`)
        }
    }

    return (
        <>
        {isLoaded &&
            <div className="page">
            <form
                onSubmit={handleSubmit}
                className="create-spot"
            >
                <h1>Update your Spot</h1>
                <p>Where&apos;s your place located</p>
                <p>Guests will only get your exact address once they booked a reservation</p>
                <label className="full-label">
                    Country <div className="red">{errors.country}</div>
                    <input
                        placeholder="Country"
                        type="text"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    />
                </label>
                <label className="full-label">
                    Street Address
                    <div className="red">{errors.address}</div>
                    <input
                        placeholder="Address"
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </label>
                <div className="city-state full-label">
                    <label className="full-label">
                        City<div className="red">{errors.city}</div>
                        <input
                            placeholder="City"
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </label>
                    <label>
                        State<div className="red">{errors.state}</div>
                        <input
                            placeholder="State"
                            type="text"
                            value={state}
                            onChange={e => setState(e.target.value)}
                        />
                    </label>
                </div>
                <label>
                    <p>Describe your place to guests </p>
                    <p>mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</p>
                    <textarea

                        className="full-label description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters">
                    </textarea>
                </label>
                <div className="red">{errors.description}</div>
                <div>
                    <h2>
                        Create a title for your spot
                    </h2>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special</p>
                </div>
                <div className="red">{errors.spotName}</div>
                <input className="description"
                    placeholder="Name of your spot"
                    type="text"
                    value={spotName}
                    onChange={e => setSpotName(e.target.value)}
                />
                <div className="full-label"><h2>Set a base price for your Spot</h2>
                    <p> Competitve pricing can help your listing stand out and rank higher in search results</p>
                </div>
                <div className="red">{errors.price}</div>

                <div className="full-label dollar">
                    $<input
                        placeholder="Price per night(USD)"
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
                <button
                className="create-button"
                    type="submit"
                >
                    Create Spot
                </button>
            </form>
        </div>
        }
        </>
    )
}

export default UpdateSpotPage
