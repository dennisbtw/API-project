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
      // define association here
      Spot.belongsTo(models.User,{
        foreignKey: 'ownerId',
        otherKey: 'id',
        as: "Owner"
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey:'spotId',
        otherKey: 'id',
        onDelete:'CASCADE',
        hooks:true
      });
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        otherKey: 'id',
        onDelete: 'CASCADE',
        hooks: true
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        otherKey: 'id',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    address: {
      type:DataTypes.STRING,
      allowNull:false
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false
    },
    country: {
      type:DataTypes.STRING,
      allowNull:false
    },
    lat: {
      type:DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        min: -90.0,
        max: 90.0
      }
    },
    lng: {
      type:DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        min: -180.0,
        max: 180.0
      }
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [0, 50]
      }
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:false
    },
    price: {
      type:DataTypes.DECIMAL,
      allowNull:false
    },
    createdAt: {
      type:DataTypes.DATE,
    },
    updatedAt: {
      type:DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};