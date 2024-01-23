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
        url: 'https://i.pinimg.com/736x/c0/53/a9/c053a948030c561240cde552e041ef9f.jpg',
        preview: true
      },
      {
        spotId: 1,
        url:'https://i.pinimg.com/736x/09/23/0e/09230eabd777c5a7ebbef3ff36862690.jpg',
        preview: true
      },
      {
        spotId: 1,
        url:'https://i.pinimg.com/736x/c5/6c/e8/c56ce8b63dea62cdc594af0e508e2452.jpg',
        preview: true
      },
      {
        spotId: 1,
        url:'https://i.pinimg.com/736x/b6/51/0e/b6510e65bac8032482a1cc187577ff36.jpg',
        preview: true
      },
      {
        spotId: 1,
        url:'https://i.pinimg.com/736x/f9/15/60/f915601361717f1abfb73096f0e12999.jpg',
        preview: true
      },
      {
        spotId:2,
        url: 'https://i.pinimg.com/736x/9f/d5/13/9fd51389e28dab089e50df567f1679ea.jpg',
        preview: true
      },
      {
        spotId:2,
        url: 'https://i.pinimg.com/736x/a4/98/cb/a498cb447f16570dbf8bb5a26fe54d5c.jpg',
        preview: true
      },
      {
        spotId:2,
        url: 'https://i.pinimg.com/736x/d1/40/c9/d140c95af76784a26a08903ee158da23.jpg',
        preview: true
      },
      {
        spotId:2,
        url: 'https://i.pinimg.com/736x/34/80/44/34804409103d78dea1b8effeebc8a5f3.jpg',
        preview: true
      },
      {
        spotId:2,
        url: 'https://i.pinimg.com/736x/ef/c4/03/efc4035031ba3140f25dd9391c20dad1.jpg',
        preview: true
      },
      {
        spotId:3,
        url: 'https://i.pinimg.com/736x/4b/3e/1a/4b3e1a01aa0773bc6ab1e640dc8a3446.jpg', 
        preview: true
      },
      {
        spotId:3,
        url: 'https://i.pinimg.com/736x/e8/f7/d5/e8f7d5a5f8e919b3658e2a6fdc67b521.jpg', 
        preview: true
      },
      {
        spotId:3,
        url: 'https://i.pinimg.com/736x/c5/19/dd/c519ddc478019287a4f79e5a13e59ddb.jpg', 
        preview: true
      },
      {
        spotId:3,
        url: 'https://i.pinimg.com/736x/42/e7/ff/42e7fffaaab33277a7d06f66216b3bfc.jpg', 
        preview: true
      },
      {
        spotId:3,
        url: 'https://i.pinimg.com/736x/1c/a1/45/1ca1458ac1cb299de397fdc2c120f42e.jpg', 
        preview: true
      },
      {
        spotId:4,
        url: 'https://preview.redd.it/9v33snfjho371.jpg?width=640&crop=smart&auto=webp&s=1335b6bbbd7ca451aa128a6c8f70db4f6dbd31c5', 
        preview: true
      },
      {
        spotId:4,
        url: 'https://i.pinimg.com/736x/1e/46/3e/1e463eee0461ef34386babbb01daf9c6.jpg', 
        preview: true
      },
      {
        spotId:4,
        url: 'https://i.pinimg.com/736x/e0/39/3c/e0393c95ba9ded8c744194e82cda58d2.jpg', 
        preview: true
      },
      {
        spotId:4,
        url: 'https://i.pinimg.com/736x/bb/e6/10/bbe6109e13dbc9a6b14e29a13841ba37.jpg', 
        preview: true
      },
      {
        spotId:4,
        url: 'https://i.pinimg.com/736x/06/01/d6/0601d6e61690aff0708815c5485aafa2.jpg', 
        preview: true
      },
      {
        spotId:5,
        url: 'https://i.pinimg.com/736x/18/79/bc/1879bc09423074213d3e4c932c6863eb.jpg', 
        preview: true
      },
      {
        spotId:5,
        url: 'https://i.pinimg.com/736x/9e/fc/d5/9efcd527ef1d587486a19537c942a837.jpg', 
        preview: true
      },
      {
        spotId:5,
        url: 'https://i.pinimg.com/736x/ba/50/71/ba50715727fdcb0a5d6d29daa80cc589.jpg', 
        preview: true
      },
      {
        spotId:5,
        url: 'https://i.pinimg.com/736x/fd/04/57/fd0457177942d2f8ca69f28a764bd2e6.jpg', 
        preview: true
      },
      {
        spotId:5,
        url: 'https://i.pinimg.com/736x/fd/04/57/fd0457177942d2f8ca69f28a764bd2e6.jpg', 
        preview: true
      },
      {
        spotId:6,
        url: 'https://i.pinimg.com/originals/90/e4/79/90e479a47aaab89fbbb159b49ce163c0.jpg',
        preview: true
      },
      {
        spotId:6,
        url: 'https://pbs.twimg.com/media/Eaxg5j-U8AAVY81?format=jpg&name=large',
        preview: true
      },
      {
        spotId:6,
        url: 'https://pbs.twimg.com/media/Eaxg5j0UwAYAEp2?format=jpg&name=large',
        preview: true
      },
      {
        spotId:6,
        url: 'https://pbs.twimg.com/media/Eaxg5jxUYAIOhKT?format=jpg&name=large',
        preview: true
      },
      {
        spotId:6,
        url: 'https://i.pinimg.com/564x/e2/5a/e1/e25ae1316a178e05b60b329ff7a814eb.jpg',
        preview: true
      },
      {
        spotId:7,
        url: 'https://i.pinimg.com/originals/7c/d2/3f/7cd23f8f171cc13d57102b25466f9695.jpg',
        preview: true,
      },
      {
        spotId:7,
        url: 'https://i.pinimg.com/736x/75/b0/be/75b0be1aeb266d680d696b41158b3261.jpg',
        preview: true,
      },
      {
        spotId:7,
        url: 'https://i.pinimg.com/736x/48/96/c7/4896c73f290cad135931453d7713bbbd.jpg',
        preview: true,
      },
      {
        spotId:7,
        url: 'https://i.pinimg.com/736x/5b/49/5f/5b495fc79e30e589661d648faf73c6db.jpg',
        preview: true,
      },
      {
        spotId:7,
        url: 'https://i.pinimg.com/736x/07/5d/df/075ddff43770cde11ef10187cf72dc34.jpg',
        preview: true,
      },
      {
        spotId:8,
        url: 'https://i.pinimg.com/736x/82/a5/3a/82a53ae509c02e2a7425c964b3859cf8.jpg', 
        preview: true
      },
      {
        spotId:8,
        url: 'https://i.pinimg.com/736x/e0/39/3c/e0393c95ba9ded8c744194e82cda58d2.jpg', 
        preview: true
      },
      {
        spotId:8,
        url: 'https://preview.redd.it/96qlh263q0c61.jpg?width=1280&format=pjpg&auto=webp&s=9af3935bf70ca826266eb4a58800fea7f4e87456', 
        preview: true
      },
      {
        spotId:8,
        url: 'https://i.pinimg.com/originals/29/23/5f/29235f10abaa6c409473017ec32b0ea6.jpg', 
        preview: true
      },
      {
        spotId:8,
        url: 'https://64.media.tumblr.com/09470d3afc36d3f11fef62b34a3aa5bc/c5c1cbc7b5588664-cd/s1280x1920/aa27de0112d827575109eed3f6a8e6091535f74c.jpg', 
        preview: true
      },
      {
        spotId:9,
        url: 'https://i.pinimg.com/736x/0a/81/bf/0a81bf80f87b922221a8f555cfebf942.jpg', 
        preview: true
      },
      {
        spotId:9,
        url: 'https://i.pinimg.com/736x/9f/40/66/9f40662600c23e0887741af14d9b0e77.jpg', 
        preview: true
      },
      {
        spotId:9,
        url: 'https://i.pinimg.com/736x/b9/5a/d0/b95ad021c1d9aac60a1ad6be7dc2f4c1.jpg', 
        preview: true
      },
      {
        spotId:9,
        url: 'https://i.pinimg.com/originals/7d/97/93/7d97935cf303caf970c504ec8a7be109.jpg', 
        preview: true
      },
      {
        spotId:9,
        url: 'https://i.pinimg.com/736x/b1/11/0b/b1110b3e9ea75312fbb9af758a42ceb2.jpg', 
        preview: true
      },
      {
        spotId:10,
        url: 'https://i.pinimg.com/736x/47/35/a7/4735a7f31e594b1217eb9e0a94feb69b.jpg', 
        preview: true
      },
      {
        spotId:10,
        url: 'https://i.pinimg.com/736x/41/fe/0f/41fe0f5f06abbdd233e3facb5459259b.jpg', 
        preview: true
      },
      {
        spotId:10,
        url: 'https://i.pinimg.com/736x/03/52/e6/0352e68017098329b566791cb01a2389.jpg', 
        preview: true
      },
      {
        spotId:10,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJc51qmGJZ1U6r3xR-KIaO-AGvoCbfSBDZcLZizdi2FAa3c3pLv7OMAORjEX_OIC8FuFI&usqp=CAU', 
        preview: true
      },
      {
        spotId:10,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxjQ_YrSzaj4MgaXbGln57NYyXqR814V1mU0ibqFTlo074W2Fkz6ye2uX46xKT_V1nW7U&usqp=CAU', 
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
