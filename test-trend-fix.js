const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

// Test credentials
const credentials = {
  email: 'admin@28h.com',
  password: 'password123',
};

async function testTrendFix() {
  console.log('🧪 Testing Trend Chart Time Issue\n');
  console.log('=' .repeat(60));

  try {
    // 1. Login
    console.log('\n1️⃣ Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, credentials);
    const token = loginRes.data.accessToken;
    console.log('✅ Login successful');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Test current date
    console.log('\n2️⃣ Testing date calculation...');
    const now = new Date();
    console.log(`Current date (client): ${now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    console.log(`Current time: ${now.toLocaleTimeString('vi-VN')}`);
    console.log(`Timezone offset: ${now.getTimezoneOffset() / 60} hours`);

    // 3. Test 7 days trend
    console.log('\n3️⃣ Fetching 7 days trend data...');
    const start = Date.now();
    const trend7 = await axios.get(`${API_URL}/reports/trends?period=day&limit=7`, { headers });
    const time = Date.now() - start;
    
    console.log(`✅ Response time: ${time}ms`);
    console.log(`📊 Data points: ${trend7.data.length}`);
    
    if (trend7.data.length > 0) {
      console.log('\n📅 Date Analysis:');
      console.log('='.repeat(60));
      
      trend7.data.forEach((item, index) => {
        const date = new Date(item.period);
        const dayOfWeek = date.getDay();
        const dayNames = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
        const dayName = dayNames[dayOfWeek];
        
        console.log(`\nDay ${index + 1}:`);
        console.log(`  Raw period: ${item.period}`);
        console.log(`  Parsed date: ${date.toLocaleDateString('vi-VN')}`);
        console.log(`  Day of week: ${dayName}`);
        console.log(`  Created: ${item.ticketsCreated}, Resolved: ${item.ticketsResolved}, Closed: ${item.ticketsClosed}`);
        
        // Check if it's today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const itemDate = new Date(date);
        itemDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.round((today - itemDate) / (1000 * 60 * 60 * 24));
        console.log(`  Days ago: ${daysDiff}`);
        
        if (daysDiff === 0) {
          console.log(`  ✅ This is TODAY`);
        } else if (daysDiff < 0) {
          console.log(`  ❌ ERROR: This is in the FUTURE!`);
        }
      });

      // Verify last data point should be today
      console.log('\n' + '='.repeat(60));
      console.log('🔍 VERIFICATION:');
      console.log('='.repeat(60));
      
      const lastItem = trend7.data[trend7.data.length - 1];
      const lastDate = new Date(lastItem.period);
      lastDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));
      
      console.log(`\nToday: ${today.toLocaleDateString('vi-VN')}`);
      console.log(`Last data point: ${lastDate.toLocaleDateString('vi-VN')}`);
      console.log(`Difference: ${daysDiff} days`);
      
      if (daysDiff === 0) {
        console.log('\n✅ CORRECT - Last data point is today');
      } else if (daysDiff === 1) {
        console.log('\n⚠️  Last data point is yesterday');
        console.log('💡 Possible timezone issue or backend date calculation bug');
      } else {
        console.log('\n❌ INCORRECT - Date calculation is wrong');
        console.log('💡 Backend date calculation needs to be fixed');
      }

      // Check first data point
      const firstItem = trend7.data[0];
      const firstDate = new Date(firstItem.period);
      firstDate.setHours(0, 0, 0, 0);
      const firstDaysDiff = Math.round((today - firstDate) / (1000 * 60 * 60 * 24));
      
      console.log(`\nFirst data point: ${firstDate.toLocaleDateString('vi-VN')}`);
      console.log(`Should be 6 days ago, actual: ${firstDaysDiff} days ago`);
      
      if (firstDaysDiff === 6) {
        console.log('✅ CORRECT - First data point is 6 days ago');
      } else {
        console.log(`❌ INCORRECT - Expected 6 days ago, got ${firstDaysDiff} days ago`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('💡 Hint: Make sure backend is running and credentials are correct');
    }
  }
}

testTrendFix();
