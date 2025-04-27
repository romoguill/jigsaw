import { Hono } from 'hono';
import { auth } from '../lib/auth.js';

export const authRoute = new Hono().on(['POST', 'GET'], '*', (c) => {
  return auth.handler(c.req.raw);
});
