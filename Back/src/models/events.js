const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('events', {
    event_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("combat","discovery","dialogue","merchant","boss"),
      allowNull: false
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enemies: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'events',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "events_pkey",
        unique: true,
        fields: [
          { name: "event_id" },
        ]
      },
    ]
  });
};
