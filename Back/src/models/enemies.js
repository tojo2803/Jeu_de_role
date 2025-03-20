const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('enemies', {
    enemy_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    attributes: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'enemies',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "enemies_pkey",
        unique: true,
        fields: [
          { name: "enemy_id" },
        ]
      },
    ]
  });
};
