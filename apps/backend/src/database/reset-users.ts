import { Sequelize } from 'sequelize-typescript';
import { User, Ticket, Comment, KnowledgeArticle, Category, Attachment } from './entities';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function resetUsers() {
  // Initialize Sequelize
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    username: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASS'] || '',
    database: process.env['DB_NAME'] || 'postgres',
    dialectOptions: {
      ssl: process.env['DB_SSL'] === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    models: [User, Ticket, Comment, KnowledgeArticle, Category, Attachment],
    logging: console.log,
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Hash password manually
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('✅ Password hashed\n');

    // Update or create each user
    const usersData = [
      {
        username: 'admin',
        email: 'admin@28h.com',
        password: hashedPassword,
        fullName: 'Admin User',
        role: 'Admin',
        department: 'IT',
        phone: '0123456789',
        isActive: true,
      },
      {
        username: 'itstaff',
        email: 'itstaff@28h.com',
        password: hashedPassword,
        fullName: 'IT Staff User',
        role: 'IT_Staff',
        department: 'IT',
        phone: '0123456788',
        isActive: true,
      },
      {
        username: 'employee',
        email: 'employee@28h.com',
        password: hashedPassword,
        fullName: 'Employee User',
        role: 'Employee',
        department: 'Sales',
        phone: '0123456787',
        isActive: true,
      },
    ];

    for (const userData of usersData) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
        hooks: false,
      });

      if (!created) {
        // Update existing user's password
        await user.update({ password: hashedPassword }, { hooks: false });
        console.log(`✅ Updated user: ${userData.email}`);
      } else {
        console.log(`✅ Created user: ${userData.email}`);
      }
    }

    console.log('\n✅ All users processed successfully!');
    console.log('\nDemo credentials:');
    console.log('- admin@28h.com / password123');
    console.log('- itstaff@28h.com / password123');
    console.log('- employee@28h.com / password123');

    // Test password comparison
    console.log('\n🧪 Testing password comparison...');
    const testUser = await User.findOne({ where: { email: 'admin@28h.com' } });
    if (testUser) {
      const isValid = await testUser.comparePassword('password123');
      console.log(`Password test for admin@28h.com: ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
      
      if (!isValid) {
        console.log('\n⚠️  Password comparison failed. Checking details:');
        console.log('Stored password hash:', testUser.password.substring(0, 30) + '...');
        console.log('Test password: password123');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetUsers();
