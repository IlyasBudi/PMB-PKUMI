"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("enumeration_type", [
      {
        name: "USERS",
        code: "U",
        is_active: true,
        created_date: new Date(),
        created_by: 1,
        updated_date: null,
        updated_by: null,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("enumeration_type", null, {})
  },
}
