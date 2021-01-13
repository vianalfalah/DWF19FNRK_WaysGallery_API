"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectFiles.belongsTo(models.Project, {
        as: "files",
        foreignKey: "projectID",
      });
    }
  }
  ProjectFiles.init(
    {
      fileName: DataTypes.STRING,
      projectID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProjectFiles",
    }
  );
  return ProjectFiles;
};
