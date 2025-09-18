"use strict"

const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const modelPath = process.cwd() + "/database/models/"
const basename = path.basename(__dirname + "/../models/index.js")
const env = process.env.DB_ENVIRONMENT || "development"
const config = require(__dirname + "/../config/index.js")[env]

const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

sequelize
  .authenticate()
  .then(() => {})
  .catch((err) => {
    console.log("Unable to connect to the database :", err)
  })

// TAMBAH MODEL DISINI UNTUK MEMPERMUDAH INTELISENSE
db.Enumeration = require("./enumeration.js")(sequelize, Sequelize)
db.EnumerationType = require("./enumeration_type.js")(sequelize, Sequelize)
db.Users = require("./users.js")(sequelize, Sequelize)
db.WsLog = require("./ws_log.js")(sequelize, Sequelize)
db.Certificate = require("./certificate.js")(sequelize, Sequelize)
db.Faculty = require("./faculty.js")(sequelize, Sequelize)
db.Lecturer = require("./lecturer.js")(sequelize, Sequelize)
db.Semester = require("./semester.js")(sequelize, Sequelize)
db.Student = require("./student.js")(sequelize, Sequelize)
db.StudyProgram = require("./study_program.js")(sequelize, Sequelize)
db.Subject = require("./subject.js")(sequelize, Sequelize)
db.UserPhoto = require("./user_photo.js")(sequelize, Sequelize)
db.UserNotification = require("./user_notification.js")(sequelize, Sequelize)
db.UserFiles = require("./user_files.js")(sequelize, Sequelize)
db.WebPmbContent = require("./web_pmb_content.js")(sequelize, Sequelize)
db.StudentInterview = require("./student_interview.js")(sequelize, Sequelize)
db.Loa = require("./loa.js")(sequelize, Sequelize)
db.Session = require("./session.js")(sequelize, Sequelize)
db.AcademicCalendar = require("./academic_calendar.js")(sequelize, Sequelize)
db.Room = require("./room.js")(sequelize, Sequelize)
db.Schedule = require("./schedule.js")(sequelize, Sequelize)

fs.readdirSync(modelPath)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  })
  .forEach((file) => {
    const model = require(__dirname + "/../models/" + file)(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
