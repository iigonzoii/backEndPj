'use strict';
const {Spot} = require ('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 fake street",
        city: 'fake city',
        state: 'fake state',
        country: 'fake country',
        lat: 37.7645358,
        lng: -122.4730327,
        name: "fake name",
        description: 'fake description',
        price: 5,
        previewImage: "image url"
      },
      {
        ownerId: 2,
        address: "1234 fake street",
        city: 'fake city',
        state: 'fake state',
        country: 'fake country',
        lat: 37.7645359,
        lng: -122.4730328,
        name: "fake name",
        description: 'fake description',
        price: 6,
        previewImage: "image url"
      },
      {
        ownerId: 3,
        address: "12345 fake street",
        city: 'fake city',
        state: 'fake state',
        country: 'fake country',
        lat: 37.7645360,
        lng: -122.4730329,
        name: "fake name",
        description: 'fake description',
        price: 7,
        previewImage: "image url"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options, {
        ownerId: { [Op.in]: [1,2,3] }
      }, {});
  }
};
