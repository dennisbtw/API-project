const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');


// user Authentication
const userAuthentication = async (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.status(401).send({ message: "Authentication required"});
    }
}

// user Authorization
const userAuthorization = async (req, res, next) => {
    const { reviewId } = req.params;
    const { user } = req;

    const spot = await Spot.findByPk(reviewId);
    if(!spot) {
        return res.status(404).json({"message": "Spot Couldn't be found"});
    }
    if(spot.ownerId !== user.id) {
        return res.status(403).json({"message": "Forbidden"});
    }
    next();
};

// Get all reviews of the current user
// preview image is spot image 
// working
router.get('/current', userAuthentication, async (req, res, next) => {
    const userId = req.user.id;

    let reviews = await Review.findAll({
        where: {userId: userId},
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            },
            include:{
                model: SpotImage,
                attributes: ['url'],
                where: {
                    preview: true
                },
                required: false
            }
        },
    {
        model: ReviewImage,
        attributes: ['id', 'url']
        }]
    });
    
    // specifies spotImages to previewImages
    reviews = reviews.map(review => {
        let url = null;
        
        if (review.Spot.SpotImages.length > 0) {
            url = review.Spot.SpotImages[0].url;
        }
        review = review.toJSON();
        review.Spot.previewImage = url;
        delete review.Spot.SpotImages;

        return review
    });
    res.json({Reviews: reviews})
});


module.exports = router;