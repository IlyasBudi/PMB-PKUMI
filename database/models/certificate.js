"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Certificate extends Model {
    static associate(models) {
      Certificate.belongsTo(models.Student, { foreignKey: "studentId" })
    }
  }
  Certificate.init(
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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "name",
      },
      number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "number",
      },
      file: {
        type: DataTypes.BLOB("medium"),
        allowNull: false,
        field: "file",
      },
      transriptsFilename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "transcripts_filename",
      },
      transriptsFile: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "transcripts_file",
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
      modelName: "Certificate",
      tableName: "certificate",
      timestamps: false,
    }
  )
  return Certificate
}
