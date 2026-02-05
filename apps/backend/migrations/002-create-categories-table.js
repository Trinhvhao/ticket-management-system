'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Kiểm tra xem bảng đã tồn tại chưa
    const tables = await queryInterface.showAllTables();
    if (tables.includes('categories')) {
      console.log('Bảng "categories" đã tồn tại, bỏ qua...');
      return;
    }

    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes với error handling
    try {
      await queryInterface.addIndex('categories', ['name'], { unique: true, name: 'categories_name' });
    } catch (error) {
      console.log('Index categories_name đã tồn tại, bỏ qua...');
    }
    
    try {
      await queryInterface.addIndex('categories', ['is_active'], { name: 'categories_is_active' });
    } catch (error) {
      console.log('Index categories_is_active đã tồn tại, bỏ qua...');
    }
    
    try {
      await queryInterface.addIndex('categories', ['display_order'], { name: 'categories_display_order' });
    } catch (error) {
      console.log('Index categories_display_order đã tồn tại, bỏ qua...');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  },
};