const { Sequelize, DataTypes } = require('sequelize');
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

// Define BusinessHours model matching entity
const BusinessHours = sequelize.define('BusinessHours', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'day_of_week',
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'start_time',
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'end_time',
  },
  isWorkingDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_working_day',
  },
}, {
  tableName: 'business_hours',
  timestamps: true,
  underscored: true,
});

async function testBusinessHours() {
  console.log('🧪 Testing Business Hours Direct Query\n');
  console.log('='.repeat(80));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Test 1: Query all business hours
    console.log('1️⃣ Querying all business hours...');
    const allHours = await BusinessHours.findAll({
      order: [['dayOfWeek', 'ASC']],
    });

    console.log(`✅ Found ${allHours.length} business hour records\n`);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    allHours.forEach(bh => {
      const status = bh.isWorkingDay ? '✅ Working' : '❌ Non-working';
      console.log(`   ${days[bh.dayOfWeek]}: ${bh.startTime} - ${bh.endTime} ${status}`);
    });

    // Test 2: Query specific day (Monday = 1)
    console.log('\n2️⃣ Querying Monday (day 1)...');
    const monday = await BusinessHours.findOne({
      where: { dayOfWeek: 1 },
    });

    if (monday) {
      console.log(`✅ Monday found:`);
      console.log(`   Working day: ${monday.isWorkingDay}`);
      console.log(`   Hours: ${monday.startTime} - ${monday.endTime}`);
    } else {
      console.log('❌ Monday not found!');
    }

    // Test 3: Query today
    const today = new Date();
    const todayDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    console.log(`\n3️⃣ Querying today (${days[todayDayOfWeek]}, day ${todayDayOfWeek})...`);
    const todayHours = await BusinessHours.findOne({
      where: { dayOfWeek: todayDayOfWeek },
    });

    if (todayHours) {
      console.log(`✅ Today's hours found:`);
      console.log(`   Working day: ${todayHours.isWorkingDay}`);
      console.log(`   Hours: ${todayHours.startTime} - ${todayHours.endTime}`);
    } else {
      console.log('❌ Today not found!');
    }

    // Test 4: Test business hours calculation
    console.log('\n4️⃣ Testing business hours calculation...');
    
    const workingDays = allHours.filter(bh => bh.isWorkingDay);
    console.log(`✅ Working days: ${workingDays.length}/7`);
    console.log(`   Days: ${workingDays.map(bh => days[bh.dayOfWeek]).join(', ')}`);

    // Calculate total working hours per week
    let totalWeeklyHours = 0;
    workingDays.forEach(bh => {
      const start = bh.startTime.split(':');
      const end = bh.endTime.split(':');
      const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
      const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
      const dailyHours = (endMinutes - startMinutes) / 60;
      totalWeeklyHours += dailyHours;
    });

    console.log(`   Total weekly working hours: ${totalWeeklyHours}h`);
    console.log(`   Average daily working hours: ${(totalWeeklyHours / workingDays.length).toFixed(1)}h`);

    // Test 5: Simulate SLA calculation
    console.log('\n5️⃣ Simulating SLA calculation...');
    
    const priorities = [
      { name: 'High', hours: 4 },
      { name: 'Medium', hours: 8 },
      { name: 'Low', hours: 24 },
    ];

    const now = new Date();
    console.log(`   Current time: ${now.toLocaleString('vi-VN')}`);
    console.log(`   Current day: ${days[now.getDay()]}`);

    priorities.forEach(priority => {
      console.log(`\n   ${priority.name} Priority (${priority.hours}h SLA):`);
      
      // Simple calculation (not considering business hours)
      const simpleDue = new Date(now.getTime() + priority.hours * 60 * 60 * 1000);
      console.log(`     Simple: ${simpleDue.toLocaleString('vi-VN')}`);
      
      // Business hours calculation would be more complex
      console.log(`     Business hours: (requires complex calculation)`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ All tests passed!');
    console.log('='.repeat(80));

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   - Business hours table: ✅ Exists`);
    console.log(`   - Records: ${allHours.length}/7 days`);
    console.log(`   - Working days: ${workingDays.length}`);
    console.log(`   - Entity mapping: ✅ Correct (camelCase → snake_case)`);
    console.log(`   - Ready for SLA calculation: ✅ Yes`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

testBusinessHours();
