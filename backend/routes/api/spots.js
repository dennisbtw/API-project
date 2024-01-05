const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { validateSpot, validateSpotExists, validateReview, validateQuery} = require('../../utils/validation')
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


router.get('/', async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    
        const errors = validateQuery(req.query)
    
        if(Object.keys(errors).length) {
            res.status(400);
            const err = new Error();
            err.message = "Bad Request"
            err.errors = errors
    
            return res.json(err)
        }
        page = parseInt(page);
        size = parseInt(size);
    
        if (Number.isNaN(page) || page <= 0 || !page) page = 1;
        if (Number.isNaN(size) || size <= 0 || !size) size = 20;
        
        if(page > 10) page = 10;
        if(size > 20) size = 20;
    
        const obj = {};
    
        if(minLat && !maxLat) obj.lat = {[Op.gte]: minLat}
        if(maxLat && !minLat) obj.lat = {[Op.lte]: maxLat}
        if(minLat && maxLat) obj.lat = {[Op.between]: [minLat, maxLat]}
    
        if(minLng && !maxLng) obj.lng = {[Op.gte]: minLng}
        if(maxLng && !minLng) obj.lng = {[Op.lte]: maxLng}
        if(minLng && maxLng) obj.lng = {[Op.between]: [minLng, maxLng]}
    
        if(minPrice && !maxPrice) obj.minPrice = minPrice
        if(maxPrice && !minPrice) obj.maxPrice = maxPrice
        if(minPrice && maxPrice) obj.price = {[Op.between]: [minPrice, maxPrice]}
        
    
        const spots = await Spot.findAll({
            where: obj,
            limit: size,
            offset: size * (page - 1)
        });
    
        const allSpots = [];
    
        for (let i = 0; i < spots.length; i++) {
            let spot = spots[i];
    
            const reviews = await Review.findAll({
                where: { spotId: spot.id },
                attributes: ['stars']
            });
    
            let totalStars = 0;
            reviews.forEach(review => totalStars += review.stars);
    
            let avgRating;
            if (reviews.length > 0) {
                avgRating = totalStars / reviews.length;
            } else {
                avgRating = "This spot has no reviews yet";
            }
    
            const previewImage = await SpotImage.findOne({
                where: { spotId: spot.id, preview: true },
                attributes: ['url']
            });
    
            spot = spot.toJSON();
            spot.avgRating = avgRating;
            if (previewImage) {
                spot.previewImage = previewImage.url;
            } else {
                spot.previewImage = "This spot has no preview image yet";
            }
    
            allSpots.push(spot);
        }
    
        return res.json({ Spots: allSpots, page, size });
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
router.post('/', userAuthentication, validateSpot, async(req, res) => {
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

// Get all Bookings for a Spot based on the Spot's id
// working 

router.get('/:spotId/bookings', userAuthentication, async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    if(spot) {
        // initialize query option
        let queryOptions = {
            where: {spotId: spotId}
        }; 
        // if current user is the owner of spot
        if (spot.ownerId == user.id) {
            queryOptions.include = {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            };
        } else { 
        // if user is not the owner
            queryOptions.attributes = ['spotId', 'startDate', 'endDate']
        }
        const bookings = await Booking.findAll(queryOptions);
        return res.json({
            Bookings: bookings
        });
        } else {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
    }
});

// create a booking

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const bookingStartDate = new Date(startDate);
    const bookingEndDate = new Date(endDate);
    const currentTime = new Date();

    if (bookingStartDate < currentTime) {
        return res.status(400).json({ message: "Bad Request", errors: { startDate: "startDate cannot be in the past" } });
    }

    if (bookingEndDate <= bookingStartDate) {
        return res.status(400).json({ message: "Bad Request", errors: { endDate: "endDate cannot be on or before startDate" } });
    }

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === req.user.id) {
        return res.status(403).json({ message: "Spot cannot belong to the owner" });
    }

    const existingBooking = await Booking.findOne({
        where: {
            spotId,
            [Op.or]: [
                {
                    [Op.and]: [
                        { startDate: { [Op.lte]: bookingEndDate } },
                        { endDate: { [Op.gte]: bookingStartDate } }
                    ]
                }
            ]
        }
    });

    if (existingBooking) {
        return res.status(403).json({ 
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            },
        });
    }

    const newBooking = await Booking.create({ 
        userId: req.user.id, spotId, startDate: bookingStartDate, endDate: bookingEndDate 
    });
    res.json(newBooking);
});



module.exports = router; 
