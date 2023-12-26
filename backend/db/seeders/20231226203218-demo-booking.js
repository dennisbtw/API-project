'use strict';

const { Booking } = require('../models')

let options = { tableName: 'Bookings' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-12-26',
        endDate: '2024-3-10'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-12-26',
        endDate: '2025-3-10'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2025-12-26',
        endDate: '2026-3-10'
      },
      {
        spotId: 4,
        userId: 4,
        startDate: '2026-12-26',
        endDate: '2027-3-10'
      },
      {
        spotId: 5,
        userId: 5,
        startDate: '2027-12-26',
        endDate: '2028-3-10' 
      },
    ], { validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
