const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('avatars', {
    avatar_id: {
      type: DataTypes.ENUM("warrior","mage","rogue","female_warrior","female_mage","female_rogue"),
      allowNull: false,
      primaryKey: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'avatars',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "avatars_pkey",
        unique: true,
        fields: [
          { name: "avatar_id" },
        ]
      },
    ]
  });
};
