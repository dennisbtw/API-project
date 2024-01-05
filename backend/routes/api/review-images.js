const express = require('express');
const router = express.Router();
const {requireAuth } = require('../../utils/auth');
const { Review, ReviewImage }  = require('../../db/models');

//Delete a Review Image

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;
    const reviewImage = await ReviewImage.findByPk(imageId);
    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        });
    }
    const review = await Review.findByPk(reviewImage.reviewId);
    if (!review || review.userId !== userId) {
        return res.status(403).json({ 
            message: "Forbidden" 
        });
    }
    await reviewImage.destroy();
    res.status(200).json({ 
        message: "Successfully deleted" 
    });
});



module.exports = router;