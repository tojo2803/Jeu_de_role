'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Player.init({
    player_name: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    niveau: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    vie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    force: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    defence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    agilite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    }
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};