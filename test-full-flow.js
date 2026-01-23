const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

// Test credentials
const ADMIN_EMAIL = 'admin@28h.com';
const ADMIN_PASSWORD = 'password123';

let authToken = '';
let testTicketId = null;

// Helper function to format date
function formatDate(date) {
  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Helper function to calculate hours difference
function hoursDiff(date1, date2) {
  return Math.abs(new Date(date2) - new Date(date1)) / 36e5;
}

async function testFullFlow() {
  console.log('\n🧪 TESTING FULL TICKET FLOW\n');
  console.log('='.repeat(80));

  try {
    // 1. Login
    console.log('\n1️⃣ Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    const loginData = loginRes.data.data || loginRes.data;
    authToken = loginData.accessToken;
    console.log('✅ Login successful');
    console.log(`   User: ${loginData.user.fullName} (${loginData.user.role})`);

    const headers = { Authorization: `Bearer ${authToken}` };

    // 2. Get categories
    console.log('\n2️⃣ Fetching categories...');
    const categoriesRes = await axios.get(`${API_URL}/categories`, { headers });
    const categories = categoriesRes.data.data || categoriesRes.data;
    console.log(`✅ Found ${categories.length} categories`);
    const categoryId = categories[0]?.id;

    // 3. Create ticket
    console.log('\n3️⃣ Creating High priority ticket...');
    const createRes = await axios.post(
      `${API_URL}/tickets`,
      {
        title: 'Test Full Flow - High Priority',
        description: 'Testing complete ticket lifecycle with SLA',
        priority: 'High',
        categoryId,
      },
      { headers }
    );
    
    const ticket = createRes.data.data || createRes.data;
    testTicketId = ticket.id;
    console.log('✅ Ticket created');
    console.log(`   ID: ${ticket.id}`);
    console.log(`   Number: ${ticket.ticketNumber}`);
    console.log(`   Status: ${ticket.status}`);
    console.log(`   Priority: ${ticket.priority}`);
    console.log(`   Created: ${formatDate(ticket.createdAt)}`);
    console.log(`   Due Date: ${ticket.dueDate ? formatDate(ticket.dueDate) : 'N/A'}`);
    
    if (ticket.dueDate) {
      const hoursUntilDue = hoursDiff(ticket.createdAt, ticket.dueDate);
      console.log(`   Time until due: ${hoursUntilDue.toFixed(2)} hours`);
    }

    // 4. Get ticket details
    console.log('\n4️⃣ Fetching ticket details...');
    const detailRes = await axios.get(`${API_URL}/tickets/${testTicketId}`, { headers });
    const ticketDetail = detailRes.data.data || detailRes.data;
    console.log('✅ Ticket details retrieved');
    console.log(`   Submitter: ${ticketDetail.submitter?.fullName}`);
    console.log(`   Assignee: ${ticketDetail.assignee?.fullName || 'Unassigned'}`);
    console.log(`   Category: ${ticketDetail.category?.name}`);

    // 5. Get IT staff for assignment
    console.log('\n5️⃣ Fetching IT staff...');
    const usersRes = await axios.get(`${API_URL}/users?role=IT_Staff`, { headers });
    const usersData = usersRes.data.data || usersRes.data;
    const itStaff = usersData.users || usersData;
    console.log(`✅ Found ${itStaff.length} IT staff members`);
    
    if (itStaff.length > 0) {
      const assigneeId = itStaff[0].id;
      
      // 6. Assign ticket
      console.log('\n6️⃣ Assigning ticket...');
      await axios.patch(
        `${API_URL}/tickets/${testTicketId}/assign`,
        { assigneeId },
        { headers }
      );
      console.log('✅ Ticket assigned');
      console.log(`   Assignee: ${itStaff[0].fullName}`);

      // 7. Start progress
      console.log('\n7️⃣ Starting progress...');
      await axios.patch(`${API_URL}/tickets/${testTicketId}/start-progress`, {}, { headers });
      console.log('✅ Progress started');

      // 8. Add comment
      console.log('\n8️⃣ Adding comment...');
      await axios.post(
        `${API_URL}/comments`,
        {
          ticketId: testTicketId,
          content: 'Working on this issue now',
          type: 'Public',
        },
        { headers }
      );
      console.log('✅ Comment added');

      // 9. Resolve ticket
      console.log('\n9️⃣ Resolving ticket...');
      await axios.patch(
        `${API_URL}/tickets/${testTicketId}/resolve`,
        { resolutionNotes: 'Issue has been fixed successfully' },
        { headers }
      );
      console.log('✅ Ticket resolved');

      // 10. Get final ticket state
      console.log('\n🔟 Fetching final ticket state...');
      const finalRes = await axios.get(`${API_URL}/tickets/${testTicketId}`, { headers });
      const finalTicket = finalRes.data.data || finalRes.data;
      console.log('✅ Final state retrieved');
      console.log(`   Status: ${finalTicket.status}`);
      console.log(`   Resolved At: ${finalTicket.resolvedAt ? formatDate(finalTicket.resolvedAt) : 'N/A'}`);
      console.log(`   Resolution Notes: ${finalTicket.resolutionNotes || 'N/A'}`);
      
      // Check SLA
      if (finalTicket.dueDate && finalTicket.resolvedAt) {
        const resolvedOnTime = new Date(finalTicket.resolvedAt) <= new Date(finalTicket.dueDate);
        console.log(`   SLA Status: ${resolvedOnTime ? '✅ Met' : '❌ Breached'}`);
      }

      // 11. Get ticket history
      console.log('\n1️⃣1️⃣ Fetching ticket history...');
      const historyRes = await axios.get(`${API_URL}/ticket-history/ticket/${testTicketId}`, { headers });
      const history = historyRes.data.data || historyRes.data;
      console.log(`✅ Found ${history.length} history entries`);
      history.slice(0, 5).forEach((entry, idx) => {
        console.log(`   ${idx + 1}. ${entry.description} - ${formatDate(entry.createdAt)}`);
      });

      // 12. Get dashboard stats
      console.log('\n1️⃣2️⃣ Fetching dashboard stats...');
      const dashboardRes = await axios.get(`${API_URL}/reports/dashboard`, { headers });
      const dashboard = dashboardRes.data.data || dashboardRes.data;
      console.log('✅ Dashboard stats retrieved');
      console.log(`   Total Tickets: ${dashboard.totalTickets}`);
      console.log(`   Open: ${dashboard.openTickets}`);
      console.log(`   In Progress: ${dashboard.inProgressTickets}`);
      console.log(`   Resolved: ${dashboard.resolvedTickets}`);
      console.log(`   SLA Compliance: ${dashboard.slaCompliance}%`);
      console.log(`   Avg Resolution Time: ${dashboard.avgResolutionTime} hours`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ FULL FLOW TEST COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log(`\n📋 Test Ticket ID: ${testTicketId}`);
    console.log(`🔗 View in UI: http://localhost:3001/tickets/${testTicketId}\n`);

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('Error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run test
testFullFlow();
