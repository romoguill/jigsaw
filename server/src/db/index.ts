import { drizzle } from 'drizzle-orm/libsql/node';

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL!,
    authToken:
      process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_AUTH_TOKEN!
        : undefined,
  },
});
