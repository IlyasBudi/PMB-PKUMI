"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class UserNotification extends Model {
    static associate(models) {
      UserNotification.belongsTo(models.Users, { foreignKey: "username" })
    }
  }
  UserNotification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "username",
        references: {
          model: "Users",
          key: "username",
        },
      },
      url: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: "url",
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "title",
      },
      detail: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: "detail",
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "is_read",
        defaultValue: false,
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
      modelName: "UserNotification",
      tableName: "user_notification",
      timestamps: false,
    }
  )
  return UserNotification
}
