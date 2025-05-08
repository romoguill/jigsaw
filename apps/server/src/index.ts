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

// Create an API router for /api routes
const app = new Hono()
  .use(logger())
  .use(
    '/api/auth/*',
    cors({
      origin: process.env.VITE_PROXY_URL || process.env.VITE_SERVER_URL!, // Use VITE_SERVER_URL as fallback
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    })
  )
  .use(
    '/api/uploadthing/**',
    cors({
      origin: process.env.VITE_PROXY_URL || process.env.VITE_SERVER_URL!, // Use VITE_SERVER_URL as fallback
      allowMethods: ['POST', 'GET'],
      allowHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .route('/api/health-check', healthCheckRoute)
  .route('/api/auth', authRoute)
  .route('/api/game', gameRoute)
  .route('/api/game-sessions', gameSessionsRoute)
  .route('/api/uploadthing', uploadRoute);

// Add static file serving after API routes
app
  .use('/*', serveStatic({ root: './static' }))
  .get('*', serveStatic({ path: './static/index.html' }));

const port = 5000;
console.log(`Server is running on ${process.env.VITE_SERVER_URL}`);

export type ApiType = typeof app;

serve({
  fetch: app.fetch,
  port,
});
