const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')
const { Spot, Image, User, Booking } = require('../../db/models');
const router = express.Router();



router.get('/current', requireAuth, async (req, res, next) => {
    let data = {}
    let currUser = req.user.id
    const usersBookings = await Booking.findAll({
        where: {
            userId: currUser
        },
        include: [
            {
                model: Spot,
                include: [{
                    model: Image,
                    as: 'SpotImages'
                }]
            }
        ],
    })

    data = usersBookings.map(booking => booking.toJSON());

    data.forEach(booking => {
        booking.Spot.SpotImages.forEach(image =>{
            if(image.preview) {
                booking.Spot.previewImage = image.url
            }
            else {
                booking.Spot.previewImage = 'no image url'
            }
        })
        delete booking.Spot.SpotImages
        delete booking.Spot.createdAt
        delete booking.Spot.updatedAt
    })
        return res.json({ Bookings: data })
    })




    module.exports = router
