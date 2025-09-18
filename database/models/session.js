"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Session extends Model {
    static associate(models) {
      Session.hasMany(models.AcademicCalendar, { foreignKey: "id" })
    }
  }
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.ENUM,
        allowNull: false,
        field: "name",
        values: ["Ganjil", "Genap"],
      },
      academicYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "academic_year",
        comment: "cth: 2023/2024",
      },
      code: {
        type: DataTypes.STRING(8),
        allowNull: false,
        field: "code",
        comment: "cth: GNP-2324",
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
      modelName: "Session",
      tableName: "session",
      timestamps: false,
    }
  )
  return Session
}
