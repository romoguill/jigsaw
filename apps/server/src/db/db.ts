import { drizzle } from 'drizzle-orm/libsql/node';
import path from 'path';
import * as schema from './schema.js';

const isDev = process.env.NODE_ENV === 'development';
const dbPath = isDev
  ? path.resolve(process.cwd(), process.env.DATABASE_URL!)
  : process.env.DATABASE_URL;

export const db = drizzle({
  connection: {
    url: `file:${dbPath}`,
    // authToken:
    //   process.env.NODE_ENV === 'production'
    //     ? process.env.DATABASE_AUTH_TOKEN!
    //     : undefined,
  },
  schema: { ...schema },
});
