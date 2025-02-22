import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth-middleware.js';

export const gameRoute = new Hono()
  .use(authMiddleware)
  .post('/builder', (c) => {
    const user = c.get('user');
    return c.json({ user });
  });
