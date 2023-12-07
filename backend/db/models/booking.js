'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
many to many between users and spots through bookings
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey:'spotId'
      }),
      Booking.belongsTo(models.User, {
        foreignKey:'userId'
      })
    }
  }
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
