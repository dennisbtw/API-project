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
      {
        spotId: 6,
        userId: 6,
        startDate: '2028-12-26',
        endDate: '2029-3-10'
      },
      {
        spotId: 7,
        userId: 7,
        startDate: '2029-12-26',
        endDate: '2030-3-10'
      },
      {
        spotId: 8,
        userId: 8,
        startDate: '2030-12-26',
        endDate: '2031-3-10'
      },
      {
        spotId: 9,
        userId: 9,
        startDate: '2031-12-26',
        endDate: '2032-3-10'
      },
      {
        spotId: 10,
        userId: 10,
        startDate: '2032-12-26',
        endDate: '2033-3-10'
      }
    ], { validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
