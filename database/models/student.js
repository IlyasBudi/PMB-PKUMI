"use strict"
const { Model } = require("sequelize")
const withDateNoTz = require("sequelize-date-no-tz-postgres")

module.exports = (sequelize, DataTypes) => {
  const Type = withDateNoTz(DataTypes)
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.Users, { foreignKey: "userId" })
      Student.belongsTo(models.Enumeration, { foreignKey: "lastEducation", as: "lastEdu" })
      Student.belongsTo(models.Enumeration, { foreignKey: "studyLevelId", as: "studyLevel" })
      Student.belongsTo(models.Enumeration, { foreignKey: "registrationStatus", targetKey: "code", as: "regStatus" })
      Student.belongsTo(models.StudyProgram, { foreignKey: "studyProgramId" })
      Student.belongsTo(models.Semester, { foreignKey: "onSemesterId" })
      Student.hasOne(models.Certificate)
    }
  }
  Student.init(
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
        allowNull: true,
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
      lastEducationMajor: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: "last_education_major",
      },
      homeUniversity: {
        type: DataTypes.STRING(250),
        allowNull: true,
        field: "home_university",
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
      nim: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: "nim",
      },
      gender: {
        type: DataTypes.ENUM,
        allowNull: true,
        field: "gender",
        values: ["Laki-laki", "Perempuan"],
      },
      registrationStatus: {
        type: DataTypes.STRING(8),
        allowNull: false,
        field: "registration_status",
        references: {
          model: "Enumeration",
          key: "code",
        },
      },
      registrationNotes: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "registration_notes",
      },
      doctorResearchProposal: {
        type: DataTypes.BLOB("medium"),
        allowNull: true,
        field: "doctor_research_proposal",
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: true,
        field: "status",
        values: ["Registrasi", "Belum Lulus", "Lulus", "Cuti", "Tidak Aktif"],
        defaultValue: "Registrasi",
      },
      graduateDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "graduate_date",
      },
      firstStudy: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "first_study",
      },
      studyLevelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "study_level_id",
        references: {
          model: "Enumeration",
          key: "id",
        },
      },
      facultyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "faculty_id",
        references: {
          model: "Faculty",
          key: "id",
        },
      },
      studyProgramId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "study_program_id",
        references: {
          model: "StudyProgram",
          key: "id",
        },
      },
      onSemesterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "on_semester_id",
        references: {
          model: "Semester",
          key: "id",
        },
      },
      fatherName: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "father_name",
      },
      motherName: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "mother_name",
      },
      fatherJob: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "father_job",
      },
      motherJob: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "mother_job",
      },
      parentAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "parent_address",
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
      modelName: "Student",
      tableName: "student",
      timestamps: false,
    }
  )
  return Student
}
