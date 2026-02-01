'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menus', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'menus',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('menus');
  },
};
