import { Hono } from 'hono';
import { auth } from '../lib/auth.js';

export const authRoutes = new Hono().on(['POST', 'GET'], '*', (c) => {
  return auth.handler(c.req.raw);
});
