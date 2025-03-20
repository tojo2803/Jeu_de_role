const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('choices', {
    choice_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    event_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'events',
        key: 'event_id'
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    required_attributes: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    required_items: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    attribute_changes: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    items_gained: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    items_lost: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    next_event_type: {
      type: DataTypes.ENUM("combat","discovery","dialogue","merchant","boss"),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'choices',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "choices_pkey",
        unique: true,
        fields: [
          { name: "choice_id" },
        ]
      },
    ]
  });
};
