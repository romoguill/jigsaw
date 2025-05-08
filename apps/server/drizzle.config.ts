import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env'
  ),
});

const isDev = process.env.NODE_ENV === 'development';
const dbPath = isDev
  ? path.resolve(process.cwd(), process.env.DATABASE_URL!)
  : process.env.DATABASE_URL;

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: `file:${dbPath}`,
  },
});
