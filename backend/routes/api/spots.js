const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, User, Review } = require('../../db/models');

const { Op } = require('sequelize');


const userAuthentication = async (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.status(401).send({ message: "Authentication required"});
    }
}

const userAuthorization = async (req, res, next) => {
    const spotId = req.params.spotId;
    const user = req.user;

    const spot = await Spot.findByPk(spotId);
    if(!spot){
        return res.status(404).json({ message: "Spot not found" });
    }
    if(spot.ownerId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
}

// get all spots

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();
    res.json({
        Spots: spots
    })
});

// get all spots owned by the current user

router.get('/current', async (req, res, next) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where: {
            ownerId: userId
        }
    });
    res.json({ 
        Spots: spots 
    });
})

// get details of a Spot from an id

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
        totalStarRating += review.starRating;
    });

    const numReviews = reviews.length;
    let avgStarRating;

    if(numReviews > 0) {
        avgStarRating = totalStarRating / numReviews;
    }
    const detail = {
        ...spot.toJSON(), 
        avgStarRating,
        numReviews
    };
    res.json(detail)
});

module.exports = router;