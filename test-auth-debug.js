const axios = require('axios');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'apps/backend/.env' });

const API_URL = 'http://localhost:3000/api/v1';

async function testAuthDebug() {
  console.log('🔍 DEBUGGING AUTHENTICATION ISSUES\n');
  console.log('='.repeat(80));

  // 1. Check database users table structure
  console.log('\n1️⃣ Checking Users Table Structure in DB...');
  console.log('='.repeat(80));
  
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Get users table columns
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Users table columns:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name.padEnd(25)} | ${col.data_type.padEnd(20)} | Nullable: ${col.is_nullable}`);
    });

    // Check if admin user exists
    const [users] = await sequelize.query(`
      SELECT id, username, email, role, is_active, created_at
      FROM users 
      WHERE email = 'admin@28h.com'
      LIMIT 1;
    `);

    console.log('\n👤 Admin user in DB:');
    if (users.length > 0) {
      console.log('   ✅ Found admin user:');
      console.log(`      ID: ${users[0].id}`);
      console.log(`      Username: ${users[0].username}`);
      console.log(`      Email: ${users[0].email}`);
      console.log(`      Role: ${users[0].role}`);
      console.log(`      Active: ${users[0].is_active}`);
      console.log(`      Created: ${users[0].created_at}`);
    } else {
      console.log('   ❌ Admin user NOT found!');
    }

    await sequelize.close();

  } catch (error) {
    console.error('❌ Database error:', error.message);
  }

  // 2. Test login API
  console.log('\n\n2️⃣ Testing Login API...');
  console.log('='.repeat(80));

  const credentials = {
    email: 'admin@28h.com',
    password: 'password123',
  };

  try {
    console.log(`Attempting login with: ${credentials.email}`);
    const loginRes = await axios.post(`${API_URL}/auth/login`, credentials);
    
    console.log('✅ Login successful!');
    console.log('\n📦 Response data:');
    console.log(`   Access Token: ${loginRes.data.accessToken?.substring(0, 50)}...`);
    
    if (loginRes.data.user) {
      console.log(`   User ID: ${loginRes.data.user.id}`);
      console.log(`   Username: ${loginRes.data.user.username}`);
      console.log(`   Email: ${loginRes.data.user.email}`);
      console.log(`   Role: ${loginRes.data.user.role}`);
      console.log(`   Full Name: ${loginRes.data.user.fullName}`);
    }

    const token = loginRes.data.accessToken;

    // 3. Test token immediately
    console.log('\n\n3️⃣ Testing Token Immediately After Login...');
    console.log('='.repeat(80));

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const meRes = await axios.get(`${API_URL}/auth/me`, { headers });
      
      console.log('✅ Token validation successful!');
      console.log(`   User: ${meRes.data.fullName} (${meRes.data.role})`);

      // 4. Test categories endpoint
      console.log('\n\n4️⃣ Testing Categories Endpoint...');
      console.log('='.repeat(80));

      const categoriesRes = await axios.get(`${API_URL}/categories`, { headers });
      console.log(`✅ Categories endpoint works! Found ${categoriesRes.data.length} categories`);

      // 5. Decode JWT to check expiration
      console.log('\n\n5️⃣ Analyzing JWT Token...');
      console.log('='.repeat(80));

      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('📋 Token payload:');
        console.log(`   User ID: ${payload.sub || payload.userId}`);
        console.log(`   Email: ${payload.email}`);
        console.log(`   Role: ${payload.role}`);
        
        if (payload.iat) {
          const issuedAt = new Date(payload.iat * 1000);
          console.log(`   Issued At: ${issuedAt.toLocaleString('vi-VN')}`);
        }
        
        if (payload.exp) {
          const expiresAt = new Date(payload.exp * 1000);
          const now = new Date();
          const hoursUntilExpiry = (expiresAt - now) / (1000 * 60 * 60);
          
          console.log(`   Expires At: ${expiresAt.toLocaleString('vi-VN')}`);
          console.log(`   Time until expiry: ${hoursUntilExpiry.toFixed(2)} hours`);
          
          if (hoursUntilExpiry < 0) {
            console.log('   ❌ TOKEN IS EXPIRED!');
          } else if (hoursUntilExpiry < 1) {
            console.log('   ⚠️  Token expires soon!');
          } else {
            console.log('   ✅ Token is valid');
          }
        }
      }

      console.log('\n' + '='.repeat(80));
      console.log('✅ ALL TESTS PASSED!');
      console.log('='.repeat(80));

    } catch (error) {
      console.error('\n❌ Token validation failed!');
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Message: ${error.response?.data?.message}`);
      console.error(`   Error: ${error.response?.data?.error}`);
      
      if (error.response?.status === 401) {
        console.log('\n🔍 Possible causes:');
        console.log('   1. JWT secret mismatch between login and validation');
        console.log('   2. Token format issue');
        console.log('   3. JWT strategy not properly configured');
        console.log('   4. User entity fields mismatch with DB');
      }
    }

  } catch (error) {
    console.error('\n❌ Login failed!');
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Message: ${error.response?.data?.message}`);
    console.error(`   Error: ${error.response?.data?.error}`);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 Possible causes:');
      console.log('   1. Wrong password');
      console.log('   2. User not found in database');
      console.log('   3. Password hash mismatch');
      console.log('   4. User entity query failing due to column mismatch');
    }
  }

  // 6. Check JWT configuration
  console.log('\n\n6️⃣ Checking JWT Configuration...');
  console.log('='.repeat(80));
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
  console.log(`   JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN || '7d (default)'}`);
}

testAuthDebug();
