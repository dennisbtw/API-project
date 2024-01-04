const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

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
    if(booking.ownerId !== user.id) {
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

router.put("/:bookingId", requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const bookingStartDate = new Date(startDate);
    const bookingEndDate = new Date(endDate);
    const currentTime = new Date();

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden"});
    }

    if (bookingStartDate < currentTime || booking.endDate < currentTime) {
        return res.status(403).json({ message: "Past bookings can't be modified" });
    }

    if (bookingEndDate <= bookingStartDate) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "startDate cannot be in the past",
                endDate: "endDate cannot be on or before startDate"
            }
        });
    }

    const conflictingBooking = await Booking.findOne({
        where: {
            id: { [Op.ne]: bookingId },
            spotId: booking.spotId,
            [Op.or]: [
                {
                    [Op.and]: [
                        { startDate: { [Op.lte]: bookingEndDate } },
                        { endDate: { [Op.gte]: bookingStartDate } },
                    ],
                }
            ],
        },
    });

    if (conflictingBooking) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking",
            },
        });
    }

    booking.startDate = bookingStartDate;
    booking.endDate = bookingEndDate;
    await booking.save();

    res.json(booking);
});


// delete a booking

router.delete('/:bookingId', userAuthentication, async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id; 

    const booking = await Booking.findByPk(bookingId);

    // Check if the booking exists
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Check if the user is authorized to delete the booking
    if (booking.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    // Check if the booking has already started
    if (new Date(booking.startDate) <= new Date()) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
    }

    // Delete the booking
    await booking.destroy();
    res.json({ message: "Successfully deleted" });
});


module.exports = router;