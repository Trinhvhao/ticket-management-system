const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...\n');
    
    const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: 'admin@28h.com',
      password: 'password123',
    });

    console.log('✅ Login successful!\n');
    console.log('Full response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n\nResponse keys:', Object.keys(response.data));
    console.log('Has accessToken?', 'accessToken' in response.data);
    console.log('accessToken value:', response.data.accessToken);

  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
}

testLogin();
