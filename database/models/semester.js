"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Semester extends Model {
    static associate(models) {
      Semester.hasMany(models.Subject, { foreignKey: "id" })
      Semester.hasMany(models.Schedule, { foreignKey: "id" })
      Semester.hasMany(models.Student, { foreignKey: "id" })
    }
  }
  Semester.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "code",
      },
      name: {
        type: DataTypes.STRING(250),
        allowNull: true,
        field: "name",
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "value",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_delete",
      },
      createdDate: {
        type: Type.DATE_NO_TZ,
        allowNull: false,
        field: "created_date",
        defaultValue: DataTypes.NOW,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "created_by",
      },
      updatedDate: {
        type: Type.DATE_NO_TZ,
        allowNull: true,
        field: "updated_date",
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "updated_by",
      },
    },
    {
      sequelize,
      modelName: "Semester",
      tableName: "semester",
      timestamps: false,
    }
  )
  return Semester
}
