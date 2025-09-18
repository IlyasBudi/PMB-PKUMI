"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ws_log", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      log_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      request_json: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      response_json: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      time_submitted: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      time_response: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(14),
        allowNull: false,
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updated_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ws_log")
  },
}
