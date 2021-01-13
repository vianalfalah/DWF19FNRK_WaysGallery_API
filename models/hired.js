"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hired extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Hired.hasOne(models.Project, {
        as: "projects",
        foreignKey: "hireID",
      });
      Hired.belongsTo(models.User, {
        as: "client",
        foreignKey: "orderBy",
      });
      Hired.belongsTo(models.User, {
        as: "vendor",
        foreignKey: "orderTo",
      });
    }
  }
  Hired.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      price: DataTypes.INTEGER,
      orderBy: DataTypes.INTEGER,
      orderTo: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Hired",
    }
  );
  return Hired;
};
