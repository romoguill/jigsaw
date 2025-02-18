import { drizzle } from 'drizzle-orm/libsql/node';
import path from 'path';
import { pathToFileURL } from 'url';

console.log(pathToFileURL(path.resolve('./data/local.db')).toString());
console.log(`file:${path.resolve('./data/local.db')}`);

export const db = drizzle({
  connection: {
    url: `file:${path.resolve('./data/local.db')}`,
    authToken:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_AUTH_TOKEN!
        : undefined,
  },
});
