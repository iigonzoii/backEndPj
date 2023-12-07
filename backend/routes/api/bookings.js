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
        booking.Spot.SpotImages.forEach(image => {
            if (image.preview) {
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
});

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params
    const { startDate, endDate } = req.body
    let currUser = req.user.id
    const today = new Date();
    const validStartDate = new Date(startDate)
    const validEndDate = new Date(endDate)
    let isOwner = await Booking.findByPk(bookingId)
    if (!(await Booking.findByPk(bookingId))) return res.status(404).json({
        message: "Booking couldn't be found"
    })
    if (isOwner.userId !== currUser) {
        res.status(403).json({
            message: "Forbidden"
        })
    };
    if (today > validEndDate) {
        const error = new Error('Past bookings can\'t be modified')
        error.status = 403
        next(error)
    }

    let currBooking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })
    console.log(currBooking.toJSON())
    if (validStartDate <= currBooking.startDate && validEndDate >= currBooking.endDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        }
        error.status = 403
        return next(error)
    } else if (validStartDate >= currBooking.StartDate && validEndDate <= currBooking.EndDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        }
        // error.status(403)
        return next(error)
    } else if (validEndDate >= currBooking.StartDate && validEndDate <= currBooking.EndDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            endDate: "End date conflicts with an existing booking"
        }
        return next(error)
    } else if (validStartDate >= currBooking.StartDate && validStartDate <= currBooking.EndDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            startDate: "Start date conflicts with an existing booking"
        }
        return next(error)
    }

    await Booking.update({
        startDate,
        endDate
    }, {
        where: {
            id: bookingId
        }
    })
    let updated = await Booking.findByPk(bookingId)
    res.json(updated)
})



module.exports = router
