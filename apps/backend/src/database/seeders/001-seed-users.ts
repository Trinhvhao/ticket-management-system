import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

export async function seedUsers() {
  try {
    // Check if users already exist
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('Users already seeded, skipping...');
      return;
    }

    console.log('Seeding users...');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create demo users
    const users = [
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

    await User.bulkCreate(users);

    console.log('✅ Users seeded successfully!');
    console.log('Demo credentials:');
    console.log('- admin@28h.com / password123');
    console.log('- itstaff@28h.com / password123');
    console.log('- employee@28h.com / password123');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}
