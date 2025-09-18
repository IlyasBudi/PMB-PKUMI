"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Semester, { foreignKey: "semesterId" })
      Schedule.belongsTo(models.StudyProgram, { foreignKey: "studyProgramId" })
      Schedule.belongsTo(models.Subject, { foreignKey: "subjectId" })
      Schedule.belongsTo(models.Room, { foreignKey: "roomId" })
      Schedule.belongsTo(models.AcademicCalendar, { foreignKey: "calendarId" })
    }
  }
  Schedule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      semesterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "semester_id",
        references: {
          model: "Semester",
          key: "id",
        },
        comment: "semester pada jadwal ini",
      },
      studyProgramId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "study_program_id",
        references: {
          model: "StudyProgram",
          key: "id",
        },
        comment: "jurusan pada jadwal ini",
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "subject_id",
        references: {
          model: "Subject",
          key: "id",
        },
        comment: "mata kuliah pada jadwal ini",
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "room_id",
        references: {
          model: "Room",
          key: "id",
        },
        comment: "ruangan untuk kegiatan ini",
      },
      calendarId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "calendar_id",
        references: {
          model: "AcademicCalendar",
          key: "id",
        },
        comment: "acuan ke kalender akademik",
      },
      listLecturer: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "list_lecturer",
        comment: "list dosen pengampu untuk jadwal ini, berupa id dengan separator koma",
        get() {
          const rawValue = this.getDataValue("listLecturer")
          return rawValue ? rawValue.split(",").map((v) => parseInt(v.trim())) : null
        },
        set(value) {
          this.setDataValue("listLecturer", value.join(","))
        },
      },
      day: {
        type: DataTypes.ENUM,
        allowNull: false,
        field: "day",
        values: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
        comment: "hari berlangsungnya jadwal ini",
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "start_time",
        comment: "waktu mulai kegiatan",
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "end_time",
        comment: "waktu berakhir kegiatan",
      },
      totalMeeting: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "total_meeting",
        comment: "jumlah pertemuan jadwal ini",
      },
      isRest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "is_rest",
        comment: "apakah jadwal ini adalah waktu istirahat",
        get() {
          return Boolean(this.getDataValue("isRest"))
        },
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
      modelName: "Schedule",
      tableName: "schedule",
      timestamps: false,
    }
  )
  return Schedule
}
