"use strict"

const { encryptCrypto } = require("../../lib/crypto")

module.exports = {
  async up(queryInterface, Sequelize) {
    // Enkripsi password pakai util project
    const encryptedPassword = encryptCrypto("password", process.env.CRYPTO_SECRET_KEY)

    await queryInterface.bulkInsert("users", [
      {
        type_id: 2, // sesuai enumeration.id = 2 (Admin)
        username: "admin",
        email: "admin@gmail.com",
        password: encryptCrypto("password", process.env.CRYPTO_SECRET_KEY),
        is_active: true,
        is_delete: false,
        created_date: new Date(),
        created_by: 1,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "admin@example.com" }, {})
  },
}
