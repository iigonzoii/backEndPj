const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot, Image, User, Review, Booking } = require('../../db/models');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params
    console.log("IMAGEID", imageId)
    let currUser = +req.user.id
    let image = await Image.findByPk(+ imageId)
    if (!image) {
        return res.status(404).json({
            message: 'Review Image couldn\'t be found'
        })
    }
    let review
    // console.log("IMAGEB4JSON", image)
    let jsonImage = image.toJSON()
    // console.log("IMMMMAGEAFTERRR", image)
    if (jsonImage) {
        review = await Review.findOne({
            where: {
                id: image.imageableId
            }
        });
        console.log("REVIEW", review)
        if (review.userId !== currUser) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }
    };

    await image.destroy(image)
    return res.json({
        message: "Succesfully deleted"
    })
})



module.exports = router
