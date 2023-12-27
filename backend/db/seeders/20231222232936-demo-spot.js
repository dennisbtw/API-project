'use strict';

const { Spot } = require('../models');

let options = { tableName: 'Spots'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Spot.bulkCreate([
    {
      ownerId: 1,
      address: '532 W Market St',
      city: 'Akron',
      state: 'Ohio',
      country: 'USA',
      lat: 41.13982,
      lng: -81.65958,
      name: "goat house",
      description: "this where THE LeBron Raymone James Sr. grew up.",
      price: 23
    },
    {
      ownerId: 2,
      address: '123 Nook Lane',
      city: 'New Leaf Town',
      state: 'AC State',
      country: 'Animalia',
      lat: 35.6895,
      lng: 139.6917,
      name: "Cozy Countryside Retreat",
      description: 'This Cozy Countryside Retreat offers a charming and whimsical getaway.',
      price: 85 
    },
    {
      ownerId: 3,
      address: '456 Leafy Trail',
      city: 'Timber Creek',
      state: 'Nookshire',
      country: 'Animalia',
      lat: 42.3601,
      lng: -71.0589,
      name: 'Riverside Bungalow',
      description: "A charming and cozy hideaway, it's the perfect spot for adventurers seeking a tranquil retreat.",
      price: 95
    },
    {
      ownerId: 4,
      address: '789 Bells Boulevard',
      city: 'Island Cove',
      state: "Nook's Isle",
      country: 'Animalia',
      lat: 28.2919,
      lng: -81.4076,
      name: 'Luxury Island Villa',
      description: "It's the perfect retreat for those who desire a blend of luxury and the charming, laid-back atmosphere of a peaceful island paradise.",
      price: 120
    },
    {
      ownerId: 5,
      address: '321 Acorn Avenue',
      city: 'Oakwood Village',
      state: 'Forestia',
      country: 'Animalia',
      lat: 46.2276,
      lng: 2.2137,
      name: 'Forest Hideaway',
      description: "It's a perfect retreat for those seeking a peaceful escape amidst the wonders of the natural world.",
      price: 70
    }
   ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4, 5]}
    }, {});
  }
};
