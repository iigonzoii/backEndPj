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
const validateReview = [
    check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Review text is required'),
check('stars')
    .exists({ checkFalsy: true })
    .isFloat({min:1})
    .withMessage('must be an integer from 1 to 5'),
    handleValidationErrors
]

router.get('/', async (req, res, next) => {
    // empty data obj to house all spots
    let data = {}
    const spots = await Spot.findAll({
        // all spots and what models to include... image and review are both needed to access avgrating and previewImage
        include: [
            {
                model: Image,
                as: 'SpotImages',
                attributes: ['id', 'url', 'preview']
                // where:{imageableType: "Spot"}
            },
            {
                model: Review
            }
        ]
    })
    // take spots findAll array, map through them, and convert to json
    data = spots.map(spot => spot.toJSON())

    data.forEach(data => {
        let allStars = 0
        // going into every data objet, looking for reviewkey(array), running a foreach to add all the stars together so we can get avg later
        data.Reviews.forEach(review => {
            allStars += review.stars
        });
        // creating keyvalue pair to show avg rating in our return obj
        data.avgRating = allStars / data.Reviews.length

        data.SpotImages.forEach(image => {
            if (image.preview) data.previewImage = image.url
            // console.log(image)
        });
        if (!data.previewImage) {
            data.previewImage = 'no image url'
        }
        // after manipulating data above we are deleting the visual arrays that were houseing that data to match res body in docs
            delete data.Reviews
            delete data.SpotImages
    });


    return res.json({ Spots: data })
});
// check error response when not logged in for create
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
    const  userId  = req.user.id
    let isOwner = await Spot.findByPk(spotId);
// console.log("isowner",isOwner)
// console.log("userId",userId)
    // just running !spotId wont work because numbers are valid even if the spot isnt, checking by pk will double down on validation making sure we dont run into errors
    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    // ? i think this may be over engineered and lines 109 through 121 can be dried up
    if (isOwner.ownerId !== userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };

    // ? I think i need to add an if imageableType somewhere around here

    let image = await Image.create({
        spotId,
        url,
        preview,
        imageableType:'Spot',
        imageableId: spotId
    })

    let rez = await Image.findByPk(spotId, {
        attributes: ['id', 'url', 'preview']
    })
    return res.json(rez)
});

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const userId = req.user.id
    let isOwner = await Spot.findByPk(spotId);
    // api docs dont specify ownership, but according to the need for auth not only for a user, but an actual owner of a property, we will assume test specs somewhere will be checking this. so to cover a** check if Owner is true
    if (!(await Spot.findByPk(spotId))) return res.status(404).json({
        message: "Spot couldn't be found"
    })
    // if the ownerId key of the spot we found doesnt have the current authorized userId as its value, then we shut it down.
    if (isOwner.ownerId !== userId) {
        res.status(403).json({
            message: "Forbidden"
        })
    };
    // update spot with the deconstructed req body variables where the id matches our passedin spotId
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
    // return updated spot
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
});

router.get('/current', requireAuth, async (req, res, next) => {
    // empty data obj to house all spots
    let data = {}
    let currUser = req.user.id
    const spots = await Spot.findAll({
        // all spots and what models to include... image and review are both needed to access avgrating and previewImage
        where: {
            ownerId: currUser
        },
        include: [
            {
                model: Image,
                as:'SpotImages'
            },
            {
                model: Review
            }
        ],
    })
    // take spots findAll array, map through them, and convert to json
    data = spots.map(spot => spot.toJSON())

    data.forEach(data => {
        let allStars = 0
        // going into every data objet, looking for reviewkey(array), running a foreach to add all the stars together so we can get avg later
        data.Reviews.forEach(review => {
            allStars += review.stars
        });
        // creating keyvalue pair to show avg rating in our return obj
        data.avgRating = allStars / data.Reviews.length



        data.SpotImages.forEach(image => {
            if (image.preview) data.previewImage = image.url
            // console.log(image)
        });
        if (!data.previewImage) {
            data.previewImage = 'no image url'
        }
        // !match this with the way i have it on the other one
        // after manipulating data above we are deleting the visual arrays that were houseing that data to match res body in docs
        delete data.Reviews
        delete data.SpotImages
    });

    return res.json({ Spots: data })
});

router.get('/:spotId', async (req, res, next) => {
    let { spotId } = req.params
    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    };
    let thisSpot = await Spot.findByPk(spotId, {
        include: [
            {
                model: Image,
                as: 'SpotImages',
                // where: {imageableType: 'Spot'},
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Review
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
    let data = thisSpot.toJSON();

    let allStars = 0
    data.Reviews.forEach(review => {
        allStars += review.stars
    });


    if (data.SpotImages.length === 0) {
        data.SpotImages = {
            message: 'no images to display'
        }
    }
    data.numReviews = data.Reviews.length;
    data.avgStarRating = allStars / data.Reviews.length;

    delete data.Reviews
    res.json(data)

});

router.get('/:spotId/reviews', async (req, res, next) => {
    let data = {}
    let { spotId } = req.params
    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    };
    let reviews = await Review.findAll({
        where: {
            id: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Image,
                as: 'ReviewImages',
                attributes: ['id', 'url']
            }
        ],
    })
    data = reviews.map(review => review.toJSON())


    res.json({ Reviews: data })

});

router.post('/:spotId/reviews',validateReview, requireAuth, async (req,res,next) =>{
    const { review, stars } = req.body
    const { spotId } = req.params
    let userId = req.user.id
    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    if (await Review.findOne({
        where: {userId: userId}
    })){
        return res.status(500).json({
            message: "User already has a review for this spot"
        })
    }

    let createdReview = await Review.create({
        review,
        stars,
        userId,
        spotId: + spotId
    })

    return res.json(createdReview)
});



module.exports = router
