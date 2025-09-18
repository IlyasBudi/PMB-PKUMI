"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class WebPmbContent extends Model {
    static associate(models) {}
  }
  WebPmbContent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        allowNull: true,
        field: "type",
        values: ["Beranda", "Download", "FAQ", "Contact"],
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "title",
      },
      detail: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "detail",
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "position",
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
      modelName: "WebPmbContent",
      tableName: "web_pmb_content",
      timestamps: false,
    }
  )
  return WebPmbContent
}
