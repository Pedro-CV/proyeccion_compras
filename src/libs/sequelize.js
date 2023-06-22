
const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('./../db/models/index');

const sequelize = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
        host:config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            require: true,
            rejectUnauthorized: false
        }
    }
);

sequelize.sync();
setupModels(sequelize);

module.exports = sequelize;


