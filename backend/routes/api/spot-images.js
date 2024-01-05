const express = require('express');
const router = express.Router();
const { Spot, SpotImage } = require('../../db/models');
const {requireAuth } = require('../../utils/auth');

// delete a Spot Image

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    const spotImage = await SpotImage.findByPk(imageId);

    if(!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    }
    const spot = await Spot.findByPk(spotImage.spotId);
    if(!spot || spot.ownerId !== userId){
        return res.status(403).json({
            message: "Forbidden"
        })
    }
        await spotImage.destroy();
        res.json({
            message: "Successfully deleted"
        });
    });



module.exports = router;