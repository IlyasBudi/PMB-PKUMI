"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("enumeration", [
      {
        id: 1,
        type_id: 1, // FK ke enumeration_type.id (pastikan ada di tabel)
        name: "Mahasiswa",
        description: "User type Mahasiswa",
        code: "MHS",
        is_active: true,
        created_date: new Date(),
        created_by: 1,
      },
      {
        id: 2,
        type_id: 1,
        name: "Admin",
        description: "User type Admin",
        code: "ADM",
        is_active: true,
        created_date: new Date(),
        created_by: 1,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("enumeration", { code: ["MHS", "ADM"] }, {})
  },
}
