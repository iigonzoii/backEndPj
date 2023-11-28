'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        }
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      }),
        Spot.belongsTo(models.User, {
          foreignKey: 'ownerId'
        }),
        Spot.belongsToMany(models.User, {
          through: models.Booking,
          foreignKey: 'spotId',
          otherKey: 'userId'
        }),
        Spot.belongsToMany(models.User, {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId'
        })
    }
  }
  Spot.init({
    id: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
