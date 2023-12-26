'use strict';

const { SpotImage } = require('../models');

let options = { tableName: 'SpotImages' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId:1,
        url: 'URL',
        preview: true
      },
      {
        spotId:2,
        url: 'URL',
        preview: true
      },
      {
        spotId:3,
        url: 'URL',
        preview: true
      },
      {
        spotId:4,
        url: 'URL',
        preview: true
      },
      {
        spotId:5,
        url: 'URL',
        preview: true
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {})
  }
};
