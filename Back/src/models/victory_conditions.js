const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('victory_conditions', {
    condition_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    required_attributes: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    required_items: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'victory_conditions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "victory_conditions_pkey",
        unique: true,
        fields: [
          { name: "condition_id" },
        ]
      },
    ]
  });
};
