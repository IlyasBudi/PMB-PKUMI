"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class WsLog extends Model {
    static associate(models) {}
  }
  WsLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      logName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "log_name",
      },
      requestJson: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "request_json",
      },
      responseJson: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "response_json",
      },
      timeSubmitted: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "time_submitted",
      },
      timeResponse: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "time_response",
      },
      status: {
        type: DataTypes.STRING(14),
        allowNull: false,
        field: "status",
      },
      createdDate: {
        type: DataTypes.DATE,
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
        type: DataTypes.DATE,
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
      modelName: "WsLog",
      tableName: "ws_log",
      timestamps: false,
    }
  )
  return WsLog
}
