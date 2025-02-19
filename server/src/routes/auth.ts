import { Hono } from 'hono';
import { auth } from '../lib/auth.js';

export const authRoutes = new Hono().on(['POST', 'GET'], '*', (c) => {
  console.log('hola');
  return auth.handler(c.req.raw);
});
