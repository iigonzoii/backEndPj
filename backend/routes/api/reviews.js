const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')
const { Spot, Image, User, Review } = require('../../db/models');
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isFloat({ min: 1 })
        .withMessage('must be an integer from 1 to 5'),
    handleValidationErrors
]

const router = express.Router();


router.get('/current', requireAuth, async (req, res, next) => {
    let data = {}
    let currUser = +req.user.id
    let reviews = await Review.findAll({
        where: {
            userId: currUser
        },
        include: [
            {
                model: Spot,
                include: [
                    {
                        model: Image,
                        as: 'SpotImages'
                    }
                ]
            },
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
    data = reviews.map(review => review.toJSON());
    console.log("THATDATATHOUGH", data)

    data.forEach(review => {
        // console.log("REREEEEEE", review)
        if (review.ReviewImages.length === 0) {
            review.ReviewImages = {
                message: 'no images to display'
            }
            if (review.Spot.SpotImages.length === 0) {
                review.Spot.previewImage = 'no images url'
            } else {
                review.Spot.SpotImages.forEach(image => {
                    review.Spot.previewImage = image.url
                })
            }
        }
        delete review.Spot.SpotImages
        delete review.Spot.createdAt
        delete review.Spot.updatedAt
    });
    res.json({ Reviews: data })
});

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body
    const { reviewId } = req.params
    const userId = +req.user.id
    let currReview = await Review.findByPk(+reviewId, {
        include: [{
            model: Image,
            as: 'ReviewImages'
        }]
    });

    if (!(await Review.findByPk(+reviewId))) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    };
    if (currReview.userId !== userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };
    if (currReview.ReviewImages.length > 9) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
    };

    let image = await Image.create({
        url,
        imageableType: 'Review',
        imageableId: +reviewId
    });
    let rez = {
        id: image.id,
        url: image.url
    };
    return res.json(rez)
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { reviewId } = req.params
    const { review, stars } = req.body
    const userId = +req.user.id

    let isOwner = await Review.findByPk(+reviewId);
    if (!(await Review.findByPk(+reviewId))) return res.status(404).json({
        message: "Review couldn't be found"
    });
    if (isOwner.userId !== userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };

    await Review.update({
        review,
        stars,
    }, {
        where: {
            id: +reviewId
        }
    })
    let updated = await Review.findByPk(+reviewId)
    res.json(updated)
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params
    const userId = +req.user.id
    let validreview = await Review.findByPk(+reviewId)
    if (!validreview) return res.status(404).json({
        message: "Review couldn't be found"
    })
    if (validreview.userId !== userId) {
        res.status(403).json({
            message: "Forbidden"
        })
    };
    await Review.destroy({
        where: { id: +reviewId }
    })
    return res.json({
        message: "Successfully deleted"
    })
});






module.exports = router
