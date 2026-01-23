const http = require('http');

async function testDashboardAPI() {
  console.log('🧪 Testing Dashboard API...\n');

  // Step 1: Login
  console.log('1️⃣ Logging in...');
  const loginData = JSON.stringify({
    email: 'admin@28h.com',
    password: 'password123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  try {
    const loginResponse = await makeRequest(loginOptions, loginData);
    const loginResult = JSON.parse(loginResponse);
    
    if (!loginResult.success || !loginResult.data?.accessToken) {
      console.error('❌ Login failed:', loginResult);
      return;
    }

    const token = loginResult.data.accessToken;
    console.log('✅ Login successful');
    console.log('   Token:', token.substring(0, 50) + '...\n');

    // Step 2: Test Dashboard API
    console.log('2️⃣ Fetching dashboard data...');
    const dashboardOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/reports/dashboard',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const dashboardResponse = await makeRequest(dashboardOptions);
    const dashboardResult = JSON.parse(dashboardResponse);

    console.log('\n📊 Dashboard API Response:');
    console.log('=====================================');
    console.log(JSON.stringify(dashboardResult, null, 2));
    console.log('=====================================\n');

    // Validate response structure
    if (dashboardResult.success && dashboardResult.data) {
      const data = dashboardResult.data;
      console.log('✅ Dashboard API is working!');
      console.log('\n📈 Summary:');
      console.log(`   Total Tickets: ${data.totalTickets || 0}`);
      console.log(`   Open Tickets: ${data.openTickets || 0}`);
      console.log(`   Closed Today: ${data.closedToday || 0}`);
      console.log(`   Avg Resolution: ${data.avgResolutionTime || 0}h`);
      console.log(`   SLA Compliance: ${data.slaComplianceRate || 0}%`);
      
      if (data.ticketsByStatus) {
        console.log('\n📋 Tickets by Status:');
        console.log(`   New: ${data.ticketsByStatus.new || 0}`);
        console.log(`   Assigned: ${data.ticketsByStatus.assigned || 0}`);
        console.log(`   In Progress: ${data.ticketsByStatus.in_progress || 0}`);
        console.log(`   Resolved: ${data.ticketsByStatus.resolved || 0}`);
        console.log(`   Closed: ${data.ticketsByStatus.closed || 0}`);
      }

      if (data.ticketsByPriority) {
        console.log('\n🎯 Tickets by Priority:');
        console.log(`   High: ${data.ticketsByPriority.high || 0}`);
        console.log(`   Medium: ${data.ticketsByPriority.medium || 0}`);
        console.log(`   Low: ${data.ticketsByPriority.low || 0}`);
      }
    } else {
      console.error('❌ Dashboard API returned unexpected format');
      console.error('Response:', dashboardResult);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Run test
testDashboardAPI();
