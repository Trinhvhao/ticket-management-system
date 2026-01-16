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
        comment: '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday',
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      is_working_day: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
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
        defaultValue: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Insert default business hours (Monday-Friday, 8:00-17:30)
    const now = new Date();
    const businessHours = [];
    
    // Monday to Friday
    for (let day = 1; day <= 5; day++) {
      businessHours.push({
        day_of_week: day,
        start_time: '08:00:00',
        end_time: '17:30:00',
        is_working_day: true,
        created_at: now,
        updated_at: now,
      });
    }
    
    // Saturday and Sunday (non-working days)
    businessHours.push({
      day_of_week: 0, // Sunday
      start_time: '00:00:00',
      end_time: '00:00:00',
      is_working_day: false,
      created_at: now,
      updated_at: now,
    });
    businessHours.push({
      day_of_week: 6, // Saturday
      start_time: '00:00:00',
      end_time: '00:00:00',
      is_working_day: false,
      created_at: now,
      updated_at: now,
    });

    await queryInterface.bulkInsert('business_hours', businessHours);

    // Insert Vietnam public holidays 2026
    const holidays = [
      { name: 'Tết Dương lịch', date: '2026-01-01', is_recurring: true, description: 'Năm mới dương lịch' },
      { name: 'Tết Nguyên Đán', date: '2026-02-17', is_recurring: false, description: 'Tết Âm lịch 2026' },
      { name: 'Tết Nguyên Đán', date: '2026-02-18', is_recurring: false, description: 'Tết Âm lịch 2026' },
      { name: 'Tết Nguyên Đán', date: '2026-02-19', is_recurring: false, description: 'Tết Âm lịch 2026' },
      { name: 'Tết Nguyên Đán', date: '2026-02-20', is_recurring: false, description: 'Tết Âm lịch 2026' },
      { name: 'Giỗ Tổ Hùng Vương', date: '2026-04-02', is_recurring: false, description: '10/3 Âm lịch' },
      { name: 'Giải phóng miền Nam', date: '2026-04-30', is_recurring: true, description: '30/4' },
      { name: 'Quốc tế Lao động', date: '2026-05-01', is_recurring: true, description: '1/5' },
      { name: 'Quốc khánh', date: '2026-09-02', is_recurring: true, description: '2/9' },
    ].map(h => ({
      ...h,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('holidays', holidays);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('holidays');
    await queryInterface.dropTable('business_hours');
  },
};
