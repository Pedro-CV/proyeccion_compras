
const { Sequelize } = require('sequelize');
require('dotenv').config();
const { config } = require('../config/config');
const setupModels = require('./../db/models/index');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,        
        }
    }
 });

sequelize.sync();
setupModels(sequelize);

module.exports = sequelize;


