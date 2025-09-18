"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class UserFiles extends Model {
    static associate(models) {
      UserFiles.belongsTo(models.Users, { foreignKey: "userId", as: "fileUser" })
    }
  }
  UserFiles.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "Users",
          key: "id",
        },
      },
      ktpNumber: {
        type: DataTypes.STRING(17),
        allowNull: true,
        field: "ktp_number",
      },
      ktpFilename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "ktp_filename",
      },
      ktpFile: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "ktp_file",
      },
      cvFilename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "cv_filename",
      },
      cvFile: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "cv_file",
      },
      foreignLanguageCertificateFilename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "foreign_language_certificate_filename",
      },
      foreignLanguageCertificateFile: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "foreign_language_certificate_file",
      },
      otherFirstFilename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "other_first_filename",
      },
      otherFirstFile: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "other_first_file",
      },
      otherSecondFilename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "other_second_filename",
      },
      otherSecondFile: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "other_second_file",
      },
      otherThirdFilename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "other_third_filename",
      },
      otherThirdFile: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "other_third_file",
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
      modelName: "UserFiles",
      tableName: "user_files",
      timestamps: false,
    }
  )
  return UserFiles
}
