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

// validate query
// not working
const validateQuery = (query) =>{
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;
  const err = {};

  page = parseInt(page);
  size = parseInt(size);

  if (page < 1) err.page = "Page must be greater than or equal to 1"
  if (size < 1) err.size = "Size must be greater than or equal to 1"

  if(minLat) {
    if (minLat < -90 || minLat > 90) err.minLat = "Minimum latitude is invalid"
  }

  if(maxLat) {
    if (maxLat < -90 || maxLat > 90) err.maxLat = "Maximum latitude is invalid"
  }

  if(minLng) {
    if (minLng < -180 || minLng > 180) err.minLng = "Minimum longitude is invalid"
  }

  if(maxLng) {
    if (maxLng < -180 || maxLng > 180) err.maxLng = "Maximum longitude is invalid"
  }

  if(minPrice) {
    if (minPrice < 0) err.minPrice = "Minimum price must be greater or equal to 0"
  }

  if(maxPrice) {
    if (maxPrice < 0) err.maxPrice = "Minimum price must be greater or equal to 0"
  }
  return err;
}

module.exports = {
  handleValidationErrors,
  validateSpot,
  validateSpotExists,
  validateReview,
  validateQuery
};