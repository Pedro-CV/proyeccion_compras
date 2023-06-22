const { Shopping, ShoppingSchema } = require('./shoppings.model');

function setupModels(sequelize) {
    Shopping.init(ShoppingSchema, Shopping.config(sequelize));
}

module.exports = setupModels;
