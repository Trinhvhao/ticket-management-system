const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'apps/backend/.env' });

async function checkDatabaseStructure() {
  // Use same config as backend
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');
    console.log('='.repeat(80));

    // 1. List all tables
    console.log('\n📋 ALL TABLES IN DATABASE:');
    console.log('='.repeat(80));
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    tables.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });

    // 2. Check business_hours table structure
    console.log('\n\n🕐 BUSINESS_HOURS TABLE STRUCTURE:');
    console.log('='.repeat(80));
    const [bhColumns] = await sequelize.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'business_hours'
      ORDER BY ordinal_position;
    `);

    if (bhColumns.length === 0) {
      console.log('❌ Table business_hours does NOT exist!');
    } else {
      console.log('✅ Table exists with columns:');
      bhColumns.forEach(col => {
        console.log(`   - ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable} | Default: ${col.column_default || 'none'}`);
      });

      // Check data
      const [bhData] = await sequelize.query('SELECT * FROM business_hours ORDER BY day_of_week');
      console.log(`\n   📊 Data: ${bhData.length} rows`);
      bhData.forEach(row => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        console.log(`      ${days[row.day_of_week]}: ${row.start_time} - ${row.end_time} (Working: ${row.is_working_day})`);
      });
    }

    // 3. Check holidays table structure
    console.log('\n\n🎉 HOLIDAYS TABLE STRUCTURE:');
    console.log('='.repeat(80));
    const [holidaysColumns] = await sequelize.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'holidays'
      ORDER BY ordinal_position;
    `);

    if (holidaysColumns.length === 0) {
      console.log('❌ Table holidays does NOT exist!');
    } else {
      console.log('✅ Table exists with columns:');
      holidaysColumns.forEach(col => {
        console.log(`   - ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable} | Default: ${col.column_default || 'none'}`);
      });

      // Check data
      const [holidaysData] = await sequelize.query('SELECT * FROM holidays ORDER BY date');
      console.log(`\n   📊 Data: ${holidaysData.length} rows`);
      holidaysData.forEach(row => {
        console.log(`      ${row.date} - ${row.name} (Recurring: ${row.is_recurring})`);
      });
    }

    // 4. Check tickets table for comparison
    console.log('\n\n🎫 TICKETS TABLE STRUCTURE (for comparison):');
    console.log('='.repeat(80));
    const [ticketsColumns] = await sequelize.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tickets'
      ORDER BY ordinal_position;
    `);

    if (ticketsColumns.length > 0) {
      console.log('✅ Sample columns:');
      ticketsColumns.slice(0, 10).forEach(col => {
        console.log(`   - ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable}`);
      });
      console.log(`   ... (${ticketsColumns.length} total columns)`);
    }

    // 5. Check all entities vs DB tables
    console.log('\n\n🔍 ENTITY vs DB COLUMN COMPARISON:');
    console.log('='.repeat(80));
    
    // Check User entity
    const [userColumns] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' ORDER BY ordinal_position;
    `);
    console.log(`\n✅ Users table: ${userColumns.map(c => c.column_name).join(', ')}`);

    // Check Category entity
    const [categoryColumns] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'categories' ORDER BY ordinal_position;
    `);
    console.log(`\n✅ Categories table: ${categoryColumns.map(c => c.column_name).join(', ')}`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ Database structure check completed!');
    console.log('='.repeat(80));

    // 6. Summary of issues
    console.log('\n\n📝 SUMMARY & RECOMMENDATIONS:');
    console.log('='.repeat(80));
    
    if (bhColumns.length === 0) {
      console.log('❌ ISSUE: business_hours table missing - run migration 005');
    } else {
      console.log('✅ business_hours table exists');
      const hasDescription = bhColumns.some(c => c.column_name === 'description');
      if (hasDescription) {
        console.log('   ⚠️  Has description column (not in entity)');
      }
    }

    if (holidaysColumns.length === 0) {
      console.log('❌ ISSUE: holidays table missing - run migration 005');
    } else {
      console.log('✅ holidays table exists');
      const hasDescription = holidaysColumns.some(c => c.column_name === 'description');
      if (hasDescription) {
        console.log('   ⚠️  Has description column (not in entity)');
      } else {
        console.log('   ✅ No description column (matches entity)');
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
  } finally {
    await sequelize.close();
  }
}

checkDatabaseStructure();
