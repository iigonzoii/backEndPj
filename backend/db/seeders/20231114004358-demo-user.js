'use strict';
const { User } = require('../models');
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName:'namee',
        lastName: 'naaaame',
        email:'demo@user.io',
        username:'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
      firstName:'emaaan',
      lastName: 'emantsla',
      email: 'realemail@email.com',
      username: 'realUser',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      firstName:'emaaanaaa',
      lastName: 'emantslaaa',
      email: 'realemailll@email.com',
      username: 'realUser2',
      hashedPassword: bcrypt.hashSync('password2')
    }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete( options, {
      username: { [Op.in]: ['Demo-lition', 'realUser'] }
    }, {});
  }
};
