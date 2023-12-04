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
        as:'SpotImages',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        }
      });
        Spot.belongsTo(models.User, {
          foreignKey: 'ownerId', as:"Owner"
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
        }),
        Spot.hasMany(models.Review, {
          foreignKey: "spotId"
        })
    }
  }
  Spot.init({
    id:  {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
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
