import './lib/load-env.js';

console.log(process.env.DATABASE_URL);

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { auth } from './lib/auth.js';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

app.get('*', serveStatic({ root: '../frontend/dist' }));

const apiRoutes = app
  .basePath('/api')
  .get('/', (c) => {
    return c.text('Hello Hono!');
  })
  .on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

const port = 5000;
console.log(`Server is running on http://localhost:${port}`);

export type ApiType = typeof apiRoutes;

serve({
  fetch: apiRoutes.fetch,
  port,
});
