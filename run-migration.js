const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './apps/backend/.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

async function runMigration() {
  console.log('🔧 Running Business Hours Migration\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Check if tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('business_hours', 'holidays')
    `);

    console.log('📋 Existing tables:', tables.map(t => t.table_name).join(', ') || 'none');

    if (tables.some(t => t.table_name === 'business_hours')) {
      console.log('\n⚠️  business_hours table already exists!');
      console.log('Checking data...\n');

      const [rows] = await sequelize.query('SELECT COUNT(*) as count FROM business_hours');
      console.log(`Found ${rows[0].count} business hours records`);

      if (rows[0].count === 0) {
        console.log('\n📝 Inserting default business hours...');
        await insertDefaultBusinessHours(sequelize);
      }
    } else {
      console.log('\n📝 Creating business_hours table...');
      await createBusinessHoursTable(sequelize);
    }

    if (tables.some(t => t.table_name === 'holidays')) {
      console.log('\n⚠️  holidays table already exists!');
      const [rows] = await sequelize.query('SELECT COUNT(*) as count FROM holidays');
      console.log(`Found ${rows[0].count} holiday records`);

      if (rows[0].count === 0) {
        console.log('\n📝 Inserting default holidays...');
        await insertDefaultHolidays(sequelize);
      }
    } else {
      console.log('\n📝 Creating holidays table...');
      await createHolidaysTable(sequelize);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Migration completed successfully!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

async function createBusinessHoursTable(sequelize) {
  await sequelize.query(`
    CREATE TABLE business_hours (
      id SERIAL PRIMARY KEY,
      day_of_week INTEGER NOT NULL,
      is_working_day BOOLEAN NOT NULL DEFAULT true,
      start_time TIME NOT NULL DEFAULT '08:00:00',
      end_time TIME NOT NULL DEFAULT '17:00:00',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT business_hours_day_of_week_unique UNIQUE (day_of_week)
    );
  `);

  console.log('✅ business_hours table created');
  await insertDefaultBusinessHours(sequelize);
}

async function createHolidaysTable(sequelize) {
  await sequelize.query(`
    CREATE TABLE holidays (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      is_recurring BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_holidays_date ON holidays(date);
  `);

  console.log('✅ holidays table created');
  await insertDefaultHolidays(sequelize);
}

async function insertDefaultBusinessHours(sequelize) {
  await sequelize.query(`
    INSERT INTO business_hours (day_of_week, is_working_day, start_time, end_time, created_at, updated_at)
    VALUES
      (0, false, '08:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (1, true, '08:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, true, '08:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, true, '08:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, true, '08:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, true, '08:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (6, false, '08:00:00', '17:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (day_of_week) DO NOTHING;
  `);

  console.log('✅ Default business hours inserted (Mon-Fri, 8AM-5PM)');
}

async function insertDefaultHolidays(sequelize) {
  await sequelize.query(`
    INSERT INTO holidays (name, date, is_recurring, created_at, updated_at)
    VALUES
      ('Tết Dương lịch', '2026-01-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Tết Nguyên Đán (Mùng 1)', '2026-01-29', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Tết Nguyên Đán (Mùng 2)', '2026-01-30', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Tết Nguyên Đán (Mùng 3)', '2026-01-31', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Giỗ Tổ Hùng Vương', '2026-04-02', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Ngày Giải phóng miền Nam', '2026-04-30', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Ngày Quốc tế Lao động', '2026-05-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Ngày Quốc khánh', '2026-09-02', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `);

  console.log('✅ Default holidays inserted (Vietnam holidays 2026)');
}

runMigration();
