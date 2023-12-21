// Make our router
const express = require('express');
const router = express.Router();

// Import for comparison operators
const { Op } = require('sequelize');

// Import for hashing function
const bcrypt = require('bcryptjs');

// Imports for authorizing users
const { setTokenCookie, restoreUser } = require('../../utils/auth');

// Import for reference to the User model to find records
const { User } = require('../../db/models');

// Import for request validation
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// checks to see whether or not req.body.credential and req.body.password are empty.
// If one of them is empty, then an error will be returned as the response.
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage("Email or username is required"),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage("Password is required"),
    handleValidationErrors
  ];

//
// LOGIN ROUTE
//
router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    // Find a user with the username/email specified in the body
    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    // If there is no user, or there is an incorrect password, create an error and pass it to the next error handling middleware
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.title = 'Login failed';
        return next(err);
    }

    // The logged in user's info to put in the res, with NO hashedPassword
    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    // Use the function we made in auth.js to set the token on our response
    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });

});


//
// LOGOUT ROUTE
//
router.delete('/', (req, res, next) => {
    // Delete the token cookie and return message of success
    res.clearCookie('token');
    return res.json({ message: 'success' });
});



//
// GET CURRENT USER SESSION
//
router.get('/', async (req, res, next) => {
    // Get the current user from the request, already set by the restoreUser middleware
    const user = req.user;

    // If there is a current user, return their info
    // If no current user, return an empty user object
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
});

module.exports = router;