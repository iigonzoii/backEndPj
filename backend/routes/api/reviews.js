const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')

const { Spot, Image, User, Review } = require('../../db/models');
const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) =>{
    // let data = {}
    let currUser = req.user.id
    let reviews = await Review.findAll({
        where:{
            userId: currUser
        },
        include: [
            {
                model: Spot
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
    // if (reviews.ReviewImages.length === 0) {
    //     reviews.ReviewImages = {
    //         message: 'no images to display'
    //     }
    // }
    // res.json({}Reviews:reviews)
    res.json({Reviews:reviews})
})






module.exports = router
