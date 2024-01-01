// backend/utils/validation.js
const { validationResult, check} = require('express-validator');
// const { Spot } = require('../db/models');

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


module.exports = {
  handleValidationErrors,
  validateSpot
};