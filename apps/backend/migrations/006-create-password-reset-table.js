'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('password_resets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      otp: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes - check if they exist first
    try {
      await queryInterface.addIndex('password_resets', ['email'], {
        name: 'idx_password_resets_email',
      });
    } catch (error) {
      console.log('Index idx_password_resets_email already exists, skipping...');
    }

    try {
      await queryInterface.addIndex('password_resets', ['expires_at'], {
        name: 'idx_password_resets_expires_at',
      });
    } catch (error) {
      console.log('Index idx_password_resets_expires_at already exists, skipping...');
    }

    try {
      await queryInterface.addIndex('password_resets', ['is_used'], {
        name: 'idx_password_resets_is_used',
      });
    } catch (error) {
      console.log('Index idx_password_resets_is_used already exists, skipping...');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('password_resets');
  },
};
