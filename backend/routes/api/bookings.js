const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');
const { validateSpot, validateSpotExists, validateReview, validateBooking, validateDates, checkConflicts, validateSpotOwnership} = require('../../utils/validation');

const userAuthentication = async (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.status(401).send({ message: "Authentication required"});
    }
}
 
const userAuthorization = async (req, res, next) => {
    const { bookingId } = req.params;
    const { user } = req;

    const booking = await Booking.findByPk(bookingId);
    if(!booking) {
        return res.status(404).json({"message": "Bookings Couldn't be found"});
    }
    if(spot.ownerId !== user.id) {
        return res.status(403).json({"message": "Forbidden"});
    }
    next();
};

// Get all of the Current User's Bookings
// working

router.get('/current', userAuthentication, async (req, res, next) => {
    const userId = req.user.id;

    let bookings = await Booking.findAll({
        where: {
            userId: userId
        },
        include: [{
            model: Spot,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'description']
            },
            include: [{
                model: SpotImage,
                attributes: ['url'],
                where: {
                    preview: true
                },
                required: false
            }]
        }]
    });

// specifies previewImage

    bookings = bookings.map(booking => {
        let url = null;
        
        if (booking.Spot.SpotImages.length > 0) {
            url = booking.Spot.SpotImages[0].url;
        }
        booking = booking.toJSON();
        booking.Spot.previewImage = url;
        delete booking.Spot.SpotImages;

        return booking
    });
    res.json({ Bookings: bookings });
})

// edit a booking

router.put('/:bookingId', userAuthentication, validateBooking, )

module.exports = router;