const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, User, Review } = require('../../db/models');
const { validateSpot } = require('../../utils/validation')
const { Op } = require('sequelize');

// fix userAuthentication and userAuthorization
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

router.get('/current', requireAuth, async (req, res, next) => {
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
// not working currently



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

module.exports = router; 
