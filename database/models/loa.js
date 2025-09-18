"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Loa extends Model {
    static associate(models) {
      Loa.belongsTo(models.Student, { foreignKey: "studentId" })
    }
  }
  Loa.init(
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
      certificateNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "certificate_number",
      },
      testNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "test_number",
      },
      yearPeriod: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "year_period",
      },
      semesterPeriod: {
        type: DataTypes.ENUM,
        allowNull: false,
        field: "semester_period",
        values: ["Ganjil", "Genap"],
      },
      academicStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "academic_start_date",
      },
      publishLocation: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "publish_location",
      },
      publishDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "publish_date",
      },
      signatoryName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "signatory_name",
      },
      signatoryPosition: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "signatory_position",
      },
      signatoryNidn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "signatory_nidn",
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
      modelName: "Loa",
      tableName: "loa",
      timestamps: false,
    }
  )
  return Loa
}
