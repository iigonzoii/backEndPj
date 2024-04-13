import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import "./CreateSpotPage.css"
import { createSpot, newImage } from "../../store/spotReducer";

function CreateSpotPage() {
    const [errors, setErrors] = useState({})
    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [description, setDescription] = useState("")
    const [spotName, setSpotName] = useState("")
    const [price, setPrice] = useState("")
    const [previewImg, setPreviewImg] = useState("")
    const [img1, setImg1] = useState("")
    const [img2, setImg2] = useState("")
    const [img3, setImg3] = useState("")
    const [img4, setImg4] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    let handleSubmit = async (e) => {
        let formErrors = {}
        e.preventDefault()
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        console.log(formValues)
        if (address.length === 0) formErrors.address = 'Street address is required'
        if (city.length === 0) formErrors.city = "City is required"
        if (state.length === 0) formErrors.state = "State is required"
        if (country.length === 0) formErrors.country = "Country is required"
        if (description.length < 30) formErrors.description = "Description needs 30 or more characters"
        if (spotName.length === 0) formErrors.spotName = "Name is required"
        if (price < 1) formErrors.price = "Price per day must be a positive number"
        if (previewImg.length === 0) formErrors.previewImg = "Preview image is required"
        let previewLayout = previewImg.split('.').pop()
        if (previewImg && (previewLayout !== "png" && previewLayout !== "jpg" && previewLayout !== "jpeg")) formErrors.previewImg = "Image URL must end in .png, .jpg, or .jpeg"
        let img1Layout = img1.split('.').pop()
        if (img1 && (img1Layout !== "png" && img1Layout !== "jpg" && img1Layout !== "jpeg")) formErrors.img1 = ("Image URL must end in .png, .jpg, or .jpeg")
        let img2Layout = img2.split('.').pop()
        if (img2 && (img2Layout !== "png" && img2Layout !== "jpg" && img2Layout !== "jpeg")) formErrors.img2 = ("Image URL must end in .png, .jpg, or .jpeg")
        let img3Layout = img3.split('.').pop()
        if (img3 && (img3Layout !== "png" && img3Layout !== "jpg" && img3Layout !== "jpeg")) formErrors.img3 = ("Image URL must end in .png, .jpg, or .jpeg")
        let img4Layout = img4.split('.').pop()
        if (img4 && (img4Layout !== "png" && img4Layout !== "jpg" && img4Layout !== "jpeg")) formErrors.img4 = ("Image URL must end in .png, .jpg, or .jpeg")
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
                price,
                previewImg,
                img1,
                img2,
                img3,
                img4
            }
            let newSpot = await dispatch(createSpot(payload))
            if (previewImg.length) await dispatch(newImage({ id: newSpot.id, url: previewImg, preview: true }))

            if (img1.length) await dispatch(newImage({ id: newSpot.id, url: img1, preview: false }))

            if (img2.length) await dispatch(newImage({ id: newSpot.id, url: img2, preview: false }))

            if (img3.length) await dispatch(newImage({ id: newSpot.id, url: img3, preview: false }))

            if (img4.length) await dispatch(newImage({ id: newSpot.id, url: img4, preview: false }))

            navigate(`/spots/${newSpot.id}`)
        }
    }

    return (
        <div className="page">
            <form
                onSubmit={handleSubmit}
                className="create-spot"
            >
                <h1 className="create">Create a new Spot</h1>
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
                <label className="full-label">
                    <p>Describe your place to guests </p>
                    <p>mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</p>
                    <textarea
                        className="full-label"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters">
                    </textarea>
                </label>
                <div className="red">{errors.description}</div>
                <div className="full-label">
                    <h2>
                        Create a title for your spot
                    </h2>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special</p>
                </div>
                <div className="red">{errors.spotName}</div>
                <input className="full-label"
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

                <div className="full-label"> <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot</p>
                </div>
                <div className="red">{errors.previewImg}</div>
                <input
                    className="full-label"
                    placeholder="Preview Image URL"
                    type="text"
                    value={previewImg}
                    onChange={e => setPreviewImg(e.target.value)}
                />
                <div className="red">{errors.img1}</div>
                <input
                    className="full-label"
                    placeholder="Image URL"
                    type="text"
                    value={img1}
                    onChange={e => setImg1(e.target.value)}
                />
                <div className="red">{errors.img2}</div>
                <input
                    className="full-label"
                    placeholder="Image URL"
                    type="text"
                    value={img2}
                    onChange={e => setImg2(e.target.value)}
                />
                <div className="red">{errors.img3}</div>
                <input
                    className="full-label"
                    placeholder="Image URL"
                    type="text"
                    value={img3}
                    onChange={e => setImg3(e.target.value)}
                />
                <div className="red">{errors.img4}</div>
                <input
                    className="full-label"
                    placeholder="Image URL"
                    type="text"
                    value={img4}
                    onChange={e => setImg4(e.target.value)}
                />
                <button className="create-button"
                    type="submit"
                >
                    Create Spot
                </button>
            </form>
        </div>
    );
}

export default CreateSpotPage
