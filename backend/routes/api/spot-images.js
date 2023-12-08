const express = require('express');
const { requireAuth } = require('../../utils/auth')
const { Spot, Image, } = require('../../db/models');
const router = express.Router();


router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = +req.params
    let currUser = +req.user.id
    const image = await Image.findByPk(imageId)
    let spot

    if (image) {
        spot = await Spot.findOne({
            where: {
                id: image.imageableId
            }
        });
    }
    if (!image) {
        return res.status(404).json({
            message: 'Spot Image couldn\'t be found'
        })
    }
    if (spot.ownerId !== currUser) {
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
