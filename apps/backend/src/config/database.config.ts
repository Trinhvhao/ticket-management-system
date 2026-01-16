import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USER'] || 'postgres',
  password: process.env['DB_PASS'] || '',
  database: process.env['DB_NAME'] || 'postgres',
  autoLoadModels: true,
  synchronize: false,
  logging: process.env['NODE_ENV'] === 'development',
  dialectOptions: {
    ssl: process.env['DB_SSL'] === 'true' ? {
      require: true,
      rejectUnauthorized: false, // For Supabase
    } : false,
  },
  pool: {
    max: parseInt(process.env['DB_POOL_MAX'] || '10', 10),
    min: parseInt(process.env['DB_POOL_MIN'] || '2', 10),
    acquire: 30000,
    idle: parseInt(process.env['DB_POOL_IDLE'] || '10000', 10),
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});
