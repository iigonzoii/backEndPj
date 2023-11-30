const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot } = require('../../db/models');
const router = express.Router();


// !start your spot route for get all right away, do nothing else, just start a router.get for all spots




module.exports = router
