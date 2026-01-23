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
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

async function checkIndexes() {
  console.log('🔍 Checking Database Indexes\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Get all indexes on tickets table
    const [indexes] = await sequelize.query(`
      SELECT
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'tickets'
      ORDER BY indexname;
    `);

    console.log('📊 Current Indexes on "tickets" table:\n');
    
    const requiredIndexes = [
      'idx_tickets_status',
      'idx_tickets_priority',
      'idx_tickets_assignee_id',
      'idx_tickets_submitter_id',
      'idx_tickets_category_id',
      'idx_tickets_created_at_status',
      'idx_tickets_resolved_at',
      'idx_tickets_closed_at',
      'idx_tickets_due_date',
      'idx_tickets_sla_breach',
    ];

    const existingIndexNames = indexes.map(idx => idx.indexname);
    
    indexes.forEach((idx, i) => {
      console.log(`${i + 1}. ${idx.indexname}`);
      console.log(`   ${idx.indexdef}\n`);
    });

    console.log('='.repeat(80));
    console.log('📋 Index Status Check:\n');

    requiredIndexes.forEach(indexName => {
      const exists = existingIndexNames.includes(indexName);
      const status = exists ? '✅' : '❌';
      console.log(`${status} ${indexName}`);
    });

    const missingIndexes = requiredIndexes.filter(idx => !existingIndexNames.includes(idx));
    
    if (missingIndexes.length > 0) {
      console.log('\n⚠️  Missing Indexes:');
      missingIndexes.forEach(idx => console.log(`   - ${idx}`));
      console.log('\n💡 Run migration to add missing indexes:');
      console.log('   cd apps/backend');
      console.log('   npx sequelize-cli db:migrate');
    } else {
      console.log('\n✅ All required indexes are present!');
    }

    // Test query performance
    console.log('\n' + '='.repeat(80));
    console.log('⚡ Testing Query Performance\n');

    // Test 1: Count tickets by date range
    const start1 = Date.now();
    const [result1] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM tickets
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    const time1 = Date.now() - start1;
    console.log(`1. Count tickets (7 days): ${time1}ms - ${result1[0].count} tickets`);

    // Test 2: Group by date
    const start2 = Date.now();
    const [result2] = await sequelize.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM tickets
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    const time2 = Date.now() - start2;
    console.log(`2. Group by date (7 days): ${time2}ms - ${result2.length} days`);

    // Test 3: Complex query with joins
    const start3 = Date.now();
    const [result3] = await sequelize.query(`
      SELECT 
        t.status,
        COUNT(*) as count
      FROM tickets t
      WHERE t.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY t.status
    `);
    const time3 = Date.now() - start3;
    console.log(`3. Status breakdown (30 days): ${time3}ms - ${result3.length} statuses`);

    // Test 4: SLA query
    const start4 = Date.now();
    const [result4] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM tickets
      WHERE due_date IS NOT NULL
        AND resolved_at IS NOT NULL
        AND resolved_at > due_date
    `);
    const time4 = Date.now() - start4;
    console.log(`4. SLA breached count: ${time4}ms - ${result4[0].count} tickets`);

    const avgTime = (time1 + time2 + time3 + time4) / 4;
    console.log(`\n📊 Average query time: ${Math.round(avgTime)}ms`);

    if (avgTime < 50) {
      console.log('✅ EXCELLENT - Queries are very fast!');
    } else if (avgTime < 100) {
      console.log('✅ GOOD - Acceptable performance');
    } else if (avgTime < 200) {
      console.log('⚠️  FAIR - Could benefit from indexes');
    } else {
      console.log('❌ SLOW - Indexes needed!');
    }

    // Check timezone
    console.log('\n' + '='.repeat(80));
    console.log('🌍 Timezone Check\n');

    const [tzResult] = await sequelize.query(`
      SELECT 
        NOW() as server_time,
        CURRENT_TIMESTAMP as current_timestamp,
        EXTRACT(TIMEZONE FROM NOW()) / 3600 as timezone_offset_hours
    `);
    
    console.log('Server time:', tzResult[0].server_time);
    console.log('Timezone offset:', tzResult[0].timezone_offset_hours, 'hours');

    // Check sample ticket dates
    const [sampleTickets] = await sequelize.query(`
      SELECT 
        ticket_number,
        created_at,
        DATE(created_at) as created_date,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as formatted_date
      FROM tickets
      ORDER BY created_at DESC
      LIMIT 5
    `);

    console.log('\n📅 Sample ticket dates:');
    sampleTickets.forEach(ticket => {
      console.log(`   ${ticket.ticket_number}: ${ticket.formatted_date} (${ticket.created_date})`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ Database check completed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkIndexes();
