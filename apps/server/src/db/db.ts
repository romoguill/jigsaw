import { drizzle } from 'drizzle-orm/libsql/node';
import path from 'path';
import * as schema from './schema.js';

console.log(process.env.DATABASE_URL);

export const db = drizzle({
  connection: {
    url: `file:${path.resolve(process.env.DATABASE_URL!)}`,
    // authToken:
    //   process.env.NODE_ENV === 'production'
    //     ? process.env.DATABASE_AUTH_TOKEN!
    //     : undefined,
  },
  schema: { ...schema },
});
