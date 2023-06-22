
const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('./../db/models/index');

const sequelize = new Sequelize(
    {
        username: config.dbName,
        password: config.dbPassword,
        database: config.dbName,
        dialect: "mysql",
        port: config.dbPort,
        host: config.dbHost,
    }
);

sequelize.sync();
setupModels(sequelize);

module.exports = sequelize;


