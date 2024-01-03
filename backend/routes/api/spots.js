const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { validateSpot, validateSpotExists, validateReview} = require('../../utils/validation')
const { Op } = require('sequelize');

const userAuthentication = async (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.status(401).send({ message: "Authentication required"});
    }
}
 
const userAuthorization = async (req, res, next) => {
    const { spotId } = req.params;
    const { user } = req;

    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        return res.status(404).json({"message": "Spot Couldn't be found"});
    }
    if(spot.ownerId !== user.id) {
        return res.status(403).json({"message": "Forbidden"});
    }
    next();
};
// get all spots
// working

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url'],
                limit: 1
            }
        ]
    });
    const spotsWithRatings = spots.map(spot => {
        const spotData = spot.toJSON();
        let totalStars = 0;
        spotData.Reviews.forEach(review => {
            totalStars += review.stars;
        });
        let avgRating = 0;
        if(spotData.Reviews.length > 0) {
            avgRating = totalStars / spotData.Reviews.length;
        }
        let previewImage = null;
        if(spotData.SpotImages.length > 0) {
            previewImage = spotData.SpotImages[0].url;
        }
        
        delete spotData.Reviews;
        delete spotData.SpotImages;

        return {
            ...spotData,
            avgRating,
            previewImage
        }
    });
    res.json({ Spots: spotsWithRatings });
});

// get all spots owned by the current user

router.get('/current', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where:{
            ownerId: userId
        },
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url'],
                limit: 1
            }
        ]
    });
    const spotsWithRatings = spots.map(spot => {
        const spotData = spot.toJSON();
        let totalStars = 0;
        spotData.Reviews.forEach(review => {
            totalStars += review.stars;
        });
        let avgRating = 0;
        if(spotData.Reviews.length > 0) {
            avgRating = totalStars / spotData.Reviews.length;
        }
        let previewImage = null;
        if(spotData.SpotImages.length > 0) {
            previewImage = spotData.SpotImages[0].url;
        }
        
        delete spotData.Reviews;
        delete spotData.SpotImages;

        return {
            ...spotData,
            avgRating,
            previewImage
        }
    });
    res.json({ Spots: spotsWithRatings });
})


// get details of a Spot from an id
// working
router.get('/:spotId', async(req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
    if(!spot){
        return res.status(404).json({ message: "Spot couldn't be found"});
    }

    // average star rating and number of reviews
    const reviews = await Review.findAll({
        where:{
            spotId: spotId
        },
        attributes: ['stars']
    });
    let totalStarRating = 0;
    reviews.forEach(review => {
        totalStarRating += review.stars;
    });

    const numReviews = reviews.length;
    let avgStarRating;

    if(numReviews) {
        avgStarRating = totalStarRating / numReviews;
    } 
    const detail = {
        ...spot.toJSON(), 
        avgStarRating,
        numReviews
    };
    res.json(detail)
});

// create a spot
// working
router.post('/', requireAuth, validateSpot, async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;

    const postSpot = await Spot.create ({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });
    res.status(201).json(postSpot);
});

// add an image to a spot based on the spot's id
// working



router.post('/:spotId/images', userAuthentication, userAuthorization, async(req, res, next) => {
    const newImage = {}
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const spotImage = await SpotImage.create({spotId, url, preview});

    newImage.id = spotImage.id;
    newImage.url = url;
    newImage.preview = preview;

    res.json(newImage);
});


// edit a spot
// working

router.put('/:spotId', userAuthentication, userAuthorization, validateSpot, async(req, res) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        return res.status(404).json({ message: "Spot couldn't be found"});
    }
    if (address) spot.address = address;
    if (city) spot.city = city;
    if (state) spot.state = state;
    if (country) spot.country = country;
    if (lat) spot.lat = lat;
    if (lng) spot.lng = lng;
    if (name) spot.name = name;
    if (description) spot.description = description;
    if (price) spot.price = price;

    await spot.save();

    res.status(200).json(spot);
});

// delete a spot
// working

router.delete('/:spotId', requireAuth, userAuthentication, userAuthorization, async(req, res, next) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    await spot.destroy();

    res.json({
        message: "Successfully deleted"
    });
});

// Get all Reviews by a Spot's id
// working


router.get('/:spotId/reviews', validateSpotExists, async (req, res, next) => {
    const { spotId } = req.params;
    const reviews = await Spot.findByPk(spotId, {
        attributes: [],
        include: [{
            model: Review,
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        }]
    })
    res.json(reviews)
})

// create a review for a spot based on the spot's id
// working

router.post('/:spotId/reviews', userAuthentication, validateSpotExists, validateReview, async (req, res)=> {
    const { review, stars } = req.body;
    const { spotId } = req.params;
    const userId = req.user.id;

    const existingReview = await Review.findOne({ where: { userId, spotId } });
    if (existingReview) {
        return res.status(500).json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    });

    return res.status(201).json(newReview)
})



module.exports = router; 
