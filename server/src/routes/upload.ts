import { createRouteHandler } from 'uploadthing/server';
import { uploadRouter } from '../lib/uploadthing.js';
import { Hono } from 'hono';

const handlers = createRouteHandler({
  router: uploadRouter,
});

export const uploadRoute = new Hono().all('/', (c) => handlers(c.req.raw));
