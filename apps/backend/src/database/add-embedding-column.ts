import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function addEmbeddingColumn() {
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
    logging: console.log,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Add embedding column
    await sequelize.query(`
      ALTER TABLE knowledge_articles 
      ADD COLUMN IF NOT EXISTS embedding TEXT;
    `);

    console.log('✅ Added embedding column to knowledge_articles table');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addEmbeddingColumn();
