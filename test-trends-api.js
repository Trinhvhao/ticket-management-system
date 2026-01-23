const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';

async function testTrendsAPI() {
  console.log('🧪 Testing Trends API...\n');

  try {
    // 1. Login first
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@28h.com',
      password: 'Admin@123',
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 50)}...\n`);

    // 2. Fetch trends data with period=day, limit=7
    console.log('2️⃣ Fetching trends data (period=day, limit=7)...');
    const trendsResponse = await axios.get(`${API_URL}/reports/trends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        period: 'day',
        limit: 7,
      },
    });

    console.log('\n📊 Trends API Response:');
    console.log('=====================================');
    console.log(JSON.stringify(trendsResponse.data, null, 2));
    console.log('=====================================\n');

    // 3. Display formatted data
    const trends = trendsResponse.data.data || trendsResponse.data;
    console.log('📈 Trend Data (Last 7 Days):');
    console.log('=====================================');
    trends.forEach((item, index) => {
      const date = new Date(item.period);
      const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric' });
      console.log(`${index + 1}. ${dayName} (${item.period})`);
      console.log(`   Created: ${item.ticketsCreated}`);
      console.log(`   Resolved: ${item.ticketsResolved}`);
      console.log(`   Closed: ${item.ticketsClosed}`);
      console.log(`   Avg Resolution: ${item.averageResolutionHours}h\n`);
    });

    console.log('✅ Trends API is working!\n');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testTrendsAPI();
