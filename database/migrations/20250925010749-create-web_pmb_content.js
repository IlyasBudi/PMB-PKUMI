"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("web_pmb_content", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("Beranda", "Download", "FAQ", "Contact"),
        allowNull: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      detail: {
        type: Sequelize.BLOB("medium"),
        allowNull: true,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
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
    // Hapus ENUM dulu supaya tidak error saat rollback
    await queryInterface.dropTable("web_pmb_content")
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_web_pmb_content_type";')
  },
}
