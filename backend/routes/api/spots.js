const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Image, User } = require('../../db/models');
const router = express.Router();

// !this shit just dont work.
router.get('/', async (req, res, next) => {
    const Spots = await Spot.findAll({
        // include: [
        //     {
        //         // model:modelname
        //     },
        //     {
        //         // model:modelName
        //     }
        // ]
    })
    return res.json({Spots})
})

// router.post('/', async (req, res, next) => {
//     const { address, city, state, country, lat, lng, name, description, price } = req.body
//     // ! getting id as null, and am not getting ownerId at all
//     const spot = await Spot.create({
//         include: {model: User, attributes: ['ownerId']},
//         // id: id,
//         address:address,
//         city: city,
//         state: state,
//         country: country,
//         lat: lat,
//         lng: lng,
//         name: name,
//         description: description,
//         price: price
//     })
//     res.status(201).json(spot)
// })

module.exports = router
