const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config({ path: 'apps/backend/.env' });

async function testUserEntityQuery() {
  console.log('🔍 TESTING USER ENTITY QUERY\n');
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
    logging: console.log,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Test 1: Raw query
    console.log('1️⃣ Testing RAW query...');
    console.log('='.repeat(80));
    const [rawUsers] = await sequelize.query(`
      SELECT id, username, email, password, full_name, role, department, phone, avatar_url, is_active, last_login_at, created_at, updated_at
      FROM users 
      WHERE email = 'admin@28h.com'
      LIMIT 1;
    `);
    
    if (rawUsers.length > 0) {
      console.log('✅ Raw query successful:');
      console.log(JSON.stringify(rawUsers[0], null, 2));
    } else {
      console.log('❌ No user found');
    }

    // Test 2: Query with SELECT *
    console.log('\n\n2️⃣ Testing SELECT * query...');
    console.log('='.repeat(80));
    const [allColumnsUsers] = await sequelize.query(`
      SELECT * FROM users WHERE email = 'admin@28h.com' LIMIT 1;
    `);
    
    if (allColumnsUsers.length > 0) {
      console.log('✅ SELECT * query successful');
      console.log(`   Total columns returned: ${Object.keys(allColumnsUsers[0]).length}`);
      console.log(`   Columns: ${Object.keys(allColumnsUsers[0]).join(', ')}`);
    }

    // Test 3: Define minimal User model
    console.log('\n\n3️⃣ Testing Sequelize Model query...');
    console.log('='.repeat(80));

    class User extends Model {}
    
    User.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'full_name',
      },
      role: {
        type: DataTypes.ENUM('Employee', 'IT_Staff', 'Admin'),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      avatarUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'avatar_url',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'is_active',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    }, {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: true,
    });

    const user = await User.findOne({
      where: { email: 'admin@28h.com' },
    });

    if (user) {
      console.log('✅ Sequelize model query successful');
      console.log('\n📦 User data:');
      const userData = user.toJSON();
      console.log(JSON.stringify(userData, null, 2));
      
      console.log('\n🔑 Keys in user object:');
      console.log(Object.keys(userData).join(', '));
    } else {
      console.log('❌ No user found with Sequelize model');
    }

    // Test 4: Query with specific attributes
    console.log('\n\n4️⃣ Testing query with specific attributes...');
    console.log('='.repeat(80));

    const userWithAttrs = await User.findOne({
      where: { email: 'admin@28h.com' },
      attributes: ['id', 'username', 'email', 'fullName', 'role', 'isActive'],
    });

    if (userWithAttrs) {
      console.log('✅ Query with attributes successful');
      console.log(JSON.stringify(userWithAttrs.toJSON(), null, 2));
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ All tests completed!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testUserEntityQuery();
