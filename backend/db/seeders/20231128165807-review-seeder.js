'use strict';
const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        review: "heres a review from userId 1",
        stars: 1
      },
      {
        userId: 1,
        spotId: 1,
        review: "heres a review",
        stars: 1
      },
      {
        userId: 2,
        spotId: 2,
        review: "heres a review from userId2",
        stars: 2
      },
      {
        userId: 1,
        spotId: 1,
        review: "heres a review",
        stars: 1
      },
      {
        userId: 1,
        spotId: 1,
        review: "heres another review",
        stars: 2
      },
      {
        userId: 1,
        spotId: 1,
        review: "heres anotherrrrr review",
        stars: 3
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete( options, {
      userId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
