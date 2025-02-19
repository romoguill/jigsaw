import { drizzle } from 'drizzle-orm/libsql/node';
import path from 'path';

export const db = drizzle({
  connection: {
    url: `file:${path.resolve('./data/local.db')}`,
    authToken:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_AUTH_TOKEN!
        : undefined,
  },
});
