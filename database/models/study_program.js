"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class StudyProgram extends Model {
    static associate(models) {
      StudyProgram.belongsTo(models.Faculty, { foreignKey: "facultyId" })
      StudyProgram.hasMany(models.Schedule, { foreignKey: "id" })
    }
  }
  StudyProgram.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      facultyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "faculty_id",
        references: {
          model: "Faculty",
          key: "id",
        },
      },
      code: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: "code",
      },
      name: {
        type: DataTypes.STRING(250),
        allowNull: false,
        field: "name",
      },
      desc: {
        type: DataTypes.STRING(250),
        allowNull: false,
        field: "desc",
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
      modelName: "StudyProgram",
      tableName: "study_program",
      timestamps: false,
    }
  )
  return StudyProgram
}
