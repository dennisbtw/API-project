'use strict';
const { Review } = require('../models')

let options = { tableName: 'Reviews' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 5,
        userId: 1,
        review: "This place is so cool",
        stars: 5
      },
      {
        spotId: 4,
        userId: 2,
        review: "Amazing!",
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: "It could be better",
        stars: 2
      },
      {
        spotId: 3,
        userId: 4,
        review: "This place stinks with a capital s",
        stars: 1
      },
      {
        spotId: 1,
        userId: 5,
        review: "Wifi is slow",
        stars: 3
      }, 
      {
        spotId: 7,
        userId: 6,
        review: "Amazing views",
        stars: 4
      },
      {
        spotId: 8,
        userId: 7,
        review: "It was okay, mid",
        stars: 2
      },
      {
        spotId: 9,
        userId: 8,
        review: "Best place I've stayed at in a long time!!",
        stars: 5
      },
      {
        spotId: 10,
        userId: 9,
        review: "Almost perfect",
        stars: 4
      },
      {
        spotId: 6,
        userId: 10,
        review: "This place is basically haunted!!",
        stars: 1
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5]}
    }, {});
  }
};
