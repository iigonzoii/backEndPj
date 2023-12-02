'use strict';
const { Image } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Image.bulkCreate([
      {
        imageableId: 1,
        imageableType: "Spot",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/mostCurrentSchema.png?alt=media&token=e449391a-2c4a-48dc-82e9-bfa5de03f047",
        preview: true
      },
      {
        imageableId: 2,
        imageableType: "Review",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/mostCurrentSchema.png?alt=media&token=e449391a-2c4a-48dc-82e9-bfa5de03f047",
        preview: true
      },
      {
        imageableId: 3,
        imageableType: "Review",
        url: "url",
        preview: false
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete( options, {
      imageableId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
