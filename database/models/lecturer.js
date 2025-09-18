"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Lecturer extends Model {
    static associate(models) {
      Lecturer.belongsTo(models.Users, { foreignKey: "userId" })
      Lecturer.belongsTo(models.Enumeration, { foreignKey: "lastEducation" })
    }
  }
  Lecturer.init(
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
      fullname: {
        type: DataTypes.STRING(250),
        allowNull: false,
        field: "fullname",
      },
      birthPlace: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "birth_place",
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "birth_date",
      },
      lastEducation: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "last_education",
        references: {
          model: "Enumeration",
          key: "id",
        },
      },
      nidn: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "nidn",
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "phone_number",
      },
      familyPhoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "family_phone_number",
      },
      gender: {
        type: DataTypes.ENUM,
        allowNull: true,
        field: "gender",
        values: ["Laki-laki", "Perempuan"],
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
      modelName: "Lecturer",
      tableName: "lecturer",
      timestamps: false,
    }
  )
  return Lecturer
}
