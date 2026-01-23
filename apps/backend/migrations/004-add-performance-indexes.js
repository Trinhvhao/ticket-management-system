'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add indexes for frequently queried columns to improve performance
    
    // Index for ticket status queries (dashboard, filters)
    await queryInterface.addIndex('tickets', ['status'], {
      name: 'idx_tickets_status',
    });

    // Index for ticket priority queries
    await queryInterface.addIndex('tickets', ['priority'], {
      name: 'idx_tickets_priority',
    });

    // Index for assignee queries (staff workload, filters)
    await queryInterface.addIndex('tickets', ['assignee_id'], {
      name: 'idx_tickets_assignee_id',
    });

    // Index for submitter queries (user's tickets)
    await queryInterface.addIndex('tickets', ['submitter_id'], {
      name: 'idx_tickets_submitter_id',
    });

    // Index for category queries
    await queryInterface.addIndex('tickets', ['category_id'], {
      name: 'idx_tickets_category_id',
    });

    // Composite index for date range queries (trends, reports)
    await queryInterface.addIndex('tickets', ['created_at', 'status'], {
      name: 'idx_tickets_created_at_status',
    });

    // Index for resolved_at queries (SLA, trends)
    await queryInterface.addIndex('tickets', ['resolved_at'], {
      name: 'idx_tickets_resolved_at',
    });

    // Index for closed_at queries (trends)
    await queryInterface.addIndex('tickets', ['closed_at'], {
      name: 'idx_tickets_closed_at',
    });

    // Index for due_date queries (SLA filters)
    await queryInterface.addIndex('tickets', ['due_date'], {
      name: 'idx_tickets_due_date',
    });

    // Composite index for SLA breach queries
    await queryInterface.addIndex('tickets', ['due_date', 'resolved_at', 'status'], {
      name: 'idx_tickets_sla_breach',
    });

    console.log('✅ Performance indexes added successfully');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all indexes
    await queryInterface.removeIndex('tickets', 'idx_tickets_status');
    await queryInterface.removeIndex('tickets', 'idx_tickets_priority');
    await queryInterface.removeIndex('tickets', 'idx_tickets_assignee_id');
    await queryInterface.removeIndex('tickets', 'idx_tickets_submitter_id');
    await queryInterface.removeIndex('tickets', 'idx_tickets_category_id');
    await queryInterface.removeIndex('tickets', 'idx_tickets_created_at_status');
    await queryInterface.removeIndex('tickets', 'idx_tickets_resolved_at');
    await queryInterface.removeIndex('tickets', 'idx_tickets_closed_at');
    await queryInterface.removeIndex('tickets', 'idx_tickets_due_date');
    await queryInterface.removeIndex('tickets', 'idx_tickets_sla_breach');

    console.log('✅ Performance indexes removed');
  },
};
