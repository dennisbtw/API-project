const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const { validateReview } = require('../../utils/validation');


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

    const review = await Review.findByPk(reviewId);
    if(!review) {
        return res.status(404).json({"message": "Review Couldn't be found"});
    }
    if(review.userId !== user.id) {
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

// Add an Image to a Review based on the Review's id
// working

router.post('/:reviewId/images', userAuthentication, userAuthorization, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    
    const existingImages = await ReviewImage.findAll({
        where: {
            reviewId
        }
    });
    if (existingImages.length >= 10) {
        res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        });
        return;
    }
    const newImage = await ReviewImage.create({
        reviewId, url
    });
    res.json({
        id: newImage.id,
        url: newImage.url
    });
})

// Edit a Review

router.put('/:reviewId', userAuthentication, userAuthorization, validateReview, async( req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const newReview = await Review.findByPk(reviewId);

    newReview.review = review;
    newReview.stars = stars;

    newReview.save();
    res.json(newReview);
})

// delete a review

router.delete('/:reviewId', userAuthentication, userAuthorization, async (req, res) => {
    const { reviewId } = req.params;
    const newReview = await Review.findByPk(reviewId);

    await newReview.destroy();

    res.json({
        message: "Successfully deleted"
    });
})

module.exports = router;