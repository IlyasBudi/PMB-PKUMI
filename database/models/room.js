"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Schedule, { foreignKey: "id" })
    }
  }
  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "name",
        comment: "nama ruangan",
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        field: "code",
        comment: "kode ruangan (unique), cth: PKU-001",
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "description",
        comment: "deskripsi singkat dari ruangan",
      },
      building: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "building",
        comment: "nama gedung dari ruangan",
      },
      floor: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "floor",
        comment: "nama atau nomor lantai dari ruangan",
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "capacity",
        comment: "jumlah kapasitas ruangan",
      },
      facility: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "facility",
        comment: "fasilitas yg tersedia berbentuk list, pisahkan dengan koma",
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
      modelName: "Room",
      tableName: "room",
      timestamps: false,
    }
  )
  return Room
}
