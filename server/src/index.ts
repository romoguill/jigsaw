import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono().basePath('/api');

const route = app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const port = 5000;
console.log(`Server is running on http://localhost:${port}`);

export type ApiType = typeof route;

serve({
  fetch: route.fetch,
  port,
});
