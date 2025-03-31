import { createRouteHandler, UTApi } from 'uploadthing/server';
import { uploadRouter } from '../lib/uploadthing.js';
import { Hono } from 'hono';

const handlers = createRouteHandler({
  router: uploadRouter,

  config: {
    isDev: process.env.NODE_ENV === 'development',
    callbackUrl:
      process.env.NODE_ENV === 'production'
        ? `${process.env.VITE_SERVER_URL}/api/uploadthing`
        : `${process.env.VITE_PROXY_URL}/api/uploadthing`,
  },
});

export const uploadRoute = new Hono().all('/', (c) => handlers(c.req.raw));

export const utapi = new UTApi();
