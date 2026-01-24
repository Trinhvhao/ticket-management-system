const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';
const ADMIN_EMAIL = 'admin@28h.com';
const ADMIN_PASSWORD = 'password123';

async function testEscalation() {
  console.log('\n🔍 Testing Escalation Rules Endpoint\n');
  console.log('='.repeat(80));

  try {
    // Login
    console.log('\n1️⃣ Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    const loginData = loginRes.data.data || loginRes.data;
    const token = loginData.accessToken;
    console.log('✅ Login successful');

    const headers = { Authorization: `Bearer ${token}` };

    // Test escalation rules
    console.log('\n2️⃣ Testing GET /escalation/rules...');
    try {
      const response = await axios.get(`${API_URL}/escalation/rules`, { headers });
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Failed with status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message);
      console.log('Full error:', JSON.stringify(error.response?.data, null, 2));
      
      if (error.response?.data?.stack) {
        console.log('\nStack trace:');
        console.log(error.response.data.stack);
      }
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('Error:', error.message);
  }
}

testEscalation();
