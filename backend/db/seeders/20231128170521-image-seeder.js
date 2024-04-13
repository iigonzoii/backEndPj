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
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/waterb%26bsigns.jpg?alt=media&token=80528c43-db05-49c3-9eb4-ddd3c47c9180",
        preview: true
      },
      {
        imageableId: 1,
        imageableType: "Spot",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/isabellabeach.jpg?alt=media&token=5a90ffb1-2926-4b59-a4f5-3d35bc8ae21d",
        preview: false
      },
      {
        imageableId: 1,
        imageableType: "Spot",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/isabellabeach2jpg.jpg?alt=media&token=794926f8-3c85-42c8-94bc-fd6407fc6db7",
        preview: false
      },
      {
        imageableId: 1,
        imageableType: "Spot",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/elyunque.jpg?alt=media&token=411dd841-1af9-47f9-9fbe-9418d74e4653",
        preview: false
      },
      {
        imageableId: 1,
        imageableType: "Spot",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/flamencobeachtank.jpg?alt=media&token=65901f26-0e9f-4fc8-8fb4-583453fb8574",
        preview: false
      },
      {
        imageableId: 2,
        imageableType: "Spot",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/isabela4.jpg?alt=media&token=638da8c5-f367-495b-96c8-609024c56134",
        preview: true
      },
      {
        imageableId: 2,
        imageableType: "Review",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/isabela4.jpg?alt=media&token=638da8c5-f367-495b-96c8-609024c56134",
        preview: false
      },
      {
        imageableId: 3,
        imageableType: "Spot",
        url: "https://firebasestorage.googleapis.com/v0/b/airbandb-backend-mod4-pj.appspot.com/o/sanjuan21.jpg?alt=media&token=1085720c-9705-487d-b32c-171796402ab8",
        preview: true
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
