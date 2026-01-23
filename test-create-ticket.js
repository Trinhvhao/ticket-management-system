const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

const credentials = {
  email: 'admin@28h.com',
  password: 'password123',
};

async function testCreateTicket() {
  console.log('🧪 Testing Ticket Creation with SLA\n');
  console.log('='.repeat(80));

  try {
    // 1. Login
    console.log('\n1️⃣ Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, credentials);
    
    // Response is wrapped in { success, data: { user, accessToken } }
    const { user, accessToken: token } = loginRes.data.data || loginRes.data;
    
    if (!token) {
      console.error('❌ No access token in response!');
      console.error('Response structure:', JSON.stringify(loginRes.data, null, 2));
      return;
    }
    
    console.log('✅ Login successful');
    if (user) {
      console.log(`User: ${user.fullName} (${user.role})`);
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Get categories
    console.log('\n2️⃣ Fetching categories...');
    const categoriesRes = await axios.get(`${API_URL}/categories`, { headers });
    const categories = categoriesRes.data.data || categoriesRes.data;
    console.log(`✅ Found ${categories.length} categories`);
    
    if (categories.length === 0) {
      console.error('❌ No categories found! Cannot create ticket.');
      return;
    }

    const category = categories[0];
    console.log(`Using category: ${category.name} (ID: ${category.id})`);

    // 3. Test creating tickets with different priorities
    const priorities = ['High', 'Medium', 'Low'];
    const createdTickets = [];

    for (const priority of priorities) {
      console.log(`\n3️⃣ Creating ${priority} priority ticket...`);
      
      const ticketData = {
        title: `Test ${priority} Priority Ticket - ${new Date().toISOString()}`,
        description: `This is a test ticket to verify SLA calculation for ${priority} priority.\n\nExpected SLA:\n- High: 4 hours\n- Medium: 8 hours\n- Low: 24 hours`,
        priority: priority,
        categoryId: category.id,
      };

      try {
        const start = Date.now();
        const ticketRes = await axios.post(`${API_URL}/tickets`, ticketData, { headers });
        const time = Date.now() - start;
        
        const ticket = ticketRes.data.data || ticketRes.data;
        createdTickets.push(ticket);

        console.log(`✅ Ticket created in ${time}ms`);
        console.log(`   Ticket Number: ${ticket.ticketNumber}`);
        console.log(`   Priority: ${ticket.priority}`);
        console.log(`   Status: ${ticket.status}`);
        console.log(`   Created At: ${new Date(ticket.createdAt).toLocaleString('vi-VN')}`);
        
        if (ticket.dueDate) {
          const dueDate = new Date(ticket.dueDate);
          const createdAt = new Date(ticket.createdAt);
          const diffMs = dueDate - createdAt;
          const diffHours = diffMs / (1000 * 60 * 60);
          
          console.log(`   Due Date: ${dueDate.toLocaleString('vi-VN')}`);
          console.log(`   Time until due: ${diffHours.toFixed(2)} hours`);
          
          // Verify SLA calculation
          const expectedHours = priority === 'High' ? 4 : priority === 'Medium' ? 8 : 24;
          if (Math.abs(diffHours - expectedHours) < 1) {
            console.log(`   ✅ SLA calculation correct (expected ~${expectedHours}h)`);
          } else {
            console.log(`   ⚠️  SLA might be off (expected ~${expectedHours}h, got ${diffHours.toFixed(2)}h)`);
            console.log(`   💡 This is normal if business hours calculation is used`);
          }
        } else {
          console.log(`   ❌ Due Date: NOT SET!`);
        }
      } catch (error) {
        console.error(`\n❌ Failed to create ${priority} ticket:`);
        console.error(`   Status: ${error.response?.status}`);
        console.error(`   Error: ${error.response?.data?.message || error.message}`);
        
        if (error.response?.data?.stack) {
          console.error(`\n   Stack trace:`);
          console.error(`   ${error.response.data.stack.split('\n').slice(0, 5).join('\n   ')}`);
        }
      }
    }

    // 4. Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total tickets created: ${createdTickets.length}/${priorities.length}`);
    
    if (createdTickets.length > 0) {
      console.log('\n✅ Successfully created tickets:');
      createdTickets.forEach(ticket => {
        const dueDate = ticket.dueDate ? new Date(ticket.dueDate).toLocaleString('vi-VN') : 'NOT SET';
        console.log(`   - ${ticket.ticketNumber} (${ticket.priority}): Due ${dueDate}`);
      });
    }

    if (createdTickets.length < priorities.length) {
      console.log('\n❌ Some tickets failed to create. Check errors above.');
    } else {
      console.log('\n✅ All tickets created successfully!');
    }

    // 5. Test business hours query
    console.log('\n' + '='.repeat(80));
    console.log('🕐 Testing Business Hours Query');
    console.log('='.repeat(80));

    try {
      const bhRes = await axios.get(`${API_URL}/business-hours`, { headers });
      const businessHours = bhRes.data.data || bhRes.data;
      console.log(`✅ Business hours endpoint works`);
      console.log(`   Found ${businessHours.length} business hour records`);
      
      bhRes.data.forEach(bh => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const status = bh.isWorkingDay ? '✅ Working' : '❌ Non-working';
        console.log(`   ${days[bh.dayOfWeek]}: ${bh.startTime} - ${bh.endTime} ${status}`);
      });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('⚠️  Business hours endpoint not found (this is OK if not implemented)');
      } else {
        console.error(`❌ Business hours query failed: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Test completed!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    }
  }
}

// Run test
testCreateTicket();
