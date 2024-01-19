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
    },
    {
      ownerId: 6,
      address: '101 Cherry Blossom Lane',
      city: 'Sakura City',
      state: 'Floria',
      country: 'Animalia',
      lat: 34.6937,
      lng: 135.5023,
      name: 'Cherry Blossom Cottage',
      description: 'Nestled among blooming cherry trees, this cottage offers a serene escape.',
      price: 80
    },
    {
      ownerId: 7,
      address: '202 Ocean Drive',
      city: 'Marine Bay',
      state: 'Aquaria',
      country: 'Animalia',
      lat: 25.7617,
      lng: -80.1918,
      name: 'Seaside Getaway',
      description: 'A beachfront property offering stunning ocean views and relaxing vibes.',
      price: 100
    },
    {
      ownerId: 8,
      address: '303 Mountain Road',
      city: 'Highpeak Town',
      state: 'Altitude',
      country: 'Animalia',
      lat: 39.7392,
      lng: -104.9903,
      name: 'Mountain View Cabin',
      description: 'A cozy cabin at the foothills of the mountains, perfect for nature lovers.',
      price: 90
    },
    {
      ownerId: 9,
      address: '404 Forest Path',
      city: 'Greenwood',
      state: 'Sylvan',
      country: 'Animalia',
      lat: 47.6062,
      lng: -122.3321,
      name: 'Woodland Retreat',
      description: 'A secluded retreat in the heart of the forest, ideal for a peaceful getaway.',
      price: 75
    },
    {
      ownerId: 10,
      address: '505 Desert Trail',
      city: 'Sandy Ridge',
      state: 'Dune',
      country: 'Animalia',
      lat: 36.1699,
      lng: -115.1398,
      name: 'Desert Oasis',
      description: 'A unique desert experience, offering stunning landscapes and starry nights.',
      price: 85
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
