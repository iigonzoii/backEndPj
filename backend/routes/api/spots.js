const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Image, User, Review } = require('../../db/models');
const router = express.Router();

router.get('/', async (req, res, next) => {
    // empty data obj to house all spots
    let data = {}
    const spots = await Spot.findAll({
        // all spots and what models to include... image and review are both needed to access avgrating and previewImage
        include: [
            {
                model: Image,
                // where:{imageableType: "Spot"}
            },
            {
                model: Review
            }
        ]
    })
    // making query objects modifiable
    data = spots.map(spot => spot.toJSON())

    data.forEach(data => {
        let allStars = 0
        // going into every data objet, looking for reviewkey(array), running a foreach to add all the stars together so we can get avg later
        data.Reviews.forEach(review => {
            allStars += review.stars
        });
        // creating keyvalue pair to show avg rating in our return obj
        data.avgRating = allStars / data.Reviews.length

        data.Images.forEach(image => {
            if (image.preview) data.previewImage = image.url
        });
            // after manipulating data above we are deleting the visual arrays that were houseing that data to match res body in docs
        delete data.Reviews
        delete data.Images
    });

    return res.json({Spots: data})
})

// router.post('/', async (req, res, next) => {
//     const { address, city, state, country, lat, lng, name, description, price } = req.body
//     // ! getting id as null, and am not getting ownerId at all
//     const spot = await Spot.create({
//         include: {model: User, attributes: ['ownerId']},
//         // id: id,
//         address:address,
//         city: city,
//         state: state,
//         country: country,
//         lat: lat,
//         lng: lng,
//         name: name,
//         description: description,
//         price: price
//     })
//     res.status(201).json(spot)
// })

module.exports = router
