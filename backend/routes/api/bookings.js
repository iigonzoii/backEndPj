const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors, } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')
const { Spot, Image, Booking } = require('../../db/models');
const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    let data = {}
    let currUser = +req.user.id
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
    const { startDate, endDate } = req.body
    const currUser = +req.user.id
    const { bookingId } = req.params
    const today = new Date();
    const validStartDate = new Date(startDate)
    const validEndDate = new Date(endDate)
    let booking = await Booking.findByPk(+bookingId)
    if (!(await Booking.findByPk(+bookingId))) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    booking = booking.toJSON()
    let spot = await Spot.findByPk(booking.spotId)
    spot = spot.toJSON()
    const spotId = spot.id
    if (today > validStartDate) {
        const error = new Error('Bad Request')
        error.errors = {
            startDate: "startDate cannot be in the past"
        }
        error.status = 400
        return next(error)
    }
    if (validStartDate >= validEndDate) {
        const error = new Error('Bad Request')
        error.errors = {
            endDate: "endDate cannot be on or before startDate"
        }
        error.status = 400
        return next(error)
    }

    let isOwner = await Booking.findByPk(+bookingId)
    if (isOwner.userId !== currUser) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    }

    let bookings = await Booking.findAll({
        where: {
            spotId,
            id: {
                // excluding current booking
                [Op.ne]: bookingId
            }
        }
    })
    bookings = bookings.map(booking => booking.toJSON())
    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i]
        // console.log('BOOOOKING',booking)
        const currStartDate = new Date(booking.startDate)
        const currEndDate = new Date(booking.endDate)
        if (validStartDate <= currStartDate && validEndDate >= currStartDate) {
            const error = new Error("Sorry, this spot is already booked for the specified dates")
            error.errors = {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
            error.status = 403
            return next(error)
        } else if (validStartDate >= currStartDate && validEndDate <= currEndDate) {
            const error = new Error("Sorry, this spot is already booked for the specified dates")
            error.errors = {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
            error.status = 403
            return next(error)
        } else if (validEndDate >= currStartDate && validEndDate <= currEndDate) {
            const error = new Error("Sorry, this spot is already booked for the specified dates")
            error.errors = {
                endDate: "End date conflicts with an existing booking"
            }
            error.status = 403
            return next(error)
        } else if (validStartDate >= currStartDate && validStartDate <= currEndDate) {
            const error = new Error("Sorry, this spot is already booked for the specified dates")
            error.errors = {
                startDate: "Start date conflicts with an existing booking"
            }
            error.status = 403
            return next(error)
        }
    }

    await Booking.update({
        startDate,
        endDate
    }, {
        where: {
            id: +bookingId
        }
    });
    // i passed in booking because
    let rez = await Booking.findByPk(bookingId)
    res.json(rez)
});

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params
    const currUser = +req.user.id
    today = new Date()
    let validBooking = await Booking.findByPk(+bookingId)
    if (!validBooking) return res.status(404).json({
        message: "Booking couldn't be found"
    });
    validBooking = validBooking.toJSON()
    let spot = await Spot.findByPk(validBooking.spotId);
    if (validBooking.userId !== currUser && spot.ownerId !== currUser) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };
    if (validBooking.startDate < today && validBooking.endDate > today) {
        return res.status(403).json({
            message: 'Bookings that have been started can\'t be deleted'
        })
    };
    await Booking.destroy({
        where: { id: +bookingId }
    });
    return res.json({
        message: "Successfully deleted"
    })
})

module.exports = router
