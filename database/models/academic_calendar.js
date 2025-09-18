"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class AcademicCalendar extends Model {
    static associate(models) {
      AcademicCalendar.belongsTo(models.Session, { foreignKey: "sessionId" })
    }
  }
  AcademicCalendar.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "session_id",
        references: {
          model: "Session",
          key: "id",
        },
        comment: "id dari semester untuk menunjukan kegiatan ini ada di semester mana",
      },
      code: {
        type: DataTypes.STRING(4),
        allowNull: false,
        field: "code",
        comment: "kode kegiatan",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "name",
        comment: "nama kegiatan",
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        field: "description",
        comment: "deskripsi singkat dari kegiatan",
      },
      colorType: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "#FFFFFF",
        field: "color_type",
        comment: "kode warna dari tipe kegiatan",
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "start_time",
        comment: "waktu mulai kegiatan",
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "end_time",
        comment: "waktu selesai kegiatan",
      },
      isActiveClass: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_active_class",
        comment: "jadwal aktif perkuliahan, hanya boleh 1 dalam 1 semester",
      },
      isHoliday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_holiday",
        comment: "jika true maka ini adalah hari libur selain weekend",
      },
      isImportant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_important",
        comment: "jika true maka ini adalah hari penting",
      },
      isExam: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_exam",
        comment: "jika true maka ini adalah tanggal ujian",
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
      modelName: "AcademicCalendar",
      tableName: "academic_calendar",
      timestamps: false,
    }
  )
  return AcademicCalendar
}
