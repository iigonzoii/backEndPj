'use strict';

const { User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'userone',
        lastName: 'userone last',
        email: 'userone.lastone@gmail.com',
        password: 'password1'
      },
      {
        firstName: 'usertwo',
        lastName: 'usertwo last',
        email: 'usertwo.lasttwo@gmail.com',
        password: 'password2'
      },
      {
        firstName: 'userthree',
        lastName: 'userthree last',
        email: 'userthree.lastthree@gmail.com',
        password: 'password3'
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      {
        name: ['userone', 'usertwo', 'userthree'],
        lastName: ['userone last', 'usertwolast', 'userthree last'],
        email: ['userone.lastone@gmail.com','usertwo.lasttwo@gmail.com', 'userthree.lastthree@gmail.com'],
        password:['password1','password2','password3']
      },
      {}
    )
  }
};
