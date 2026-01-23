'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create business_hours table
    await queryInterface.createTable('business_hours', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '0=Sunday, 1=Monday, ..., 6=Saturday',
      },
      is_working_day: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '08:00:00',
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '17:00:00',
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

    // Add unique constraint
    await queryInterface.addConstraint('business_hours', {
      fields: ['day_of_week'],
      type: 'unique',
      name: 'business_hours_day_of_week_unique',
    });

    // Create holidays table
    await queryInterface.createTable('holidays', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      is_recurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'If true, holiday repeats every year',
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

    // Add index on date
    await queryInterface.addIndex('holidays', ['date'], {
      name: 'idx_holidays_date',
    });

    // Insert default business hours (Monday-Friday, 8AM-5PM)
    await queryInterface.bulkInsert('business_hours', [
      {
        day_of_week: 0, // Sunday
        is_working_day: false,
        start_time: '08:00:00',
        end_time: '17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        day_of_week: 1, // Monday
        is_working_day: true,
        start_time: '08:00:00',
        end_time: '17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        day_of_week: 2, // Tuesday
        is_working_day: true,
        start_time: '08:00:00',
        end_time: '17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        day_of_week: 3, // Wednesday
        is_working_day: true,
        start_time: '08:00:00',
        end_time: '17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        day_of_week: 4, // Thursday
        is_working_day: true,
        start_time: '08:00:00',
        end_time: '17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        day_of_week: 5, // Friday
        is_working_day: true,
        start_time: '08:00:00',
        end_time: '17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        day_of_week: 6, // Saturday
        is_working_day: false,
        start_time: '08:00:00',
        end_time: '17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Insert some default holidays for Vietnam
    await queryInterface.bulkInsert('holidays', [
      {
        name: 'Tết Dương lịch',
        date: '2026-01-01',
        is_recurring: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tết Nguyên Đán (Mùng 1)',
        date: '2026-01-29',
        is_recurring: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tết Nguyên Đán (Mùng 2)',
        date: '2026-01-30',
        is_recurring: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tết Nguyên Đán (Mùng 3)',
        date: '2026-01-31',
        is_recurring: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Giỗ Tổ Hùng Vương',
        date: '2026-04-02',
        is_recurring: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ngày Giải phóng miền Nam',
        date: '2026-04-30',
        is_recurring: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ngày Quốc tế Lao động',
        date: '2026-05-01',
        is_recurring: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ngày Quốc khánh',
        date: '2026-09-02',
        is_recurring: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    console.log('✅ Business hours and holidays tables created with default data');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('holidays');
    await queryInterface.dropTable('business_hours');
    console.log('✅ Business hours and holidays tables dropped');
  },
};
