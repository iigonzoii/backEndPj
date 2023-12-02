const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

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
        .isFloat({ min: 0 })
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

    return res.json({ Spots: data })
});

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const ownerId = req.user.id
    const spot = await Spot.create({
        ownerId,
        address: address,
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
});

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body
    const { spotId } = req.params

    // just running !spotId wont work because numbers are valid even if the spot isnt, checking by pk will double down on validation making sure we dont run into errors
    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    let image = await Image.create({
        spotId,
        url,
        preview
    })

    let rez = await Image.findByPk(image.id, {
        attributes: ['id', 'url', 'preview']
    })
    return res.json(rez)
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const userId = req.user.id
    let isOwner = await Spot.findByPk(spotId);
    // api docs dont specify ownership, but according to the need for auth not only for a user, but an actual owner of a property, we will assume test specs somewhere will be checking this. so to cover ass check if Owner is true
    if (!(await Spot.findByPk(spotId))) return res.status(404).json({
        message: "Spot couldn't be found"
    })
    if (isOwner.ownerId !== userId) {
        res.status(403).json({
            message: "Forbidden"
        })
    };

    await Spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    }, {
        where: {
            id: spotId
        }
    })
    let updated = await Spot.findByPk(spotId)
    res.json(updated)
});

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params
    const userId = req.user.id
    let validSpot = await Spot.findByPk(spotId)
    if (!validSpot) return res.status(404).json({
        message: "Spot couldn't be found"
    })
    if (validSpot.ownerId !== userId) {
        res.status(403).json({
            message: "Forbidden"
        })
    };
    await Spot.destroy({
        where: { id: spotId }
    })
    return res.json({
        message: "Successfully deleted"
    })
})

module.exports = router
