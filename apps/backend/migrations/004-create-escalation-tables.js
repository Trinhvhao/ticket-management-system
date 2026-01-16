'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create escalation_rules table
    await queryInterface.createTable('escalation_rules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      priority: {
        type: Sequelize.ENUM('Low', 'Medium', 'High'),
        allowNull: true,
        comment: 'Apply to specific priority, null = all priorities',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Apply to specific category, null = all categories',
      },
      triggerType: {
        type: Sequelize.ENUM('sla_at_risk', 'sla_breached', 'no_response', 'no_assignment'),
        allowNull: false,
      },
      triggerHours: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Hours before trigger (for no_response/no_assignment)',
      },
      escalationLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Escalation level (1, 2, 3...)',
      },
      targetType: {
        type: Sequelize.ENUM('role', 'user', 'manager'),
        allowNull: false,
      },
      targetRole: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Target role (IT_Staff, Admin) if targetType = role',
      },
      targetUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Target user ID if targetType = user',
      },
      notifyManager: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Create escalation_history table
    await queryInterface.createTable('escalation_history', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ticketId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tickets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ruleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'escalation_rules',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      fromLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      toLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      escalatedBy: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'system or user_id',
      },
      escalatedToUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'User escalated to',
      },
      escalatedToRole: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Role escalated to',
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex('escalation_rules', ['isActive']);
    await queryInterface.addIndex('escalation_rules', ['priority']);
    await queryInterface.addIndex('escalation_rules', ['categoryId']);
    await queryInterface.addIndex('escalation_rules', ['triggerType']);
    
    await queryInterface.addIndex('escalation_history', ['ticketId']);
    await queryInterface.addIndex('escalation_history', ['ruleId']);
    await queryInterface.addIndex('escalation_history', ['createdAt']);

    // Seed default escalation rules
    await queryInterface.bulkInsert('escalation_rules', [
      {
        name: 'High Priority SLA Breach',
        description: 'Escalate high priority tickets when SLA is breached',
        priority: 'High',
        categoryId: null,
        triggerType: 'sla_breached',
        triggerHours: null,
        escalationLevel: 2,
        targetType: 'role',
        targetRole: 'Admin',
        targetUserId: null,
        notifyManager: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'High Priority At Risk',
        description: 'Escalate high priority tickets when SLA is at risk',
        priority: 'High',
        categoryId: null,
        triggerType: 'sla_at_risk',
        triggerHours: null,
        escalationLevel: 1,
        targetType: 'role',
        targetRole: 'IT_Staff',
        targetUserId: null,
        notifyManager: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'No Assignment After 2 Hours',
        description: 'Escalate tickets not assigned after 2 hours',
        priority: null,
        categoryId: null,
        triggerType: 'no_assignment',
        triggerHours: 2,
        escalationLevel: 1,
        targetType: 'role',
        targetRole: 'Admin',
        targetUserId: null,
        notifyManager: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'No Response After 4 Hours',
        description: 'Escalate assigned tickets with no response after 4 hours',
        priority: null,
        categoryId: null,
        triggerType: 'no_response',
        triggerHours: 4,
        escalationLevel: 1,
        targetType: 'role',
        targetRole: 'Admin',
        targetUserId: null,
        notifyManager: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('escalation_history');
    await queryInterface.dropTable('escalation_rules');
  },
};
