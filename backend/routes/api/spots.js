const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const {requireAuth} = require('../../utils/auth')

const { Spot, Image, User, Review } = require('../../db/models');
const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required.'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required.'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required.'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required.'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90.'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180.'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isNumeric()
        .isFloat({min: 0})
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

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

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const ownerId = req.user.id
    const spot = await Spot.create({
        ownerId,
        address:address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    })
    res.status(201).json(spot)
})

module.exports = router
