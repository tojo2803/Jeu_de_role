const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('defeat_conditions', {
    condition_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    health_threshold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'defeat_conditions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "defeat_conditions_pkey",
        unique: true,
        fields: [
          { name: "condition_id" },
        ]
      },
    ]
  });
};
