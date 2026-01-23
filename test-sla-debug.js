const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testSLADebug() {
  console.log('🔍 Testing SLA Calculation Debug...\n');

  try {
    // 1. Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@28h.com',
      password: 'password123',
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful\n');

    // 2. Get all tickets to check dueDate
    console.log('2️⃣ Fetching all tickets...');
    const ticketsResponse = await axios.get(`${API_URL}/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tickets = ticketsResponse.data.data.tickets;
    console.log(`📊 Total tickets: ${tickets.length}\n`);

    // 3. Analyze tickets for SLA calculation
    console.log('3️⃣ Analyzing tickets for SLA...');
    console.log('=====================================\n');

    let ticketsWithDueDate = 0;
    let ticketsResolved = 0;
    let ticketsResolvedWithDueDate = 0;
    let ticketsMetSLA = 0;
    let ticketsBreachedSLA = 0;

    tickets.forEach((ticket, index) => {
      const hasDueDate = ticket.dueDate !== null;
      const isResolved = ticket.resolvedAt !== null;
      
      if (hasDueDate) ticketsWithDueDate++;
      if (isResolved) ticketsResolved++;
      
      if (hasDueDate && isResolved) {
        ticketsResolvedWithDueDate++;
        const resolvedAt = new Date(ticket.resolvedAt);
        const dueDate = new Date(ticket.dueDate);
        const metSLA = resolvedAt <= dueDate;
        
        if (metSLA) {
          ticketsMetSLA++;
        } else {
          ticketsBreachedSLA++;
        }

        console.log(`Ticket #${ticket.ticketNumber}:`);
        console.log(`  Status: ${ticket.status}`);
        console.log(`  Priority: ${ticket.priority}`);
        console.log(`  Created: ${new Date(ticket.createdAt).toLocaleString('vi-VN')}`);
        console.log(`  Due Date: ${dueDate.toLocaleString('vi-VN')}`);
        console.log(`  Resolved: ${resolvedAt.toLocaleString('vi-VN')}`);
        console.log(`  Time diff: ${((resolvedAt - dueDate) / (1000 * 60 * 60)).toFixed(2)} hours`);
        console.log(`  SLA Status: ${metSLA ? '✅ MET' : '❌ BREACHED'}`);
        console.log('');
      }
    });

    // 4. Summary
    console.log('=====================================');
    console.log('📊 SLA CALCULATION SUMMARY');
    console.log('=====================================\n');
    
    console.log(`Total tickets: ${tickets.length}`);
    console.log(`Tickets with dueDate: ${ticketsWithDueDate}`);
    console.log(`Tickets resolved: ${ticketsResolved}`);
    console.log(`Tickets resolved WITH dueDate: ${ticketsResolvedWithDueDate}`);
    console.log('');
    
    if (ticketsResolvedWithDueDate > 0) {
      console.log(`✅ Met SLA: ${ticketsMetSLA}`);
      console.log(`❌ Breached SLA: ${ticketsBreachedSLA}`);
      console.log(`📈 SLA Compliance Rate: ${((ticketsMetSLA / ticketsResolvedWithDueDate) * 100).toFixed(1)}%`);
    } else {
      console.log('⚠️  NO TICKETS WITH BOTH dueDate AND resolvedAt');
      console.log('');
      console.log('🔍 WHY SLA IS 0%:');
      console.log('   SLA calculation requires:');
      console.log('   1. Ticket must have dueDate (not null)');
      console.log('   2. Ticket must be resolved (resolvedAt not null)');
      console.log('   3. Compare resolvedAt <= dueDate');
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('   - Tickets need SLA rules to auto-set dueDate');
      console.log('   - Check if SLA rules are configured');
      console.log('   - Check if tickets are assigned priority');
      console.log('   - dueDate should be set when ticket is created');
    }

    // 5. Check tickets without dueDate
    console.log('\n=====================================');
    console.log('🔍 TICKETS WITHOUT DUE DATE');
    console.log('=====================================\n');
    
    const ticketsWithoutDueDate = tickets.filter(t => t.dueDate === null);
    ticketsWithoutDueDate.forEach(ticket => {
      console.log(`#${ticket.ticketNumber} - ${ticket.title}`);
      console.log(`  Status: ${ticket.status}`);
      console.log(`  Priority: ${ticket.priority}`);
      console.log(`  Created: ${new Date(ticket.createdAt).toLocaleString('vi-VN')}`);
      console.log(`  ⚠️  dueDate: NULL`);
      console.log('');
    });

    // 6. Get dashboard stats
    console.log('=====================================');
    console.log('📊 DASHBOARD SLA STATS');
    console.log('=====================================\n');
    
    const dashboardResponse = await axios.get(`${API_URL}/reports/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const dashboard = dashboardResponse.data.data;
    console.log(`SLA Compliance Rate: ${dashboard.slaComplianceRate}%`);
    console.log(`SLA Breached: ${dashboard.slaBreached}`);
    console.log(`SLA At Risk: ${dashboard.slaAtRisk}`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSLADebug();
