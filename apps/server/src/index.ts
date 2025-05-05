import './lib/load-env.js';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoute } from './routes/auth.js';
import { healthCheckRoute } from './routes/health-check.js';
import { uploadRoute } from './routes/upload.js';
import { gameRoute } from './routes/game.js';
import { gameSessionsRoute } from './routes/game-sessions.js';

const app = new Hono()
  .basePath('/api')
  .use(logger())
  .use(
    '/auth/*',
    cors({
      origin: 'http://localhost:5173', // Vite origin
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    })
  )
  .use(
    '/uploadthing/**',
    cors({
      origin: '*',
      allowMethods: ['POST', 'GET'],
      allowHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .route('/', healthCheckRoute)
  .route('/auth', authRoute)
  .route('/game', gameRoute)
  .route('/game-sessions', gameSessionsRoute)
  .route('/uploadthing', uploadRoute)
  // Static files from Vite build
  .get('*', serveStatic({ root: '../frontend/dist' }));

const port = 5000;
console.log(`Server is running on http://localhost:${port}`);

export type ApiType = typeof app;

serve({
  fetch: app.fetch,
  port,
});
