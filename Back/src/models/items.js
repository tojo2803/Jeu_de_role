const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('items', {
    item_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("weapon","armor","consumable","key","treasure"),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    effects: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'items',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "items_pkey",
        unique: true,
        fields: [
          { name: "item_id" },
        ]
      },
    ]
  });
};
