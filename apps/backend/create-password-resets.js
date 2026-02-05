require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, // Sửa từ DB_PASSWORD thành DB_PASS
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

async function createPasswordResetsTable() {
  try {
    console.log('🔌 Đang kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Kết nối thành công!');

    console.log('📝 Đang tạo bảng password_resets...');
    
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Đã tạo bảng password_resets!');

    console.log('📝 Đang tạo indexes...');
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_password_resets_is_used ON password_resets(is_used);
    `);
    
    console.log('✅ Đã tạo indexes!');

    // Kiểm tra kết quả
    const [results] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'password_resets';
    `);
    
    if (results[0].count > 0) {
      console.log('✅ Hoàn tất! Bảng password_resets đã sẵn sàng.');
    }

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await sequelize.close();
  }
}

createPasswordResetsTable();
