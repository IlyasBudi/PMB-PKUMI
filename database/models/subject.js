"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Subject extends Model {
    static associate(models) {
      Subject.belongsTo(models.Semester, { foreignKey: "semesterId" })
      Subject.belongsTo(models.StudyProgram, { foreignKey: "studyProgramId" })
      Subject.hasMany(models.Schedule, { foreignKey: "id" })
    }
  }
  Subject.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      semesterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "semester_id",
        references: {
          model: "Semester",
          key: "id",
        },
      },
      studyProgramId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "study_program_id",
        references: {
          model: "StudyProgram",
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
      credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "credits",
      },
      subjectGroupCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "subject_group_code",
      },
      isMatrikulasi: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_matrikulasi",
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
      modelName: "Subject",
      tableName: "subject",
      timestamps: false,
    }
  )
  return Subject
}
