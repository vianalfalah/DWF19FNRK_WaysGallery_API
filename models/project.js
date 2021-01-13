"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.Hired, {
        as: "projects",
        foreignKey: "hireID",
      });
      Project.hasMany(models.ProjectFiles, {
        as: "files",
        foreignKey: "projectID",
      });
    }
  }
  Project.init(
    {
      hireID: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
