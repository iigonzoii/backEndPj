const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot, Image, User, Review } = require('../../db/models');
const router = express.Router();
router.get('/current', requireAuth, async (req, res, next) => {
    let data = {}
    let currUser = req.user.id
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
    data = reviews.map(review => review.toJSON())
    data.forEach(review => {
        if (review.ReviewImages.length === 0) {
            review.ReviewImages = {
                message: 'no images to display'
            }
            review.Spot.SpotImages.forEach(image => {
                if (image.preview) review.Spot.previewImage = image.url
            });
        }
        delete review.Spot.SpotImages
    })
    res.json({ Reviews: data })
});

router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const { url } = req.body
    const { reviewId } = req.params
    const  userId  = req.user.id
    let isOwner = await Review.findByPk(reviewId);

    if (!(await Review.findByPk(reviewId))) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }
console.log(isOwner)
    // ? i think this may be over engineered and lines 109 through 121 can be dried up
    if (isOwner.userId !== userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };


    let image = await Image.create({
        url,
        imageableType: 'Review',
        imageableId: reviewId
        // exclude:['createdAt', 'updatedAt']
    })

    let rez = await Image.findByPk(reviewId, {
        attributes: ['id', 'url',]
    })
    return res.json(rez)
})






module.exports = router
