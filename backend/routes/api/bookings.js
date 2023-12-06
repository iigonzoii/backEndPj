const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')
const { Spot, Image, User, Booking } = require('../../db/models');
const router = express.Router();



router.get('/current', requireAuth, async(req, res, next) => {
    let data = {}
    let currUser = req.user.id
    const usersBookings = await Booking.findAll({
        where: {
            userId: currUser
        },
        // include: [
        //     // {
        //     //     model: Image,
        //     //     as:'SpotImages'
        //     // },
        //     {
        //         model: Spot
        //     }
        // ],
    })

    data = usersBookings.map(booking => booking.toJSON());

    // * for each data object, do a spot.findbypk passing in data.spotId
    // let bookedSpot = data.forEach(async booking => {
    //     await Spot.findByPk(booking.spotId)
    // });

    //     data.forEach(data => {
    //     data.SpotImages.forEach(image => {
    //         if (image.preview) data.previewImage = image.url
    //         // console.log(image)
    //     });
    //     if (!data.previewImage) {
    //         data.previewImage = 'no image url'
    //     };
    //     delete data.SpotImages

    // });
    console.log(data)


    return res.json( data )
})











module.exports = router
