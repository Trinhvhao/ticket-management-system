const { Client } = require('pg');
require('dotenv').config({ path: 'apps/backend/.env' });

async function checkDatabaseStructure() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // For Supabase with self-signed cert
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    console.log('='.repeat(80));

    // 1. List all tables
    console.log('\n📋 ALL TABLES IN DATABASE:');
    console.log('='.repeat(80));
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });

    // 2. Check business_hours table structure
    console.log('\n\n🕐 BUSINESS_HOURS TABLE STRUCTURE:');
    console.log('='.repeat(80));
    const bhColumns = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'business_hours'
      ORDER BY ordinal_position;
    `);

    if (bhColumns.rows.length === 0) {
      console.log('❌ Table business_hours does NOT exist!');
    } else {
      console.log('✅ Table exists with columns:');
      bhColumns.rows.forEach(col => {
        console.log(`   - ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable} | Default: ${col.column_default || 'none'}`);
      });

      // Check data
      const bhData = await client.query('SELECT * FROM business_hours ORDER BY day_of_week');
      console.log(`\n   📊 Data: ${bhData.rows.length} rows`);
      bhData.rows.forEach(row => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        console.log(`      ${days[row.day_of_week]}: ${row.start_time} - ${row.end_time} (Working: ${row.is_working_day})`);
      });
    }

    // 3. Check holidays table structure
    console.log('\n\n🎉 HOLIDAYS TABLE STRUCTURE:');
    console.log('='.repeat(80));
    const holidaysColumns = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'holidays'
      ORDER BY ordinal_position;
    `);

    if (holidaysColumns.rows.length === 0) {
      console.log('❌ Table holidays does NOT exist!');
    } else {
      console.log('✅ Table exists with columns:');
      holidaysColumns.rows.forEach(col => {
        console.log(`   - ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable} | Default: ${col.column_default || 'none'}`);
      });

      // Check data
      const holidaysData = await client.query('SELECT * FROM holidays ORDER BY date');
      console.log(`\n   📊 Data: ${holidaysData.rows.length} rows`);
      holidaysData.rows.forEach(row => {
        console.log(`      ${row.date} - ${row.name} (Recurring: ${row.is_recurring})`);
      });
    }

    // 4. Check tickets table for comparison
    console.log('\n\n🎫 TICKETS TABLE STRUCTURE (for comparison):');
    console.log('='.repeat(80));
    const ticketsColumns = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tickets'
      ORDER BY ordinal_position;
    `);

    if (ticketsColumns.rows.length > 0) {
      console.log('✅ Sample columns:');
      ticketsColumns.rows.slice(0, 10).forEach(col => {
        console.log(`   - ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable}`);
      });
      console.log(`   ... (${ticketsColumns.rows.length} total columns)`);
    }

    // 5. Check if Prisma is being used
    console.log('\n\n🔍 CHECKING FOR PRISMA:');
    console.log('='.repeat(80));
    const prismaTable = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = '_prisma_migrations';
    `);
    
    if (prismaTable.rows.length > 0) {
      console.log('✅ Prisma migrations table found!');
      const prismaMigrations = await client.query('SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5');
      console.log(`   Last ${prismaMigrations.rows.length} migrations:`);
      prismaMigrations.rows.forEach(m => {
        console.log(`   - ${m.migration_name} (${m.finished_at})`);
      });
    } else {
      console.log('❌ Prisma migrations table NOT found');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Database structure check completed!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

checkDatabaseStructure();
