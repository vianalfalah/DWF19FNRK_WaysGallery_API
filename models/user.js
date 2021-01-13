"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        as: "posts",
        foreignKey: "userID",
      });
      User.hasMany(models.Art, {
        as: "arts",
        foreignKey: "userID",
      });
      User.hasOne(models.Profile, {
        as: "profile",
        foreignKey: "userID",
      });
      User.hasMany(models.Hired, {
        as: "orders",
        foreignKey: "orderTo",
      });
      User.hasMany(models.Hired, {
        as: "offers",
        foreignKey: "orderBy",
      });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
