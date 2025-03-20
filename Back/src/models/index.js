const { Sequelize } = require("sequelize");
const config = require("../config/database"); // Chemin vers la configuration DB

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: "postgres",
  logging: (msg) => console.log(msg), 
});

// Import des modèles
const initModels = require("./init-models");
const models = initModels(sequelize);

module.exports = { sequelize, ...models };
