const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot, Image, User, Review, Booking } = require('../../db/models');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = +req.params
    let currUser = +req.user.id
    const image = await Image.findByPk(imageId)
    let review

    if (image) {
        review = await Review.findOne({
            where: {
                id: image.imageableId
            }
        });
    }
    if (!image) {
        return res.status(404).json({
            message: 'Review Image couldn\'t be found'
        })
    }
    if (review.userId !== currUser) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    await image.destroy(image)
    return res.json({
        message: "Succesfully deleted"
    })
})



module.exports = router
