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
      // define association here
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        otherKey:'id'
      });
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        otherKey:'id'
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey:'reviewId',
        otherKey: 'id',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  Review.init({
    spotId: { 
      type:DataTypes.INTEGER,
      allowNull:false
    },
    userId: { 
      type:DataTypes.INTEGER,
      allowNull:false
    },
    review: {
      type:DataTypes.TEXT,
      allowNull:false
    },
    stars: { 
      type:DataTypes.INTEGER,
      allowNull:false
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};