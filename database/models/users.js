"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Enumeration, { foreignKey: "typeId" })
      Users.hasMany(models.UserFiles)
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "type_id",
        references: {
          model: "Enumeration",
          key: "id",
        },
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "username",
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "email",
      },
      password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        field: "password",
      },
      verificationCode: {
        type: DataTypes.STRING(6),
        allowNull: true,
        field: "verification_code",
        defaultValue: null,
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
      modelName: "Users",
      tableName: "users",
      timestamps: false,
    }
  )
  return Users
}
