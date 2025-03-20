const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('character_classes', {
    class_id: {
      type: DataTypes.ENUM("warrior","mage","rogue"),
      allowNull: false,
      primaryKey: true
    },
    base_attributes: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    starting_items: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'character_classes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "character_classes_pkey",
        unique: true,
        fields: [
          { name: "class_id" },
        ]
      },
    ]
  });
};
