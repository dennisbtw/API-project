// backend/utils/validation.js
const { validationResult, check} = require('express-validator');
const { Spot, Booking, } = require('../db/models');
const { Op } = require('sequelize');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

// validate new spot

const validateSpot = [
  check('address')
  .exists({ checkFalsy: true })
  .withMessage('Street address is required'),
  check('city')
  .exists({ checkFalsy: true})
  .withMessage('City is required'),
  check('state')
  .exists({ checkFalsy: true})
  .withMessage('State is required'),
  check('country')
  .exists({ checkFalsy: true })
  .withMessage('Country is required'),
  check('lat')
  .isFloat({min: -90.0, max: 90.0})
  .withMessage('Latitude is not valid'),
  check('lng')
  .isFloat({min: -180.0, max: 180.0})
  .withMessage('Longitude is not valid'),
  check('name')
  .isLength({max: 50})
  .withMessage('Name must be less than 50 characters'),
  check('description')
  .exists({ checkFalsy: true})
  .withMessage('Description is required'),
  check('price')
  .isFloat({min: 0})
  .withMessage('Price is required'),
  handleValidationErrors
];


// sees if a spot exist

const validateSpotExists = async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    return res.status(404).json({ "message": "Spot couldn't be found" });
  }
  next();
};

// validate review

const validateReview = [
  check('review')
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage('Review text is required'),
  check('stars')
  .exists({checkFalsy: true})
  .isInt({ min: 1, max: 5})
  .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

// validate Booking

const validateBooking = [
  check('startDate')
  .exists({checkFalsy: true})
  .withMessage('start date is required'),
  check('endDate')
  .exists({checkFalsy: true})
  .withMessage('end date is required'),
  handleValidationErrors
]

// validate the dates of the booking

const validateDates = (req, res, next) => {
  const {startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if(start < new Date ()) {
    const error = new Error('Bad Request');
    error.errors = {
      "startDate": "startDate cannot be in the past"
    };
    error.status = 400;
    error.title = "Bad request";
    return next(error);
  }
  if (end <= start) {
    const error = new Error('Bad Request');
    error.errors = {
      "endDate": "endDate cannot be on or before startDate"
    };
    error.status = 400; 
    error.title = "Bad request"
    return next(error);
  }
  next();
}

// check date conflicts

const checkConflicts = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const { spotId } = req.params;

  const conflictBooking = await Booking.findOne({
    where: {
      spotId: spotId,
      [Op.and]: [
        {
          startDate: {
            [Op.lte]: endDate 
          }
        },
        {
          endDate: {
            [Op.gte]: startDate 
          }
        }
      ]
    }
  });

  if (conflictBooking){
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    });
  } else {
    next ();
  }
}

// Spot must NOT belong to the current user

const validateSpotOwnership = async (req, res, next) => {
  const { user } = req;
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(spot.ownerId === user.id) {
    return res.status(403).json({
      message: "Forbidden: Cannot book your own spot"
    });
  } else {
    next();
  }
}

module.exports = {
  handleValidationErrors,
  validateSpot,
  validateSpotExists,
  validateReview,
  validateBooking,
  validateDates,
  checkConflicts,
  validateSpotOwnership
};