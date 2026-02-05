'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Kiểm tra xem bảng đã tồn tại chưa
    const tables = await queryInterface.showAllTables();
    if (tables.includes('password_resets')) {
      console.log('Bảng "password_resets" đã tồn tại, bỏ qua...');
      return;
    }

    // Tạo bảng password_resets
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

    console.log('Đã tạo bảng "password_resets" thành công!');

    // Thêm indexes
    try {
      await queryInterface.addIndex('password_resets', ['email'], {
        name: 'idx_password_resets_email',
      });
      console.log('Đã tạo index idx_password_resets_email');
    } catch (error) {
      console.log('Index idx_password_resets_email đã tồn tại, bỏ qua...');
    }

    try {
      await queryInterface.addIndex('password_resets', ['expires_at'], {
        name: 'idx_password_resets_expires_at',
      });
      console.log('Đã tạo index idx_password_resets_expires_at');
    } catch (error) {
      console.log('Index idx_password_resets_expires_at đã tồn tại, bỏ qua...');
    }

    try {
      await queryInterface.addIndex('password_resets', ['is_used'], {
        name: 'idx_password_resets_is_used',
      });
      console.log('Đã tạo index idx_password_resets_is_used');
    } catch (error) {
      console.log('Index idx_password_resets_is_used đã tồn tại, bỏ qua...');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('password_resets');
  },
};
