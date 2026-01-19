import { Sequelize } from 'sequelize-typescript';
import { User, Ticket, Comment, KnowledgeArticle, Category, Attachment } from './entities';
import { seedUsers } from './seeders/001-seed-users';
import { seedKnowledgeArticles } from './seeders/002-seed-knowledge-articles';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runSeeders() {
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
    logging: false,
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models (without dropping tables)
    await sequelize.sync();
    console.log('✅ Models synced');

    // Run seeders
    await seedUsers();
    await seedKnowledgeArticles();

    console.log('\n✅ All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();
