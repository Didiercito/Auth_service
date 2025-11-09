import { config } from 'dotenv';

config();

export const databaseConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'auth_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: {
        rejectUnauthorized: false
    },
    charset: 'utf8mb4',
    timezone: 'Z',
    entities: ['src/database/schemas/**/*.ts'],
    migrations: ['src/database/migrations/**/*.ts'],
    subscribers: [],
};