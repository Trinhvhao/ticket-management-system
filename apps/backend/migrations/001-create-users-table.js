'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table exists
    const tables = await queryInterface.showAllTables();
    if (tables.includes('users')) {
      console.log('Table "users" already exists, skipping creation...');
      return;
    }

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('employee', 'it_staff', 'admin'),
        allowNull: false,
        defaultValue: 'employee',
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      position: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes with error handling
    try {
      await queryInterface.addIndex('users', ['email'], { unique: true, name: 'users_email' });
    } catch (error) {
      console.log('Index users_email already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('users', ['role'], { name: 'users_role' });
    } catch (error) {
      console.log('Index users_role already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('users', ['status'], { name: 'users_status' });
    } catch (error) {
      console.log('Index users_status already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('users', ['department'], { name: 'users_department' });
    } catch (error) {
      console.log('Index users_department already exists, skipping...');
    }
    
    try {
      await queryInterface.addIndex('users', ['createdAt'], { name: 'users_created_at' });
    } catch (error) {
      console.log('Index users_created_at already exists, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};