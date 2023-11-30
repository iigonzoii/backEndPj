const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot } = require('../../db/models');
const router = express.Router();


// !start your spot route for get all right away, do nothing else, just start a router.get for all spots

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'createdAt', 'updatedAt', 'avgRating', 'previewImage']
    })
    return res.json(spots)
})


module.exports = router
