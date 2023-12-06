'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.hasMany(models.Image, {
        foreignKey: 'imageableId',
        as:'ReviewImages',
        constraints: false,
        scope: {
          imageableType: 'Review'
        }
      });
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Review.belongsTo(models.Spot, {
        foreignKey:'spotId'
      })
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    spotId: DataTypes.INTEGER,
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
