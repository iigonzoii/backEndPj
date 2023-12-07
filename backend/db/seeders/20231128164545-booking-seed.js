'use strict';
const {Booking} = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '01/01/2024',
        endDate: '01/02/2024'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '01/01/2024',
        endDate: '01/02/2024'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '01/03/2024',
        endDate: '01/04/2024'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '12/01/2023',
        endDate: '12/05/2023'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '01/01/2024',
        endDate: '01/31/2024'
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
