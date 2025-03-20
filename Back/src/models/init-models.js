var DataTypes = require("sequelize").DataTypes;
var _avatars = require("./avatars");
var _character_classes = require("./character_classes");
var _choices = require("./choices");
var _defeat_conditions = require("./defeat_conditions");
var _enemies = require("./enemies");
var _events = require("./events");
var _items = require("./items");
var _victory_conditions = require("./victory_conditions");

function initModels(sequelize) {
  var avatars = _avatars(sequelize, DataTypes);
  var character_classes = _character_classes(sequelize, DataTypes);
  var choices = _choices(sequelize, DataTypes);
  var defeat_conditions = _defeat_conditions(sequelize, DataTypes);
  var enemies = _enemies(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var items = _items(sequelize, DataTypes);
  var victory_conditions = _victory_conditions(sequelize, DataTypes);

  choices.belongsTo(events, { as: "event", foreignKey: "event_id"});
  events.hasMany(choices, { as: "choices", foreignKey: "event_id"});

  return {
    avatars,
    character_classes,
    choices,
    defeat_conditions,
    enemies,
    events,
    items,
    victory_conditions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
