"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Enumeration extends Model {
    static associate(models) {
      Enumeration.belongsTo(models.EnumerationType, { foreignKey: "typeId" })
    }
  }
  Enumeration.init(
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
          model: "EnumerationType",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "name",
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "description",
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
        field: "code",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
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
      modelName: "Enumeration",
      tableName: "enumeration",
      timestamps: false,
    }
  )
  return Enumeration
}
