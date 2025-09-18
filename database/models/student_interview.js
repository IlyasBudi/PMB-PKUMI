"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class StudentInterview extends Model {
    static associate(models) {
      StudentInterview.belongsTo(models.Student, { foreignKey: "studentId" })
    }
  }
  StudentInterview.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "student_id",
        references: {
          model: "Student",
          key: "id",
        },
      },
      date: {
        type: Type.DATE_NO_TZ,
        allowNull: true,
        field: "date",
      },
      notesInterview: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "notes_interview",
      },
      notesResult: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "notes_result",
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
      modelName: "StudentInterview",
      tableName: "student_interview",
      timestamps: false,
    }
  )
  return StudentInterview
}
