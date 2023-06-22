const { Model, DataTypes, Sequelize } = require("sequelize");
const SHOPPING_TABLE = "shoppings";

class Shopping extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: SHOPPING_TABLE,
      modelName: "Shopping",
      timestamps: true,
    };
  }
}

const ShoppingSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  invoiceNum: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "invoice_num",
  },
  productBarcode: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "product_barcode",
  },
  unit_price: {
    allowNull: false,
    type: DataTypes.FLOAT,
    field: "unit_price",
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: "quantity",
  },
  total: {
    allowNull: false,
    type: DataTypes.FLOAT,
    field: "total",
  },
};

module.exports = { Shopping, ShoppingSchema };
